'use strict';

let assert = (require('chai')).assert;
let Embed = require('../../../lib/classes/Embed.js');
let embedURL = 'http://www.example.com/foo';
let embedOptions = {
  foo: 'bar'
};
let embed;

describe('Embed', function() {
  beforeEach(function () {
    embed = new Embed(embedURL, embedOptions);
  });
  describe('Embed#constructor', function() {
    it('embedURL should be set', function() {
      assert.equal(embedURL, embed.embedURL);
    });
    it('options should be set', function() {
      assert.equal(embedOptions, embed.options);
    });
  });
  describe('Embed#markStarted', function() {
    it('embed.startedDate should be a Date object ', function() {
      embed.markStarted();
      assert.instanceOf(embed.startedDate, Date);
    });
  });
  describe('Embed#markFinished', function() {
    it('embed.finishedDate should be a Date object', function() {
      embed.markStarted();
      embed.markFinished();
      assert.instanceOf(embed.finishedDate, Date);
    });
    it('embed.elapsedMs should be a number', function() {
      embed.markStarted();
      embed.markFinished();
      assert.isNumber(embed.elapsedMs);
    });
  });
});