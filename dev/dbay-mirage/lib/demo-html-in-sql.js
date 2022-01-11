(function() {
  'use strict';
  var CND, DBay, FS, HDML, PATH, SQL, badge, banner, debug, echo, equals, guy, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

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

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  ({DBay} = require('../../../apps/dbay'));

  ({width_of, to_width} = require('to-width'));

  ({HDML} = require('../../../apps/hdml'));

  //-----------------------------------------------------------------------------------------------------------
  banner = function(title) {
    return echo(CND.reverse(CND.steel(to_width(' ' + title + ' ', 50))));
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_datamill = function(cfg) {
    var _append_tag, _insert_atr, _insert_atrid, _insert_content, _insert_datasource, db, dsk, render_dsk;
    db = new DBay({
      path: '/dev/shm/demo-datamill.sqlite'
    });
    db.create_stdlib();
    db(SQL`drop view  if exists tags_and_html;
drop table if exists atrs;
drop table if exists mirror;
drop table if exists atrids;
drop table if exists datasources;`);
    db(SQL`create table atrids (
    atrid integer not null,
  primary key ( atrid ) );`);
    db(SQL`create table atrs (
    atrid integer not null,
    k     text    not null,
    v     text    not null,
  primary key ( atrid, k ),
  foreign key ( atrid ) references atrids );`);
    db(SQL`create table mirror (
    dsk   text    not null,
    tid   integer not null,
    sgl   text    not null,      -- sigil, one of \`<\`, \`>\`, \`^\`
    tag   text    not null,      -- use '$text' for text nodes
    atrid integer,
    text  text,
  primary key ( dsk, tid ),
  foreign key ( dsk   ) references datasources,
  foreign key ( atrid ) references atrids );`);
    db(SQL`create table datasources (
    dsk     text not null,
    url     text not null,
    digest  text default null,
  primary key ( dsk ) );`);
    // -- create table #{prefix}_datasources (
    db(SQL`create view tags_and_html as select distinct
    t.tid                                                     as tid,
    t.sgl                                                     as sgl,
    t.tag                                                     as tag,
    t.atrid                                                   as atrid,
    case t.tag when '$text' then t.text
    else xxx_create_tag( t.sgl, t.tag, a.k, a.v ) over w end  as xxx
  from
    mirror as t
    left join atrs as a using ( atrid )
  where true
    and ( t.dsk = std_getv( 'dsk' ) )
  window w as (
    partition by t.tid
    order by a.k
    rows between unbounded preceding and unbounded following )
  order by tid;`);
    //.........................................................................................................
    _insert_atrid = db.prepare_insert({
      into: 'atrids',
      returning: '*',
      exclude: ['atrid']
    });
    /* NOTE we don't use `autoincrement` b/c this is the more general solution; details will change when the
     VNR gets more realistic (dsk, linenr, ...) */
    // _insert_content     = db.prepare_insert { into: 'mirror',       returning: '*', exclude: [ 'tid', ], }
    _insert_content = db.prepare(SQL`with v1 as ( select coalesce( max( tid ), 0 ) + 1 as tid from mirror where dsk = $dsk )
insert into mirror ( dsk, tid, sgl, tag, atrid, text )
  values ( $dsk, ( select tid from v1 ), $sgl, $tag, $atrid, $text )
  returning *;`);
    _insert_atr = db.prepare_insert({
      into: 'atrs',
      returning: null
    });
    _insert_datasource = db.prepare_insert({
      into: 'datasources',
      returning: '*'
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
        return HDML.create_tag(Σ.sgl, Σ.tag, Σ.atrs);
      }
    });
    //.........................................................................................................
    _append_tag = function(dsk, sgl, tag, atrs = null, text = null) {
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
          _insert_atr.run({atrid, k, v});
        }
      }
      urge(db.first_row(_insert_content, {dsk, sgl, tag, atrid, text}));
      return null;
    };
    //.........................................................................................................
    render_dsk = function(cfg) {
      var dsk;
      ({dsk} = cfg);
      db.setv('dsk', dsk);
      return (db.all_first_values(SQL`select xxx from tags_and_html;`)).join('');
    };
    //.........................................................................................................
    dsk = 'demo';
    _insert_datasource.run({
      dsk,
      url: 'ram:',
      digest: null
    });
    _append_tag(dsk, '^', 'path', {
      id: 'c1',
      d: 'M100,100L200,200'
    });
    _append_tag(dsk, '<', 'div', {
      id: 'c1',
      class: 'foo bar'
    });
    _append_tag(dsk, '^', '$text', null, "helo");
    _append_tag(dsk, '>', 'div');
    _append_tag(dsk, '^', 'mrg:loc#baselines');
    //.........................................................................................................
    db.setv('dsk', 'demo');
    banner("datasources");
    console.table(db.all_rows(SQL`select * from datasources;`));
    banner("mirror");
    console.table(db.all_rows(SQL`select * from mirror;`));
    banner("atrs");
    console.table(db.all_rows(SQL`select * from atrs;`));
    banner("std_variables()");
    console.table(db.all_rows(SQL`select * from std_variables();`));
    banner("tags_and_html");
    console.table(db.all_rows(SQL`select * from tags_and_html;`));
    banner("render_dsk");
    info(rpr(render_dsk({dsk})));
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