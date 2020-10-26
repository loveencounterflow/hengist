(function() {
  'use strict';
  var CND, FS, HOLLERITH, PATH, after, assign, badge, debug, declare, echo, first_of, help, info, isa, jr, last_of, nf, rpr, size_of, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'BENCHMARKS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  //...........................................................................................................
  HOLLERITH = require('hollerith-codec');

  this.as_hollerith = (x) => {
    return HOLLERITH.encode(x);
  };

  this.from_hollerith = (x) => {
    return HOLLERITH.decode(x);
  };

  nf = require('number-format.js');

  //...........................................................................................................
  // H                         = require '../helpers'
  // DATAMILL                  = require '../..'
  this.types = require('./types');

  ({isa, validate, declare, first_of, last_of, size_of, type_of} = this.types);

  // VNR                       = require '../vnr'
  // $fresh                    = true
  // first                     = Symbol 'first'
  // last                      = Symbol 'last'
  PATH = require('path');

  FS = require('fs');

  //-----------------------------------------------------------------------------------------------------------
  this._cache = {};

  this._get_key = function(name) {
    return name + ' ' + jr([...arguments].slice(1));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_integer_numbers = function(n = 10) {
    var R, cachekey;
    cachekey = this._get_key('get_integer_numbers', ...arguments);
    if ((R = this._cache[cachekey]) != null) {
      return R;
    }
    validate.cardinal(n);
    return this._cache[cachekey] = (function() {
      var results = [];
      for (var i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_random_words = function(n = 10, path = null, fresh = false) {
    var CP, R, cachekey, word;
    if (path == null) {
      path = '/usr/share/dict/portuguese';
    }
    cachekey = this._get_key('get_random_words', ...arguments);
    if (fresh) {
      delete this._cache[cachekey];
    }
    if ((R = this._cache[cachekey]) != null) {
      return R;
    }
    validate.cardinal(n);
    CP = require('child_process');
    R = ((CP.execSync(`shuf -n ${n} ${path}`)).toString('utf-8')).split('\n');
    R = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = R.length; i < len; i++) {
        word = R[i];
        results.push(word.replace(/'s$/g, ''));
      }
      return results;
    })();
    R = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = R.length; i < len; i++) {
        word = R[i];
        if (word !== '') {
          results.push(word);
        }
      }
      return results;
    })();
    return this._cache[cachekey] = R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_random_text = function(n = 10, path = null) {
    var R, cachekey, word;
    if (path == null) {
      path = '/usr/share/dict/portuguese';
    }
    cachekey = this._get_key('get_random_text', ...arguments);
    if ((R = this._cache[cachekey]) != null) {
      return R;
    }
    R = this.get_random_words(n, path);
    R = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = R.length; i < len; i++) {
        word = R[i];
        results.push(Math.random() > 0.7 ? '' : word);
      }
      return results;
    })();
    R = R.join('\n');
    return this._cache[cachekey] = R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_random_datoms = function(n = 10, path = null) {
    var $vnr, $vnr_hex, PD, R, cachekey, i, key, keys, last_idx, len, nr, vnr_blob, word, words;
    PD = require('pipedreams11');
    if (path == null) {
      path = '/usr/share/dict/portuguese';
    }
    cachekey = this._get_key('get_random_datoms', ...arguments);
    if ((R = this._cache[cachekey]) != null) {
      return R;
    }
    words = this.get_random_words(n, path);
    nr = 0;
    R = [];
    keys = ['^word', '^fun', '^text', '^something'];
    last_idx = keys.length - 1;
    for (i = 0, len = words.length; i < len; i++) {
      word = words[i];
      nr++;
      $vnr = [nr];
      vnr_blob = this.as_hollerith($vnr);
      $vnr_hex = vnr_blob.toString('hex');
      key = keys[CND.random_integer(0, last_idx)];
      if (Math.random() > 0.75) {
        R.push(PD.new_datom(key, word, {
          $vnr,
          $vnr_hex,
          $stamped: true
        }));
      } else {
        R.push(PD.new_datom(key, word, {$vnr, $vnr_hex}));
      }
    }
    CND.shuffle(R);
    return this._cache[cachekey] = R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_svg_pathdata = function() {
    return (FS.readFileSync(PATH.join(__dirname, '../src/tests/svgttf-test-data.txt'), 'utf-8')).split(/\n/);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_random_nested_objects = function(n = 10, path = null, fresh = false) {
    var R, _, cachekey, entry, i, j, len, ref, subset_of_words, word, word_count, words;
    cachekey = this._get_key('get_random_datoms', ...arguments);
    if (fresh) {
      delete this._cache[cachekey];
    }
    if ((R = this._cache[cachekey]) != null) {
      return R;
    }
    fresh = true;
    words = this.get_random_words(word_count, null, fresh);
    R = [];
    for (_ = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      CND.shuffle(words);
      word_count = CND.random_integer(3, 7);
      subset_of_words = words.slice(1, +word_count + 1 || 9e9);
      entry = {};
      for (j = 0, len = subset_of_words.length; j < len; j++) {
        word = subset_of_words[j];
        entry[word] = 42;
      }
      R.push(entry);
    }
    return this._cache[cachekey] = R;
  };

}).call(this);

//# sourceMappingURL=data-providers.js.map