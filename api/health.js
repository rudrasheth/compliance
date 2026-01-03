// Vercel serverless function for health check
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'Compliance API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}