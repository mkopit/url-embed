'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Flickr embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Flickr extends OEmbedProvider {}

Flickr.prototype.name = 'flickr';
Flickr.prototype.providerURL = 'https://www.flickr.com/services/oembed/';
Flickr.prototype.urlPatterns = ['^https?://(www\.)?flickr\.com/.*', 'https?://flic\.kr/.*'];
Flickr.prototype.format = 'json';

module.exports = Flickr;
