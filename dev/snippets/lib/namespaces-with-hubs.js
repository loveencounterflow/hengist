(async function() {
  'use strict';
  var GUY, Host, Secondary, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, urge, warn, whisper;

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
  Host = class Host {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this.$ = new Secondary(this);
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    show() {
      help('^650-1^', this);
      help('^650-2^', this.$);
      help('^650-3^', this.$.show);
      return null;
    }

  };

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
  if (module === require.main) {
    await (() => {
      var h;
      h = new Host();
      return h.$.show();
    })();
  }

}).call(this);

//# sourceMappingURL=namespaces-with-hubs.js.map