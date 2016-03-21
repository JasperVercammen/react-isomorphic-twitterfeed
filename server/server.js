/**
 * Created by mobinni on 07/12/15.
 */

// Imports
import env from './utils/environment';
import express from 'express';
import {webpack as webPackCustomMiddleware, render} from './middleware';
import compression from 'compression';
import {filter} from 'lodash';

var Twit= require('twit');

const config = {
  consumer_key: "jxe7YL8UNgfbCLIax8yO2dv5M",
  consumer_secret: "bAXV7Xap54KCpe7JBzvjCymYJSNkoK2sOaaH6aOYLXMZ9kczT3",
  access_token: "572764156-IH99cW8QNW134efZgtZ1LXfQBKqmUwdjSqMOioOZ",
  access_token_secret: "Wy08MJHHJW6fAeWqKdO4Gq597x0l6DAPqoco6afzYTsm5"
};

var T = new Twit(config);

const app = express();
const {isProduction, ssrEnabled, isDevelopment} = env;

export function boot() {
  // Configuration
  const port = isProduction ? process.env.PORT : 9000;


// Environment setup
  if (isDevelopment) {
    app.use(function (req, res, next) {
      if (req.url !== '/') {
        // if you're not the root url, pass throught the webpack middleware
        webPackCustomMiddleware.WebPackMiddleware(req, res, next);
      } else {
        // Will pass through a middleware to server side render index.html
        next();
      }
    });

    app.use(webPackCustomMiddleware.HotReloadMiddleware);
  }

  app.get('/api/twitter-feed' , function(req, res) {
    console.log(req.query.search);
    const limit = req.query.limit? req.query.limit : 10;
    T.get('statuses/user_timeline', {
        count: 50,
        exclude_replies: true,
        include_rts: true,
        user_id: 35544835,
        screen_name: 'Keytradebank'
      }, function(err, data, response) {
        if(req.query.lang && req.query.lang !== '') {
          data = filter(data, function (o) {
            return o.lang === req.query.lang;
          });
        }

        res.send(data);
      });
  });

  // Other middlewares
  app.use(compression());
  if (ssrEnabled) {
    app.use(render.route);
  } else {
    app.use(render.index);
  }

  app.listen(port, () => console.log('Server running on port ' + port));
};