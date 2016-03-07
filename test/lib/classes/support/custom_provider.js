'use strict';

/** @ignore */
let URLEmbedProvider = require('../../../../lib/classes/URLEmbedProvider.js');

class CustomProvider extends URLEmbedProvider {

  /**
    @override
  */
  getEmbed (embed, callback) {
    let embedURL = embed.embedURL;

    try {
      embed.data.html = '<iframe src="http://www.example.com/embed/video/12345" width="512" height="288" frameborder="0"></iframe>';
      this.filterData(embed.data);
      callback(embed);
    } catch (error) {
      embed.data = {
        html: this.errorMarkup(embedURL)
      };
      embed.error = error;
      callback(embed);
    }
  }
}

CustomProvider.prototype.name = 'custom';
CustomProvider.prototype.urlPatterns = ['^https?://www\.example\.com/video/.*'];

module.exports = CustomProvider;
