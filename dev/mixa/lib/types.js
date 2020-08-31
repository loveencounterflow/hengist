(function() {
  'use strict';
  var CND, Intertype, L, alert, badge, debug, default_settings, help, info, intertype, jr, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MIXA/TYPES';

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

  L = this;

  default_settings = freeze({
    meta: {
      help: {
        alias: 'h',
        type: Boolean,
        description: "show help and exit"
      },
      cd: {
        alias: 'd',
        type: String,
        description: "change to directory before running command"
      },
      trace: {
        alias: 't',
        type: Boolean,
        description: "trace options parsing (for debugging)"
      }
    },
    commands: {
      cat: {
        description: "draw a cat"
      },
      version: {
        description: "show project version and exit"
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.declare('mixa_settings', {
    tests: {
      "x is an object": function(x) {
        return this.isa.object(x);
      },
      "x.?meta is a mixa_flagdefs": function(x) {
        return ((!x.meta) != null) || this.isa.mixa_flagdefs(x.meta);
      },
      "x.?commands is a mixa_flagdefs": function(x) {
        return ((!x.commands) != null) || this.isa.mixa_flagdefs(x.commands);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.declare('mixa_flagdefs', {
    tests: {
      "x is an object": function(x) {
        return this.isa.object(x);
      },
      "each attribute of x is a mixa_flagdef": function(x) {
        var k, v;
        for (k in x) {
          v = x[k];
          if (!this.isa.mixa_flagdef(v)) {
            return false;
          }
        }
        return true;
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.declare('mixa_flagdef', {
    tests: {
      "x is an object": function(x) {
        return this.isa.object(x);
      },
      //.........................................................................................................
      // These options are filled out by `mixa` or used by `command-line-args` in incompatible ways:
      "x.name is not set": function(x) {
        return x.name == null;
      },
      "x.group is not set": function(x) {
        return x.group == null;
      },
      "x.defaultOption is not set": function(x) {
        return x.defaultOption == null;
      },
      //.........................................................................................................
      "x.?type is a function": function(x) {
        return (x.type == null) || this.isa.function(x.type);
      },
      "x.?alias is a text": function(x) {
        return (x.alias == null) || this.isa.text(x.alias);
      },
      "x.?multiple is a boolean": function(x) {
        return (x.multiple == null) || this.isa.boolean(x.multiple);
      },
      "x.?lazyMultiple is a boolean": function(x) {
        return (x.lazyMultiple == null) || this.isa.boolean(x.lazyMultiple);
      },
      "x.?defaultValue is anything": function(x) {
        return true;
      }
    }
  });

}).call(this);

//# sourceMappingURL=types.js.map