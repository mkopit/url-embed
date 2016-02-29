'use strict';

/**
 * Embed data object that holds embedOptions and resulting data.
 */
class Embed {
  constructor () {
    /**
    * Will be populated with an Error object if an error occurs while processing this embed
    * @type {Error}
    */
    this.error = null;

    /**
    * Options for this embed
    * @type {{embedURL:String}}
    */
    this.options = {};

    /**
    * Default markup for unprocessed embed.data.html
    * @type {String}
    */
    this.stubMarkup = '<!-- default embed markup -->';

    /**
    * Data object for the resolved embed
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
