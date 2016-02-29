'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  SoundCloud embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class SoundCloud extends OEmbedProvider {}

SoundCloud.prototype.name = 'soundcloud';
SoundCloud.prototype.providerURL = 'http://soundcloud.com/oembed';
SoundCloud.prototype.urlPatterns = ['^https?://(www\.)?soundcloud\.com/.*'];
SoundCloud.prototype.format = 'json';
module.exports = SoundCloud;
