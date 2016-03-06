'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  DailyMotion embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class DailyMotion extends OEmbedProvider {}

DailyMotion.prototype.name = 'dailymotion';
DailyMotion.prototype.providerURL = 'https://www.dailymotion.com/services/oembed';
DailyMotion.prototype.urlPatterns = ['^http://dai.ly/.*', '^https?://(www\.)?dailymotion\.com/.*'];
DailyMotion.prototype.format = 'json';

module.exports = DailyMotion;
