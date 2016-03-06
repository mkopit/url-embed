'use strict';

/** @ignore */
let querystring = require('querystring');
/** @ignore */
let request = require('request');
/** @ignore */
let fs = require('fs');
/** @ignore */
let UnexpectedStatusError = require('./errors/UnexpectedStatusError');
/** @ignore */
let EmbedValidationError = require('./errors/EmbedValidationError');
/** @ignore */
let URLEmbedProvider = require('./URLEmbedProvider');
/** @ignore */
let xml2js = require('xml2js');

/**
* Converts a pattern of URLs into markup via an oembed provider
* @see http://oembed.com
* @extends {URLEmbedProvider}
* @interface
*/
class OEmbedProvider extends URLEmbedProvider {

  /**
  * @param {String} providerURL - the URL of the provider's oembed service
  * @param {Array<RegExp>} urlPatterns - array of regular expressions that this provider will match
  * @param {String} format - the data format of the provider's oembed service. Must be either 'json' or 'xml'.
  */
  constructor (providerURL, urlPatterns, format) {
    super(urlPatterns);

    /**
    * The URL of the provider's oembed service
    * @type {String}
    */
    if (providerURL) this.providerURL = providerURL;

    /**
    * @desc The data format of the provider's oembed service.
    * @type {String}
    */
    if (format) this.format = format;

    /**
    * The version number of the url-embed module
    * @type {String}
    */
    this.version = null;
  }

  /**
  * Resolves options.embedURL to an embed and passes it to callback.
  * @param {Embed} embed - Embed object
  * @param {function(embed:Embed)} callback - callback to invoke after resolving embed
  * @throws {UnexpectedStatusError} throws when provider API returns a non-200 response.
  * @throws {EmbedValidationError} throws when Embed is missing embed.options.embedURL
  * @override
  */
  getEmbed (embed, callback) {
    if (!embed || !embed.options || !embed.options.embedURL) {
      throw new EmbedValidationError('Embed.options object missing required property: embedURL');
    }

    this.makeAPIRequest(embed, function (embed) {
      callback(embed);
    });
  }

  /**
  * Makes the requests to the oembed provider's API
  * @param {Embed} embed - embed object
  * @param {function(embed:Ebmed)} callback - callback to invoke after resolving embed
  */
  makeAPIRequest (embed, callback) {
    let self = this;
    let options = embed.options;
    let requestOptions = self.buildRequestOptions(options);
    let oembedAPIURL = self.buildAPIURL(options, requestOptions);
    requestOptions.url = oembedAPIURL;

    self.request(requestOptions, function (error, response, body) {
      if (response && response.request && response.request.uri && response.request.uri.href) {
        embed.oembedAPIURL = response.request.uri.href;
      } else {
        embed.oembedAPIURL = oembedAPIURL;
      }

      if (!error && response.statusCode === 200) {
        self.parseResponseBody(body, function (error, data) {
          // json or xml parsing error
          if (error) {
            self._applyErrorToEmbed(error, embed);
            callback(embed);
            return;
          // successfuly parsed
          } else {
            embed.data = data;
            self.filterData(embed.data);
            callback(embed);
            return;
          }
        });
      } else {
        // Error making request
        if (error) {
          self._applyErrorToEmbed(error, embed);
          callback(embed);
          return;
        // No error, but non-200 HTTP response
        } else {
          let errorMarkupFunctionName = 'errorMarkup' + response.statusCode;
          let errorMarkupFunction = self[errorMarkupFunctionName] ? self[errorMarkupFunctionName] : self.errorMarkup;
          let error = new UnexpectedStatusError('HTTP status ' + response.statusCode + ' for embed provider URL: ' + oembedAPIURL);
          error.status = response.statusCode;
          self._applyErrorToEmbed(error, embed, errorMarkupFunction);
          callback(embed);
          return;
        }
      }
    });
  }

  /**
  * Puts the Embed into an error state if an error occurs
  * @param {Error} error - the Error that occurred
  * @param {Embed} embed - the Embed object
  * @param {function(embed: Embed, error: Error)} [errorMarkupFunction] - function that generates error markup
  */
  _applyErrorToEmbed (error, embed, errorMarkupFunction) {
    if (!errorMarkupFunction) {
      errorMarkupFunction = this.errorMarkup;
    }
    embed.data.html = errorMarkupFunction(embed, error);
    embed.error = error;
  }

  /**
  * Parses the provider API response into a data object
  * @param {String} body - API response
  * @param {function(error: Error, data: Object)}
  */
  parseResponseBody (body, callback) {
    body = this.convertHighBitUnicodeToSurrogates(body);
    let data;
    if (this.format === 'json') {
      try {
        data = JSON.parse(body);
        callback(null, data);
      } catch (error) {
        callback(error);
      }
      return;
    } else {
      let xmlOptions = {
        explicitArray: false,
        valueProcessors: [
          xml2js.processors.parseNumbers,
          xml2js.processors.parseBooleans
        ]
      };
      data = xml2js.parseString(body, xmlOptions, function (error, result) {
        if (error) {
          callback(error);
        } else {
          data = result.oembed;
          callback(null, data);
        }
        return;
      });
    }
  }

  /**
  * Builds the API URL string
  * @param {Object} embedOptions - options object
  * @param {String} embedOptions.embedURL - URL to be embedded
  * @return {String} - API URL
  */
  buildAPIURL (embedOptions) {
    let qs = {};
    qs.url = embedOptions.embedURL;
    qs.format = this.format;
    if (embedOptions.maxWidth) qs.maxwidth = embedOptions.maxWidth;
    if (embedOptions.maxHeight) qs.maxheight = embedOptions.maxHeight;

    if (this.defaultProviderQueryStringParameters) {
      for (let name in this.defaultProviderQueryStringParameters) {
        qs[name] = this.defaultProviderQueryStringParameters[name];
      }
    }

    return this.providerURL + '?' + querystring.stringify(qs);
  }

  /**
  * Builds the HTTP request options (headers, etc.)
  * @see https://www.npmjs.com/package/request
  * @param {Object} embedOptions - options object
  * @param {String} embedOptions.embedURL - URL to be embedded
  * @return {Object} - request options
  */
  buildRequestOptions (embedOptions) {
    if (!this.version) {
      let fileContents = fs.readFileSync(__dirname + '/../../package.json');
      let packageJSON = JSON.parse(fileContents);
      this.version = packageJSON.version;
    }

    let requestOptions = {
      headers: {
        'User-Agent': 'URLEmbed Module HTTP Agent ' + this.version
      },
      timeout: this.timeoutMs
    };
    return requestOptions;
  }

  /**
  * Converts high-bit-value escaped unicode code points to unicode surrogate pair code points.
  *
  * JSON.parse yields a parse error when it encounters unicode literals > 16-bits.
  * Notably, many newer emojis fall into this category.
  *
  * To solve for this you need to split the > 16-bit unicode escapedcode point into surrogate pairs.
  *
  * Great and entertaining explaination here:
  * {@link https://gist.github.com/mranney/1707371}
  *
  * Algorithm for calculating surrogate pairs cribbed from here:
  * {@link http://www.russellcottrell.com/greek/utilities/surrogatepaircalculator.htm}
  *
  * @param {String} body - The raw body of the HTTP response from the oembed provider's API
  * @return {String} - The transformed body with surrogate pairs
  */
  convertHighBitUnicodeToSurrogates (body) {
    return body.replace(/\\U([\da-f]{8})/gm, function (match, scalarVal) {
      let S = parseInt('0x' + scalarVal, 16);
      let H = Math.floor((S - 0x10000) / 0x400) + 0xD800;
      let L = ((S - 0x10000) % 0x400) + 0xDC00;
      return '\\u' + H.toString(16) + '\\u' + L.toString(16);
    });
  }

  /**
  * Configures the provider
  * @param {Object} configOptions
  * @param {number} configOptions.timeoutMs - Request timeout in milliseconds.
  * @override
  */
  configure (configOptions) {
    if (configOptions && configOptions.timeoutMs) {
      this.timeoutMs = configOptions.timeoutMs;
    }
  }
}

/**
* The data format of the provider's oembed service. Defaults to 'json'
* @identifier format
* @type {String}
*/
OEmbedProvider.prototype.format = 'json';

/**
* Default request timeout in milliseconds. Defaults to 2000.
* @type {number}
* @identifier timeoutMs
*/
OEmbedProvider.prototype.timeoutMs = 2000;

/**
* Reference to the request module.
* @type {Object}
* @see https://www.npmjs.com/package/request
*/
OEmbedProvider.prototype.request = request;

/**
* Object containing any any odd querystring parameters that the provider's oembed service requires.
* @type {Object}
*/
OEmbedProvider.prototype.defaultProviderQueryStringParameters = null;

module.exports = OEmbedProvider;
