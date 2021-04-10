(function() {
  var sleep, text;

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  text = `just a generator demo`;

  if (module === require.main) {
    (() => {
      var i, len, word, words;
      console.log('helo');
      words = text.split(/\s+/);
      console.log(words);
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        console.log(word);
      }
      // await sleep 0.1
      return process.stderr.write("and hello over the other channel!\n");
    })();
  }

}).call(this);

//# sourceMappingURL=_generator.js.map