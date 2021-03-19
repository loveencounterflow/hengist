(function() {
  'use strict';
  var $, $async, $drain, $show, $split, $watch, CND, FS, FSP, PATH, Re2, SP, alert, badge, debug, echo, execall/* https://github.com/uhop/node-re2 */, help, info, log, rpr, urge, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'IN-MEMORY-SQL';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  FSP = require('fs/promises');

  SP = require('../../../apps/steampipes');

  ({$, $async, $watch, $show, $split, $drain} = SP.export());

  Re2 = require('re2');

  execall = require('execall');

  //-----------------------------------------------------------------------------------------------------------
  this./* https://github.com/sindresorhus/execall */get_utf8_pattern = function() {
    var _utf8_byte_pattern;
    // see http://www.unicode.org/versions/Unicode13.0.0/ch03.pdf#G7404
    _utf8_byte_pattern = '';
    _utf8_byte_pattern += '[\\x01-\\x7F]|';
    _utf8_byte_pattern += '[\\xC2-\\xDF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xE0][\\xA0-\\xBF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xE1-\\xEC][\\x80-\\xBF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xED][\\x80-\\x9F][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xEE-\\xEF][\\x80-\\xBF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xF0][90-\\xBF][\\x80-\\xBF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xF1-\\xF3][\\x80-\\xBF][\\x80-\\xBF][\\x80-\\xBF]|';
    _utf8_byte_pattern += '[\\xF4][\\x80-\\x8F][\\x80-\\xBF][\\x80-\\xBF]';
    // see https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md#binary-data
    // legal_utf8_byte_pattern   = ''
    // # legal_utf8_byte_pattern   = '(?-u)'
    // legal_utf8_byte_pattern  += '^('
    // legal_utf8_byte_pattern  += _utf8_byte_pattern
    // legal_utf8_byte_pattern  += ')*$'
    return `(?:${_utf8_byte_pattern})+`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$find_error = function(do_echo) {
    var lnr, pattern, re0, re2;
    lnr = 0;
    pattern = this.get_utf8_pattern();
    re2 = new Re2(pattern, 'g');
    re0 = new RegExp(pattern, 'g');
    return $(function(buffer, send) {
      var new_text, part, parts, text;
      lnr++;
      text = buffer.toString('utf-8');
      if (indexOf.call(text, '�') < 0) {
        if (do_echo) {
          echo(text);
        }
        send(text);
        return null;
      }
      parts = execall(re0, text);
      new_text = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = parts.length; i < len; i++) {
          part = parts[i];
          results.push(part.match);
        }
        return results;
      })()).join('🔶');
      if (do_echo) {
        echo(new_text);
      }
      send(new_text);
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.show_encoding_errors = function(path) {
    return new Promise((resolve, reject) => {
      var pipeline, source;
      source = SP.read_from_file(path);
      pipeline = [];
      pipeline.push(source);
      pipeline.push($split('\n', false));
      pipeline.push(this.$find_error(true));
      // pipeline.push $watch ( d ) ->
      //   echo d if show > 0
      //   show--
      pipeline.push($drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline);
      return null;
    });
  };

  // iconv -f UTF-8 -t UTF-8//IGNORE "$1" > "$2"

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      var path;
      // debug '^56686^', process.argv
      /* TAINT use mixa */
      path = process.argv[2];
      return this.show_encoding_errors(path);
    })();
  }

  // debug @get_utf8_pattern()
// info execall /./, 'abcd'
// info execall /./g, 'abcd'
// help match for match in execall /\d+/g, "100, 23 and 42"
// info()
// help match for match in execall /((\d+))/g, "100, 23 and 42"

}).call(this);

//# sourceMappingURL=show-utf8-encoding-errors.js.map