'use strict';

/** @ignore */
let URLEmbedProvider = require('../URLEmbedProvider');

/**
  Custom embed provider for older MTV video page urls
*/
class MTVVideoOld extends URLEmbedProvider {

  /**
    @override
  */
  getEmbed (embed, callback) {
    let embedURL = embed.options.embedURL;

    try {
      let matches = embedURL.match('/videos/misc/([0-9]+)');
      embed.data.html = '<iframe src="http://media.mtvnservices.com/embed/mgid:uma:video:mtv.com:' + matches[1] + '" width="512" height="288" frameborder="0"></iframe>';
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

MTVVideoOld.prototype.name = 'old_mtv_video';
MTVVideoOld.prototype.urlPatterns = ['^http://www\.mtv\.com/videos/misc/.*'];

module.exports = MTVVideoOld;
