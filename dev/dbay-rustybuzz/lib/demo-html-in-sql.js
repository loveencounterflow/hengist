(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMO-MIRAGE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  ({DBay} = require(H.dbay_path));

  ({Drb} = require(H.drb_path));

  // { Mrg }                   = require PATH.join H.drb_path, 'lib/_mirage'
  ({width_of, to_width} = require('to-width'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_jsdom = function(cfg) {
    var _append_tag, _insert_atr, _insert_atrid, _insert_doc, _insert_tag, db, doc;
    db = new DBay({
      path: '/dev/shm/demo-html-in-sql.sqlite'
    });
    db(SQL`drop view  if exists next_free_aid;
drop table if exists atrids;
drop table if exists atrs;
drop table if exists tags;
drop table if exists docs;`);
    db(SQL`create table atrids ( atrid integer not null primary key );`);
    db(SQL`create table atrs (
    atrid integer not null,
    k     text not null,
    v     text not null,
  primary key ( atrid, k ),
  foreign key ( atrid ) references atrids );`);
    db(SQL`create table tags (
    tid   integer not null primary key,
    sgl   text not null,      -- sigil, one of \`<\`, \`>\`, \`^\`
    tag   text not null,      -- use '$text' for text nodes
    atrid integer,
  foreign key ( atrid ) references atrids );`);
    db(SQL`create table docs (
    doc   integer not null,   -- references docs
    v2    integer not null,   -- VNR
    v3    integer not null,   -- VNR
    v4    integer not null,   -- VNR
    tid   integer not null references tags,
  primary key ( doc, v2, v3, v4 ) );`);
    _insert_atrid = db.prepare_insert({
      into: 'atrids',
      returning: '*',
      exclude: ['atrid']
    });
    _insert_tag = db.prepare_insert({
      into: 'tags',
      returning: '*',
      exclude: ['tid']
    });
    _insert_atr = db.prepare_insert({
      into: 'atrs',
      returning: '*'
    });
    _insert_doc = db.prepare_insert({
      into: 'docs',
      returning: '*'
    });
    //.........................................................................................................
    doc = 1;
    _append_tag = function(doc, sgl, tag, atrs) {
      var atrid, k, v;
      atrid = null;
      if (atrs != null) {
        ({atrid} = db.first_row(_insert_atrid()));
        for (k in atrs) {
          v = atrs[k];
          if (!isa.text(v)) {
            v = rpr(v);
          }
          info('^689-1^', db.first_row(_insert_atr, {atrid, k, v}));
        }
      }
      urge(db.first_row(_insert_tag, {doc, sgl, tag, atrid}));
      return null;
    };
    _append_tag(1, '<', 'div', {
      id: 'c1',
      class: ['foo', 'bar']
    });
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from docs;`));
    console.table(db.all_rows(SQL`select * from tags;`));
    console.table(db.all_rows(SQL`select * from atrs;`));
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.demo_jsdom();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-html-in-sql.js.map