(function() {
  'use strict';
  var $, $async, $display, $drain, $show, $watch, CND, DATOM, HTML, INTERSHOP, INTERTEXT, PGP, RXWS, SP, after, alert, assign, async, badge, cast, debug, defer, echo, field_values_from_datom, field_values_from_datoms, fresh_datom, help, info, isa, jr, new_datom, rpr, select, stamp, sync, type_of, types, urge, validate, warn, whisper;

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

  ({$, $async, $drain, $show, $watch} = SP.export());

  DATOM = require('../../../apps/datom');

  ({select, stamp, new_datom, fresh_datom} = DATOM.export());

  // DB                        = require '../intershop/intershop_modules/db'
  INTERSHOP = require('../intershop');

  PGP = (require('pg-promise'))({
    capSQL: false
  });

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
  this.$async_tee_write_to_db_2 = function() {
    var $buffer, $wait, DEMO_datoms_fields, DEMO_datoms_table, buffer, buffer_size, db_has_ended, first, flush, last, pipeline, stop_waiting, stream_has_ended;
    buffer = [];
    stream_has_ended = false;
    db_has_ended = false;
    stop_waiting = null;
    DEMO_datoms_table = new PGP.helpers.TableName({
      schema: 'demo',
      table: 'datoms'
    });
    DEMO_datoms_fields = new PGP.helpers.ColumnSet([
      'vnr',
      'key',
      'atr',
      'stamped' //, table
    ]);
    pipeline = [];
    first = Symbol('first');
    last = Symbol('last');
    buffer_size = 1;
    //.........................................................................................................
    flush = async function() {
      var sql, values;
      values = field_values_from_datoms(buffer);
      buffer.length = 0;
      sql = PGP.helpers.insert(values, DEMO_datoms_fields, DEMO_datoms_table);
      debug('^443^', sql);
      await db.none(sql);
      if (stream_has_ended) {
        db_has_ended = true;
        if (stop_waiting != null) {
          stop_waiting();
        }
      }
      return null;
    };
    //.........................................................................................................
    pipeline.push($buffer = $({first, last}, (d, send) => {
      if (d === first) {
        null; // init DB
        return null;
      }
      if (d === last) {
        stream_has_ended = true;
        if (buffer.length > 0) {
          flush();
        }
        return null;
      }
      buffer.push(d);
      if (buffer.length >= buffer_size) {
        flush();
      }
      return send(d);
    }));
    //.........................................................................................................
    pipeline.push($wait = $async((d, send, done) => {
      send(d);
      if (stream_has_ended && !db_has_ended) {
        stop_waiting = done;
        return null;
      }
      return done();
    }));
    //.........................................................................................................
    return SP.pull(...pipeline);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$tee_write_to_db_1 = function(S) {
    var $guard, $write, first, last, pipeline, sql;
    first = Symbol('first');
    last = Symbol('last');
    sql = "insert into DEMO.datoms ( vnr, key, atr, stamped ) values ( $1, $2, $3, $4 );";
    pipeline = [];
    //.........................................................................................................
    pipeline.push($guard = $({first, last}, (d, send) => {
      if (d === first) {
        help('^807^', "first");
        return null;
      }
      if (d === last) {
        help('^807^', "last");
        return null;
      }
      return send(d);
    }));
    //.........................................................................................................
    pipeline.push($write = $async(async(d, send, done) => {
      //.......................................................................................................
      await DB.query([sql, ...(field_values_from_datoms(d))]);
      //.......................................................................................................
      send(d);
      done();
      return null;
    }));
    //.........................................................................................................
    return SP.pull(...pipeline);
  };

  //-----------------------------------------------------------------------------------------------------------
  field_values_from_datoms = function(ds) {
    var d, i, len, results;
    results = [];
    for (i = 0, len = ds.length; i < len; i++) {
      d = ds[i];
      results.push(field_values_from_datom(d));
    }
    return results;
  };

  //-----------------------------------------------------------------------------------------------------------
  field_values_from_datom = function(d) {
    var ref, stamped, vnr, x;
    stamped = (ref = d.stamped) != null ? ref : false;
    vnr = (function() {
      var i, len, ref1, results;
      ref1 = d.$vnr;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        x = ref1[i];
        results.push(x === 2e308 ? 999 : x === -2e308 ? -999 : x);
      }
      return results;
    })();
    return {
      vnr,
      key: d.$key,
      atr: null,
      stamped
    };
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  $display = (S) => {
    return $watch((d) => {
      var xxx;
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
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.connect = function() {
    var O, connection_string, db_name, db_user;
    O = INTERSHOP.settings;
    db_user = O['intershop/db/user'].value;
    db_name = O['intershop/db/name'].value;
    connection_string = `postgres://${db_user}@localhost/${db_name}`;
    return PGP(connection_string);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._clear = async function(S) {
    debug('^443^', "truncating table DEMO.datoms");
    await S.db.none("truncate DEMO.datoms cascade;");
    return debug('^443^', "ok");
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    return new Promise(async(resolve) => {
      var DISPLAY, S, pipeline, source, tokens;
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
      S = {
        db: this.connect()
      };
      pipeline = [];
      tokens = RXWS.grammar.parse(source);
      await this._clear(S);
      pipeline.push(tokens);
      pipeline.push(this.$transform(S));
      pipeline.push($display(S));
      pipeline.push((await this.$async_tee_write_to_db_2(S)));
      pipeline.push($drain(function() {
        db.$pool.end(); // alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
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
      // finally
      // await DB._pool.end() # unless pool.ended
      //   # PGP.end() # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
      //   stream_has_ended = true
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      await this.demo();
      // await @demo_inserts()
      return null;
    })();
  }

}).call(this);
