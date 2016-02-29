# url-embed

A flexible class-based system that supports converting URLs into embed code. The module provides support for many oembed providers, as well as support for creating your own custom providers.

[API Documentation Lives Here](http://mkopit.github.io/url-embed/docs/esdoc/index.html)

## The Basics

* [EmbedEngine class](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/Embed.js~Embed.html): given one or more urls will resolve them to corresponding markup.
* [URLEmbedProvider interface](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/URLEmbedProvider.js~URLEmbedProvider.html): defines the basic methods that will get invoked by EmbedEngine
* [OEmbedProvider interface](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/OEmbedProvider.js~OEmbedProvider.html): extends URLEmbedProvider and implements support for interacting with an oembed provider's API
* [Embed class](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/Embed.js~Embed.html): the primary object passed through callbacks
  * [error](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/Embed.js~Embed.html#instance-member-error): contains a reference to an Error object if an error occurred
  * [embedOptions](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/Embed.js~Embed.html#instance-member-options): options object the Embed was constructed from
    * embedURL: the URL we're embedding
  * [data](http://mkopit.github.io/url-embed/docs/esdoc/class/lib/classes/Embed.js~Embed.html#instance-member-data): the data object from the resolved embed
    * html: the resulting embed markup.


&nbsp;

Example: Resolving a single embed

```javascript
'use strict';

let engine = new require('url-embed').EmbedEngine({
  timeoutMs: 2000,
  referrer: 'www.example.com'
});

engine.registerDefaultProviders();

// Get single embed
engine.getEmbed({embedURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}, function(embed) {
  if (embed.error) {
    console.log('Something went wrong.');
    console.log(err.stack);
  }

  // Embed markup
  console.log(embed.data.html);
});

```

&nbsp;

Example: resolving muliple embeds in parallel

```javascript
'use strict';

let engine = new require('url-embed').EmbedEngine({
  timeoutMs: 2000,
  referrer: 'www.example.com'
});

engine.registerDefaultProviders();

let embedOptionArray = [
  {embedURL: 'https://www.instagram.com/p/BCA0qkon9B1/?taken-by=mtv'},
  {embedURL: 'https://soundcloud.com/newyorker/listen-to-craig-raine-read-bitch'},
  {embedURL: 'https://www.youtube.com/watch?v=2LO4QL_i8is'},
  {embedURL: 'https://vimeo.com/156045670'},
  {embedURL: 'http://soundcloud.com/forss/flickermood'},
  {embedURL: 'https://www.flickr.com/photos/sas999/25092061391/in/explore-2016-02-22/'},
  {embedURL: 'http://www.dailymotion.com/video/x3lwpy7_the-worst-car-in-the-history-of-the-world-top-gear-bbc_auto'},
  {embedURL: 'https://www.facebook.com/facebook/videos/10153231379946729/'},
  {embedURL: 'https://www.facebook.com/MTV/posts/10153553500401701'},
  {embedURL: 'https://twitter.com/simpscreens/status/702025133951680512'},
  {embedURL: 'http://imgur.com/gallery/KSMB2tI'},
  {embedURL: 'https://play.spotify.com/track/0ivpUENLpheuPoa6VuY1ax'},
  {embedURL: 'http://mtv.tumblr.com/post/139813756155/kanye-west-taking-a-kanye-rest-so-he-can-do-his'},
  {embedURL: 'https://videopress.com/v/kUJmAcSf'},
  {embedURL: 'http://www.example.com/foo'}
];

// Get multiple embeds
engine.getMultipleEmbeds(embedOptionArray, function (error, results) {
  if (error) {
    // dang it
  } else {
    for (let i = 0; i < results.length; i++) {
      embed = results[i];
      if (embed.error) {
        // something failed during resolving this embed
      } else {
        console.log(embed.data.html);
      }
    }
  }
}

```

## Creating Your Own URL Embed Providers

You can extend URLEmbedProvider and OEmbedProvider to make your own embed providers.

Example: oembed provider

```javascript
'use strict';

let OEmbedProvider = (require('url-embed')).OEmbedProvider;

class SoundCloud extends OEmbedProvider {}

// Name of provider
SoundCloud.prototype.name = 'soundcloud';

// oembed API URL
SoundCloud.prototype.providerURL = 'http://soundcloud.com/oembed';

// List of RegExp patterns to match provider urls
SoundCloud.prototype.urlPatterns = ['^https?://(www\.)?soundcloud\.com/.*'];

// Format indicates the response type of the oembed API
SoundCloud.prototype.format = 'json';

module.exports = SoundCloud;

```

&nbsp;

Example: custom provider

```javascript
'use strict';

let URLEmbedProvider = (require('url-embed')).URLEmbedProvider;

class CustomProvider extends URLEmbedProvider {

  /*
  * @override
  */
  getEmbed (embed, callback) {
    let embedURL = embed.options.embedURL;

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

  /*
  * Optional custom override of function that generates error markup.
  * @override
  */
  errorMarkup (embed, error, errorMessage) {
    return 'Oops. Something went wrong for: <a href="' + embed.options.embedURL + '">' + embed.options.embedURL + '</a>';
  }
}

CustomProvider.prototype.name = 'custom';
CustomProvider.prototype.urlPatterns = ['^https?://www\.example\.com/video/.*'];

module.exports = CustomProvider;
```

&nbsp;

Example: registering a provider with the EmbedEngine

```javascript
'use strict'

let CustomProvider = require('./custom_provider');

let engine = new require('url-embed').EmbedEngine({
  timeoutMs: 2000,
  referrer: 'www.example.com'
});

engine.registerProvider(new CustomProvider());
```