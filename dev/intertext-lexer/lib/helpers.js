(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  this.new_token = function(ref, token, mode, tid, name, value, x1, x2, x = null, lexeme = null) {
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
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$parse_md_star = function() {
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
      switch (d.tid) {
        //.....................................................................................................
        case 'star1':
          send(stamp(d));
          if (within.one) {
            exit.one();
            send(this.new_token('^æ1^', d, 'html', 'tag', 'i', '</i>'));
          } else {
            enter.one(d.x1);
            send(this.new_token('^æ2^', d, 'html', 'tag', 'i', '<i>'));
          }
          break;
        default:
          //.....................................................................................................
          send(d);
      }
      return null;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$parse_md_stars = function() {
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
      switch (d.tid) {
        //.....................................................................................................
        case 'star1':
          send(stamp(d));
          if (within.one) {
            exit.one();
            send(this.new_token('^æ1^', d, 'html', 'tag', 'i', '</i>'));
          } else {
            enter.one(d.x1);
            send(this.new_token('^æ2^', d, 'html', 'tag', 'i', '<i>'));
          }
          break;
        //.....................................................................................................
        case 'star2':
          send(stamp(d));
          if (within.two) {
            if (within.one) {
              if (start_of.one > start_of.two) {
                exit.one();
                send(this.new_token('^æ3^', d, 'html', 'tag', 'i', '</i>'));
                exit.two();
                send(this.new_token('^æ4^', d, 'html', 'tag', 'b', '</b>'));
                enter.one(d.x1);
                send(this.new_token('^æ5^', d, 'html', 'tag', 'i', '<i>'));
              } else {
                exit.two();
                send(this.new_token('^æ6^', d, 'html', 'tag', 'b', '</b>'));
              }
            } else {
              exit.two();
              send(this.new_token('^æ7^', d, 'html', 'tag', 'b', '</b>'));
            }
          } else {
            enter.two(d.x1);
            send(this.new_token('^æ8^', d, 'html', 'tag', 'b', '<b>'));
          }
          break;
        //.....................................................................................................
        case 'star3':
          send(stamp(d));
          if (within.one) {
            if (within.two) {
              if (start_of.one > start_of.two) {
                exit.one();
                send(this.new_token('^æ9^', d, 'html', 'tag', 'i', '</i>'));
                exit.two();
                send(this.new_token('^æ10^', d, 'html', 'tag', 'b', '</b>'));
              } else {
                exit.two();
                send(this.new_token('^æ11^', d, 'html', 'tag', 'b', '</b>'));
                exit.one();
                send(this.new_token('^æ12^', d, 'html', 'tag', 'i', '</i>'));
              }
            } else {
              exit.one();
              send(this.new_token('^æ13^', d, 'html', 'tag', 'i', '</i>'));
              enter.two(d.x1);
              send(this.new_token('^æ14^', d, 'html', 'tag', 'b', '<b>'));
            }
          } else {
            if (within.two) {
              exit.two();
              send(this.new_token('^æ15^', d, 'html', 'tag', 'b', '</b>'));
              enter.one(d.x1);
              send(this.new_token('^æ16^', d, 'html', 'tag', 'i', '<i>'));
            } else {
              enter.two(d.x1);
              send(this.new_token('^æ17^', d, 'html', 'tag', 'b', '<b>'));
              enter.one(d.x1 + 2);
              send(this.new_token('^æ18^', {
                x1: d.x1 + 2,
                x2: d.x2
              }, 'html', 'tag', 'i', '<i>'));
            }
          }
          break;
        default:
          //.....................................................................................................
          send(d);
      }
      return null;
    };
  };

}).call(this);

//# sourceMappingURL=helpers.js.map