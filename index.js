import express from 'express';
import next from 'next';
import nextRoutes from 'next-routes';

const routes = nextRoutes();
const port = parseInt(process.env.PORT, 10) || 8000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const customHandler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    return customHandler(req, res);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`Running on localhost:${port}`);
  });
});
