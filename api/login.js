// api/login.js

import users from '../src/mock/usersMock.js'; // Importa tu mock

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    // Simulamos un token JWT ficticio
    const token = Buffer.from(`${user.email}:${user.id}`).toString('base64');
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
}
