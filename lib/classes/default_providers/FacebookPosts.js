'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  FacebookPosts embed provider
  @see https://developers.facebook.com/docs/plugins/oembed-endpoints
*/
class FacebookPosts extends OEmbedProvider {}

FacebookPosts.prototype.name = 'facebook_posts';
FacebookPosts.prototype.providerURL = 'https://www.facebook.com/plugins/post/oembed.json/';
FacebookPosts.prototype.urlPatterns = [
  '^https://www.facebook.com/[^/]+/posts/.*',
  '^https://www.facebook.com/[^/]+/activity/.*',
  '^https://www.facebook.com/photo.php?fbid=.*',
  '^https://www.facebook.com/photos/.*',
  '^https://www.facebook.com/permalink.php?story_fbid=.*',
  '^https://www.facebook.com/media/set?set=.*',
  '^https://www.facebook.com/questions/.*',
  '^https://www.facebook.com/notes/.*'
];
FacebookPosts.prototype.format = 'json';

module.exports = FacebookPosts;
