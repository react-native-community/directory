import express from 'express';
import next from 'next';
import nextRoutes from 'next-routes';
import compression from 'compression';

const isProduction = process.env.NODE_ENV === 'production';
const routes = nextRoutes();
const port = parseInt(process.env.PORT, 10) || 8000;
const app = next({ dev: !isProduction });
const customHandler = routes.getRequestHandler(app);

const getAllowedSortByName = req => {
  let sortBy = 'updated';

  [
    'recommended',
    'compatibility',
    'health',
    'downloads',
    'issues',
    'stars',
  ].forEach(sortName => {
    if (req.params.order === sortName) {
      sortBy = sortName;
    }
  });

  return sortBy;
};

app.prepare().then(() => {
  const server = express();

  if (isProduction) {
    server.use(compression());
  }

  server.get('/search/:search', (req, res) => {
    return app.render(req, res, '/', { search: req.params.search });
  });

  server.get('/:order/:topic', (req, res) => {
    return app.render(req, res, '/', {
      sortBy: getAllowedSortByName(req),
      topic: req.params.topic,
    });
  });

  server.get('/:order', (req, res) => {
    return app.render(req, res, '/', { sortBy: getAllowedSortByName(req) });
  });

  server.get('*', (req, res) => {
    return customHandler(req, res);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`Running on http://localhost:${port}`);
  });
});
