(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, show, stamp, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/TOPOSORT'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show = function(topograph) {
    var LTSORT, dependencies, error, ordering;
    LTSORT = require('../../../apps/ltsort');
    try {
      dependencies = LTSORT.group(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn(GUY.trm.reverse(error.message));
      warn('^08-1^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    info('^08-2^', dependencies);
    try {
      ordering = LTSORT.linearize(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn('^08-3^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    info('^08-4^', ordering);
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.toposort = function(T, done) {
    /* TAINT simplify to single set? */
    var LTSORT, add_lexeme, anyother, finalize, lexemes, topograph;
    // T?.halt_on_error()
    LTSORT = require('../../../apps/ltsort');
    topograph = LTSORT.new_graph({
      loners: true
    });
    lexemes = [];
    anyother = {
      before: new Set(),
      after: new Set()
    };
    //.........................................................................................................
    add_lexeme = function(cfg) {
      var after, before, d, i, j, len, len1, name;
      cfg = {...{name, after, before}, ...cfg};
      ({name, after, before} = cfg);
      validate.nonempty.text(name);
      if (after == null) {
        after = [];
      }
      if (before == null) {
        before = [];
      }
      if (!isa.list(after)) {
        after = [after];
      }
      if (!isa.list(before)) {
        before = [before];
      }
      if ((before.length === 0) && (after.length === 0)) {
        LTSORT.add(topograph, name);
      } else {
        for (i = 0, len = after.length; i < len; i++) {
          d = after[i];
          if (d === '*') {
            anyother.after.add(name);
            continue;
          }
          LTSORT.add(topograph, d, name);
        }
        for (j = 0, len1 = before.length; j < len1; j++) {
          d = before[j];
          if (d === '*') {
            anyother.before.add(name);
            continue;
          }
          LTSORT.add(topograph, name, d);
        }
      }
      return null;
    };
    //.........................................................................................................
    finalize = function() {
      var name, names, ref, ref1, x;
      names = [...topograph.precedents.keys()];
      for (name of names) {
        ref = anyother.before.keys();
        for (x of ref) {
          debug('^08-5^', {name, x});
          LTSORT.add(topograph, x, name);
        }
        ref1 = anyother.after.keys();
        for (x of ref1) {
          debug('^08-5^', {name, x});
          LTSORT.add(topograph, name, x);
        }
      }
      return null;
    };
    //.........................................................................................................
    add_lexeme({
      name: 'shop',
      before: '*'
    });
    add_lexeme({
      name: 'cook',
      before: 'eat'
    });
    add_lexeme({
      name: 'dishes',
      after: '*'
    });
    add_lexeme({
      name: 'eat',
      after: 'cook'
    });
    //.........................................................................................................
    debug('^08-6^', anyother);
    finalize();
    show(topograph);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.toposort();
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-toposort.js.map