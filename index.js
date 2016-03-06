'use strict';

/** @ignore */
let utils = require('./lib/utils');

module.exports.EmbedEngine = require('./lib/classes/EmbedEngine');
module.exports.URLEmbedProvider = require('./lib/classes/URLEmbedProvider');
module.exports.OEmbedProvider = require('./lib/classes/OEmbedProvider');
module.exports.Embed = require('./lib/classes/Embed');
module.exports.defaultProviderClasses = {};
module.exports.errorClasses = {};

let providerList = utils.loadClassesFromDirectory(__dirname + '/lib/classes/default_providers');

for (let i = 0; i < providerList.length; i++) {
  let Provider = providerList[i];
  module.exports.defaultProviderClasses[Provider.name] = Provider;
}

let errorList = utils.loadClassesFromDirectory(__dirname + '/lib/classes/errors');

for (let i = 0; i < errorList.length; i++) {
  let ErrorClass = errorList[i];
  let errorInstance = new ErrorClass();
  module.exports.errorClasses[typeof errorInstance] = ErrorClass;
}