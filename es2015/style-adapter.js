'use strict';

function StyleAdapter() {}

StyleAdapter.prototype = {
  injectStyle: function injectStyle(options) {
    throw new Exception('injectStyle is not implemented properly');
  }
};

module.exports = StyleAdapter;