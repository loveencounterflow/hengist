(function() {
  'use strict';
  var CND, Dba, PATH, Readlines, Tokenwalker, badge, debug, declare, def, defaults, echo, freeze, glob, help, info, isa, lets, rpr, type_of, types, urge, validate, warn, whisper;

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

  ({declare, defaults, isa, type_of, validate} = types.export());

  ({Tokenwalker} = require('./tokenwalker'));

  def = Object.defineProperty;

  //===========================================================================================================
  declare('sc_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.nonempty_text x.schema": function(x) {
        return this.isa.nonempty_text(x.schema);
      },
      "@isa_optional.nonempty_text x.prefix": function(x) {
        return this.isa_optional.nonempty_text(x.prefix);
      },
      "@isa.list x.ignore_names": function(x) {
        return this.isa.list(x.ignore_names);
      },
      "@isa.list x.ignore_short_paths": function(x) {
        return this.isa.list(x.ignore_short_paths);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults.sc_cfg = {
    schema: 'scda',
    ignore_names: [],
    ignore_short_paths: []
  };

  //===========================================================================================================
  this.Scda = class Scda {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var prefix, schema;
      // super()
      /* TAINT add validation, defaults */
      this.cfg = {...defaults.sc_cfg, ...cfg};
      validate.sc_cfg(this.cfg);
      ({schema, prefix} = cfg);
      if ((prefix != null) && !prefix.endsWith('/')) {
        prefix = `${prefix}/`;
      }
      /* TAINT make globbing configurable */
      /* TAINT allow to pass in list of paths */
      this._source_glob = PATH.join(prefix, '*.coffee');
      this.cfg.ignore_names = new Set(this.cfg.ignore_names);
      this.cfg.ignore_short_paths = new Set(this.cfg.ignore_short_paths);
      this.cfg = freeze({...this.cfg, schema, prefix});
      def(this, 'dba', {
        enumerable: false,
        value: new Dba()
      });
      this.dba.open({
        schema,
        ram: true
      });
      this._schema_i = this.dba.as_identifier(schema);
      this.init_db();
      //.......................................................................................................
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    init_db() {
      /* TAINT short_path might not be unique */
      /* TAINT use mirage schema with VNRs, refs */
      return this.dba.execute(`-- ---------------------------------------------------------------------------------------------------
create table ${this._schema_i}.paths (
    short_path  text unique not null,
    path        text primary key );
-- ---------------------------------------------------------------------------------------------------
create table ${this._schema_i}.occurrences (
    short_path  text    not null,
    lnr         integer not null,
    type        text not null,
    role        text not null,
    name        text not null,
  primary key ( short_path, lnr ) );`);
    }

    // -- ---------------------------------------------------------------------------------------------------
    // create table #{@_schema_i}.lines (
    //     short_path  text    not null,
    //     lnr         integer not null,
    //     line        text    not null,
    //   primary key ( short_path, lnr ) );

      //---------------------------------------------------------------------------------------------------------
    add_path(cfg) {
      var path, short_path;
      ({path} = cfg);
      if ((this.cfg.prefix != null) && path.startsWith(this.cfg.prefix)) {
        short_path = path.slice(this.cfg.prefix.length);
      }
      if (this.cfg.ignore_short_paths.has(short_path)) {
        return null;
      }
      this.dba.run(`insert into ${this._schema_i}.paths ( short_path, path ) values ( $short_path, $path );`, {short_path, path});
      return short_path;
    }

    // #---------------------------------------------------------------------------------------------------------
    // $add_line: ( cfg ) ->
    //   ### TAINT short_path might not be unique ###
    //   { short_path
    //     lnr
    //     line } = cfg
    //   @dba.run """
    //     insert into #{@_schema_i}.lines ( short_path, lnr, line )
    //       values ( $short_path, $lnr, $line );""", \
    //     { short_path, lnr, line, }
    //   return null

      //---------------------------------------------------------------------------------------------------------
    add_occurrence(cfg) {
      /* TAINT short_path might not be unique */
      /* TAINT code duplication */
      /* TAINT use prepared statement */
      var lnr, name, role, short_path, type;
      ({short_path, lnr, type, role, name} = cfg);
      this.dba.run(`insert into ${this._schema_i}.occurrences ( short_path, lnr, type, role, name )
  values ( $short_path, $lnr, $type, $role, $name );`, {short_path, lnr, type, role, name});
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    add_sources() {
      return this._add_sources_line_by_line();
    }

    //---------------------------------------------------------------------------------------------------------
    _add_sources_line_by_line() {
      var cnr, d, error, i, len, line, lnr, name, path, readlines, ref, role, short_path, source_paths, tokenwalker, type;
      source_paths = glob.sync(this._source_glob);
//.......................................................................................................
      for (i = 0, len = source_paths.length; i < len; i++) {
        path = source_paths[i];
        short_path = this.add_path({path});
        if (short_path == null) {
          continue;
        }
        debug('^4445^', path);
        readlines = new Readlines(path);
        lnr = 0;
        //.....................................................................................................
        while ((line = readlines.next()) !== false) {
          lnr++;
          line = line.toString('utf-8');
          if (/^\s*$/.test(line)) { // exclude blank lines
            //...................................................................................................
            continue;
          }
          if (/^\s*#/.test(line)) { // exclude some comments
            continue;
          }
          // @$add_line { short_path, lnr, line, }
          tokenwalker = new Tokenwalker({
            lnr,
            source: line
          });
          try {
            ref = tokenwalker.walk();
            // debug '^4433^', tokenwalker
            //...................................................................................................
            for (d of ref) {
              debug('^33343^', d);
              ({lnr, cnr, type, name, role} = d);
              if (this.cfg.ignore_names.has(name)) {
                continue;
              }
              this.add_occurrence({short_path, lnr, type, role, name});
            }
          } catch (error1) {
            //...................................................................................................
            error = error1;
            if (error.name !== 'SyntaxError') {
              throw error;
            }
            /* TAINT add to table `errors` or similar */
            warn(`^4476^ skipping line ${lnr} of ${short_path} because of syntax error: ${rpr(line)}`);
            continue;
          }
        }
      }
      //.......................................................................................................
      return null;
    }

  };

}).call(this);

//# sourceMappingURL=main.js.map