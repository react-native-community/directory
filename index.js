import express from 'express';
import next from 'next';
import nextRoutes from 'next-routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import * as Sorting from './common/sorting';
import { handleFilterLibraries } from './common/search';
import data from './build/data.json';

const originalData = [...data.libraries];
const sortedData = {
  updated: Sorting.updated([...originalData]),
  recommended: Sorting.recommended([...originalData]),
  compatibility: Sorting.compatibility([...originalData]),
  quality: Sorting.quality([...originalData]),
  downloads: Sorting.downloads([...originalData]),
  issues: Sorting.issues([...originalData]),
  stars: Sorting.stars([...originalData]),
};

const isProduction = process.env.NODE_ENV === 'production';
const routes = nextRoutes();
const port = parseInt(process.env.PORT, 10) || 8000;
const app = next({ dev: !isProduction });
const customHandler = routes.getRequestHandler(app);

const getAllowedOrderString = req => {
  let sortBy = 'updated';

  [
    'recommended',
    'compatibility',
    'quality',
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

  server.use('/static', express.static('static'));
  server.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  if (isProduction) {
    server.use(compression());
  }

  server.get('/:order/:topic', (req, res) => {
    const sortBy = getAllowedOrderString(req);
    const libraries = sortedData[sortBy];

    if (req.query.json) {
      if (req.query.search) {
        return res.status(200).json(
          handleFilterLibraries({
            libraries,
            queryTopic: req.params.topic,
            querySearch: req.query.search,
          })
        );
      }

      return res.status(200).json(libraries);
    }

    return app.render(req, res, '/', {
      libraries,
      sortBy,
      topic: req.params.topic,
      search: req.query.search,
    });
  });

  server.get('/:order', (req, res) => {
    const sortBy = getAllowedOrderString(req);
    const libraries = sortedData[sortBy];

    if (req.query.json) {
      if (req.query.search) {
        return res.status(200).json(
          handleFilterLibraries({
            libraries,
            querySearch: req.query.search,
          })
        );
      }

      return res.status(200).json(libraries);
    }

    return app.render(req, res, '/', {
      libraries,
      sortBy,
      search: req.query.search,
    });
  });

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
