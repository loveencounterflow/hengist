(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, jr, log, plain, praise, rpr, test, types, urge, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('webguy/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  types = new (require('intertype-newest')).Intertype();

  ({isa} = types);

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_basic = function(T, done) {
    var WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    a = {
      number: 12,
      a_f: null
    };
    b = {
      number: 123,
      text: 123,
      b_f: 123,
      a_f: 123
    };
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_skips_constructor = function(T, done) {
    var A, WGUY, a;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        return void 0;
      }

      a_f() {}

    };
    a = new A();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_inludes_inherited = function(T, done) {
    var A, B, WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        return void 0;
      }

      a_f() {}

    };
    B = class B extends A {
      constructor() {
        super();
        this.text = 'abcd';
        return void 0;
      }

      b_f() {}

    };
    a = new A();
    b = new B();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_skips_underscores_and_symbols = function(T, done) {
    var A, B, WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        this._do_not_touch_me = false;
        return void 0;
      }

      a_f() {}

    };
    B = class B extends A {
      constructor() {
        super();
        this.text = 'abcd';
        this[Symbol('helo')] = 456;
        this._do_not_touch_me_either = false;
        return void 0;
      }

      b_f() {}

    };
    a = new A();
    b = new B();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_get_prototype_chain = function(T, done) {
    var A, B, WGUY, a, a1, a1p, b, bp, bp1, o1, o2;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      a1() {}

      a2() {}

      a3() {}

    };
    B = class B extends A {
      b_1() {}

      b_2() {}

      b_3() {}

    };
    a = new A();
    b = new B();
    //.........................................................................................................
    o1 = {};
    o2 = new Object();
    a1 = [];
    a1p = Object.getPrototypeOf(a1);
    b = new B();
    bp = Object.getPrototypeOf(b);
    bp1 = Object.getPrototypeOf(bp);
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(A), [A]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(B), [B, A]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(b), [b, bp, bp1]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(b.prototype), []);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(Object), [Object]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(o1), [o1]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(o2), [o2]);
    }
    if (T != null) {
      T.eq(WGUY.props.get_prototype_chain(a1), [a1, a1p]);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_walk_depth_first_property_descriptors = function(T, done) {
    var A, B, WGUY, a, a1, a2, a3, b, b_1, b_2, b_3, d, props;
    WGUY = require('../../../apps/webguy');
    ({props} = WGUY);
    //.........................................................................................................
    a1 = function() {};
    a2 = function() {};
    a3 = function() {};
    b_1 = function() {};
    b_2 = function() {};
    b_3 = function() {};
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.a1 = a1;

      A.prototype.a2 = a2;

      A.prototype.a3 = a3;

      A.prototype.c = 'declared in A';

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.b_1 = b_1;

      B.prototype.b_2 = b_2;

      B.prototype.b_3 = b_3;

      B.prototype.c = 'declared in B';

      return B;

    }).call(this);
    a = new A();
    b = new B();
    //.........................................................................................................
    // urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B        )..., ]
    // urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B::  )..., ]
    if (T != null) {
      T.eq((function() {
        var ref, results;
        ref = props.walk_depth_first_property_descriptors(B.prototype);
        results = [];
        for (d of ref) {
          results.push([d.key, d.descriptor]);
        }
        return results;
      })(), [
        [
          'a1',
          {
            value: a1,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'a2',
          {
            value: a2,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'a3',
          {
            value: a3,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'c',
          {
            value: 'declared in A',
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_1',
          {
            value: b_1,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_2',
          {
            value: b_2,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_3',
          {
            value: b_3,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'c',
          {
            value: 'declared in B',
            writable: true,
            enumerable: true,
            configurable: true
          }
        ]
      ]);
    }
    if (T != null) {
      T.eq((function() {
        var ref, results;
        ref = props.walk_depth_first_property_descriptors(new B());
        results = [];
        for (d of ref) {
          results.push([d.key, d.descriptor]);
        }
        return results;
      })(), [
        [
          'a1',
          {
            value: a1,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'a2',
          {
            value: a2,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'a3',
          {
            value: a3,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'c',
          {
            value: 'declared in A',
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_1',
          {
            value: b_1,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_2',
          {
            value: b_2,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'b_3',
          {
            value: b_3,
            writable: true,
            enumerable: true,
            configurable: true
          }
        ],
        [
          'c',
          {
            value: 'declared in B',
            writable: true,
            enumerable: true,
            configurable: true
          }
        ]
      ]);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_acquire_depth_first = function(T, done) {
    var A, B, WGUY, a, a1, a2, a3, b, b_1, b_2, b_3, props;
    WGUY = require('../../../apps/webguy');
    ({props} = WGUY);
    //.........................................................................................................
    a1 = function() {};
    a2 = function() {};
    a3 = function() {};
    b_1 = function() {};
    b_2 = function() {};
    b_3 = function() {};
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.a1 = a1;

      A.prototype.a2 = a2;

      A.prototype.a3 = a3;

      A.prototype.c = 'declared in A';

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.b_1 = b_1;

      B.prototype.b_2 = b_2;

      B.prototype.b_3 = b_3;

      B.prototype.c = 'declared in B';

      return B;

    }).call(this);
    a = new A();
    b = new B();
    (() => {      //.........................................................................................................
      var k, result;
      result = props.acquire_depth_first(B.prototype, {
        descriptor: {
          enumerable: true
        },
        overwrite: true
      });
      if (T != null) {
        T.eq((function() {
          var results;
          results = [];
          for (k in result) {
            results.push(k);
          }
          return results;
        })(), ['a1', 'a2', 'a3', 'c', 'b_1', 'b_2', 'b_3']);
      }
      if (T != null) {
        T.eq(result, {
          a1,
          a2,
          a3,
          c: 'declared in B',
          b_1,
          b_2,
          b_3
        });
      }
      if (T != null) {
        T.ok(result.a1 === a1);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.throws(/duplicate key 'c'/, function() {
          return props.acquire_depth_first(B.prototype, {
            descriptor: {
              enumerable: true
            },
            overwrite: false
          });
        });
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var k, result;
      result = props.acquire_depth_first(B.prototype, {
        descriptor: {
          enumerable: false
        },
        overwrite: true
      });
      if (T != null) {
        T.eq((function() {
          var results;
          results = [];
          for (k in result) {
            results.push(k);
          }
          return results;
        })(), []);
      }
      if (T != null) {
        T.eq(result, {});
      }
      if (T != null) {
        T.ok(result.a1 === a1);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var k, result;
      result = props.acquire_depth_first(B.prototype, {
        descriptor: {
          enumerable: true
        },
        overwrite: 'ignore'
      });
      if (T != null) {
        T.eq((function() {
          var results;
          results = [];
          for (k in result) {
            results.push(k);
          }
          return results;
        })(), ['a1', 'a2', 'a3', 'c', 'b_1', 'b_2', 'b_3']);
      }
      if (T != null) {
        T.eq(result, {
          a1,
          a2,
          a3,
          c: 'declared in A',
          b_1,
          b_2,
          b_3
        });
      }
      if (T != null) {
        T.ok(result.a1 === a1);
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_acquire_depth_first_with_generated_properties = function(T, done) {
    var A, WGUY, add_1, mul_1, props;
    WGUY = require('../../../apps/webguy');
    ({props} = WGUY);
    //.........................................................................................................
    add_1 = function(a, b = 1) {
      return a + b;
    };
    mul_1 = function(a, b = 1) {
      return a * b;
    };
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.add_1 = add_1;

      A.prototype.mul_1 = mul_1;

      return A;

    }).call(this);
    (() => {      //.........................................................................................................
      var cfg, generator, mytarget, result;
      generator = function*({target, owner, key, descriptor}) {
        var i, len, method, n, ref, subkey, value;
        if (T != null) {
          T.ok(target === mytarget);
        }
        method = descriptor.value = props.nameit(key, descriptor.value.bind(target));
        yield ({key, descriptor});
        if (!key.endsWith('_1')) {
          return null;
        }
        ref = [2, 3];
        //.....................................................................................................
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          subkey = key.slice(0, key.length - 1) + `${n}`;
          value = ((n) => {
            var f;
            f = function(a, b = n) {
              return method(a, b);
            };
            return props.nameit(subkey, f.bind(target));
          })(n);
          yield ({
            //...................................................................................................
            key: subkey,
            descriptor: {...descriptor, value}
          });
        }
        return null;
      };
      //.......................................................................................................
      mytarget = {};
      cfg = {
        target: mytarget,
        descriptor: {
          enumerable: true
        },
        generator: generator
      };
      result = props.acquire_depth_first(A.prototype, cfg);
      //.......................................................................................................
      if (T != null) {
        T.ok((Object.getOwnPropertyDescriptor(A.prototype, 'add_1')).enumerable, false);
      }
      if (T != null) {
        T.ok((Object.getOwnPropertyDescriptor(result, 'add_1')).enumerable, true);
      }
      if (T != null) {
        T.ok((Object.getOwnPropertyDescriptor(result, 'add_2')).enumerable, true);
      }
      if (T != null) {
        T.ok((Object.getOwnPropertyDescriptor(result, 'add_3')).enumerable, true);
      }
      if (T != null) {
        T.ok(result === mytarget);
      }
      if (T != null) {
        T.ok(isa.function(result.add_1));
      }
      if (T != null) {
        T.ok(isa.function(result.add_2));
      }
      if (T != null) {
        T.ok(isa.function(result.add_3));
      }
      if (T != null) {
        T.ok(isa.function(result.mul_1));
      }
      if (T != null) {
        T.ok(isa.function(result.mul_2));
      }
      if (T != null) {
        T.ok(isa.function(result.mul_3));
      }
      if (T != null) {
        T.eq(result.add_1(7), 8);
      }
      if (T != null) {
        T.eq(result.add_2(7), 9);
      }
      if (T != null) {
        T.eq(result.add_3(7), 10);
      }
      if (T != null) {
        T.eq(result.mul_1(7), 7);
      }
      if (T != null) {
        T.eq(result.mul_2(7), 14);
      }
      if (T != null) {
        T.eq(result.mul_3(7), 21);
      }
      if (T != null) {
        T.eq(result.add_1.name, 'add_1');
      }
      if (T != null) {
        T.eq(result.add_2.name, 'add_2');
      }
      if (T != null) {
        T.eq(result.add_3.name, 'add_3');
      }
      if (T != null) {
        T.eq(result.mul_1.name, 'mul_1');
      }
      if (T != null) {
        T.eq(result.mul_2.name, 'mul_2');
      }
      if (T != null) {
        T.eq(result.mul_3.name, 'mul_3');
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_acquire_depth_first_with_generated_properties_and_decorator = function(T, done) {
    var A, WGUY, add_1, cfg, mul_1, mytarget, props, result;
    WGUY = require('../../../apps/webguy');
    ({props} = WGUY);
    //.........................................................................................................
    add_1 = function(a, b = 1) {
      return a + b;
    };
    mul_1 = function(a, b = 1) {
      return a * b;
    };
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.add_1 = add_1;

      A.prototype.mul_1 = mul_1;

      return A;

    }).call(this);
    //.........................................................................................................
    mytarget = {};
    //---------------------------------------------------------------------------------------------------------
    cfg = {
      target: mytarget,
      descriptor: {
        enumerable: true
      },
      //.......................................................................................................
      generator: function*({target, owner, key, descriptor}) {
        var i, len, method, n, ref, subkey, value;
        if (T != null) {
          T.ok(target === mytarget);
        }
        method = descriptor.value = props.nameit(key, descriptor.value.bind(target));
        yield ({key, descriptor});
        if (!key.endsWith('_1')) {
          return null;
        }
        ref = [2, 3];
        //.....................................................................................................
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          subkey = key.slice(0, key.length - 1) + `${n}`;
          value = ((n) => {
            var f;
            f = function(a, b = n) {
              return method(a, b);
            };
            return f;
          })(n);
          yield ({
            //...................................................................................................
            key: subkey,
            descriptor: {...descriptor, value}
          });
        }
        return null;
      },
      //.......................................................................................................
      decorator: function({target, owner, key, descriptor}) {
        var value;
        debug('^345-1^', descriptor.value);
        value = props.nameit(key, descriptor.value.bind(target));
        debug('^345-2^', value);
        return {value};
      }
    };
    //.........................................................................................................
    result = props.acquire_depth_first(A.prototype, cfg);
    //.........................................................................................................
    if (T != null) {
      T.ok((Object.getOwnPropertyDescriptor(A.prototype, 'add_1')).enumerable, false);
    }
    if (T != null) {
      T.ok((Object.getOwnPropertyDescriptor(result, 'add_1')).enumerable, true);
    }
    if (T != null) {
      T.ok((Object.getOwnPropertyDescriptor(result, 'add_2')).enumerable, true);
    }
    if (T != null) {
      T.ok((Object.getOwnPropertyDescriptor(result, 'add_3')).enumerable, true);
    }
    if (T != null) {
      T.ok(result === mytarget);
    }
    if (T != null) {
      T.ok(isa.function(result.add_1));
    }
    if (T != null) {
      T.ok(isa.function(result.add_2));
    }
    if (T != null) {
      T.ok(isa.function(result.add_3));
    }
    if (T != null) {
      T.ok(isa.function(result.mul_1));
    }
    if (T != null) {
      T.ok(isa.function(result.mul_2));
    }
    if (T != null) {
      T.ok(isa.function(result.mul_3));
    }
    if (T != null) {
      T.eq(result.add_1(7), 8);
    }
    if (T != null) {
      T.eq(result.add_2(7), 9);
    }
    if (T != null) {
      T.eq(result.add_3(7), 10);
    }
    if (T != null) {
      T.eq(result.mul_1(7), 7);
    }
    if (T != null) {
      T.eq(result.mul_2(7), 14);
    }
    if (T != null) {
      T.eq(result.mul_3(7), 21);
    }
    if (T != null) {
      T.eq(result.add_1.name, 'add_1');
    }
    if (T != null) {
      T.eq(result.add_2.name, 'add_2');
    }
    if (T != null) {
      T.eq(result.add_3.name, 'add_3');
    }
    if (T != null) {
      T.eq(result.mul_1.name, 'mul_1');
    }
    if (T != null) {
      T.eq(result.mul_2.name, 'mul_2');
    }
    if (T != null) {
      T.eq(result.mul_3.name, 'mul_3');
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_acquire_depth_first_with_dynamic_targets_from_generator = function(T, done) {
    var WGUY, add_1, cfg, k, mul_1, props, result, source, t1, t2, t3;
    WGUY = require('../../../apps/webguy');
    ({props} = WGUY);
    //.........................................................................................................
    add_1 = function(a, b = 1) {
      return a + b;
    };
    mul_1 = function(a, b = 1) {
      return a * b;
    };
    //.........................................................................................................
    source = {
      p1: 1,
      p2: 2,
      p3: 3,
      p4: 4,
      p5: 5,
      p6: 6
    };
    //.........................................................................................................
    t1 = {};
    t2 = {};
    t3 = {};
    //---------------------------------------------------------------------------------------------------------
    cfg = {
      descriptor: {
        enumerable: true
      },
      //.......................................................................................................
      generator: function*({target, owner, key, descriptor}) {
        if ((modulo(descriptor.value, 3)) === 0) {
          target = t3;
        } else if ((modulo(descriptor.value, 2)) === 0) {
          target = t2;
        } else {
          target = t1;
        }
        yield ({target, key, descriptor});
        return null;
      }
    };
    //.........................................................................................................
    result = props.acquire_depth_first(source, cfg);
    if (T != null) {
      T.eq((function() {
        var results;
        results = [];
        for (k in result) {
          results.push(k);
        }
        return results;
      })(), []);
    }
    if (T != null) {
      T.eq(t1.p1, 1);
    }
    if (T != null) {
      T.eq(t2.p2, 2);
    }
    if (T != null) {
      T.eq(t3.p3, 3);
    }
    if (T != null) {
      T.eq(t2.p4, 4);
    }
    if (T != null) {
      T.eq(t1.p5, 5);
    }
    if (T != null) {
      T.eq(t3.p6, 6);
    }
    //.........................................................................................................
    done();
    return null;
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  //   #---------------------------------------------------------------------------------------------------------
  //   [Symbol.iterator]: -> yield from @_transforms

  //   #---------------------------------------------------------------------------------------------------------
  //   _build: ->
  //     chain = ( GUY.props.get_prototype_chain @ ).reverse()
  //     for object in chain
  //       for key from GUY.props.walk_keys object, { hidden: true, builtins: false, depth: 0, }
  //         continue if key is 'constructor'
  //         continue if key is 'length'
  //         continue if key.startsWith '_'
  //         @_transforms.push d for d from @_walk_values object[ key ]
  //     return null

  //   #---------------------------------------------------------------------------------------------------------
  //   _walk_values: ( value ) ->
  //     return yield new value() if @_types.isa.class value
  //     #.......................................................................................................
  //     if @_types.isa.function value
  //       return yield value unless ( value.name.startsWith '$' ) or ( value.name.startsWith 'bound $' )
  //       return yield value.call @
  //     #.......................................................................................................
  //     if @_types.isa.list value
  //       for e in value
  //         yield d for d from @_walk_values e
  //       return null
  //     #.......................................................................................................
  //     return yield value

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  //===========================================================================================================
  if (require.main === module) {
    (() => {
      // test @
      // test @props_acquire_depth_first_with_generated_properties
      return test(this.props_acquire_depth_first_with_dynamic_targets_from_generator);
    })();
  }

  // test @props_get_prototype_chain
// test @props_walk_depth_first_property_descriptors
// test @props_acquire_depth_first

}).call(this);

//# sourceMappingURL=test-props.js.map