'use strict';

/** @ignore */
let utils = require('./lib/utils');

module.exports.EmbedEngine = require('./lib/classes/EmbedEngine');
module.exports.URLEmbedProvider = require('./lib/classes/URLEmbedProvider');
module.exports.OEmbedProvider = require('./lib/classes/OEmbedProvider');
module.exports.defaultProviderClasses = {};

let providerList = utils.loadClassesFromDirectory(__dirname + '/lib/classes/default_providers');

for (let i = 0; i < providerList.length; i++) {
  let provider = providerList[i];
  module.exports.defaultProviderClasses[provider.name] = provider;
}
