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
  this.get_values = function(n = 10) {
    var idx, idxs, providers;
    validate.cardinal(n);
    providers = [this.get_integers.bind(this), this.get_booleans.bind(this), this.get_words.bind(this), this.get_cjk_chr.bind(this)];
    //.........................................................................................................
    idxs = this.get_integers(n, 0, providers.length);
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = idxs.length; i < len; i++) {
        idx = idxs[i];
        results.push((providers[idx](1))[0]);
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_integers = function(n = 10, min = -1000, max = +1000) {
    var _;
    validate.cardinal(n);
    validate.integer(min);
    validate.integer(max);
    return (function() {
      var i, ref, results;
      results = [];
      for (_ = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
        results.push(CND.random_integer(min, max));
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_booleans = function(n = 10) {
    var _;
    validate.cardinal(n);
    return (function() {
      var i, ref, results;
      results = [];
      for (_ = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
        results.push((CND.random_integer(0, 2)) === 0);
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_cjk_chr = function(n = 10) {
    var R, _, i, ref;
    validate.cardinal(n);
    R = [];
    for (_ = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      R.push((function() {
        switch (CND.random_integer(0, 2)) {
          case 0:
            return String.fromCodePoint(CND.random_integer(0x04e00, 0x09f00));
          case 1:
            return String.fromCodePoint(CND.random_integer(0x20000, 0x2a6d7));
        }
      })());
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_words = function(n = 10) {
    var CP, R, m, path, word;
    validate.cardinal(n);
    m = Math.ceil(n / 2);
    path = '/usr/share/dict/french';
    CP = require('child_process');
    R = ((CP.execSync(`shuf -n ${m} ${path}`)).toString('utf-8')).split('\n');
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
    if (R.length < n) {
      R = [...R, ...(this.get_cjk_chr(n - R.length))];
    }
    return CND.shuffle(R);
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

}).call(this);

//# sourceMappingURL=data-providers-nocache.js.map