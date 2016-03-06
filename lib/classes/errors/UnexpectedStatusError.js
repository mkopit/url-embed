'use strict';

/**
* Error occurs when an HTTP request resulted in a non 200 response.
*/
class UnexpectedStatusError extends Error {}

module.exports = UnexpectedStatusError;