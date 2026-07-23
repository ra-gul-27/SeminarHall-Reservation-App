import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// 1. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Halls: Get all
app.get('/api/halls', authenticateToken, async (req, res) => {
  try {
    const halls = await prisma.hall.findMany();
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching halls' });
  }
});

// 3. Reservations: Create
app.post('/api/reservations', authenticateToken, async (req: any, res) => {
  const { hallId, startTime, endTime, purpose } = req.body;
  const userId = req.user.id;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        hallId,
        userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
});

// 4. Reservations: Get all (Admin can see all, staff see theirs)
app.get('/api/reservations', authenticateToken, async (req: any, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },
      include: { hall: true, user: { select: { email: true } } }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// 5. Reservations: Delete (Admin only)
app.delete('/api/reservations/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }

  try {
    await prisma.reservation.delete({
      where: { id }
    });
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting reservation' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
