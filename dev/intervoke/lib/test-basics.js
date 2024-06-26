(function() {
  'use strict';
  var GUY, Isa, Isa2, alert, debug, echo, get_isa2_class, get_isa_class, help, info, inspect, log, plain, praise, rpr, test, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERVOKE/TESTS/BASIC'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({type_of} = types);

  Isa = null;

  Isa2 = null;

  // probes_and_matchers = [
  //   ]
  // #.........................................................................................................
  // for [ probe, matcher, error, ] in probes_and_matchers
  //   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

  //===========================================================================================================
  get_isa_class = function() {
    var IVK;
    if (Isa != null) {
      return Isa;
    }
    IVK = require('../../../apps/intervoke');
    Isa = (function() {
      //===========================================================================================================
      class Isa extends IVK.Intervoke {};

      //---------------------------------------------------------------------------------------------------------
      Isa.declare = {
        null: function(x) {
          return x === null;
        },
        undefined: function(x) {
          return x === void 0;
        },
        boolean: function(x) {
          return (x === true) || (x === false);
        },
        float: function(x) {
          return Number.isFinite(x);
        },
        symbol: function(x) {
          return (typeof x) === 'symbol';
        }
      };

      return Isa;

    }).call(this);
    //===========================================================================================================
    return Isa;
  };

  //===========================================================================================================
  get_isa2_class = function() {
    if (Isa2 != null) {
      return Isa2;
    }
    Isa = get_isa_class();
    Isa2 = (function() {
      //===========================================================================================================
      class Isa2 extends Isa {};

      //---------------------------------------------------------------------------------------------------------
      Isa2.declare = {
        integer: function(x) {
          return (this.float(x)) && Number.isInteger(x);
        }
      };

      return Isa2;

    }).call(this);
    //===========================================================================================================
    return Isa2;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_isa = function(T, done) {
    var IVK, e, isa;
    IVK = require('../../../apps/intervoke');
    Isa = get_isa_class();
    //.........................................................................................................
    isa = new Isa();
    // debug '^98-1^', isa.__cache
    if (T != null) {
      T.eq(isa.float(42), true);
    }
    if (T != null) {
      T.eq(isa.float(0/0), false);
    }
    if (T != null) {
      T.eq(isa.float('22'), false);
    }
    if (T != null) {
      T.eq(isa.boolean('22'), false);
    }
    if (T != null) {
      T.eq(isa.boolean(true), true);
    }
    try {
      debug('^98-2^', isa.xxx(42));
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    if (T != null) {
      T.throws(/property 'xxx' is unknown/, function() {
        return isa.xxx(42);
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_accessors_are_registered_in_set = function(T, done) {
    var IVK, isa;
    IVK = require('../../../apps/intervoke');
    Isa = get_isa_class();
    isa = new Isa();
    if (T != null) {
      T.eq([...isa.__accessors], ['null', 'undefined', 'boolean', 'float', 'symbol']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_disallowed_to_redeclare = function(T, done) {
    var IVK, e, isa;
    IVK = require('../../../apps/intervoke');
    Isa = get_isa_class();
    isa = new Isa();
    try {
      debug('^98-3^', isa.__declare('float', (function() {})));
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    if (T != null) {
      T.throws(/property 'float' already declared/, function() {
        return isa.__declare('float', (function() {}));
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_declarations_are_inherited = function(T, done) {
    var isa2;
    Isa2 = get_isa2_class();
    isa2 = new Isa2();
    if (T != null) {
      T.eq(type_of(isa2.null), 'function');
    }
    if (T != null) {
      T.eq(type_of(isa2.undefined), 'function');
    }
    if (T != null) {
      T.eq(type_of(isa2.boolean), 'function');
    }
    if (T != null) {
      T.eq(type_of(isa2.float), 'function');
    }
    if (T != null) {
      T.eq(type_of(isa2.symbol), 'function');
    }
    if (T != null) {
      T.eq(type_of(isa2.integer), 'function');
    }
    if (T != null) {
      T.eq(isa2.null(null), true);
    }
    if (T != null) {
      T.eq(isa2.undefined(void 0), true);
    }
    if (T != null) {
      T.eq(isa2.boolean(true), true);
    }
    if (T != null) {
      T.eq(isa2.float(42.1), true);
    }
    if (T != null) {
      T.eq(isa2.symbol(Symbol('x')), true);
    }
    if (T != null) {
      T.eq(isa2.integer(42), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_methods_are_properly_named = function(T, done) {
    (function() {      //.........................................................................................................
      var isa, isa2;
      if (T != null) {
        T.ok(get_isa_class() === get_isa_class());
      }
      if (T != null) {
        T.ok(get_isa2_class() === get_isa2_class());
      }
      Isa = get_isa_class();
      Isa2 = get_isa2_class();
      isa2 = new Isa2();
      isa = new Isa();
      return T != null ? T.ok(Isa.declare.float === isa.float) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
    (function() {      //.........................................................................................................
      var isa;
      Isa = get_isa_class();
      isa = new Isa();
      isa.__declare('anything', function(x) {
        return true;
      });
      if (T != null) {
        T.eq(isa.null.name, 'null');
      }
      if (T != null) {
        T.eq(isa.undefined.name, 'undefined');
      }
      if (T != null) {
        T.eq(isa.boolean.name, 'boolean');
      }
      if (T != null) {
        T.eq(isa.float.name, 'float');
      }
      if (T != null) {
        T.eq(isa.symbol.name, 'symbol');
      }
      if (T != null) {
        T.eq(isa.integer.name, 'integer');
      }
      return T != null ? T.eq(isa.anything.name, 'anything') : void 0;
    })();
    (function() {      //.........................................................................................................
      var isa2;
      Isa = get_isa_class();
      Isa2 = get_isa2_class();
      isa2 = new Isa2();
      if (T != null) {
        T.ok(Isa.declare.float === isa2.float);
      }
      isa2.__declare('anything', function(x) {
        return true;
      });
      if (T != null) {
        T.eq(isa2.null.name, 'null');
      }
      if (T != null) {
        T.eq(isa2.undefined.name, 'undefined');
      }
      if (T != null) {
        T.eq(isa2.boolean.name, 'boolean');
      }
      if (T != null) {
        T.eq(isa2.float.name, 'float');
      }
      if (T != null) {
        T.eq(isa2.symbol.name, 'symbol');
      }
      if (T != null) {
        T.eq(isa2.integer.name, 'integer');
      }
      return T != null ? T.eq(isa2.anything.name, 'anything') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_longest_first_matching = function(T, done) {
    var analyze_ncc, error, i, len, matcher, probe, probes_and_matchers, re_from_vocabulary, result, sort_vocabulary, vocabulary, vocabulary_re;
    vocabulary = ['of', 'or', 'empty', 'text', 'nonempty', 'list', 'empty list', 'empty list of', 'integer', 'list of', 'of integer'];
    //-----------------------------------------------------------------------------------------------------------
    sort_vocabulary = function(vocabulary) {
      return [...vocabulary].sort(function(a, b) {
        if (a.length < b.length) {
          /* TAINT in edge cases, sorting can be off when code units != code points */
          return +1;
        }
        if (a.length > b.length) {
          return -1;
        }
        return 0;
      });
    };
    //-----------------------------------------------------------------------------------------------------------
    re_from_vocabulary = function(vocabulary) {
      var term, words_pattern;
      vocabulary = sort_vocabulary(vocabulary);
      words_pattern = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = vocabulary.length; i < len; i++) {
          term = vocabulary[i];
          results.push(`(?:${GUY.str.escape_for_regex(term)})`);
        }
        return results;
      })()).join('|');
      return new RegExp(`(?<=^|\\s+)${words_pattern}(?=$|\\s+)`, 'ug');
    };
    //-----------------------------------------------------------------------------------------------------------
    analyze_ncc = function(vocabulary_re, ncc) {
      var d, ref, results, y;
      ref = probe.matchAll(vocabulary_re);
      results = [];
      for (y of ref) {
        [d] = y;
        results.push(d);
      }
      return results;
    };
    // info '^95-1^', vocabulary
    probes_and_matchers = [['list of integer', ['list of', 'integer']], ['empty list of integer', ['empty list of', 'integer']], ['nonempty integer list', ['nonempty', 'integer', 'list']], ['empty list of integer or list of text', ['empty list of', 'integer', 'or', 'list of']], ['nonempty list of integer or list of text', ['nonempty', 'list of', 'integer', 'or', 'list of']], ['integer', ['integer']]];
    vocabulary_re = re_from_vocabulary(vocabulary);
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      result = analyze_ncc(vocabulary_re, probe);
      info('^23423^', [probe, result]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_phrase_parser_basics = function(T, done) {
    var Phrase_parser, expand, lf, pick_1st, pp, sample_vocabulary, sp;
    ({Phrase_parser, sample_vocabulary} = require('../../../apps/intervoke/lib/phrase-parser'));
    //.........................................................................................................
    pp = new Phrase_parser();
    pp.set_vocabulary(sample_vocabulary);
    sp = function(sentence) {
      return sentence.split('_');
    };
    lf = function(fn) {
      var e;
      try {
        return info('^99-1^', [...fn()]);
      } catch (error1) {
        e = error1;
        return warn(GUY.trm.reverse(e.message));
      }
    };
    expand = function(fn) {
      return [...fn()];
    };
    pick_1st = function(fn) {
      return [...fn()][0];
    };
    // debug '^23423^', lf pp._walk_disjuncts "".split '_'
    // debug '^23423^', lf pp._walk_disjuncts "_or_".split '_'
    if (T != null) {
      T.throws(/unexpected empty alternative clause/, function() {
        return expand(function() {
          return pp._walk_disjuncts(sp("or"));
        });
      });
    }
    if (T != null) {
      T.throws(/unexpected empty alternative clause/, function() {
        return expand(function() {
          return pp._walk_disjuncts(sp("or_positive_integer_or_nonempty_text"));
        });
      });
    }
    if (T != null) {
      T.throws(/unexpected empty alternative clause/, function() {
        return expand(function() {
          return pp._walk_disjuncts(sp("positive_integer_or_nonempty_text_or"));
        });
      });
    }
    if (T != null) {
      T.throws(/expected word 'nonempty' in phrase 'positive_nonempty' to have role 'noun'/, function() {
        return expand(function() {
          return [pp.parse("positive_integer_or_positive_nonempty")];
        });
      });
    }
    if (T != null) {
      T.throws(/word 'combobulate' is unknown in 'combobulate_integer'/, function() {
        return expand(function() {
          return [pp.parse("combobulate_integer")];
        });
      });
    }
    if (T != null) {
      T.throws(/unexpected empty alternative clause/, function() {
        return expand(function() {
          return [pp.parse("list_of")];
        });
      });
    }
    if (T != null) {
      T.throws(/wrong use of 'or' in element clause/, function() {
        return pp._find_element_clauses(sp('nonempty_list_of_text_or_integer'));
      });
    }
    if (T != null) {
      T.throws(/expected 'optional' to occur as first word in phrase/, function() {
        return pp.parse("positive_integer_or_nonempty_optional_text");
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(expand(function() {
        return pp._walk_disjuncts(sp("positive_integer"));
      }), [['positive', 'integer']]);
    }
    if (T != null) {
      T.eq(expand(function() {
        return pp._walk_disjuncts(sp("positive_integer_or_nonempty_text"));
      }), [['positive', 'integer'], ['nonempty', 'text']]);
    }
    if (T != null) {
      T.eq(pp._find_element_clauses(sp('nonempty_list_of_list_of_text')), {
        phrase: ['nonempty', 'list'],
        elements: {
          phrase: ['list'],
          elements: {
            phrase: ['text']
          }
        }
      });
    }
    help('^99-1^', pp._find_element_clauses(sp('nonempty_list_of_list_of_text')));
    if (T != null) {
      T.eq(expand(function() {
        return pp._walk_element_clauses(sp('nonempty_list_of_list_of_text'));
      }), [
        {
          phrase: ['nonempty',
        'list'],
          elements: {
            phrase: ['list'],
            elements: {
              phrase: ['text']
            }
          }
        },
        {
          phrase: ['list'],
          elements: {
            phrase: ['text']
          }
        },
        {
          phrase: ['text']
        }
      ]);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(pp.parse("positive_integer_or_nonempty_text"), {
        alternatives: [
          {
            noun: 'integer',
            adjectives: ['positive']
          },
          {
            noun: 'text',
            adjectives: ['nonempty']
          }
        ],
        optional: false
      });
    }
    if (T != null) {
      T.eq(pp.parse("positive_integer_or_optional_nonempty_text"), {
        alternatives: [
          {
            noun: 'integer',
            adjectives: ['positive']
          },
          {
            noun: 'text',
            adjectives: ['nonempty']
          }
        ],
        optional: true
      });
    }
    if (T != null) {
      T.eq(pp.parse("optional_positive_integer_or_nonempty_text"), {
        alternatives: [
          {
            noun: 'integer',
            adjectives: ['positive']
          },
          {
            noun: 'text',
            adjectives: ['nonempty']
          }
        ],
        optional: true
      });
    }
    if (T != null) {
      T.eq(pp.parse("list"), {
        alternatives: [
          {
            noun: 'list'
          }
        ],
        optional: false
      });
    }
    if (T != null) {
      T.eq(pp.parse("list_or_text"), {
        alternatives: [
          {
            noun: 'list'
          },
          {
            noun: 'text'
          }
        ],
        optional: false
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_phrase_parser_element_types = function(T, done) {
    var Phrase_parser, expand, lf, pick_1st, pp, sample_vocabulary, sp;
    ({Phrase_parser, sample_vocabulary} = require('../../../apps/intervoke/lib/phrase-parser'));
    //.........................................................................................................
    pp = new Phrase_parser();
    pp.set_vocabulary(sample_vocabulary);
    sp = function(sentence) {
      return sentence.split('_');
    };
    lf = function(fn) {
      var e;
      try {
        return info('^99-1^', [...fn()]);
      } catch (error1) {
        e = error1;
        return warn(GUY.trm.reverse(e.message));
      }
    };
    expand = function(fn) {
      return [...fn()];
    };
    pick_1st = function(fn) {
      return [...fn()][0];
    };
    //.........................................................................................................
    // T?.eq ( pp.parse "list_or_text" ), { alternatives: [ { noun: 'list', }, { noun: 'text', } ], optional: false }
    if (T != null) {
      T.eq(pp.parse("list_of_text"), {
        alternatives: [
          {
            noun: 'list',
            elements: {
              noun: 'text'
            }
          }
        ],
        optional: false
      });
    }
    if (T != null) {
      T.eq(pp.parse("list_of_empty_text"), {
        alternatives: [
          {
            noun: 'list',
            elements: {
              noun: 'text',
              adjectives: ['empty']
            }
          }
        ],
        optional: false
      });
    }
    if (T != null) {
      T.throws(/nested containers not allowed in 'list_of_list_of_text'/, function() {
        return pp.parse("list_of_list_of_text");
      });
    }
    // debug '^409-1^', ( pp.parse "set_or_list_of_text" )
    // debug '^409-2^', ( pp.parse "set_or_list_of_text_or_integer" )
    // debug '^409-3^', ( pp.parse "list_of_text_or_integer" )
    // debug '^409-4^', ( pp.parse "list_of_text_or_set" )
    if (T != null) {
      T.throws(/alternatives not allowed with containers in 'set_or_list_of_text'/, function() {
        return pp.parse("set_or_list_of_text");
      });
    }
    if (T != null) {
      T.throws(/alternatives not allowed with containers in 'set_or_list_of_text_or_integer'/, function() {
        return pp.parse("set_or_list_of_text_or_integer");
      });
    }
    if (T != null) {
      T.throws(/alternatives not allowed with containers in 'list_of_text_or_integer'/, function() {
        return pp.parse("list_of_text_or_integer");
      });
    }
    if (T != null) {
      T.throws(/alternatives not allowed with containers in 'list_of_text_or_set'/, function() {
        return pp.parse("list_of_text_or_set");
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_intervoke = function(T, done) {
    var Intervoke, My_intervoke, My_proto_intervoke, e, prompter;
    ({Intervoke} = require('../../../apps/intervoke'));
    My_proto_intervoke = (function() {
      //.........................................................................................................
      class My_proto_intervoke extends Intervoke {};

      My_proto_intervoke.declare = {
        baz: function(...P) {
          return help('^My_intervoke.declare.bar', P);
        }
      };

      return My_proto_intervoke;

    }).call(this);
    My_intervoke = (function() {
      //.........................................................................................................
      class My_intervoke extends My_proto_intervoke {};

      My_intervoke.declare = {
        bar: function(...P) {
          return help('^My_intervoke.declare.bar', P);
        }
      };

      return My_intervoke;

    }).call(this);
    //.........................................................................................................
    prompter = new My_intervoke();
    debug('^ivk_intervoke@1^', prompter);
    // debug '^ivk_intervoke@2^', [ prompter.__walk_prototype_chain()..., ]
    debug('^ivk_intervoke@3^', prompter.__declare('foo', function(...P) {
      return urge('^ivk_intervoke@4^', P);
    }));
    try {
      prompter.__declare('baz', (function() {}));
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    // debug '^ivk_intervoke@5^', prompter.baz
    // debug '^ivk_intervoke@6^', prompter.bar
    // debug '^ivk_intervoke@7^', prompter.foo
    debug('^ivk_intervoke@8^', prompter.baz(101, 102));
    debug('^ivk_intervoke@9^', prompter.bar(3, 4, 5));
    debug('^ivk_intervoke@10^', prompter.foo(1, 2, 3));
    try {
      prompter.no_such_method();
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_intervoke_phraser = function(T, done) {
    var Intervoke_phraser, My_intervoke_phraser, My_proto_intervoke_phraser, e, prompter;
    ({Intervoke_phraser} = require('../../../apps/intervoke'));
    My_proto_intervoke_phraser = (function() {
      //.........................................................................................................
      class My_proto_intervoke_phraser extends Intervoke_phraser {};

      My_proto_intervoke_phraser.declare = {
        baz: function(...P) {
          return help('^My_intervoke_phraser.declare.bar', P);
        }
      };

      return My_proto_intervoke_phraser;

    }).call(this);
    My_intervoke_phraser = (function() {
      //.........................................................................................................
      class My_intervoke_phraser extends My_proto_intervoke_phraser {};

      My_intervoke_phraser.declare = {
        bar: function(...P) {
          return help('^My_intervoke_phraser.declare.bar', P);
        }
      };

      return My_intervoke_phraser;

    }).call(this);
    //.........................................................................................................
    prompter = new My_intervoke_phraser();
    debug('^ivk_intervoke_phraser@1^', prompter);
    // debug '^ivk_intervoke_phraser@2^', [ prompter.__walk_prototype_chain()..., ]
    debug('^ivk_intervoke_phraser@3^', prompter.__declare('foo', function(...P) {
      return urge('^ivk_intervoke_phraser@4^', P);
    }));
    // debug '^ivk_intervoke_phraser@5^', prompter.baz
    // debug '^ivk_intervoke_phraser@6^', prompter.bar
    // debug '^ivk_intervoke_phraser@7^', prompter.foo
    debug('^ivk_intervoke_phraser@8^', prompter.baz(101, 102));
    debug('^ivk_intervoke_phraser@9^', prompter.bar(3, 4, 5));
    debug('^ivk_intervoke_phraser@10^', prompter.foo(1, 2, 3));
    try {
      // debug '^ivk_intervoke_phraser@10^', prompter.integer
      // debug '^ivk_intervoke_phraser@10^', prompter.integer_or_text 3
      prompter.integer;
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    try {
      prompter.integer_or_text(3);
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    try {
      prompter.no_such_method();
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      // @ivk_isa()
      // test @ivk_declarations_are_inherited
      return test(this);
    })();
  }

  // @ivk_intervoke()
// @ivk_intervoke_phraser()
// test @ivk_phrase_parser_basics
// test @ivk_phrase_parser_element_types
// test @ivk_methods_are_properly_named
// test @ivk_isa
// test @ivk_disallowed_to_redeclare
// @demo_longest_first_matching()

  // for formula in [ 'a || b && c      ', 'a || ( b && c )  ', '( a || b ) && c  ', ]
//   for a in [ false, true, ]
//     for b in [ false, true, ]
//       for c in [ false, true, ]
//         echo formula, a, b, c, GUY.trm.truth eval formula

}).call(this);

//# sourceMappingURL=test-basics.js.map