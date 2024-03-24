(async function() {
  'use strict';
  var GUY, Host, SUBSIDIARY, Subsidiary_helpers, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertalk'));

  ({rpr, inspect, echo, log} = GUY.trm);

  // WG                        = require '../../../apps/webguy'
  // hub_s                     = Symbol.for 'hub'
  /*

  **Note**: I first had in mind to use an ingenious / tricky / treacherous construction that would allow the
  'secondary' to reference methods on the host / primary using `this` / `@`; this would have allowed both the
  primary and the secondary to use a unified notation like `@f`, `@$.f` to reference `f` on the primary and on
  the secondary. However this also would be surprising because now `this` means not the secondary, but the
  primary instance in methods of the secondary instance which is too surprising to sound right.

  Instead, we're using composition, albeit with a backlink.

   */
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
      var template;
      template = {
        host: null,
        subsidiary: null,
        subsidiary_key: '$',
        host_key: '_'
      };
      cfg = {...template, ...cfg};
      debug('^340-1^', cfg);
      /* TAINT shouldn't be necessary if done explicitly? */
      if (!this.subsidiaries.has(cfg.subsidiary)) {
        throw new Error("object isn't a subsidiary");
      }
      if (this.hosts.has(cfg.subsidiary)) {
        throw new Error("subsidiary already has a host");
      }
      /* host->subsidiary is a standard containment/compository relationship and is expressed directly;
         subsidiary-> host is a backlink that would create a circular reference which we avoid by using a
         `WeakMap` instance, `@hosts`: */
      Object.defineProperty(cfg.host, cfg.subsidiary_key, {
        value: cfg.subsidiary
      });
      Object.defineProperty(cfg.subsidiary, cfg.host_key, {
        get: () => {
          return this.get_host(cfg.subsidiary);
        }
      });
      this.hosts.set(cfg.subsidiary, cfg.host);
      return cfg.subsidiary;
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
    await (() => {
      var h;
      h = new Host();
      h.show();
      h.$a.show();
      return h.$b.show();
    })();
  }

}).call(this);

//# sourceMappingURL=namespaces-with-hubs.js.map