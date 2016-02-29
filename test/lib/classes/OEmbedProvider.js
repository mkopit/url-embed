'use strict';

let assert = (require('chai')).assert;
let OEmbedProvider = require('../../../lib/classes/OEmbedProvider.js');
let Embed = require('../../../lib/classes/Embed.js');
let matchingURL = 'http://www.example.com/';
let nonMatchingURL = 'http://foo.com/';
let urlPatterns = ['^' + matchingURL + '.*'];
let providerURL = 'http://api.example.com/oembed';
let html = '<iframe src="http://www.example.com/iframeedthing"></iframe>';
let failMarkup = '<strong>FAIL</strong>';
let body = JSON.stringify({
  html: html
});
let provider;
let embed;

let mockRequestSuccess = function(requestOptions, callback) {
  let response = {
    statusCode : 200,
    request: {
      uri : {
        href : providerURL
      }
    }
  };
  callback(null, response, body);
}

let mockRequestFail = function(requestOptions, callback) {
  let response = {
    statusCode : 404,
    request: {
      uri : {
        href : providerURL
      }
    }
  };
  callback(null, response, 'Thing not found');
}

class Provider extends OEmbedProvider {}

Provider.prototype.name = 'testProvider';
Provider.prototype.providerURL = providerURL;
Provider.prototype.urlPatterns = urlPatterns;
Provider.prototype.format = 'json';

/** @test {OEmbedProvider} */
describe('OEmbedProvider', function() {
  beforeEach(function () {
    provider = new Provider();
    embed = new Embed();
    embed.options.embedURL = matchingURL;
  });

  /** @test {OEmbedProvider#constructor} */
  describe('URLEmbedProvider#constructor', function() {
    /** @test {OEmbedProvider#constructor} */
    it('should contain a urlPatterns property', function() {
      assert.equal(provider.urlPatterns, urlPatterns);
    });
    /** @test {OEmbedProvider#constructor} */
    it('should contain a providerURL property', function() {
      assert.equal(provider.providerURL, providerURL);
    });
  });

  /** @test {URLEmbedProvider#isMatch} */
  describe('OEmbedProvider#isMatch', function () {
    /** @test {URLEmbedProvider#isMatch} */
    it('should match the provider url', function() {
      assert.isTrue(provider.isMatch(matchingURL + 'foo/bar'));
    });
    
    /** @test {URLEmbedProvider#isMatch} */
    it('should fail to match a different url', function() {
      assert.isFalse(provider.isMatch(nonMatchingURL));
    });
  });

  /** @test {OEmbedProvider#getEmbed} */
  describe('OEmbedProvider#getEmbed', function() {

    /** @test {OEmbedProvider#getEmbed} */
    it('successful: should return the body markup', function(done) {
      provider.request = mockRequestSuccess;

      provider.getEmbed(embed, function(embed) {
        assert.equal(embed.data.html, html);
        done();
      });
    });

    /** @test {URLEmbedProvider#filterData} */
    it('filterData function should get called', function(done) {
      let called = false;

      provider.request = mockRequestSuccess;

      provider.filterData = function(data) {
        called = true;
        return data;
      }
      provider.getEmbed(embed, function(embed) {
        assert.isNull(embed.error);
        assert.isTrue(called);
        done();
      });
    });

    /** @test {OEmbedProvider#getEmbed} */
    it('should return an error object when it fails', function (done) {
      provider.request = mockRequestSuccess;

      provider.filterData = function(data) {
        throw new Error('Intentional error');
      }
      provider.getEmbed(embed, function(embed) {
        assert.isTrue((embed.error instanceof Error));
        done();
      });
    });

    /** @test {URLEmbedProvider#errorMarkup} */
    it('should call errorMarkup when it fails', function(done) {
      provider.request = mockRequestSuccess;

      provider.filterData = function (data) {
        throw new Error('Intentional error');
      }

      provider.errorMarkup = function(embed, error, errorMessage) {
        assert.equal(embed.options.embedURL, matchingURL);
        return failMarkup;
      }
      provider.getEmbed(embed, function(embed) {
        assert.equal(embed.data.html, failMarkup);
        done();
      });
    });

    /** @test {URLEmbedProvider#errorMarkup} */
    it('should call errorMarkup if the provider yields a non 200 response', function(done) {
      provider.request = mockRequestFail;

      let called = false;

      provider.errorMarkup = function(embed, error, errorMessage) {
        called = true;
        assert.equal(embed.options.embedURL, matchingURL);
        return failMarkup;
      }

      provider.getEmbed(embed, function(embed) {
        assert.equal(embed.data.html, failMarkup);
        done();
      });
    });

    it('should call errorMarkup404 if the provider yields a 404 response and the provider supports the method', function(done) {
      provider.request = mockRequestFail;

      let called = false;

      provider.errorMarkup404 = function(embed, error, errorMessage) {
        called = true;
        assert.equal(embed.options.embedURL, matchingURL);
        return failMarkup;
      }
      provider.getEmbed(embed, function(embed) {
        assert.equal(embed.data.html, failMarkup);
        done();
      });
    });
  });

  /** @test {OEmbedProvider#buildAPIURL} */
  describe('OEmbedProvider#buildAPIURL', function() {
    it('should return a valid API url with all options accounted for', function() {
      let options = {
        embedURL: matchingURL,
        maxWidth: 500,
        maxHeight: 300
      };

      provider.defaultProviderQueryStringParameters = {
        foo: 'bar'
      }

      let apiURL = provider.buildAPIURL(options);
      assert.match(apiURL, new RegExp('^' + providerURL));
      assert.match(apiURL, /\?.*maxheight=300/);
      assert.match(apiURL, /\?.*maxwidth=500/);
      assert.match(apiURL, /\?.*foo=bar/);
    })
  });

  /** @test {OEmbedProvider#convertHighBitUnicodeToSurrogates} */
  describe('OEmbedProvider#convertHighBitUnicodeToSurrogates', function() {
    it('should convert the escaped code point for "🚀" to the corresponding escaped surrogate pair', function() {
      assert.equal(provider.convertHighBitUnicodeToSurrogates('\\U0001f680'), '\\ud83d\\ude80');
    });
  });
  
});