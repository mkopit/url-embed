'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Videopress embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Videopress extends OEmbedProvider {
  /**
    Configures the provider.

    Annoyingly Videopress requires a 'for' querystring parameter containing the name of the referring site.

    @param {Object} engineOptions
    @param {number} engineOptions.timeoutMs - Request timeout in milliseconds.
    @override
  */
  configure (engineOptions) {
    super.configure(engineOptions);

    /**
      @type {Object}
      @override
    */
    this.defaultProviderQueryStringParameters = {
      for: (engineOptions && engineOptions.referrer) ? engineOptions.referrer : 'www.example.com'
    };
  }
}

Videopress.prototype.name = 'videopress';
Videopress.prototype.providerURL = 'https://public-api.wordpress.com/oembed/1.0/';
Videopress.prototype.urlPatterns = ['^https?://videopress.com/v/.*'];
Videopress.prototype.format = 'json';

module.exports = Videopress;
