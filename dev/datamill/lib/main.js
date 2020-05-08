(function() {
  'use strict';
  var $, $drain, $show, $watch, CND, DATOM, HTML, INTERTEXT, RXWS, SP, after, alert, assign, async, badge, cast, debug, defer, echo, fresh_datom, help, info, isa, jr, new_datom, rpr, select, stamp, sync, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DATAMILL-DEMO';

  rpr = CND.rpr;

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

  async = {};

  sync = {
    concurrency: 1
  };

  // async                     = { async: true, }
  //...........................................................................................................
  types = require('./types');

  ({isa, validate, cast, type_of} = types);

  INTERTEXT = require('intertext');

  ({HTML, RXWS} = require('../../../apps/paragate'));

  SP = require('steampipes');

  ({$, $drain, $show, $watch} = SP.export());

  DATOM = require('../../../apps/datom');

  ({select, stamp, new_datom, fresh_datom} = DATOM.export());

  //-----------------------------------------------------------------------------------------------------------
  this.$headings = function(S) {
    /* Recognize heading as any line that starts with a `#` (hash). Current behavior is to
     check whether both prv and nxt lines are blank and if not so issue a warning; this detail may change
     in the future. */
    var pattern;
    pattern = /^(?<hashes>\#+)(?<text>[\s\S]*)$/;
    //.........................................................................................................
    // H.register_key S, '<h', { is_block: true, }
    // H.register_key S, '>h', { is_block: true, }
    //.........................................................................................................
    return $((d, send) => {
      var dest/* TAINT use trim method */, level, match, text;
      if (d.$key !== '^block') {
        return send(d);
      }
      if (d.level !== 0) {
        return send(d);
      }
      if ((match = d.text.match(pattern)) == null) {
        return send(d);
      }
      urge('^334^', CND.reverse(d));
      send(stamp(d));
      level = match.groups.hashes.length;
      text = match.groups.text.replace(/^\s*(.*?)\s*$/g, '$1');
      dest = '???'; // d.dest
      send(fresh_datom('<h', {
        level,
        $vnr: [...d.$vnr, 1],
        dest,
        ref: 'blk/hd1'
      }));
      send(fresh_datom('^line', {
        text,
        $vnr: [...d.$vnr, 2],
        dest,
        ref: 'blk/hd2'
      }));
      send(fresh_datom('>h', {
        level,
        $vnr: [...d.$vnr, 3],
        dest,
        ref: 'blk/hd3'
      }));
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.$transform = function(S) {
    var pipeline;
    pipeline = [];
    pipeline.push(this.$headings(S));
    return SP.pull(...pipeline);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.$tee_write_to_db = function(S) {
    var first, last;
    first = Symbol('first');
    last = Symbol('last');
    return $({first, last}, (d, send) => {
      if (d === first) {
        null;
      }
      if (d === last) {
        null;
      }
      return send(d);
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    return new Promise((resolve) => {
      var DISPLAY, S, pipeline, source, tokens, xxx;
      // debug '^4554^', rpr ( k for k of DATAMILL )
      DISPLAY = require('../../paragate/lib/display');
      source = `<title>A Proposal</title>
<h1>Motivation</h1>
<p>It has been suggested to further the cause.</p>
<p>This is <i>very</i> desirable indeed.</p>

# First Things First

A paragraph on the lowest level
(this, hopefully, does not apply to the paragraph's content
but only to its position in the manuscript).

  An indented paragraph
  which may be understood
  as a blockquote or somesuch.

\`\`\`
some

code
\`\`\`
`;
      S = {};
      pipeline = [];
      tokens = RXWS.grammar.parse(source);
      xxx = function(d) {
        var R, i, k, len, ref;
        R = {};
        ref = (Object.keys(d)).sort();
        for (i = 0, len = ref.length; i < len; i++) {
          k = ref[i];
          R[k] = d[k];
        }
        return R;
      };
      pipeline.push(tokens);
      pipeline.push(this.$transform(S));
      pipeline.push($watch((d) => {
        /* TAINT use datamill display */
        switch (d.$key) {
          case '<document':
          case '>document':
            echo(CND.grey(xxx(d)));
            break;
          case '^blank':
          case '>document':
            echo(CND.grey(CND.reverse(xxx(d))));
            break;
          default:
            switch (d.$key[0]) {
              case '<':
                echo(CND.lime(xxx(d)));
                break;
              case '>':
                echo(CND.red(xxx(d)));
                break;
              case '^':
                echo(CND.yellow(xxx(d)));
                break;
              default:
                echo(CND.reverse(CND.green(xxx(d))));
            }
        }
        return null;
      }));
      pipeline.push(this.$tee_write_to_db(S));
      pipeline.push($drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline);
      // # tokens  = HTML.parse source
      // info rpr token for token in tokens
      // await DISPLAY.show_tokens_as_table tokens
      // for d in tokens
      //   echo CND.rainbow d
      //   switch d.$key
      //     when '<document' then null
      //     when '>document' then null
      //     when '^blank' then null
      //     when '^block'
      //       { text, } = d
      //       echo text
      //     else throw new Error "^3376^ unknown $key #{rpr d.$key}"
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      await this.demo();
      return null;
    })();
  }

}).call(this);
