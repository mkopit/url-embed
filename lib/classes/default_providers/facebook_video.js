'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  FacebookVideo embed provider
  @see https://developers.facebook.com/docs/plugins/oembed-endpoints
*/
class FacebookVideo extends OEmbedProvider {}

FacebookVideo.prototype.name = 'facebook_video';
FacebookVideo.prototype.providerURL = 'https://www.facebook.com/plugins/video/oembed.json/';
FacebookVideo.prototype.urlPatterns = [
  '^https://www.facebook.com/[^/]+/videos/.*',
  '^https://www.facebook.com/video.php?id=.*',
  '^https://www.facebook.com/video.php?v=.*'
];
FacebookVideo.prototype.format = 'json';
module.exports = FacebookVideo;
