'use strict';

/** @ignore */
let EmbedValidationError = require('./errors/EmbedValidationError');

/**
 * Embed data object that holds embedOptions and resulting data.
 */
class Embed {
  /**
  * @param {String} embedURL - URL to be embedded
  * @param {Object} embedOptions - Additional options
  * @throws {EmbedValidationError} - if embedURL is undefined.
  */
  constructor (embedURL, embedOptions) {
    if (!embedURL) {
      throw new EmbedValidationError('embedURL is undefined');
    }
    /**
    * The URL to be embedded
    * @type {String}
    */
    this.embedURL = embedURL;

    /**
    * Will be populated with an Error object if an error occurs while processing this embed
    * @type {Error}
    */
    this.error = null;

    /**
    * Options for this Embed
    * @type {Object}
    */
    this.options = embedOptions || {};

    /**
    * Default markup for unprocessed embed.data.html
    * @type {String}
    */
    this.stubMarkup = '<!-- default embed markup -->';

    /**
    * Data object for the resolved embed
    *
    * __Note:__ there should always be a populated data.html property, even if the embed encounters an error while resolving.
    * @type {{html: String}}
    */
    this.data = {
      html: this.stubMarkup
    };

    /**
    * Time the embed began resolving
    * @type {Date}
    */
    this.startedDate = null;

    /**
    * Time the embed finished resolving
    * @type {Date}
    */
    this.finishedDate = null;

    /**
    * Milliseconds elapsed during resolving embed
    * @type {number}
    */
    this.elapsedMs = null;

    /**
    * The provider API URL that was used to resolve the embed
    * @type {String}
    */
    this.oembedAPIURL = null;
  }

  /**
  * Timestamps the beginning of the embed resolve process.
  */
  markStarted () {
    this.startedDate = new Date();
  }

  /**
  * Timestamps the end of the embed resolve process and calculates elapsedMs
  */
  markFinished () {
    this.finishedDate = new Date();
    this.elapsedMs = this.finishedDate.getTime() - this.startedDate.getTime();
  }
}

module.exports = Embed;
