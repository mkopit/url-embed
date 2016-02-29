'use strict';

let assert = (require('chai')).assert;

let URLEmbedProvider = require('../../../lib/classes/URLEmbedProvider.js');
let Embed = require('../../../lib/classes/Embed.js');
let matchingURL = 'http://www.example.com/';
let nonMatchingURL = 'http://foo.com/';
let urlPatterns = ['^' + matchingURL + '.*'];
let failMarkup = '<strong>FAIL</strong>';
let provider;
let embed;

/** @test {URLEmbedProvider} */
describe('URLEmbedProvider', function() {
  beforeEach(function () {
    provider = new URLEmbedProvider(urlPatterns);

    embed = new Embed();
    embed.options = {embedURL: matchingURL};
  });

  /** @test {URLEmbedProvider#constructor} */
  describe('URLEmbedProvider#constructor', function() {
    /** @test {URLEmbedProvider#constructor} */
    it('should contain a urlPatterns property', function() {
      assert(urlPatterns, provider.urlPatterns);
    });
  });

  /** @test {URLEmbedProvider#isMatch} */
  describe('URLEmbedProvider#isMatch', function () {
    /** @test {URLEmbedProvider#isMatch} */
    it('should match the provider url', function() {
      assert.isTrue(provider.isMatch(matchingURL + 'foo/bar'));
    });
    
    /** @test {URLEmbedProvider#isMatch} */
    it('should fail to match a different url', function() {
      assert.isFalse(provider.isMatch(nonMatchingURL));
    });
  });

  /** @test {URLEmbedProvider#getEmbed} */
  describe('URLEmbedProvider#getEmbed', function() {

    /** @test {URLEmbedProvider#getEmbed} */
    it('should return the stub markup', function(done) {
      provider.getEmbed(embed, function(embed) {
        assert.isNull(embed.error);
        assert.equal(embed.data.html, embed.stubMarkup);
        done();
      });
    });

    /** @test {URLEmbedProvider#filterData} */
    it('filterData function should get called', function(done) {
      let called = false;

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

    /** @test {URLEmbedProvider#getEmbed} */
    it('should return an error object when it fails', function (done) {
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
  });
});