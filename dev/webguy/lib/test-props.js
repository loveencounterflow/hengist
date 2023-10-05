(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, jr, log, plain, praise, rpr, test, types, urge, warn, whisper;

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
  this.props_walk_depth_first_properties = function(T, done) {
    var A, B, Props, WGUY, a, b, d, i, j, k, l, len, len1, len2, props, ref, ref1, ref2, templates, x;
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
    templates = {
      acquire_depth_first: {
        source: null,
        target: null,
        filter: null,
        decorator: null
      }
    };
    //.........................................................................................................
    Props = class Props {
      * walk_depth_first_property_descriptors(x) {
        var dsc, i, key, len, proto, protos, ref, ref1;
        ref = protos = (WGUY.props.get_prototype_chain(x)).reverse();
        for (i = 0, len = ref.length; i < len; i++) {
          proto = ref[i];
          ref1 = Object.getOwnPropertyDescriptors(proto);
          for (key in ref1) {
            dsc = ref1[key];
            if (key === 'constructor') {
              continue;
            }
            yield [key, dsc];
          }
        }
        return null;
      }

      //.........................................................................................................
      acquire_depth_first(cfg) {
        var R, dsc, key, ref, ref1, y;
        cfg = {...templates, ...cfg};
        R = (ref = cfg.target) != null ? ref : {};
        ref1 = this.walk_depth_first_property_descriptors(cfg.source);
        for (y of ref1) {
          [key, dsc] = y;
          if (cfg.filter != null) {
            if (!cfg.filter(key)) {
              continue;
            }
          }
          if (cfg.decorator != null) {
            dsc.value = cfg.decorator(dsc.value);
          }
          Object.defineProperty(R, key, dsc);
        }
        return R;
      }

    };
    //.........................................................................................................
    Object.setPrototypeOf(Props, WGUY.props);
    props = new Props();
    ref = [...(props.walk_depth_first_property_descriptors(B))];
    for (i = 0, len = ref.length; i < len; i++) {
      x = ref[i];
      //.........................................................................................................
      urge('^3223^', x);
    }
    ref1 = [...(props.walk_depth_first_property_descriptors(B.prototype))];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      x = ref1[j];
      urge('^3223^', x);
    }
    ref2 = [...(props.walk_depth_first_property_descriptors(new B()))];
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      x = ref2[l];
      urge('^3223^', x);
    }
    //.........................................................................................................
    urge('^3223^', (function() {
      var ref3, results, y;
      ref3 = props.walk_depth_first_property_descriptors(props.acquire_depth_first({
        source: B.prototype
      }));
      results = [];
      for (y of ref3) {
        [k, d] = y;
        results.push(k);
      }
      return results;
    })());
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
      // test @props_get_prototype_chain
      return test(this.props_walk_depth_first_properties);
    })();
  }

}).call(this);

//# sourceMappingURL=test-props.js.map