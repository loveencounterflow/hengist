(function() {
  'use strict';
  var CND, DATOM, alert, badge, cast, debug, echo, help, info, isa, jr, lets, log, new_datom, rpr, select, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERTEXT/TESTS/SLABS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  DATOM = new (require('datom')).Datom({
    dirty: false
  });

  ({new_datom, lets, select} = DATOM.export());

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types);

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS API"] = function(T, done) {
    var INTERTEXT;
    INTERTEXT = require('../../../apps/intertext');
    //.........................................................................................................
    // CAT = require 'multimix/lib/cataloguing'
    // debug CAT.all_keys_of INTERTEXT.SLABS
    T.ok(isa.undefined(INTERTEXT.SLABS.slabs_from_text));
    T.ok(isa.function(INTERTEXT.SLABS.slabjoints_from_text));
    T.ok(isa.function(INTERTEXT.SLABS.assemble));
    T.ok(isa.object(INTERTEXT.SLABS.settings));
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.slabjoints_from_text 1"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    probes_and_matchers = [
      [
        '',
        {
          segments: [],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 0,
          cursor: 0
        },
        null
      ],
      [
        'a very fine day',
        {
          segments: ['a°',
        'very°',
        'fine°',
        'day#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 4,
          cursor: 0
        },
        null
      ],
      [
        'a cro^mu^lent so^lu^tion',
        {
          segments: ['a°',
        'cro-=',
        'mu-=',
        'lent°',
        'so-=',
        'lu-=',
        'tion#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 7,
          cursor: 0
        },
        null
      ],
      [
        '䷾Letterpress printing',
        {
          segments: ['䷾Letterpress°',
        'printing#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 2,
          cursor: 0
        },
        null
      ],
      [
        'ベルリンBerlin',
        {
          segments: ['ベ#',
        'ル#',
        'リ#',
        'ン#',
        'Berlin#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 5,
          cursor: 0
        },
        null
      ],
      [
        '其法用膠泥刻字、薄如錢唇',
        {
          segments: ['其#',
        '法#',
        '用#',
        '膠#',
        '泥#',
        '刻#',
        '字、#',
        '薄#',
        '如#',
        '錢#',
        '唇#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 11,
          cursor: 0
        },
        null
      ],
      [
        'over-guess^ti^mate',
        {
          segments: ['over-#',
        'guess-=',
        'ti-=',
        'mate#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 4,
          cursor: 0
        },
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          probe = probe.replace(/\^/g, INTERTEXT.HYPH.soft_hyphen_chr);
          return resolve(INTERTEXT.SLABS.slabjoints_from_text(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.slabjoints_from_text 2"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    probes_and_matchers = [
      [
        'Tis a consummation, devoutly to be wished.',
        {
          segments: ['Tis°',
        'a°',
        'con-=',
        'sum-=',
        'ma-=',
        'tion,°',
        'de-=',
        'voutly°',
        'to°',
        'be°',
        'wished.#'],
          version: '0.0.1',
          joints: {
            blunt: '#',
            shy: '=',
            space: '°'
          },
          size: 11,
          cursor: 0
        },
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          probe = INTERTEXT.HYPH.hyphenate(probe);
          result = INTERTEXT.SLABS.slabjoints_from_text(probe);
          debug('^337637^', INTERTEXT.HYPH.reveal_hyphens(probe));
          help('^337637^', CND.inspect(result));
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.text_and_joint_from_segment"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    probes_and_matchers = [["foo=", ['foo', '=']]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = INTERTEXT.SLABS.text_and_joint_from_segment(probe);
          help('^337637^', CND.inspect(result));
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.assemble (1)"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    probes_and_matchers = [["", "", null], ["a very fine day", "a very fine day", null], ["a cro\xadmu\xadlent so\xadlu\xadtion", "a cromulent solution", null], ["䷾Letterpress printing", "䷾Letterpress printing", null], ["ベルリンBerlin", "ベルリンBerlin", null], ["其法用膠泥刻字、薄如錢唇", "其法用膠泥刻字、薄如錢唇", null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(INTERTEXT.SLABS.assemble(INTERTEXT.SLABS.slabjoints_from_text(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.assemble (2)"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    probes_and_matchers = [["", "", null], ["a very fine day", "fine day", null], ["a cro^mu^lent so^lu^tion", "mulent solu-", null], ["䷾Letterpress printing", "", null], ["ベルリンBerlin", "リンBerlin", null], ["其法用膠泥刻字、薄如錢唇", "用膠泥刻", null], ["over-guess\xadti\xadmate", "timate", null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var slb;
          probe = probe.replace(/\^/g, INTERTEXT.HYPH.soft_hyphen_chr);
          slb = INTERTEXT.SLABS.slabjoints_from_text(probe);
          return resolve(INTERTEXT.SLABS.assemble(slb, 2, 5));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.assemble (3)"] = function(T, done) {
    var INTERTEXT, i, idx, idx_1, idx_1_txt, idx_2, idx_2_txt, j, len, line, matcher, probe, ref, ref1, result, slabjoints;
    INTERTEXT = require('../../../apps/intertext');
    probe = "a very fine day for a cro\xadmu\xadlent so\xadlu\xadtion";
    matcher = ["a", "a very", "a very fine", "a very fine day", "a very fine day for", "a very fine day for a", "a very fine day for a cro-", "a very fine day for a cromu-", "a very fine day for a cromulent", "a very fine day for a cromulent so-", "a very fine day for a cromulent solu-", "a very fine day for a cromulent solution"];
    slabjoints = INTERTEXT.SLABS.slabjoints_from_text(probe);
    info(slabjoints);
    result = (function() {
      var i, ref, results;
      results = [];
      for (idx = i = 0, ref = slabjoints.size; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        results.push(INTERTEXT.SLABS.assemble(slabjoints, 0, idx));
      }
      return results;
    })();
    for (idx = i = 0, len = result.length; i < len; idx = ++i) {
      line = result[idx];
      echo(CND.white(line.padEnd(50)), idx, line.length);
    }
    idx_1 = 11;
    for (idx_2 = j = ref = idx_1, ref1 = slabjoints.size; (ref <= ref1 ? j < ref1 : j > ref1); idx_2 = ref <= ref1 ? ++j : --j) {
      line = INTERTEXT.SLABS.assemble(slabjoints, idx_1, idx_2);
      idx_1_txt = `${idx_1}`.padEnd(5);
      idx_2_txt = `${idx_2}`.padEnd(5);
      echo(CND.yellow(line.padEnd(50)), idx_1_txt, idx_2_txt, line.length);
    }
    help(jr(result));
    T.eq(result, matcher);
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.assemble (4)"] = function(T, done) {
    var INTERTEXT, idx, matcher, probe, result, slabjoints;
    INTERTEXT = require('../../../apps/intertext');
    probe = "over-guess\xadti\xadmate";
    matcher = ["over-", "over-guess-", "over-guessti-", "over-guesstimate"];
    slabjoints = INTERTEXT.SLABS.slabjoints_from_text(probe);
    result = (function() {
      var i, ref, results;
      results = [];
      for (idx = i = 0, ref = slabjoints.size; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        results.push(INTERTEXT.SLABS.assemble(slabjoints, 0, idx));
      }
      return results;
    })();
    help(jr(result));
    T.eq(result, matcher);
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTEXT.SLABS.assemble (4)"] = function(T, done) {
    var INTERTEXT, idx, matcher, probe, result, slabjoints;
    INTERTEXT = require('../../../apps/intertext');
    probe = "over-guess\xadti\xadmate";
    matcher = ["over-", "over-guess-", "over-guessti-", "over-guesstimate"];
    slabjoints = INTERTEXT.SLABS.slabjoints_from_text(probe);
    result = (function() {
      var i, ref, results;
      results = [];
      for (idx = i = 0, ref = slabjoints.size; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        results.push(INTERTEXT.SLABS.assemble(slabjoints, 0, idx));
      }
      return results;
    })();
    help(jr(result));
    T.eq(result, matcher);
    done();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      // await @_demo()
      return test(this);
    })();
  }

  // test @[ "INTERTEXT.SLABS.slabjoints_from_text 2" ]
// test @[ "INTERTEXT.SLABS.text_and_joint_from_segment" ]
// test @[ "INTERTEXT.SLABS.slabjoints_from_text 1" ]
// test @[ "INTERTEXT.SLABS.assemble (3)" ]
// test @[ "INTERTEXT.SLABS.assemble (4)" ]

}).call(this);

//# sourceMappingURL=slabs.test.js.map