(function() {
  'use strict';
  var $, $drain, $watch, CND, DATOM, INTERTEXT, SP, alert, assign, badge, debug, echo, freeze, help, info, is_stamped, isa, jr, lets, log, new_datom, rpr, select, type_of, urge, validate, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; },
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/DISPLAY';

  rpr = CND.rpr;

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
  ({assign, jr} = CND);

  // warn "^3763^ using ../../apps/intertext/types, should use ../types"
  // INTERTEXT                 = require '../../apps/intertext'
  INTERTEXT = require('intertext');

  ({isa, validate, type_of} = INTERTEXT.types);

  SP = require('steampipes');

  ({$, $watch, $drain} = SP.export());

  DATOM = new (require('datom')).Datom({
    dirty: false
  });

  // stamp
  // wrap_datom
  ({new_datom, is_stamped, lets, freeze, select} = DATOM.export());

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.$tee_show_tokens_as_blocks = function() {
    var color_count, colors, errors, escape_text, lexemes, pipeline, source;
    escape_text = function(text) {
      var R;
      R = text;
      R = R.replace(/\n/g, '⏎');
      R = R.replace(/[\x00-\x1a\x1c-\x1f]/g, function($0) {
        return String.fromCodePoint(($0.codePointAt(0)) + 0x2400);
      });
      R = R.replace(/\x1b(?!\[)/g, '␛');
      return R;
    };
    //.........................................................................................................
    colors = [CND.MAGENTA, CND.CYAN, CND.GREEN];
    color_count = colors.length;
    source = null;
    pipeline = [];
    lexemes = [];
    errors = [];
    //.........................................................................................................
    pipeline.push(SP.$once_after_last(function(send) {
      var error, i, idx, indent, len, lexeme, message, stretch;
      echo(((function() {
        var i, results;
        results = [];
        for (idx = i = 0; i <= 19; idx = ++i) {
          results.push(`${idx * 10}`.padEnd(10, ' '));
        }
        return results;
      })()).join(''));
      echo('├┬┬┬┬┼┬┬┬┐'.repeat(20));
      echo(escape_text(source));
      echo(((function() {
        var i, len, results;
        results = [];
        for (idx = i = 0, len = lexemes.length; i < len; idx = ++i) {
          lexeme = lexemes[idx];
          results.push(colors[modulo(idx, color_count)](CND.reverse(CND.bold(escape_text(lexeme)))));
        }
        return results;
      })()).join(''));
      echo(((function() {
        var i, len, results;
        results = [];
        for (idx = i = 0, len = lexemes.length; i < len; idx = ++i) {
          lexeme = lexemes[idx];
          results.push(escape_text(lexeme));
        }
        return results;
      })()).join(''));
      for (i = 0, len = errors.length; i < len; i++) {
        error = errors[i];
        indent = ' '.repeat(error.start);
        stretch = CND.red(CND.reverse(error.text));
        message = CND.yellow(error.message);
        echo(`${indent}${stretch} ${message}`);
      }
      return null;
    }));
    //.........................................................................................................
    pipeline.push($(function(d, send) {
      /* TAINT unify nodes so we don't have to do this */
      var is_document_A, is_document_B, text;
      if (is_document_A = d.$key === '<document') {
        source = d.source;
      }
      if (is_document_B = d.$key === '<node' && d.name === 'document') {
        source = d.text;
      }
      if (is_document_A || is_document_B) {
        return send(d);
      }
      if ((d.$key === '>document') || (d.$key === '>node' && d.name === 'document')) {
        return send(d);
      }
      //.......................................................................................................
      if (select(d, '^error')) {
        errors.push(d);
        return send(d);
      }
      if (is_stamped(d)) {
        return send(d);
      }
      // debug '^080^', jr d
      ({text} = d);
      if (text == null) {
        return send(d);
      }
      lexemes.push(text);
      return send(d);
    }));
    //.........................................................................................................
    return SP.pull(...pipeline);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$tee_show_tokens_as_table = function(settings = null) {
    /* TAINT implement `$tee()` in SteamPipes */
    var byline;
    byline = [];
    // byline.push $show()
    byline.push(this._$show_tokens_as_table(settings));
    byline.push($drain());
    return SP.$tee(SP.pull(...byline));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._$show_tokens_as_table = function(settings = null) {
    var $add_keys, $filter, $format, $reorder_keys, colorize, defaults, exclude, include, include_first, include_last, pipeline, seen_keys;
    // debug '^2224^', TBL       = INTERTEXT.TBL
    // last      = Symbol 'last'
    pipeline = [];
    seen_keys = new Set();
    include_first = ['$key', 'pos', 'name', 'text'];
    include_last = ['$vnr', '$'];
    include = [];
    exclude = [];
    defaults = {
      stamped: false
    };
    settings = {...defaults, ...settings};
    //.........................................................................................................
    pipeline.push($filter = $((d, send) => {
      if (settings.stamped || (!d.$stamped)) {
        return send(d);
      }
    }));
    //.........................................................................................................
    pipeline.push($add_keys = $watch((d) => {
      var k, results;
      results = [];
      for (k in d) {
        if (indexOf.call(exclude, k) < 0) {
          results.push(seen_keys.add(k));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }));
    //.........................................................................................................
    pipeline.push(SP.$collect());
    pipeline.push($reorder_keys = $((buffer, send) => {
      var d, e, first_or_last, i, j, k, l, len, len1, len2, len3, len4, m, n, ref, v;
      include = [];
      first_or_last = new Set([...include_first, ...include_last]);
      for (i = 0, len = include_first.length; i < len; i++) {
        k = include_first[i];
        if (seen_keys.has(k)) {
          include.push(k);
        }
      }
      ref = (function() {
        var l, len1, ref, results;
        ref = [...seen_keys].sort();
        results = [];
        for (l = 0, len1 = ref.length; l < len1; l++) {
          k = ref[l];
          if (!first_or_last.has(k)) {
            results.push(k);
          }
        }
        return results;
      })();
      for (j = 0, len1 = ref.length; j < len1; j++) {
        k = ref[j];
        include.push(k);
      }
      for (l = 0, len2 = include_last.length; l < len2; l++) {
        k = include_last[l];
        if (seen_keys.has(k)) {
          include.push(k);
        }
      }
      for (m = 0, len3 = buffer.length; m < len3; m++) {
        d = buffer[m];
        e = {};
        for (n = 0, len4 = include.length; n < len4; n++) {
          k = include[n];
          v = d[k];
          e[k] = ((v != null) || v === null) ? v : void 0/* set missing keys */
        }
        send(e);
      }
      return null;
    }));
    //.........................................................................................................
    pipeline.push($format = $((d, send) => {
      if (d.text != null) {
        d.text = rpr(d.text);
      }
      d.pos = '';
      d.pos += (d.start != null ? `${d.start}`.padStart(3) : '---') + ',';
      d.pos += (d.stop != null ? `${d.stop}`.padStart(3) : '---');
      delete d.start;
      delete d.stop;
      return send(d);
    }));
    //.........................................................................................................
    colorize = (cell_txt, {value, row, is_header, key, idx}) => {
      var R;
      R = cell_txt;
      if (is_header) {
        return CND.white(CND.bold(CND.reverse(R)));
      }
      if (row.$vnr == null) {
        return CND.cyan(CND.underline(CND.bold(CND.reverse(R))));
      }
      if (row.name === 'info') {
        return CND.BASE01(CND.underline(CND.bold(CND.reverse(R))));
      }
      if (row.$key === '^raw') {
        return CND.BLUE(CND.underline(CND.bold(CND.reverse(R))));
      }
      if (row.$key === '^error') { // and ( key is 'text' )
        return CND.red(CND.bold(CND.reverse(R)));
      }
      if ((row.$key === '^text') && (key === 'text')) {
        return CND.white(CND.bold(CND.reverse(R)));
      }
      if ((value != null) && (key === 'text')) {
        return CND.blue(CND.bold(CND.reverse(R)));
      }
      switch (type_of(value)) {
        case 'boolean':
          R = CND.yellow(R);
          break;
        case 'text':
          R = CND.blue(R);
          break;
        case 'number':
          R = CND.green(R);
          break;
        case 'undefined':
          R = CND.grey(R);
          break;
        case 'null':
          R = CND.grey(R);
          break;
        default:
          R = CND.white(R);
      }
      return R;
    };
    //.........................................................................................................
    // pipeline.push $show()
    pipeline.push(INTERTEXT.TBL.$tabulate({
      format: colorize
    }));
    pipeline.push($watch(function(d) {
      return echo(d.text);
    }));
    return SP.pull(...pipeline);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.show_tokens_as_table = function(tokens) {
    return new Promise((resolve) => {
      var pipeline;
      validate.list(tokens);
      pipeline = [];
      pipeline.push(tokens);
      // pipeline.push @$raw_tokens_from_source()
      // pipeline.push @$as_datoms()
      // pipeline.push @$consolidate_errors()
      // pipeline.push @$consolidate_tags()
      // pipeline.push $show { title: '^443-2^', }
      pipeline.push(this.$tee_show_tokens_as_table({
        stamped: true
      }));
      // pipeline.push @$tee_show_tokens_as_table { stamped: false, }
      pipeline.push(this.$tee_show_tokens_as_blocks());
      // pipeline.push $watch ( d ) -> echo CND.yellow jr d unless d.$key is '^xmlxr:info'
      pipeline.push($drain(resolve()));
      SP.pull(...pipeline);
      return null;
    });
  };

}).call(this);

//# sourceMappingURL=display.js.map