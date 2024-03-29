(function() {
  'use strict';
  var CND, Dba, Intertype, alert, badge, debug, help, info, intertype, jr, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MKTS-PARSER/TYPES';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  jr = JSON.stringify;

  Intertype = (require('intertype')).Intertype;

  intertype = new Intertype(module.exports);

  Dba = null;

  //-----------------------------------------------------------------------------------------------------------
  this.declare('gdb_constructor_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.declare('gdb_node_body', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.nonempty_text x.id": function(x) {
        return this.isa.nonempty_text(x.id);
      }
    }
  });

  // "@isa_optional.boolean x.echo":         ( x ) -> @isa_optional.boolean x.echo

  //-----------------------------------------------------------------------------------------------------------
  this.declare('gdb_edge_properties', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      }
    }
  });

  // "@isa.nonempty_text x.id":              ( x ) -> @isa.nonempty_text x.id

  //-----------------------------------------------------------------------------------------------------------
  this.defaults = {
    //.........................................................................................................
    gdb_constructor_cfg: {
      // _temp_prefix: '_dba_temp_'
      // readonly:     false
      // create:       true
      // overwrite:    false
      // timeout:      5000
      schema: 'main',
      path: null,
      echo: false
    }
  };

}).call(this);

//# sourceMappingURL=types.js.map