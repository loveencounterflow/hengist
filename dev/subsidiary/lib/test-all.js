(async function() {
  'use strict';
  var GUY, alert, debug, echo, example_class_with_several_subsidiaries, example_plain_objects, help, info, inspect, log, plain, praise, rpr, test, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('subsidiary'));

  ({rpr, inspect, echo, log} = GUY.trm);

  test = require('guy-test');

  // #-----------------------------------------------------------------------------------------------------------
  // @imports = ( T, done ) ->
  //   # T?.halt_on_error()
  //   SUB                 = require '../../../apps/subsidiary'
  //   T?.eq ( k for k of SUB ).sort(), [ 'SUBSIDIARY', 'Subsidiary', ]
  //   probes_and_matchers = []
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       result = eval probe
  //       resolve result
  //       return null
  //   done?()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.imports = function(T, done) {
    var SUB, k;
    // T?.halt_on_error()
    SUB = require('../../../apps/subsidiary');
    if (T != null) {
      T.eq(((function() {
        var results;
        results = [];
        for (k in SUB) {
          results.push(k);
        }
        return results;
      })()).sort(), ['SUBSIDIARY', 'Subsidiary']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.api = function(T, done) {
    var SUBSIDIARY, keys;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    keys = GUY.props.keys(SUBSIDIARY, {
      hidden: true
    });
    keys = keys.sort();
    debug(keys);
    if (T != null) {
      T.eq(keys, ['constructor', 'create', 'get_host', 'hosts', 'is_subsidiary', 'subsidiaries', 'tie_all', 'tie_one', 'walk_subsidiaries']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ad_hoc_use_1 = function(T, done) {
    var SUBSIDIARY, host, ref, subsidiary;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    //.........................................................................................................
    host = {
      a: true
    };
    subsidiary = SUBSIDIARY.create({
      b: true
    });
    SUBSIDIARY.tie_one({
      host,
      subsidiary,
      enumerable: true
    });
    //.........................................................................................................
    urge('^722-1^', host);
    urge('^722-2^', host.$);
    urge('^722-3^', subsidiary);
    urge('^722-4^', subsidiary._);
    //.........................................................................................................
    if (T != null) {
      T.ok(host.$ === subsidiary);
    }
    if (T != null) {
      T.ok(subsidiary._ === host);
    }
    if (T != null) {
      T.ok(host.$.b === true);
    }
    if (T != null) {
      T.ok(subsidiary._.a === true);
    }
    if (T != null) {
      T.ok(((ref = Object.getOwnPropertyDescriptor(host, '$')) != null ? ref.enumerable : void 0) === true);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ad_hoc_use_2 = function(T, done) {
    var SUBSIDIARY, host, ref, subsidiary;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    //.........................................................................................................
    host = {
      a: true
    };
    subsidiary = {
      b: true
    };
    SUBSIDIARY.tie_one({
      host,
      subsidiary,
      enumerable: true
    });
    //.........................................................................................................
    urge('^722-5^', host);
    urge('^722-6^', host.$);
    urge('^722-7^', subsidiary);
    urge('^722-8^', subsidiary._);
    //.........................................................................................................
    if (T != null) {
      T.ok(host.$ === subsidiary);
    }
    if (T != null) {
      T.ok(subsidiary._ === host);
    }
    if (T != null) {
      T.ok(host.$.b === true);
    }
    if (T != null) {
      T.ok(subsidiary._.a === true);
    }
    if (T != null) {
      T.ok(((ref = Object.getOwnPropertyDescriptor(host, '$')) != null ? ref.enumerable : void 0) === true);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_in_class_1 = function(T, done) {
    var Host, SUBSIDIARY, host, host_$a, host_$b, host_$not_a_subsidiary, ref, ref1, ref2;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    host_$a = null;
    host_$b = null;
    host_$not_a_subsidiary = null;
    Host = (function() {
      var B;

      //=========================================================================================================
      class Host {
        //-------------------------------------------------------------------------------------------------------
        constructor() {
          var ref, subsidiary, subsidiary_key, x;
          ref = SUBSIDIARY.walk_subsidiaries(this);
          for (x of ref) {
            ({subsidiary_key, subsidiary} = x);
            SUBSIDIARY.tie_one({
              host: this,
              subsidiary,
              host_key: '_',
              subsidiary_key,
              enumerable: true
            });
          }
          return void 0;
        }

        //-------------------------------------------------------------------------------------------------------
        show() {
          return null;
        }

      };

      //-------------------------------------------------------------------------------------------------------
      /* use plain object */
      Host.prototype.$a = host_$a = SUBSIDIARY.create({
        $a: true,
        show: function() {
          this._.show();
          return null;
        }
      });

      //-------------------------------------------------------------------------------------------------------
      /* use instance */
      Host.prototype.$b = host_$b = SUBSIDIARY.create(new (B = (function() {
        class B {
          show() {
            this._.show();
            return null;
          }

        };

        B.prototype.$b = true;

        return B;

      }).call(this))());

      //-------------------------------------------------------------------------------------------------------
      Host.prototype.$not_a_subsidiary = host_$not_a_subsidiary = {};

      return Host;

    }).call(this);
    //=========================================================================================================
    host = new Host();
    //.........................................................................................................
    urge('^722-9^', host);
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$a), true);
    }
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$b), true);
    }
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$not_a_subsidiary), false);
    }
    if (T != null) {
      T.ok(((ref = Object.getOwnPropertyDescriptor(host, '$a')) != null ? ref.enumerable : void 0) === true);
    }
    if (T != null) {
      T.ok(((ref1 = Object.getOwnPropertyDescriptor(host, '$b')) != null ? ref1.enumerable : void 0) === true);
    }
    if (T != null) {
      T.ok(((ref2 = Object.getOwnPropertyDescriptor(host.__proto__, '$not_a_subsidiary')) != null ? ref2.enumerable : void 0) === true);
    }
    //.........................................................................................................
    if (T != null) {
      T.ok(host.$a === host_$a);
    }
    if (T != null) {
      T.ok(host.$b === host_$b);
    }
    if (T != null) {
      T.ok(host.$not_a_subsidiary === host_$not_a_subsidiary);
    }
    if (T != null) {
      T.ok(host.$a._ === host);
    }
    if (T != null) {
      T.ok(host.$b._ === host);
    }
    if (T != null) {
      T.ok(host.$not_a_subsidiary._ === void 0);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_in_class_2 = function(T, done) {
    var Host, SUBSIDIARY, host, host_$a, host_$b, host_$not_a_subsidiary, ref, ref1, ref2;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    host_$a = null;
    host_$b = null;
    host_$not_a_subsidiary = null;
    Host = (function() {
      var B;

      //=========================================================================================================
      class Host {
        //-------------------------------------------------------------------------------------------------------
        constructor() {
          SUBSIDIARY.tie_all({
            host: this,
            host_key: '_',
            enumerable: true
          });
          return void 0;
        }

        //-------------------------------------------------------------------------------------------------------
        show() {
          return null;
        }

      };

      //-------------------------------------------------------------------------------------------------------
      /* use plain object */
      Host.prototype.$a = host_$a = SUBSIDIARY.create({
        $a: true,
        show: function() {
          this._.show();
          return null;
        }
      });

      //-------------------------------------------------------------------------------------------------------
      /* use instance */
      Host.prototype.$b = host_$b = SUBSIDIARY.create(new (B = (function() {
        class B {
          show() {
            this._.show();
            return null;
          }

        };

        B.prototype.$b = true;

        return B;

      }).call(this))());

      //-------------------------------------------------------------------------------------------------------
      Host.prototype.$not_a_subsidiary = host_$not_a_subsidiary = {};

      return Host;

    }).call(this);
    //=========================================================================================================
    host = new Host();
    //.........................................................................................................
    urge('^722-10^', host);
    urge('^722-11^', host.$a);
    urge('^722-12^', host.$b);
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$a), true);
    }
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$b), true);
    }
    if (T != null) {
      T.eq(SUBSIDIARY.is_subsidiary(host.$not_a_subsidiary), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.ok(host.$a === host_$a);
    }
    if (T != null) {
      T.ok(host.$b === host_$b);
    }
    if (T != null) {
      T.ok(host.$not_a_subsidiary === host_$not_a_subsidiary);
    }
    debug(host.$not_a_subsidiary);
    debug(host_$not_a_subsidiary);
    if (T != null) {
      T.ok(host.$a._ === host);
    }
    if (T != null) {
      T.ok(host.$b._ === host);
    }
    if (T != null) {
      T.ok(host.$not_a_subsidiary._ === void 0);
    }
    if (T != null) {
      T.ok(((ref = Object.getOwnPropertyDescriptor(host, '$a')) != null ? ref.enumerable : void 0) === true);
    }
    if (T != null) {
      T.ok(((ref1 = Object.getOwnPropertyDescriptor(host, '$b')) != null ? ref1.enumerable : void 0) === true);
    }
    if (T != null) {
      T.ok(((ref2 = Object.getOwnPropertyDescriptor(host.__proto__, '$not_a_subsidiary')) != null ? ref2.enumerable : void 0) === true);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_with_plain_object = function(T, done) {
    var SUBSIDIARY, a, b, host, k;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    a = SUBSIDIARY.create({
      is_a: true
    });
    b = SUBSIDIARY.create({
      is_b: true
    });
    host = {a, b};
    host = SUBSIDIARY.tie_all({
      host,
      enumerable: true
    });
    //=========================================================================================================
    urge('^722-13^', host);
    urge('^722-14^', host.a);
    urge('^722-15^', host.b);
    urge('^722-16^', Object.getOwnPropertyDescriptor(host, 'a'));
    urge('^722-17^', Object.getOwnPropertyDescriptor(host.a, '_'));
    urge('^722-18^', (function() {
      var results;
      results = [];
      for (k in host) {
        results.push(k);
      }
      return results;
    })());
    urge('^722-19^', (function() {
      var results;
      results = [];
      for (k in host.a) {
        results.push(k);
      }
      return results;
    })());
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  example_class_with_several_subsidiaries = function() {
    var Host, SUBSIDIARY;
    //#########################################################################################################
    ({SUBSIDIARY} = require('subsidiary'));
    Host = (function() {
      var B, C;

      //=========================================================================================================
      class Host {
        //-------------------------------------------------------------------------------------------------------
        constructor() {
          SUBSIDIARY.tie_all({
            host: this,
            host_key: '_',
            enumerable: true
          });
          return void 0;
        }

      };

      //-------------------------------------------------------------------------------------------------------
      /* using a plain object */
      Host.prototype.$a = SUBSIDIARY.create({
        $a: true,
        f: function() {
          return null/* whatever */;
        },
        g: function() {
          return null/* whatever */;
        }
      });

      //-------------------------------------------------------------------------------------------------------
      /* using an ad-hoc instance */
      Host.prototype.$b = SUBSIDIARY.create(new (B = (function() {
        class B {
          f() {
            return null/* whatever */;
          }

          g() {
            return null/* whatever */;
          }

        };

        B.prototype.$b = true;

        return B;

      }).call(this))());

      //-------------------------------------------------------------------------------------------------------
      /* using an instance */
      Host.prototype.$b = SUBSIDIARY.create(new (C = class C {})());

      return Host;

    }).call(this);
    //#########################################################################################################
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  example_plain_objects = function() {
    var SUBSIDIARY, a, b;
    //#########################################################################################################
    ({SUBSIDIARY} = require('subsidiary'));
    a = {
      is_a: true,
      value: 17
    };
    b = {
      is_b: true,
      value: 4
    };
    SUBSIDIARY.tie_one({
      host: a,
      subsidiary: b,
      subsidiary_key: 'b',
      host_key: 'a',
      enumerable: true
    });
    log('^xpo@1^', a.b === b);
    log('^xpo@2^', a.b.a === a);
    log('^xpo@3^', a);
    log('^xpo@4^', b);
    // Output:
    //   ^xpo@1^ true
    //   ^xpo@2^ true
    //   ^xpo@3^ { is_a: true, value: 17, b: { is_b: true, value: 4, a: [Getter] } }
    //   ^xpo@4^ { is_b: true, value: 4, a: [Getter] }

    //#########################################################################################################
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (() => {
      // await test @
      example_class_with_several_subsidiaries();
      return example_plain_objects();
    })();
  }

}).call(this);

//# sourceMappingURL=test-all.js.map