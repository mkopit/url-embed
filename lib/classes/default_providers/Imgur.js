'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Imgur embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Imgur extends OEmbedProvider {}

Imgur.prototype.name = 'imgur';
Imgur.prototype.providerURL = 'http://api.imgur.com/oembed';
Imgur.prototype.urlPatterns = ['^https?://(.+\.)?imgur\.com/.*'];
Imgur.prototype.format = 'json';
module.exports = Imgur;
