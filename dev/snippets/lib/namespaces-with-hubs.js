(async function() {
  'use strict';
  var GUY, Host, Secondary, alert, create_subsidiary, create_ties, debug, echo, get_host, help, hosts, info, inspect, is_subsidiary, log, plain, praise, rpr, subsidiaries, urge, warn, whisper;

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
  Secondary = class Secondary {
    //---------------------------------------------------------------------------------------------------------
    constructor(host) {
      // WG.props.hide @, '_', host
      this._ = host;
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    show() {
      urge('^650-4^', this);
      urge('^650-5^', this._);
      urge('^650-6^', this._.show);
      urge('^650-7^', this._.show());
      return null;
    }

  };

  //===========================================================================================================
  subsidiaries = new WeakSet();

  hosts = new WeakMap();

  //===========================================================================================================
  // class ???

  //-----------------------------------------------------------------------------------------------------------
  create_subsidiary = function(subsidiary) {
    if (subsidiaries.has(subsidiary)) {
      throw new Error("object already in use as subsidiary");
    }
    subsidiaries.add(subsidiary);
    return subsidiary;
  };

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT safeguard against non-object values */
  is_subsidiary = function(value) {
    return subsidiaries.has(value);
  };

  //-----------------------------------------------------------------------------------------------------------
  create_ties = function(host, subsidiary_key, subsidiary, host_key = '_') {
    /* TAINT shouldn't be necessary if done explicitly? */
    if (!subsidiaries.has(subsidiary)) {
      throw new Error("object isn't a subsidiary");
    }
    if (hosts.has(subsidiary)) {
      throw new Error("subsidiary already has a host");
    }
    /* host->subsidiary is a standard containment/compository relationship and is expressed directly;
     subsidiary-> host is a backlink that would create a circular reference which we avoid by using a
     `WeakMap` instance, `hosts`: */
    Object.defineProperty(host, subsidiary_key, {
      value: subsidiary
    });
    Object.defineProperty(subsidiary, host_key, {
      get: function() {
        return get_host(subsidiary);
      }
    });
    hosts.set(subsidiary, host);
    return subsidiary;
  };

  //-----------------------------------------------------------------------------------------------------------
  get_host = function(subsidiary) {
    var R;
    if ((R = hosts.get(subsidiary)) != null) {
      return R;
    }
    throw new Error("no host registered for object");
  };

  Host = (function() {
    var B;

    //===========================================================================================================
    class Host {
      //---------------------------------------------------------------------------------------------------------
      constructor() {
        var candidate, key, ref;
        ref = this;
        /* TAINT this loop should be changed so we catch all relevant objects, including from inherited classes */
        for (key in ref) {
          candidate = ref[key];
          create_ties(this, key, candidate, '_');
          debug('^233-1^', key, is_subsidiary(candidate), candidate._ === this);
          debug('^233-1^', this[key]);
        }
        //   continue unless key.startsWith '$'
        //   debug '^233-2^', key, candidate, candidate?.prototype
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
    Host.prototype.$a = create_subsidiary({
      show: function() {
        warn('^650-1^', "$a.show");
        this._.show();
        return null;
      }
    });

    //---------------------------------------------------------------------------------------------------------
    Host.prototype.$b = create_subsidiary(new (B = class B {
      show() {
        warn('^650-1^', "$b.show");
        this._.show();
        return null;
      }

    })());

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