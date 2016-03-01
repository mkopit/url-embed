'use strict';

/** @ignore */
let fs = require('fs');

/**
* Utility Library
*/
module.exports = {
  /**
  * Requires in all class files in a directory
  * @param {String} [path] - path containing classes
  */
  loadClassesFromDirectory: function (path) {
    let classes = [];

    let files = fs.readdirSync(path);
    for (let i = 0; i < files.length; i++) {
      let clazz = require(path + '/' + files[i]);
      classes.push(clazz);
    }

    return classes;
  }
};
