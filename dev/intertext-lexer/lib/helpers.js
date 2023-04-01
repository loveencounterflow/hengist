(function() {
  'use strict';
  var DATOM, GUY, H, Methods, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/HELPERS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Methods = {
    //---------------------------------------------------------------------------------------------------------
    show_lexer_as_table: function(title, lexer) {
      var create, empty_value, entry, jump, lexeme, lexemes, mode, pattern, ref1, ref2, reserved, tid, value;
      lexer.start();
      lexemes = [];
      ref1 = lexer.registry;
      for (mode in ref1) {
        entry = ref1[mode];
        ref2 = entry.lexemes;
        for (tid in ref2) {
          lexeme = ref2[tid];
          ({mode, tid, pattern, jump, reserved, create, value, empty_value} = lexeme);
          lexemes.push({mode, tid, pattern, jump, reserved, create, value, empty_value});
        }
      }
      H.tabulate(title, lexemes);
      return null;
    },
    //---------------------------------------------------------------------------------------------------------
    new_token: function(ref, token, mode, tid, name, value, x1, x2, x = null, lexeme = null) {
      /* TAINT recreation of `Interlex::new_token()` */
      var jump, ref1;
      jump = (ref1 = lexeme != null ? lexeme.jump : void 0) != null ? ref1 : null;
      ({x1, x2} = token);
      return new_datom(`^${mode}`, {
        mode,
        tid,
        mk: `${mode}:${tid}`,
        jump,
        name,
        value,
        x1,
        x2,
        x,
        $: ref
      });
    },
    //---------------------------------------------------------------------------------------------------------
    $parse_md_star: function() {
      var enter, exit, start_of, within;
      //.........................................................................................................
      within = {
        one: false
      };
      start_of = {
        one: null
      };
      //.........................................................................................................
      enter = (mode, x1) => {
        within[mode] = true;
        start_of[mode] = x1;
        return null;
      };
      enter.one = (x1) => {
        return enter('one', x1);
      };
      //.........................................................................................................
      exit = (mode) => {
        within[mode] = false;
        start_of[mode] = null;
        return null;
      };
      exit.one = () => {
        return exit('one');
      };
      //.........................................................................................................
      return (d, send) => {
        switch (d.$key) {
          //.....................................................................................................
          case 'plain:star1':
            send(stamp(d));
            if (within.one) {
              exit.one();
              send(new_datom('html:tag', {
                value: '</i>'
              }));
            } else {
              enter.one(d.x1);
              send(new_datom('html:tag', {
                value: '<i>'
              }));
            }
            break;
          default:
            //.....................................................................................................
            send(d);
        }
        return null;
      };
    },
    //---------------------------------------------------------------------------------------------------------
    $parse_md_stars: function() {
      var enter, exit, parse_md_stars, start_of, within;
      within = {
        one: false,
        two: false
      };
      start_of = {
        one: null,
        two: null
      };
      //.........................................................................................................
      enter = (mode, x1) => {
        within[mode] = true;
        start_of[mode] = x1;
        return null;
      };
      enter.one = (x1) => {
        return enter('one', x1);
      };
      enter.two = (x1) => {
        return enter('two', x1);
      };
      //.........................................................................................................
      exit = (mode) => {
        within[mode] = false;
        start_of[mode] = null;
        return null;
      };
      exit.one = () => {
        return exit('one');
      };
      exit.two = () => {
        return exit('two');
      };
      //.........................................................................................................
      return parse_md_stars = (d, send) => {
        switch (d.$key) {
          //.....................................................................................................
          case 'plain:star1':
            send(stamp(d));
            if (within.one) {
              exit.one();
              send(new_datom('html:tag', {
                value: '</i>'
              }));
            } else {
              enter.one(d.x1);
              send(new_datom('html:tag', {
                value: '<i>'
              }));
            }
            break;
          //.....................................................................................................
          case 'plain:star2':
            send(stamp(d));
            if (within.two) {
              if (within.one) {
                if (start_of.one > start_of.two) {
                  exit.one();
                  send(new_datom('html:tag', {
                    value: '</i>'
                  }));
                  exit.two();
                  send(new_datom('html:tag', {
                    value: '</b>'
                  }));
                  enter.one(d.x1);
                  send(new_datom('html:tag', {
                    value: '<i>'
                  }));
                } else {
                  exit.two();
                  send(new_datom('html:tag', {
                    value: '</b>'
                  }));
                }
              } else {
                exit.two();
                send(new_datom('html:tag', {
                  value: '</b>'
                }));
              }
            } else {
              enter.two(d.x1);
              send(new_datom('html:tag', {
                value: '<b>'
              }));
            }
            break;
          //.....................................................................................................
          case 'plain:star3':
            send(stamp(d));
            if (within.one) {
              if (within.two) {
                if (start_of.one > start_of.two) {
                  exit.one();
                  send(new_datom('html:tag', {
                    value: '</i>'
                  }));
                  exit.two();
                  send(new_datom('html:tag', {
                    value: '</b>'
                  }));
                } else {
                  exit.two();
                  send(new_datom('html:tag', {
                    value: '</b>'
                  }));
                  exit.one();
                  send(new_datom('html:tag', {
                    value: '</i>'
                  }));
                }
              } else {
                exit.one();
                send(new_datom('html:tag', {
                  value: '</i>'
                }));
                enter.two(d.x1);
                send(new_datom('html:tag', {
                  value: '<b>'
                }));
              }
            } else {
              if (within.two) {
                exit.two();
                send(new_datom('html:tag', {
                  value: '</b>'
                }));
                enter.one(d.x1);
                send(new_datom('html:tag', {
                  value: '<i>'
                }));
              } else {
                enter.two(d.x1);
                send(new_datom('html:tag', {
                  value: '<b>'
                }));
                enter.one(d.x1 + 2);
                send(new_datom('html:tag', {
                  value: '<i>',
                  x1: d.x1 + 2,
                  x2: d.x2
                }));
              }
            }
            break;
          default:
            //.....................................................................................................
            send(d);
        }
        return null;
      };
    }
  };

  //===========================================================================================================
  module.exports = {...H, ...Methods};

}).call(this);

//# sourceMappingURL=helpers.js.map