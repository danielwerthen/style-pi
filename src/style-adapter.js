function StyleAdapter() {

}

StyleAdapter.prototype = {
  injectStyle(options) {
    throw new Exception('injectStyle is not implemented properly');
  }
}

module.exports = StyleAdapter;