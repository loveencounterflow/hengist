(function() {
  'use strict';
  var BM, CND, FSP, INTERTEXT, PATH, after, alert, assets, assign, badge, debug, defer, demo_parse, echo, help, info, isa, jr, limit_reached, prepare, rpr, timeout, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/BENCHMARKS';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  defer = setImmediate;

  //...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   cast
  //   type_of }               = types
  //...........................................................................................................
  BM = require('../../../lib/benchmarks');

  // DATA                      = require '../data-providers'
  //...........................................................................................................
  timeout = 3 * 1000;

  limit_reached = function(t0) {
    return Date.now() - t0 > timeout;
  };

  FSP = (require('fs')).promises;

  PATH = require('path');

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  //...........................................................................................................
  assets = {
    ok: false,
    probes: ['', 'x', 'foo\n  bar'],
    // '\nxxx'.repeat 20000
    approx_char_count: 0,
    line_count: 0,
    paths: ['main.benchmarks.js']
  };

  // 'interim.tests.js'
  // '../src/interim.tests.coffee'
  // '../../../assets/larry-wall-on-regexes.html'
  types = require('../paragate/lib/types');

  ({isa, validate, type_of} = types);

  //-----------------------------------------------------------------------------------------------------------
  prepare = function() {
    return new Promise(async function(resolve) {
      var i, len, path, probe, ref;
      if (assets.ok) {
        return resolve();
      }
      ref = assets.paths;
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        path = PATH.resolve(PATH.join(__dirname, path));
        probe = (await FSP.readFile(path, {
          encoding: 'utf-8'
        }));
        assets.approx_char_count += probe.length;
        assets.line_count += (probe.split('\n')).length;
        assets.probes.push(probe);
      }
      assets.ok = true;
      resolve();
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.chvtindent = async function(n, show) {
    return (await this._parse(n, show, 'chvtindent'));
  };

  this.rxws_tokens = async function(n, show) {
    return (await this._parse(n, show, 'rxws_tokens'));
  };

  this.rxws_blocks = async function(n, show) {
    return (await this._parse(n, show, 'rxws_blocks'));
  };

  this.htmlish = async function(n, show) {
    return (await this._parse(n, show, 'htmlish'));
  };

  this.asciisorter = async function(n, show) {
    return (await this._parse(n, show, 'asciisorter'));
  };

  this.chrsubsetter = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter'));
  };

  this.chrsubsetter_fast = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter_fast'));
  };

  this.chrsubsetter_blocks = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter_blocks'));
  };

  this.chrsubsetter_planes = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter_planes'));
  };

  this.chrsubsetter_halfplanes = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter_halfplanes'));
  };

  this.chrsubsetter_words = async function(n, show) {
    return (await this._parse(n, show, 'chrsubsetter_words'));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._parse = function(n, show, name) {
    return new Promise(async(resolve) => {
      var GRAMMAR, error, grammar;
      switch (name) {
        case 'chvtindent':
          GRAMMAR = require('./old-grammars/indentation.grammar');
          grammar = GRAMMAR.indentation_grammar;
          break;
        case 'rxws_blocks':
          GRAMMAR = require('../paragate/lib/regex-whitespace.grammar');
          grammar = GRAMMAR.grammar;
          break;
        case 'rxws_tokens':
          GRAMMAR = require('../paragate/lib/regex-whitespace.grammar');
          grammar = new GRAMMAR.Rxws_grammar({
            as_blocks: false
          });
          break;
        case 'htmlish':
          GRAMMAR = require('../paragate/lib/htmlish.grammar');
          grammar = GRAMMAR.grammar;
          break;
        case 'asciisorter':
          GRAMMAR = require('./old-grammars/asciisorter.grammar');
          grammar = GRAMMAR.asciisorter;
          break;
        case 'chrsubsetter':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = GRAMMAR.grammar;
          break;
        case 'chrsubsetter_fast':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = new GRAMMAR.Chrsubsetter({
            track_lines: false
          });
          break;
        case 'chrsubsetter_blocks':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = new GRAMMAR.Chrsubsetter({
            preset: 'blocks'
          });
          break;
        case 'chrsubsetter_planes':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = new GRAMMAR.Chrsubsetter({
            preset: 'planes'
          });
          break;
        case 'chrsubsetter_halfplanes':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = new GRAMMAR.Chrsubsetter({
            preset: 'halfplanes'
          });
          break;
        case 'chrsubsetter_words':
          GRAMMAR = require('../paragate/lib/chrsubsetter.grammar');
          grammar = new GRAMMAR.Chrsubsetter({
            preset: 'words'
          });
          break;
        default:
          throw new Error(`^44498^ unknown grammar ${rpr(name)}`);
      }
      try {
        //.........................................................................................................
        validate.object(grammar);
        validate.function(grammar.parse);
      } catch (error1) {
        error = error1;
        throw new Error(`^339^ not a valid grammar: ${rpr(name)}; GRAMMAR: ${rpr(types.all_keys_of(GRAMMAR))}`);
      }
      //.........................................................................................................
      await prepare();
      //.........................................................................................................
      resolve(() => {
        var rxws_tokens;
        return new Promise(rxws_tokens = (resolve) => {
          var approx_char_count, i, idx, len, probe, ref, token_count, tokens;
          token_count = 0;
          approx_char_count = 0;
          ref = assets.probes;
          for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
            probe = ref[idx];
            if ((name === 'chvtindent') && (probe.length > 10e3)) {
              continue;
            }
            approx_char_count += probe.length;
            tokens = grammar.parse(probe);
            token_count += tokens.length;
          }
          resolve(approx_char_count);
          // resolve token_count
          // resolve assets.line_count
          return null;
        });
      });
      //.........................................................................................................
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_parse = async function() {
    var GRAMMAR, grammar, i, len, probe, ref;
    await prepare();
    GRAMMAR = require('./regex-whitespace.grammar');
    // grammar = GRAMMAR.rxws_grammar
    grammar = new GRAMMAR.Rxws_grammar({
      as_blocks: false
    });
    ref = assets.probes;
    // GRAMMAR = require './old-grammars/indentation.grammar'
    // grammar = GRAMMAR.indentation_grammar
    for (i = 0, len = ref.length; i < len; i++) {
      probe = ref[i];
      urge('^5554^', rpr((grammar.parse(probe)).length));
    }
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.benchmark = async function() {
    var _, bench, i, j, len, n, ref, repetitions, show, test_name, test_names;
    // always_use_fresh_words    = false
    bench = BM.new_benchmarks();
    // n           = 1e6
    n = 10;
    timeout = n / 50e3 * 1000 + (2 * 1000);
    show = false;
    show = n < 21;
    repetitions = 1;
    // await BM.benchmark n, show, @
    test_names = ['asciisorter', 'chrsubsetter', 'chrsubsetter_blocks', 'chrsubsetter_fast', 'chrsubsetter_halfplanes', 'chrsubsetter_planes', 'chrsubsetter_words', 'chvtindent', 'htmlish', 'rxws_blocks', 'rxws_tokens'];
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      CND.shuffle(test_names);
      for (j = 0, len = test_names.length; j < len; j++) {
        test_name = test_names[j];
        await BM.benchmark(bench, n, show, this, test_name);
      }
      echo();
    }
    BM.show_totals(bench);
    return null;
  };

  // commander                          heap-benchmark fontmirror interplot svgttf mingkwai-typesetter
  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // demo_parse()
      await this.benchmark();
      return null;
    })();
  }

}).call(this);
