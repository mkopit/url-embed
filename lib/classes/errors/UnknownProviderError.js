'use strict';

/**
* Error occurs when a provider cannot not be found for the given URL.
*/
class UnknownProviderError extends Error {}

module.exports = UnknownProviderError;