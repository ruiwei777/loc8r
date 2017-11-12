# `Loc8r` Share and Review Your Favorite Locations
[![NPM Version][npm-image]][npm-url]
[![Nodejs Version][node-image]][node-url]


[Demo](http://loc8r-ruiwei.herokuapp.com/)


## Tech Stack
Node.js, Express, MongoDB, AngularJS, Gulp & Bower

# How to Run
* git clone this respository, `npm install`,  `nodemon` to run the server.
* to modify AngularJS, `bower install` then `npm run dev`(watch, livereload) or `npm run build`

# Notes
* The `start` and `postinstall` scripts in `package.json` are for deployment to Heroku. `postinstall` will ask Heroku to install bower dependencies and run gulp `build` task.
* To notify Heroku to install bower and gulp themselves which live inside `devDependencies`, run `heroku config:set NPM_CONFIG_PRODUCTION=false` in the root folder. [(reference)](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)

[npm-url]: https://npmjs.org/package/node-version-check
[npm-image]: https://img.shields.io/npm/v/npm.svg
[node-image]: https://img.shields.io/badge/Node-8.6.0-brightgreen.svg
[node-url]: https://nodejs.org/en/