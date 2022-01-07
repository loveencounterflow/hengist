(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, Hdml, PATH, SQL, badge, debug, echo, equals, guy, hdml, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  /*

  Hypertext   HTMLish
  Database    DBay
  Markup      Manipulation
  Language    Library

  Hypertext+DB

  HTMLish DataMilL

  */
  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMO-HDML';

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
  Hdml = class Hdml {
    //-----------------------------------------------------------------------------------------------------------
    escape_text(text) {
      var R;
      R = text;
      R = R.replace(/&/g, '&amp;');
      R = R.replace(/</g, '&lt;');
      R = R.replace(/>/g, '&gt;');
      return R;
    }

    //-----------------------------------------------------------------------------------------------------------
    atr_value_as_text(x) {
      var R;
      R = isa.text(x) ? x : JSON.stringify(x);
      R = this.escape_text(R);
      R = R.replace(/'/g, '&#39;');
      R = R.replace(/\n/g, '&#10;');
      return `'${R}'`;
    }

    //-----------------------------------------------------------------------------------------------------------
    create_tag(sigil, tag, atrs = null) {
      switch (sigil) {
        case '<':
          return this._create_opening_or_selfclosing_tag(false, tag, atrs);
        case '^':
          return this._create_opening_or_selfclosing_tag(true, tag, atrs);
        case '>':
          return this.create_closing_tag(tag);
      }
      throw new Error(`^45487^ illegal sigil ${rpr(sigil)}`);
    }

    //-----------------------------------------------------------------------------------------------------------
    create_opening_tag(tag, atrs = null) {
      return this._create_opening_or_selfclosing_tag(false, tag, atrs);
    }

    create_selfclosing_tag(tag, atrs = null) {
      return this._create_opening_or_selfclosing_tag(true, tag, atrs);
    }

    //-----------------------------------------------------------------------------------------------------------
    _create_opening_or_selfclosing_tag(is_selfclosing, tag, atrs = null) {
      /* TAINT validate or escape tag, atr keys */
      var atrs_txt, k, s, v;
      s = is_selfclosing ? '/' : '';
      if ((atrs == null) || ((Object.keys(atrs)).length === 0)) {
        return `<${tag}${s}>`;
      }
      atrs_txt = ((function() {
        var results;
        results = [];
        for (k in atrs) {
          v = atrs[k];
          results.push(`${k}=${this.atr_value_as_text(v)}`);
        }
        return results;
      }).call(this)).join(' ');
      return `<${tag} ${atrs_txt}${s}>`;
    }

    //-----------------------------------------------------------------------------------------------------------
    /* TAINT validate or escape tag */
    create_closing_tag(tag) {
      return `</${tag}>`;
    }

  };

  hdml = new Hdml();

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_datamill = function(cfg) {
    var _append_tag, _insert_atr, _insert_atrid, _insert_doc, _insert_tag, db, doc;
    db = new DBay({
      path: '/dev/shm/demo-datamill.sqlite'
    });
    db(SQL`drop view  if exists next_free_aid;
drop table if exists atrs;
drop table if exists tags;
drop table if exists atrids;
drop table if exists docs;`);
    db(SQL`create table atrids ( atrid integer not null primary key );`);
    db(SQL`create table atrs (
    atrid integer not null references atrids,
    k     text not null,
    v     text not null,
  primary key ( atrid, k ) );`);
    db(SQL`create table tags (
    tid   integer not null primary key,
    sgl   text    not null,      -- sigil, one of \`<\`, \`>\`, \`^\`
    tag   text    not null,      -- use '$text' for text nodes
    atrid integer references atrids,
    text  text );`);
    db(SQL`create table docs (
    doc   integer not null,   -- references docs
    v2    integer not null,   -- VNR
    v3    integer not null,   -- VNR
    v4    integer not null,   -- VNR
    tid   integer not null references tags,
  primary key ( doc, v2, v3, v4 ) );`);
    //.........................................................................................................
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
    db.create_window_function({
      name: 'xxx_array_agg',
      varargs: false,
      deterministic: true,
      start: null,
      step: function(total, k, v) {
        if (k != null) {
          if (total == null) {
            total = {};
          }
          total[k] = v;
        }
        return total;
      },
      inverse: function(total, dropped) {
        if (total == null) {
          return null;
        }
        delete total[k];
        return total;
      },
      result: function(total) {
        if (total == null) {
          return '';
        }
        return JSON.stringify(total);
      }
    });
    //.........................................................................................................
    db.create_window_function({
      name: 'xxx_create_tag',
      varargs: false,
      deterministic: true,
      start: null,
      step: function(Σ, sgl, tag, k, v) {
        if (Σ == null) {
          Σ = {
            sgl,
            tag,
            atrs: {}
          };
        }
        if (k != null) {
          Σ.atrs[k] = v;
        }
        return Σ;
      },
      inverse: function(Σ, dropped) {
        if (Σ == null) {
          return null;
        }
        delete Σ.atrs[k];
        return Σ;
      },
      result: function(Σ) {
        if (Σ == null) {
          return '';
        }
        return hdml.create_tag(Σ.sgl, Σ.tag, Σ.atrs);
      }
    });
    //.........................................................................................................
    doc = 1;
    _append_tag = function(doc, sgl, tag, atrs = null, text = null) {
      var atrid, k, v;
      atrid = null;
      if (text != null) {
        validate.null(atrs);
      } else if (atrs != null) {
        validate.null(text);
        ({atrid} = db.first_row(_insert_atrid));
        for (k in atrs) {
          v = atrs[k];
          if (!isa.text(v)) {
            v = rpr(v);
          }
          info('^689-1^', db.first_row(_insert_atr, {atrid, k, v}));
        }
      }
      urge(db.first_row(_insert_tag, {doc, sgl, tag, atrid, text}));
      return null;
    };
    //.........................................................................................................
    _append_tag(1, '^', 'path', {
      id: 'c1',
      d: 'M100,100L200,200'
    });
    _append_tag(1, '<', 'div', {
      id: 'c1',
      class: 'foo bar'
    });
    _append_tag(1, '^', '$text', null, "helo");
    _append_tag(1, '>', 'div');
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from docs;`));
    console.table(db.all_rows(SQL`select * from tags;`));
    console.table(db.all_rows(SQL`select * from atrs;`));
    console.table(db.all_rows(SQL`select distinct
    t.tid                                                     as tid,
    t.sgl                                                     as sgl,
    t.tag                                                     as tag,
    t.atrid                                                   as atrid,
    case t.tag when '$text' then t.text
    else xxx_create_tag( t.sgl, t.tag, a.k, a.v ) over w end  as xxx
  from
    tags as t
    left join atrs as a using ( atrid )
  window w as (
    partition by t.tid
    order by a.k
    rows between unbounded preceding and unbounded following )
  order by tid;`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_html_generation = function() {
    urge('^574^', rpr(hdml.create_tag('<', 'foo')));
    urge('^574^', rpr(hdml.create_tag('<', 'foo', null)));
    urge('^574^', rpr(hdml.create_tag('<', 'foo', {})));
    urge('^574^', rpr(hdml.create_tag('<', 'foo', {
      a: 42,
      b: "'",
      c: '"'
    })));
    urge('^574^', rpr(hdml.create_tag('^', 'foo', {
      a: 42,
      b: "'",
      c: '"'
    })));
    urge('^574^', rpr(hdml.create_tag('^', 'prfx:foo', {
      a: 42,
      b: "'",
      c: '"'
    })));
    urge('^574^', rpr(hdml.create_tag('>', 'foo')));
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.demo_datamill();
    })();
  }

  // @demo_html_generation()

}).call(this);

//# sourceMappingURL=demo-html-in-sql.js.map