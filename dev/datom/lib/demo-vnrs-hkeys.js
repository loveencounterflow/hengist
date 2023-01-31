(function() {
  'use strict';
  var GUY, alert, debug, demo_hkeys, demo_vnrs, echo, help, info, inspect, log, plain, praise, rpr, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATOM/DEMO-VNR-HKEY'));

  ({rpr, inspect, echo, log} = GUY.trm);

  /*

  Vectorial Numbers (VNRs)
  Hierarchical Keys (HKeys)

  */
  //-----------------------------------------------------------------------------------------------------------
  demo_vnrs = function() {
    /*
    */
    var d;
    d = {
      $v1_lnr: 1,
      $v2_col: 1
    };
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hkeys = function() {
    /*
    'lexer:plain:text'
    'lexer:html:tag:start:em'
    'lexer:md:markup:stars3'
    'lexer:md:text'
    'mdnish:html:tag:start:em'
    'mdnish:html:tag:stop:em'
    */
    var d;
    d = {
      $kr1_origin: 'lexer',
      $kr2_mode: 'html'
    };
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      demo_vnrs();
      return demo_hkeys();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-vnrs-hkeys.js.map