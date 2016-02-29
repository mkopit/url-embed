'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Youtube embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Youtube extends OEmbedProvider {}

Youtube.prototype.name = 'youtube';
Youtube.prototype.providerURL = 'http://www.youtube.com/oembed';
Youtube.prototype.urlPatterns = [
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/watch.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/v/.+$',
  '^http(?:s)?://youtu\\.be/.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/user/.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/[^#?/]+#[^#?/]+/.+$',
  '^http(?:s)?://m\\.youtube\\.com/index.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/profile.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/view_play_list.+$',
  '^http(?:s)?://(?:[-\\w]+\\.)?youtube\\.com/playlist.+$'
];
Youtube.prototype.format = 'json';
module.exports = Youtube;
