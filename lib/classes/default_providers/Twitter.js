'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Twitter embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Twitter extends OEmbedProvider {}

Twitter.prototype.name = 'twitter';
Twitter.prototype.providerURL = 'https://api.twitter.com/1/statuses/oembed.json';
Twitter.prototype.urlPatterns = ['^https?://(www\.)?twitter\.com/.+?/status(es)?/.*'];
Twitter.prototype.format = 'json';
module.exports = Twitter;
