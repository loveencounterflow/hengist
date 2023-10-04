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
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-props.js.map