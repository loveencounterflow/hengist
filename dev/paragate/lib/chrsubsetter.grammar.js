(function() {
  'use strict';
  var CND, Chrsubsetter, GRAMMAR, INTERTEXT, MAIN, Multimix, alert, assign, badge, debug, echo, freeze, help, info, isa, jr, lets, log, rpr, space_re, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/GRAMMARS/REGEXWS';

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

  // CHVTN                     = require 'chevrotain'
  ({lets, freeze} = (new (require('datom')).Datom({
    dirty: false
  })).export());

  types = require('../paragate/lib/types');

  ({isa, type_of, validate} = types);

  GRAMMAR = require('../paragate/lib/grammar');

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  space_re = /\x20+/y;

  Multimix = require('../paragate/node_modules/multimix');

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT also allow regexes outside of objects? */
  /* TAINT validate regexes? no anchor, sticky, unicode */
  this.sets = [
    {
      name: 'spaces',
      match: /\s+/yu
    },
    {
      /* less specific */
    name: 'punctuations',
      match: /[=,.;:!?]+/yu
    },
    {
      name: 'signs',
      match: /[-+]+/yu
    },
    {
      name: 'digits',
      match: /[0-8]+/yu
    },
    {
      name: 'newlines',
      match: /\n+/yu
    },
    {
      name: 'ucletters',
      match: /[A-Z]+/yu
    },
    {
      name: 'lcletters',
      match: /[a-z]+/yu
    }
  ];

  //-----------------------------------------------------------------------------------------------------------
  this./* more specific */parse = function(source) {
    var $0, $key, $vnr, R, chr_idx, colnr, dent, flush_other, found, i, idx, last_cat_idx, last_chr_idx, level, line, linenr, lines, match, nl, other_start, other_stop, ref, ref1, set, set_idx, start, stop, text;
    validate.text(source);
    R = [];
    chr_idx = 0;
    last_chr_idx = source.length - 1;
    set_idx = null;
    last_cat_idx = this.sets.length - 1;
    other_start = null;
    other_stop = null;
    set = null;
    found = false;
    $vnr = [0, 0];
    //.........................................................................................................
    flush_other = function() {
      if (other_start == null) {
        return;
      }
      R.push({
        $key: '^other',
        start: other_start,
        stop: other_stop,
        text,
        $vnr,
        $: '^Б1^'
      });
      other_start = null;
      other_stop = null;
      return null;
    };
    while (true) {
      if (chr_idx > last_chr_idx) {
        //.........................................................................................................
        break;
      }
      set_idx = last_cat_idx + 1;
      found = false;
      while (true) {
        //.......................................................................................................
        set_idx--;
        if (set_idx < 0) {
          break;
        }
        set = this.sets[set_idx];
        set.match.lastIndex = chr_idx;
        if ((match = source.match(set.match)) == null) {
          /* TAINT some serious naming calamity here */
          continue;
        }
        //.....................................................................................................
        flush_other();
        [$0] = match;
        start = chr_idx;
        chr_idx += $0.length;
        stop = chr_idx;
        text = source.slice(start, stop);
        found = true;
        $key = '^' + set.name;
        R.push({
          $key,
          start,
          stop,
          text,
          $vnr,
          $: '^Б2^'
        });
        break;
      }
      //.......................................................................................................
      if (!found) {
        if (other_start == null) {
          other_start = chr_idx;
        }
        other_stop = (other_stop != null ? other_stop : other_start) + 1;
        urge('^7778^', 'other', source.slice(other_start, other_stop));
        chr_idx += 1;
      }
    }
    //.........................................................................................................
    flush_other();
    return freeze(R);
    //#########################################################################################################
    lines = source.split(this.nl_re);
    linenr = 0;
    colnr = 1;
    nl = '';
    //.........................................................................................................
    start = 0;
    stop = source.length;
    R.push({
      $key: '<document',
      start,
      stop,
      source,
      $vnr: [-2e308],
      $: '^r1^'
    });
    for (idx = i = 0, ref = lines.length; i <= ref; idx = i += 2) {
      line = lines[idx];
      nl = (ref1 = lines[idx + 1]) != null ? ref1 : '';
      stop = start + line.length + nl.length;
      linenr++;
      ({dent, text} = (line.match(this.dent_re)).groups);
      level = dent.length;
      line += nl;
      R.push({
        $key: '^dline',
        start,
        stop,
        dent,
        text,
        nl,
        line,
        level,
        $vnr: [linenr, colnr],
        $: '^r2^'
      });
      start = stop;
    }
    start = stop = source.length;
    R.push({
      $key: '>document',
      start,
      stop,
      $vnr: [+2e308],
      $: '^r3^'
    });
    //.........................................................................................................
    return freeze(this.as_blocks ? this._as_blocks(R) : R);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_blocks = function(dlines) {
    /* TAINT account for differing levels */
    var R, blanks, blocks, consolidate, d, flush, i, idx, prv_level, ref;
    R = [];
    blocks = [];
    blanks = [];
    prv_level = null;
    //.........................................................................................................
    consolidate = function($key, buffer) {
      var $vnr, d, first, last, level, linecount, ref, start, stop, text;
      first = buffer[0];
      last = buffer[buffer.length - 1];
      start = first.start;
      stop = last.stop;
      $vnr = first.$vnr;
      level = (ref = first.level) != null ? ref : 0;
      linecount = buffer.length;
      // debug '^223^', rpr buffer
      if ($key === '^block') {
        text = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = buffer.length; i < len; i++) {
            d = buffer[i];
            results.push(d.text + d.nl);
          }
          return results;
        })()).join('');
      } else {
        text = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = buffer.length; i < len; i++) {
            d = buffer[i];
            results.push(d.dent + d.text + d.nl);
          }
          return results;
        })()).join('');
      }
      return {
        $key,
        start,
        stop,
        text,
        level,
        linecount,
        $vnr,
        $: '^r4^'
      };
    };
    //.........................................................................................................
    flush = function($key, collection) {
      if (!(collection.length > 0)) {
        return collection;
      }
      R.push(consolidate($key, collection));
      return [];
    };
    //.........................................................................................................
    R.push(dlines[0]);
    for (idx = i = 1, ref = dlines.length - 1; (1 <= ref ? i < ref : i > ref); idx = 1 <= ref ? ++i : --i) {
      d = dlines[idx];
      if (d.$key !== '^dline') {
        R.push(d);
        continue;
      }
      if (this.blank_re.test(d.line)) {
        blocks = flush('^block', blocks);
        blanks.push(d);
        continue;
      }
      blanks = flush('^blank', blanks);
      if (prv_level !== d.level) {
        blocks = flush('^block', blocks);
      }
      prv_level = d.level;
      blocks.push(d);
    }
    //.........................................................................................................
    blanks = flush('^blank', blanks);
    blocks = flush('^block', blocks);
    R.push(dlines[dlines.length - 1]);
    return R;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  MAIN = this;

  Chrsubsetter = (function() {
    class Chrsubsetter extends Multimix {
      //---------------------------------------------------------------------------------------------------------
      constructor(settings = null) {
        var defaults;
        super();
        defaults = {
          nl_re: /(\n)//* NOTE might also use `/(\n|\r\n?)/` */,
          dent_re: /^(?<dent>\x20*)(?<text>.*)/,
          blank_re: /^\s*$/,
          name: 'rxws_grammar',
          as_blocks: true
        };
        settings = {...defaults, ...settings};
        this.name = settings.name;
        this.nl_re = settings.nl_re;
        this.dent_re = settings.dent_re;
        this.blank_re = settings.blank_re;
        this.as_blocks = settings.as_blocks;
        return this;
      }

    };

    Chrsubsetter.include(MAIN, {
      overwrite: true
    });

    return Chrsubsetter;

  }).call(this);

  //###########################################################################################################
  module.exports = {
    Chrsubsetter,
    grammar: new Chrsubsetter()
  };

}).call(this);
