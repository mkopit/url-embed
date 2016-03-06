'use strict';

/**
* Error occurs when an HTTP request resulted in a non 200 response.
*/
class UnexpectedStatusError extends Error {
  /**
  * @param {String} message - Error message
  * @param {String} fileName - File where error was thrown.
  * @param {number} lineNumber - Line nunmber where error was thrown.
  * @override
  */
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);

    /**
    * HTTP status code
    * @type {number}
    */
    this.status = 0;
  }
}

module.exports = UnexpectedStatusError;