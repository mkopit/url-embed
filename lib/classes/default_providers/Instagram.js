'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Instagram embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Instagram extends OEmbedProvider {}

Instagram.prototype.name = 'instagram';
Instagram.prototype.providerURL = 'https://api.instagram.com/oembed';
Instagram.prototype.urlPatterns = ['^https?://(www\.)?instagr(\.am|am\.com)/p/.*'];
Instagram.prototype.format = 'json';
module.exports = Instagram;

