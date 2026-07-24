const bcrypt = require('bcryptjs');

async function generateSQL() {
  const hash1 = await bcrypt.hash('IFET811111', 10);
  const hash2 = await bcrypt.hash('IFET001', 10);

  const sql = `
INSERT INTO "User" (id, email, password_hash, role, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'IFETHALL', '${hash1}', 'ADMIN', NOW(), NOW());

INSERT INTO "User" (id, email, password_hash, role, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'ADMIN5', '${hash2}', 'ADMIN', NOW(), NOW());

INSERT INTO "Hall" (id, name, capacity, features, "createdAt", "updatedAt") 
VALUES 
('main', 'MT Seminar Hall', 100, '{}', NOW(), NOW()),
('mini', 'Lib Seminar Hall', 50, '{}', NOW(), NOW()),
('meeting', 'Meeting Hall', 20, '{}', NOW(), NOW());
  `;
  console.log(sql);
}

generateSQL();
