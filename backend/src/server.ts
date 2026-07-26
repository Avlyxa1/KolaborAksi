import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[KolaborAksi] Server running on http://localhost:${PORT}`);
  console.log(`[KolaborAksi] Health check: http://localhost:${PORT}/api/health`);
});
