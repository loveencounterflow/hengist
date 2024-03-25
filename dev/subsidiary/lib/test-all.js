(async function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, test, urge, warn, whisper;

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
      T.eq(keys, ['constructor', 'create', 'get_host', 'hosts', 'is_subsidiary', 'subsidiaries', 'tie_all', 'tie_host_and_subsidiary', 'walk_subsidiaries']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ad_hoc_use = function(T, done) {
    var SUBSIDIARY, host, subsidiary;
    // T?.halt_on_error()
    ({SUBSIDIARY} = require('../../../apps/subsidiary'));
    //.........................................................................................................
    host = {
      a: true
    };
    subsidiary = SUBSIDIARY.create({
      b: true
    });
    SUBSIDIARY.tie_host_and_subsidiary({
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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_in_class_1 = function(T, done) {
    var Host, SUBSIDIARY, host, host_$a, host_$b, host_$not_a_subsidiary;
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
            SUBSIDIARY.tie_host_and_subsidiary({
              host: this,
              subsidiary,
              host_key: '_',
              subsidiary_key
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
    urge('^722-5^', host);
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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_in_class_2 = function(T, done) {
    var Host, SUBSIDIARY, host, host_$a, host_$b, host_$not_a_subsidiary;
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
    urge('^722-5^', host);
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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-all.js.map