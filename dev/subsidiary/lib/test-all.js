(async function() {
  'use strict';
  var GUY, Host, SUBSIDIARY, Subsidiary_helpers, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, test, urge, warn, whisper;

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
      T.eq(keys, ['constructor', 'create', 'get_host', 'hosts', 'is_subsidiary', 'subsidiaries', 'tie_host_and_subsidiary', 'walk_subsidiaries']);
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
    urge('^722-1^', host.$);
    urge('^722-1^', subsidiary);
    urge('^722-1^', subsidiary._);
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

  //===========================================================================================================
  Subsidiary_helpers = class Subsidiary_helpers {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this.subsidiaries = new WeakSet();
      this.hosts = new WeakMap();
    }

    //---------------------------------------------------------------------------------------------------------
    * walk_subsidiaries(host) {
      var results, subsidiary, subsidiary_key;
      results = [];
      for (subsidiary_key in host) {
        subsidiary = host[subsidiary_key];
        if (this.is_subsidiary(subsidiary)) {
          /* TAINT this loop should be changed so we catch all relevant objects, including from inherited classes */
          results.push((yield {subsidiary_key, subsidiary}));
        }
      }
      return results;
    }

    //---------------------------------------------------------------------------------------------------------
    create(subsidiary) {
      if (this.subsidiaries.has(subsidiary)) {
        throw new Error("object already in use as subsidiary");
      }
      this.subsidiaries.add(subsidiary);
      return subsidiary;
    }

    //---------------------------------------------------------------------------------------------------------
    /* TAINT safeguard against non-object values */
    is_subsidiary(x) {
      return this.subsidiaries.has(x);
    }

    //---------------------------------------------------------------------------------------------------------
    tie_host_and_subsidiary(cfg) {
      /* TAINT use types, validate */
      var enumerable, host, host_key, subsidiary, subsidiary_key, template;
      template = {
        host: null,
        subsidiary: null,
        subsidiary_key: '$',
        host_key: '_',
        enumerable: false
      };
      cfg = {...template, ...cfg};
      //.......................................................................................................
      ({host, subsidiary, host_key, subsidiary_key, enumerable} = cfg);
      //.......................................................................................................
      debug('^340-1^', cfg);
      /* TAINT shouldn't be necessary if done explicitly? */
      if (!this.subsidiaries.has(subsidiary)) {
        throw new Error("object isn't a subsidiary");
      }
      if (this.hosts.has(subsidiary)) {
        throw new Error("subsidiary already has a host");
      }
      /* host->subsidiary is a standard containment/compository relationship and is expressed directly;
         subsidiary-> host is a backlink that would create a circular reference which we avoid by using a
         `WeakMap` instance, `@hosts`: */
      Object.defineProperty(host, subsidiary_key, {
        value: subsidiary,
        enumerable
      });
      Object.defineProperty(subsidiary, host_key, {
        get: (() => {
          return this.get_host(subsidiary);
        }),
        enumerable
      });
      this.hosts.set(subsidiary, host);
      return subsidiary;
    }

    //---------------------------------------------------------------------------------------------------------
    get_host(subsidiary) {
      var R;
      if ((R = this.hosts.get(subsidiary)) != null) {
        return R;
      }
      throw new Error("no host registered for object");
    }

  };

  //===========================================================================================================
  SUBSIDIARY = new Subsidiary_helpers();

  Host = (function() {
    var B;

    //===========================================================================================================
    class Host {
      //---------------------------------------------------------------------------------------------------------
      constructor() {
        var ref, subsidiary, subsidiary_key, y;
        ref = SUBSIDIARY.walk_subsidiaries(this);
        for (y of ref) {
          ({subsidiary_key, subsidiary} = y);
          SUBSIDIARY.tie_host_and_subsidiary({
            host: this,
            subsidiary,
            host_key: '_',
            subsidiary_key
          });
          debug('^233-1^', subsidiary_key, SUBSIDIARY.is_subsidiary(subsidiary), subsidiary._ === this);
          debug('^233-1^', this[subsidiary_key]);
        }
        //   continue unless subsidiary_key.startsWith '$'
        //   debug '^233-2^', subsidiary_key, subsidiary, subsidiary?.prototype
        // @$ = new Secondary @
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      show() {
        help('^650-1^', this);
        help('^650-2^', this.$a, this.$a.show);
        help('^650-2^', this.$b, this.$b.show);
        return null;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Host.prototype.$a = SUBSIDIARY.create({
      show: function() {
        warn('^650-1^', "$a.show");
        this._.show();
        return null;
      }
    });

    //---------------------------------------------------------------------------------------------------------
    Host.prototype.$b = SUBSIDIARY.create(new (B = class B {
      show() {
        warn('^650-1^', "$b.show");
        this._.show();
        return null;
      }

    })());

    //---------------------------------------------------------------------------------------------------------
    Host.prototype.$not_a_subsidiary = {};

    return Host;

  }).call(this);

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await test(this));
    })();
  }

  // #.........................................................................................................
// host        = { a: true, }
// subsidiary  = SUBSIDIARY.create { b: true, }
// SUBSIDIARY.tie_host_and_subsidiary { host, subsidiary, enumerable: true, }
// urge '^722-1^', host
// urge '^722-1^', host.$
// urge '^722-1^', subsidiary
// urge '^722-1^', subsidiary._

}).call(this);

//# sourceMappingURL=test-all.js.map