const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const SECRET_KEY = 'my_super_secret_key';

// Simulated user (in real life you'd use a database)
const mockUser = {
  id: 1,
  username: 'admin',
  password: '123456', // ⚠️ Never store plain passwords in production
};



// 1️⃣ Login route → creates JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign(
      { id: mockUser.id, username: mockUser.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// 2️⃣ Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
}

// 3️⃣ Protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user
  });
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
