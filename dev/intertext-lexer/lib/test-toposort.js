(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, show, stamp, test, type_of, types, urge, validate, warn, whisper,
    indexOf = [].indexOf;

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
    var LTSORT, dependencies, error, name, ordering, precedents, ref, table, x, y;
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
    table = [];
    ref = topograph.precedents.entries();
    for (y of ref) {
      [name, precedents] = y;
      precedents = precedents.join(', ');
      table.push({name, precedents});
    }
    H.tabulate("topograph", table);
    info('^08-4^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = ordering.length; i < len; i++) {
        x = ordering[i];
        results.push(GUY.trm.yellow(x));
      }
      return results;
    })()).join(GUY.trm.grey(' => ')));
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.toposort = function(T, done) {
    var LTSORT, add_lexeme, antecedents, finalize, lexemes, subsequents, topograph;
    // T?.halt_on_error()
    LTSORT = require('../../../apps/ltsort');
    topograph = LTSORT.new_graph({
      loners: true
    });
    lexemes = [];
    antecedents = [];
    subsequents = [];
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
            if (indexOf.call(subsequents, name) < 0) {
              subsequents.push(name);
            }
            continue;
          }
          LTSORT.add(topograph, d, name);
        }
        for (j = 0, len1 = before.length; j < len1; j++) {
          d = before[j];
          if (d === '*') {
            if (indexOf.call(antecedents, name) < 0) {
              antecedents.unshift(name);
            }
            continue;
          }
          LTSORT.add(topograph, name, d);
        }
      }
      return null;
    };
    //.........................................................................................................
    finalize = function() {
      var antecedent, i, idx, j, k, l, len, len1, len2, len3, name, names, ref, ref1, subsequent;
      names = [...topograph.precedents.keys()];
      for (idx = i = 0, len = antecedents.length; i < len; idx = ++i) {
        antecedent = antecedents[idx];
        help('^08-5^', antecedent, antecedents.slice(0, idx));
        ref = [...names, ...antecedents.slice(0, idx), ...subsequents];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          name = ref[j];
          if (antecedent === name) {
            continue;
          }
          LTSORT.add(topograph, antecedent, name);
        }
      }
      for (idx = k = 0, len2 = subsequents.length; k < len2; idx = ++k) {
        subsequent = subsequents[idx];
        warn('^08-6^', subsequent, subsequents.slice(0, idx));
        ref1 = [...names, ...subsequents.slice(0, idx), ...antecedents];
        for (l = 0, len3 = ref1.length; l < len3; l++) {
          name = ref1[l];
          if (subsequent === name) {
            continue;
          }
          LTSORT.add(topograph, name, subsequent);
        }
      }
      return null;
    };
    //.........................................................................................................
    add_lexeme({
      name: 'getup',
      before: '*'
    });
    add_lexeme({
      name: 'brushteeth',
      before: '*'
    });
    add_lexeme({
      name: 'shop',
      before: '*'
    });
    add_lexeme({
      name: 'cook',
      before: 'eat'
    });
    add_lexeme({
      name: 'serve',
      after: 'cook',
      before: 'eat'
    });
    add_lexeme({
      name: 'dishes',
      after: '*'
    });
    add_lexeme({
      name: 'sleep',
      after: '*'
    });
    add_lexeme({
      name: 'eat',
      after: 'cook'
    });
    //.........................................................................................................
    debug('^08-1^', {antecedents, subsequents});
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