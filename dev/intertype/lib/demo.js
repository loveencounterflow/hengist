(function() {
  var demo;

  demo = function() {
    var all_keys_of, declare, error, i, intertype, isa, len, nr, result, size_of, test, tests, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    urge(size_of('𣁬𡉜𠑹𠅁', 'codepoints'));
    intertype.declare('point', {
      size: 2,
      tests: {
        '? is an object': function(x) {
          return this.isa.object(x);
        },
        '?.x is set': function(x) {
          return this.has_key(x, 'x');
        },
        '?.y is set': function(x) {
          return this.has_key(x, 'y');
        },
        '?.x is a float': function(x) {
          return this.isa.float(x.x);
        },
        '?.y is a float': function(x) {
          return this.isa.float(x.x);
        }
      }
    });
    intertype.declare('vector', {
      size: 2,
      tests: {
        '? is a list': function(x) {
          return this.isa.list(x);
        },
        'size of ? is 2': function(x) {
          return (this.size_of(x)) === 2;
        },
        '?[ 0 ] is a float': function(x) {
          return this.isa.float(x[0]);
        },
        '?[ 1 ] is a float': function(x) {
          return this.isa.float(x[1]);
        }
      }
    });
    info(isa.point(42));
    info(isa.point({
      x: 42,
      y: 108
    }));
    info(isa.point({
      x: 2e308,
      y: 108
    }));
    tests = [
      [
        1,
        (function() {
          return validate.float(42);
        })
      ],
      [
        1,
        (function() {
          return validate.float(42);
        })
      ],
      [
        2,
        (function() {
          return validate.integer(42);
        })
      ],
      [
        3,
        (function() {
          return validate.even(42);
        })
      ],
      [
        4,
        (function() {
          return validate.float(42.5);
        })
      ],
      [
        4,
        (function() {
          return validate.float(42.5);
        })
      ],
      [
        5,
        (function() {
          return validate.integer(42.5);
        })
      ],
      [
        6,
        (function() {
          return validate.even(42.5);
        })
      ],
      [
        7,
        (function() {
          return validate.point(42);
        })
      ],
      [
        8,
        (function() {
          return validate.point({
            x: 42,
            y: 108
          });
        })
      ],
      [
        9,
        (function() {
          return validate.point({
            y: 108
          });
        })
      ],
      [
        10,
        (function() {
          return validate.point({
            x: 2e308,
            y: 108
          });
        })
      ],
      [
        11,
        (function() {
          return validate.vector(null);
        })
      ],
      [
        12,
        (function() {
          return validate.vector([2]);
        })
      ],
      [
        13,
        (function() {
          return validate.vector([2,
        3]);
        })
      ],
      [
        14,
        (function() {
          return validate.regex([2,
        3]);
        })
      ],
      [
        15,
        (function() {
          return validate.regex(/x/);
        })
      ],
      [
        16,
        (function() {
          return validate.regex(/^x$/g);
        })
      ],
      [
        17,
        (function() {
          return isa.regex(/x/);
        })
      ],
      [
        18,
        (function() {
          return isa.regex(/^x$/g);
        })
      ]
    ];
    for (i = 0, len = tests.length; i < len; i++) {
      [nr, test] = tests[i];
      try {
        result = test();
      } catch (error1) {
        error = error1;
        warn(nr, error.message);
        // throw error
        continue;
      }
      info(nr, result);
    }
    help(isa.float(42));
    help(isa.float(new Number(42)));
    help(types_of(42));
    help(types_of(new Number(42)));
    return debug('µ12233', types_of([]));
  };

}).call(this);

//# sourceMappingURL=demo.js.map