(function() {
  /* This file is needed for testing; when modified, tests must be modified, too */
  var isa, log, type_of, types, validate;

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types);

  log = console.log;

  this.other_function = function(x) {
    validate.float(x);
    x++;
    return x;
  };

  this.my_function = function(x) {
    var type;
    if ((type = type_of(x)) !== 'float') {
      throw new Error(`^79283^ expected a float, got a ${type}`);
    }
    log('^334^', x);
    return x ** 2;
  };

  if (module === require.main) {
    (() => {
      return log('^783^', this.my_function(42));
    })();
  }

}).call(this);

//# sourceMappingURL=assets-file1.js.map