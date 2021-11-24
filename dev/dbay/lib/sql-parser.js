(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, f, guy, help, info, isa, quick_demo_1, quick_demo_2, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/OUTLINES/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  f = function() {
    var sql;
    sql = SQL`-- drop table if exists main.outlines;
-- drop table if exists main.fontnicks;
-- drop index if exists main.ads_location_idx;
-- drop table if exists main.ads;
-- drop table if exists main.lines;
-- ...................................................................................................
-- vacuum main;
-- ...................................................................................................
create table main.fontnicks (
    fontnick    text    not null,
    fspath      text    not null,
  primary key ( fontnick ) );
-- ...................................................................................................
create table main.outlines (
    fontnick  text    not null references fontnicks ( fontnick ),
    gid       integer not null,
    sid       text generated always as ( 'o' || gid || fontnick ) virtual,
    chrs      text,
    /* Shape ID (SID): */
    /* bounding box */
    x         float   not null,
    y         float   not null,
    x1        float   not null,
    y1        float   not null,
    /* PathData (PD): */
    pd        text generated always as ( drb_unzip( pd_blob ) ) virtual,
    pd_blob   blob    not null,
    primary key ( fontnick, gid ) );
-- ...................................................................................................
create table main.ads (
    id      integer not null primary key,
    doc     integer not null, -- document idx
    par     integer not null, -- paragraph idx
    adi     integer not null, -- arr. dat. idx
    sgi     integer not null, -- shape group idx, being a suite of ADs that must be reshaped if broken
    alt     integer not null, -- variant idx
    gid     integer,
    b       integer,
    x       integer not null,
    y       integer not null,
    dx      integer not null,
    dy      integer not null,
    lx      integer, -- line x, i.e. actual x when put onto the line
    x1      integer generated always as ( x + dx ) virtual not null,
    -- y1      integer generated always as ( y + dy ) virtual not null,
    chrs    text,
    sid     text, -- references main.outlines ( sid ) ??
    nobr    boolean not null, -- if true, must re-shape when separated from previous outline
    br      text
    );
-- ...................................................................................................
create unique index main.ads_location_idx on ads ( doc, par, adi, sgi, alt );
-- ...................................................................................................
create table main.line_ads (
    doc     integer not null, -- document idx  ### TAINT should be FK
    par     integer not null, -- paragraph idx ### TAINT should be FK
    lnr     integer not null,
    ads_id  integer not null references main.ads ( id ),
    primary key ( doc, par, lnr, ads_id )
    );
-- ...................................................................................................
create table main.lines (
    -- id      integer not null primary key,
    doc     integer not null, -- document idx  ### TAINT should be FK
    par     integer not null, -- paragraph idx ### TAINT should be FK
    lnr     integer default null, -- line number (from the left)
    rnr     integer default null, -- line number (from the right)
    x0      integer not null, -- x coord. of start-of-line (rel. to single line set by \`shape_text()\`)
    x1      integer not null, -- x coord. of end-of-line   (rel. to single line set by \`shape_text()\`)
    primary key ( doc, par, lnr )
    );`;
    return sql;
  };

  //-----------------------------------------------------------------------------------------------------------
  quick_demo_1 = function() {
    var ast, error, k, sql, sqliteParser;
    sqliteParser = require('/tmp/sql-parsing/sqlite-parser');
    sql = SQL`select pants from laundry;`;
    sql = SQL`create table x ( a integer foobar );`;
    sql = f();
    try {
      ast = sqliteParser(sql);
      debug(ast);
    } catch (error1) {
      error = error1;
      debug((function() {
        var results;
        results = [];
        for (k in error) {
          results.push(k);
        }
        return results;
      })());
      debug(error.expected);
      debug(error.found);
      debug(error.name);
      debug(error.location);
      debug(error.message);
    }
    // debug error.constructor
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  quick_demo_2 = function() {
    var Parser, ast, error, head, k, mid, parser, sql, tail;
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/bigquery'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/db2'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/flinksql'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/hive'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/mariadb'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/mysql'
    ({Parser} = require('/tmp/sql-parsing/node_modules/node-sql-parser/build/postgresql'));
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/sqlite'
    // { Parser }  = require '/tmp/sql-parsing/node_modules/node-sql-parser/build/transactsql'
    sql = SQL`create table x ( a integer foobar );`;
    sql = f();
    // lines       = sql.split '\n'
    parser = new Parser();
    try {
      ast = parser.astify(sql);
      debug(ast);
    } catch (error1) {
      error = error1;
      debug((function() {
        var results;
        results = [];
        for (k in error) {
          results.push(k);
        }
        return results;
      })());
      debug(error.message);
      debug(error.expected);
      // debug error.found
      debug(error.name);
      debug(error.location);
      head = sql.slice(0, error.location.start.offset);
      mid = sql.slice(error.location.start.offset, +error.location.end.offset + 1 || 9e9);
      tail = sql.slice(error.location.end.offset + 1);
      info((CND.blue(head)) + (CND.yellow(CND.reverse(mid))) + (CND.blue(tail)));
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return quick_demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=sql-parser.js.map