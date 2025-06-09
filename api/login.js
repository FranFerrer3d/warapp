import users from './mock/usersMock.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Lógica de login
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.status(200).json({ token: 'mock-token-123', user: { email: user.email } });
    } else {
      res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

  } else if (req.method === 'GET') {
    // Health check o simple ping
    res.status(200).json({ message: 'API funcionando correctamente 🚀' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}


