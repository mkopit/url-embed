'use strict';

/** @ignore */
let async = require('async');

/** @ignore */
let URLEmbedProvider = require('./URLEmbedProvider');

/** @ignore */
let OEmbedProvider = require('./OEmbedProvider');

/** @ignore */
let utils = require('../utils');

/** @ignore */
let UnknownProviderError = require('./errors/UnknownProviderError');

/**
 * Resolves urls to embeds from a registered list of embed providers
 */
class EmbedEngine {
  /**
  * @param {Object} [engineOptions] - configuration options
  * @param {number} [engineOptions.timeoutMs] - request timeout in milliseconds
  */
  constructor (engineOptions) {
    /**
    * Utility references to provider superclasses
    * @type {{URLEmbedProvider: URLEmbedProvider, OEmbedProvider: OEmbedProvider}}
    */
    this.providerSuperClasses = {
      URLEmbedProvider: URLEmbedProvider,
      OEmbedProvider: OEmbedProvider
    };

    /**
    * The directory containing the default provider classes
    * @type {String}
    */
    this.defaultProviderDirectory = __dirname + '/default_providers';

    /**
    * The registry of provider instances
    * @type {Array<URLEmbedProvider>}
    */
    this.providerRegistry = [];

    /**
     * Array of provider classes included in this library
     * @type {Array<URLEmbedProvider>} defaultProviderClasses - array of provider classes included in this library
     */
    this.defaultProviderClasses = utils.loadClassesFromDirectory(this.defaultProviderDirectory);

    /**
    * Configuration options. These will also be passed to the configure method of each provider instance
    * @type {Object} engineOptions - configuration options
    * @property {number} engineOptions.timeoutMs - request timeout in milliseconds
    */
    this.engineOptions = engineOptions;
  }

  /**
  * Registers a provider instance.
  *
  * __Highlander Rule__: this provider will replace an already registered provider if they have the same name property.
  *
  * @param {URLProvider} provider - instance of <code>URLProvider</code> or <code>OEmbedProvider</code>
  */
  registerProvider (provider) {
    let providerExists = false;

    this._configureProvider(provider);

    for (let idx = 0; idx < this.providerRegistry.length; idx++) {
      if (this.providerRegistry[idx].name === provider.name) {
        this.providerRegistry[idx] = provider;
        providerExists = true;
      }
    }

    if (!providerExists) {
      this.providerRegistry.push(provider);
    }
  }

  _configureProvider (provider) {
    provider.configure(this.engineOptions);
  }

  /**
  * Registers all the default providers in this library
  * @param {String} [path] - directory of provider classes (if not specified it will default to the ones in this library)
  */
  registerDefaultProviders (path) {
    for (let i = 0; i < this.defaultProviderClasses.length; i++) {
      let ProviderClass = this.defaultProviderClasses[i];
      let provider = new ProviderClass();
      this._configureProvider(provider);
      this.registerProvider(provider);
    }
  }

  /**
  * Resolves an Embed object, populating its data property and calling the callback
  * @param {Embed} embed - Embed object
  * @param {function(embed: Embed)} callback - callback to invoke after resolving Embed
  */
  getEmbed (embed, callback) {
    embed.markStarted();

    let providerFound = false;

    for (let idx = 0; idx < this.providerRegistry.length; idx++) {
      let provider = this.providerRegistry[idx];
      let self = this;

      if (provider.isMatch(embed.embedURL)) {
        providerFound = true;

        provider.getEmbed(embed, function (embed) {
          self.filterData(embed.data);
          embed.markFinished();
          callback(embed);
          return;
        });

        idx = this.providerRegistry.length;
      }
    }

    if (!providerFound) {
      embed.error = new UnknownProviderError('Unknown embed provider for url: ' + embed.embedURL);
      embed.data = {
        html: this.errorMarkupNoMatchingProvider(embed)
      };
      embed.markFinished();
      callback(embed);
    }
  }

  /*
  * Resolves an array of embedOptions.embedURL's in parallel
  * @param {Array} optArray - Array of embed options objects
  * @param {function(error: Error, results: Array)} callback - callback to invoke after batch is complete
  */
  getMultipleEmbeds (optArray, callback) {
    let self = this;

    async.map(optArray, function (options, callbackIterator) {
      self.getEmbed(options, function (embed) {
        callbackIterator(null, embed);
      });
    },
    function (error, results) {
      callback(error, results);
    });
  }

  /**
  * Returns error markup if there was no provider that matched the embedURL
  * @param {Embed} embed - Embed object
  */
  errorMarkupNoMatchingProvider (embed) {
    return '<a href="' + embed.embedURL + '">' + embed.embedURL + '</a>';
  }

  /**
  * Can be overridden/replaced to modify any provider's data before it is passed to the client callback.<br />
  * *Note:* if you only need to modify a specific provider's data then there's a similar <code>filterData</code> method on each provider object, too.
  * @param {{html: string}} data - Data object containing embed html
  */
  filterData (data) {}
}

module.exports = EmbedEngine;
