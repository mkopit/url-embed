'use strict';

/** @ignore */
let OEmbedProvider = require('../OEmbedProvider');

/**
  Vimeo embed provider
  @see https://core.trac.wordpress.org/browser/tags/4.4.2/src/wp-includes/class-oembed.php
*/
class Vimeo extends OEmbedProvider {}

Vimeo.prototype.name = 'vimeo';
Vimeo.prototype.providerURL = 'https://vimeo.com/api/oembed.json';
Vimeo.prototype.urlPatterns = ['^https?://(.+\.)?vimeo\.com/.*'];

module.exports = Vimeo;
