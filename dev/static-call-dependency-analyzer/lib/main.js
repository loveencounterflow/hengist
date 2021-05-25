(function() {
  'use strict';
  var CND, Dba, PATH, Readlines, Scdadba, Tokenwalker, badge, debug, echo, freeze, glob, help, info, isa, lets, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SCDA';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  ({Dba} = require('../../../apps/icql-dba'));

  Readlines = require('n-readlines');

  glob = require('glob');

  ({freeze, lets} = require('letsfreezethat'));

  types = require('./types');

  ({isa, type_of, validate} = types.export());

  ({Tokenwalker} = require('./tokenwalker'));

  //===========================================================================================================
  Scdadba = class Scdadba extends Dba {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      /* TAINT add validation, defaults */
      var prefix, schema, schema_i;
      super();
      ({schema, prefix} = cfg);
      schema_i = this.as_identifier(schema);
      if (!prefix.endsWith('/')) {
        prefix += '/';
      }
      this.cfg = freeze({...this.cfg, schema, schema_i, prefix});
      //.......................................................................................................
      this.open({
        schema,
        ram: true
      });
      /* TAINT short_path might not be unique */
      /* TAINT use mirage schema with VNRs, refs */
      this.execute(`-- ---------------------------------------------------------------------------------------------------
create table ${schema_i}.paths (
    short_path  text unique not null,
    path        text primary key );
-- ---------------------------------------------------------------------------------------------------
create table ${schema_i}.lines (
    short_path  text    not null,
    lnr         integer not null,
    line        text    not null,
  primary key ( short_path, lnr ) );
-- ---------------------------------------------------------------------------------------------------
create table ${schema_i}.defs (
    short_path  text    not null,
    lnr         integer not null,
    tag         text not null,
    atsign      text,
    name        text not null,
    tail        text,
  primary key ( short_path, lnr ) );`);
      //.......................................................................................................
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    $add_path(cfg) {
      var path, short_path;
      ({path} = cfg);
      if (path.startsWith(this.cfg.prefix)) {
        short_path = path.slice(this.cfg.prefix.length);
      }
      this.run(`insert into ${this.cfg.schema_i}.paths ( short_path, path ) values ( $short_path, $path );`, {short_path, path});
      return short_path;
    }

    //---------------------------------------------------------------------------------------------------------
    $add_line(cfg) {
      /* TAINT short_path might not be unique */
      var line, lnr, short_path;
      ({short_path, lnr, line} = cfg);
      this.run(`insert into ${this.cfg.schema_i}.lines ( short_path, lnr, line )
  values ( $short_path, $lnr, $line );`, {short_path, lnr, line});
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    $add_def(cfg) {
      /* TAINT short_path might not be unique */
      var atsign, lnr, name, short_path, tag, tail;
      ({short_path, lnr, tag, atsign, name, tail} = cfg);
      this.run(`insert into ${this.cfg.schema_i}.defs ( short_path, lnr, tag, atsign, name, tail )
  values ( $short_path, $lnr, $tag, $atsign, $name, $tail );`, {short_path, lnr, tag, atsign, name, tail});
      return null;
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {})();
  }

  // await @demo()
// @demo_lexer()
// @demo_tokenwalker()

}).call(this);

//# sourceMappingURL=main.js.map