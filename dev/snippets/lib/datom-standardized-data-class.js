(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertalk'));

  ({rpr, inspect, echo, log} = GUY.trm);

}).call(this);

//# sourceMappingURL=datom-standardized-data-class.js.map