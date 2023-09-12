(function() {
  'use strict';
  var i, j, k, l, log;

  ({log} = console);

  for (i = k = 1; k <= 3; i = ++k) {
    foo:
    for (j = l = 1; l <= 3; j = ++l) {
      if (i === j) {
        break foo;
      }
      log(i, j);
    }
  }

}).call(this);

//# sourceMappingURL=labels.js.map