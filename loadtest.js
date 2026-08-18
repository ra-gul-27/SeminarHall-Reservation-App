import http from 'k6/http';
import { check, sleep } from 'k6';

// This configuration simulates a "Traffic Spike"
export const options = {
  vus: 100, // 100 concurrent virtual users hitting the API at the same time
  duration: '10s', // Run the test for 10 seconds
};

export default function () {
  // Replace this with your actual deployed Vercel URL if testing production
  const url = 'http://localhost:5000/api/auth/login';
  
  // We send a fake login request to force the backend to query the Supabase database
  const payload = JSON.stringify({
    email: 'stress_test@example.com',
    password: 'fakepassword',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  
  // Since it's a fake login, we EXPECT the server to return 401 Unauthorized.
  // If it returns 500, it means the database connection pool crashed!
  check(res, {
    'Database handled the query (Status 401)': (r) => r.status === 401,
  });
  
  sleep(1);
}
