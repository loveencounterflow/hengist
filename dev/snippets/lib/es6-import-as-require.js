(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, log, plain, praise, rpr, slugify, type_of, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_optional} = types);

  ({
    //===========================================================================================================
    default: slugify
  } = (require('fix-esm')).require('@sindresorhus/slugify'));

  debug('^3345^', slugify("Hello Wörld!"));

}).call(this);

//# sourceMappingURL=es6-import-as-require.js.map