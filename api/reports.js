// api/reports.js

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Simulación de un fetch de reports
    const reports = [
      { id: 1, name: 'Report 1', result: 'Victory' },
      { id: 2, name: 'Report 2', result: 'Defeat' },
    ];
    res.status(200).json(reports);
  } else if (req.method === 'POST') {
    // Simular agregar un reporte
    const { name, result } = req.body;
    res.status(201).json({ message: 'Report Created', data: { name, result } });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
