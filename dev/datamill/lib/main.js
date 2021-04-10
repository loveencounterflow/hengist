(function() {
  'use strict';
  var $, $async, $display, $drain, $mark_doc_boundaries, $parse, $show, $watch, CND, DATOM, HTML, INTERSHOP, INTERTEXT, INTERTEXT_show_text_ruler, PGP, RXWS, SP, after, alert, assign, async, badge, cast, debug, defer, echo, escape_text, field_values_from_datom, field_values_from_datoms, freeze, fresh_datom, help, info, isa, jr, lets, new_datom, rpr, select, stamp, sync, type_of, types, urge, validate, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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

  ({select, stamp, freeze, lets, new_datom, fresh_datom} = DATOM.export());

  // DB                        = require '../intershop/intershop_modules/db'
  INTERSHOP = require('../intershop');

  PGP = (require('pg-promise'))({
    capSQL: false
  });

  //-----------------------------------------------------------------------------------------------------------
  this.$headings = function(me) {
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
  this.$transform = function(me) {
    var last, pipeline;
    last = Symbol('last');
    pipeline = [];
    pipeline.push(this.$headings(me));
    pipeline.push($({last}, $(function(d, send) {
      if (d === last) {
        send({
          $key: '^foo',
          $vnr: [10, -1]
        });
        send({
          $key: '^foo',
          $vnr: [10]
        });
        send({
          $key: '^foo',
          $vnr: [10, 0]
        });
        send({
          $key: '^foo',
          $vnr: [10, 1]
        });
        return null;
      }
      return send(d);
    })));
    return SP.pull(...pipeline);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.$async_tee_write_to_db_2 = function(me) {
    var $buffer, $guard, DEMO_datoms_fields, DEMO_datoms_table, buffer, buffer_size, flush, last, pipeline;
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
    last = Symbol('last');
    buffer = [];
    buffer_size = 15;
    pipeline = [];
    //.........................................................................................................
    flush = async function() {
      var sql, values;
      values = field_values_from_datoms(buffer);
      buffer.length = 0;
      sql = PGP.helpers.insert(values, DEMO_datoms_fields, DEMO_datoms_table);
      await me.db.none(sql);
      whisper('^443^', CND.plum(CND.reverse(`written ${values.length} values`)));
      return null;
    };
    //.........................................................................................................
    pipeline.push($guard = $({last}, (d, send) => {
      return send(d);
    }));
    //.........................................................................................................
    pipeline.push($buffer = $async(async(d, send, done) => {
      if (d === last) {
        if (buffer.length > 0) {
          await flush();
        }
      } else {
        buffer.push(d);
        if (buffer.length >= buffer_size) {
          await flush();
        }
        send(d);
      }
      done();
      return null;
    }));
    //.........................................................................................................
    return SP.pull(...pipeline);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$tee_write_to_db_1 = function(me) {
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
  $display = (me) => {
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
  this._clear = async function(me) {
    debug('^443^', "truncating table DEMO.datoms");
    await me.db.none("truncate DEMO.datoms cascade;");
    return debug('^443^', "ok");
  };

  //-----------------------------------------------------------------------------------------------------------
  this._list = async function() { // new Promise ( resolve ) =>
    var me, row, rows;
    me = {
      db: this.connect()
    };
    rows = (await me.db.any("select * from DEMO.datoms order by vnr using <;"));
    for (row of rows) {
      help('^332^', row);
    }
    me.db.$pool.end(); // alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_stream = function() {
    return new Promise(async(resolve, reject) => {
      var DB;
      DB = require('../intershop/intershop_modules/db');
      await this._demo_stream();
      await DB._pool.end();
      urge('^445-1^', "pool ended");
      return resolve();
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  $parse = function(grammar) {
    return $(function(source, send) {
      var i, len, ref, results, token;
      ref = grammar.parse(source);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        token = ref[i];
        results.push(send(token));
      }
      return results;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  $mark_doc_boundaries = function() {
    return SP.window({
      width: 2,
      fallback: null
    }, $(function(cd, send) {
      var c, d;
      [c, d] = cd;
      if (!((c != null) && (d != null))) {
        return null;
      }
      if (d.$key === '<document') {
        if (c.$key === '>document') {
          send(freeze({
            $key: '^boundary'
          }));
        }
      } else if (!(d.$key === '>document')) {
        send(d);
      }
      return null;
    }));
  };

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

  INTERTEXT_show_text_ruler = function(text) {
    var block_idx, chr, chr_idx, chrs, color, colors, i, idx, j, len, piece, ref, ruler;
    echo(((function() {
      var i, results;
      results = [];
      for (idx = i = 0; i <= 19; idx = ++i) {
        results.push(`${idx * 10}`.padEnd(10, ' '));
      }
      return results;
    })()).join(''));
    // piece = '├┬┬┬┬┼┬┬┬┐'.replace /./g, ( $0, idx ) ->
    //   return if idx %% 2 is 0 then ( CND.reverse $0 ) else $0
    colors = [CND.yellow, CND.cyan, CND.pink];
    piece = ((CND.reverse(CND.yellow(' '))) + '░').repeat(10);
    piece = '█ ░ ░ ░ ░ ';
    echo(piece.repeat(20));
    chrs = [...(escape_text(text))];
    ruler = '';
    for (block_idx = i = 0, ref = chrs.length; i < ref; block_idx = i += +10) {
      color = colors[modulo(block_idx, colors.length)];
      for (chr_idx = j = 0, len = chrs.length; j < len; chr_idx = ++j) {
        chr = chrs[chr_idx];
        ruler += (modulo(chr_idx, 2)) === 0 ? CND.reverse(chr) : chr;
      }
    }
    echo(ruler);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_stream = function() {
    return new Promise(async(resolve, reject) => {
      var $concatenate_chunks, $extract_line, DB, chunkify_filter, pipeline, source, sql;
      DB = require('../intershop/intershop_modules/db');
      sql = "select * from MIRAGE.mirror where dsk = 'proposal' order by linenr;";
      //.........................................................................................................
      $extract_line = function() {
        return $(function(d, send) {
          return send(d.line);
        });
      };
      $concatenate_chunks = function() {
        var linenr, start;
        start = 0;
        linenr = 1;
        return $(function(chunk, send) {
          var chr_count, line_count, text;
          line_count = chunk.length;
          text = chunk.join('\n');
          chr_count = [...text].length;
          send(freeze({
            $key: '^chunk',
            text,
            linenr,
            start,
            line_count,
            chr_count
          }));
          linenr += line_count;
          return start += chr_count;
        });
      };
      chunkify_filter = function(d) {
        return /^\s*$/.test(d);
      };
      //.........................................................................................................
      source = (await DB.new_query_source(sql));
      pipeline = [];
      pipeline.push(source);
      pipeline.push($extract_line());
      pipeline.push(SP.$chunkify_keep(chunkify_filter));
      pipeline.push($concatenate_chunks());
      // pipeline.push $watch ( text ) -> urge rpr text
      pipeline.push($watch(function(d) {
        return INTERTEXT_show_text_ruler(d.text);
      }));
      // pipeline.push $parse RXWS.grammar
      // pipeline.push $mark_doc_boundaries()
      pipeline.push(SP.$show());
      pipeline.push($drain(function() {
        return (()/* NOTE must be function, not asyncfunction */ => {
          help('^445-7^', "stream ended");
          return resolve();
        })();
      }));
      SP.pull(...pipeline);
      // source.end()
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    return new Promise(async(resolve) => {
      var DISPLAY, me, pipeline, tokens;
      // debug '^4554^', rpr ( k for k of DATAMILL )
      DISPLAY = require('../../paragate/lib/display');
      me = {
        db: this.connect()
      };
      pipeline = [];
      tokens = RXWS.grammar.parse(source);
      await this._clear(me);
      pipeline.push(tokens);
      pipeline.push(this.$transform(me));
      pipeline.push($display(me));
      pipeline.push((await this.$async_tee_write_to_db_2(me)));
      pipeline.push($drain(() => {
        // await DB._pool.end() # unless pool.ended
        // PGP.end()       # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
        me.db.$pool.end(); // alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
        return resolve();
      }));
      SP.pull(...pipeline);
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await @demo()
      // await @_list()
      await this.demo_stream();
      // await @demo_inserts()
      help('ok');
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map