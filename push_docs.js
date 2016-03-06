var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'docs/esdoc'), function (err) {
  if (err) {
    console.error('An error occurred while pushing docs: ');
    console.error(err.stack);
  } else {
    console.log('gh-pages published.\n');
  }
});
