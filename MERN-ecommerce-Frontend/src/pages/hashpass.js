const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');

  console.log({
    email: 'admin@gmail.com',
    password: hashedPassword.toString('base64'), // Convert Binary to base64
    salt: salt.toString('base64'), // Convert Binary to base64
    role: 'admin',
    name: 'Admin User',
  });
}

hashPassword('Admin123');
