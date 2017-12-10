# `Loc8r` Find Your Locations
[![NPM Version][npm-image]][npm-url]
[![Nodejs Version][node-image]][node-url]


[Demo](http://loc8r-ruiwei.herokuapp.com/)

An application to share and review your favorite locations


## Tech Stack
Node.js, Express, MongoDB, Mongoose, Angular.js

# How to Run
1. git clone this respository, `npm install`
2. `bow install` to install front end packages
3. `npm run build` or `npm run dev` to ask Gulp to compile front end bundles
4. `nodemon` to start the Node.js server
5. Go to `localhost:5050` live reload server (if npm run dev) or`localhost:5000` backend server to use the app


# Notes
* The `start` and `postinstall` scripts in `package.json` are for deployment to Heroku. `postinstall` will ask Heroku to install bower dependencies and run gulp `build` task.
* To notify Heroku to install bower and gulp themselves which live inside `devDependencies`, run `heroku config:set NPM_CONFIG_PRODUCTION=false` in the root folder. [(reference)](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)
* By default the Gulp live reload is run on localhost:5050, and all `/api` requests are proxied to `localhost:5000` which is the backend address. To modify this, change the `target` value in Gulp's `connect` task.

[npm-url]: https://npmjs.org/package/node-version-check
[npm-image]: https://img.shields.io/npm/v/npm.svg
[node-image]: https://img.shields.io/badge/Node-8.6.0-brightgreen.svg
[node-url]: https://nodejs.org/en/