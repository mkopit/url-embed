'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Tumblr embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Tumblr extends OEmbedProvider {}

Tumblr.prototype.name = 'tumblr';
Tumblr.prototype.providerURL = 'https://www.tumblr.com/oembed/1.0';
Tumblr.prototype.urlPatterns = ['^https?://(.+)\.tumblr\.com/post/.*'];
Tumblr.prototype.format = 'json';
module.exports = Tumblr;
