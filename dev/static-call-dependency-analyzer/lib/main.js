(function() {
  'use strict';
  var CND, Dba, PATH, Readlines, Scdadba, badge, debug, echo, freeze, glob, help, info, isa, lets, rpr, type_of, types, urge, validate, warn, whisper;

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types.export());

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

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.patterns = [
    ['method',
    /^\s*(?<atsign>@?)(?<name>[\w$]+):(?<tail>.*(?:->|=>).*)$/],
    // [ 'method',   /^\s*(?<atsign>@?)(?<name>[\w\$]+):(?<tail>.*)$/, ]
    ['function',
    /^\s*(?<atsign>@?)(?<name>[\w\$]+)\s*=\s*(?<tail>.*(?:->|=>).*)$/]
  ];

  //-----------------------------------------------------------------------------------------------------------
  this._groups_from_match = function(match) {
    var R, k, ref, v;
    R = {};
    ref = match.groups;
    for (k in ref) {
      v = ref[k];
      if ((v === '') || (v == null)) {
        continue;
      }
      R[k] = v;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    var atsign, dba, i, j, len, len1, line, lnr, match, name, path, pattern, prefix, readlines, ref, ref1, row, schema, short_path, source_glob, source_paths, tag, tail;
    schema = 'scda';
    prefix = PATH.resolve(PATH.join(__dirname, '../../../../icql-dba/src'));
    // prefix        = PATH.resolve PATH.join __dirname, '../src'
    source_glob = PATH.join(prefix, '*.coffee');
    source_paths = glob.sync(source_glob);
    dba = new Scdadba({schema, prefix});
//.........................................................................................................
    for (i = 0, len = source_paths.length; i < len; i++) {
      path = source_paths[i];
      short_path = dba.$add_path({path});
      if (!/import/.test(path)) {
        continue;
      }
      debug('^4445^', path);
      readlines = new Readlines(path);
      lnr = 0;
      //.......................................................................................................
      while ((line = readlines.next()) !== false) {
        lnr++;
        line = line.toString('utf-8');
        if (/^\s*$/.test(line)) { // exclude blank lines
          //.....................................................................................................
          continue;
        }
        if (/^\s*#/.test(line)) { // exclude some comments
          continue;
        }
        dba.$add_line({short_path, lnr, line});
        ref = this.patterns;
        //.....................................................................................................
        for (j = 0, len1 = ref.length; j < len1; j++) {
          [tag, pattern] = ref[j];
          if ((match = line.match(pattern)) == null) {
            continue;
          }
          debug('^4336^', tag, line);
          ({atsign, name, tail} = this._groups_from_match(match));
          // info '^342^', { lnr, tag, groups, }
          dba.$add_def({short_path, lnr, tag, atsign, name, tail});
          break;
        }
      }
    }
    ref1 = dba.query("select * from scda.paths order by path;");
    for (row of ref1) {
      //.........................................................................................................
      urge('^3344^', row);
    }
    // help '^3344^', row for row from dba.query """
    //   select * from scda.lines
    //   where true
    //     -- and ( lnr between 111 and 123 )
    //     -- and ( line != '' )
    //   order by short_path, lnr;"""
    // console.table [ ( dba.query "select short_path, lnr, name from scda.defs order by name;" )..., ]
    console.table([...(dba.query("select short_path, lnr, tag, name, tail from scda.defs order by name;"))]);
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_lexer = function() {
    var CS, cnr, collector, d, flush, i, len, lines, lnr, match_tokenline, name, patterns, push, ref, register, registry, source, text;
    CS = require('coffeescript');
    source = `@foo = -> 42
@foo = f = -> 42
@foo = => 42
@foo = () -> 42
@foo = () => 42
@foo = ( x ) -> x * x
@foo = ( x ) => x * x
@foo = ( x = 42 ) => x * x
@foo = ( x = f 42 ) => x * x
@foo = ( x, y ) -> x * y
@foo = ( x, f = ( a ) -> a ) -> f x
@foo()
@foo value
@foo value, value, value
@foo value, @bar value
@foo value, ( @bar value ), value
@foo value, ( blah.bar value ), value
foo = -> 42
foo = f = -> 42
foo = => 42
foo = () -> 42
foo = () => 42
foo = ( x ) -> x * x
foo = ( x ) => x * x
foo = ( x = 42 ) => x * x
foo = ( x = f 42 ) => x * x
foo = ( x, y ) -> x * y
foo = ( x, f = ( a ) -> a ) -> f x
foo()
foo value
foo value, value, value
foo value, @bar value
foo value, ( @bar value ), value
foo value, ( blah.bar value ), value`;
    // @foo = ( x )
    // @foo 42
    // @foo g 42
    // f 3

    // source = "a = 42"
    // source = "a = -> 42"
    // source = "@a 42"
    //-----------------------------------------------------------------------------------------------------------
    lines = source.split(/\n/);
    lnr = null;
    collector = null;
    registry = [];
    patterns = [['definition', /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:(?:->|=>)#/], ['definition', /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:param_start#/], ['definition', /#(?<tnr>\d+):identifier#\d+:=#\d+:(?:->|=>)#/], ['definition', /#(?<tnr>\d+):identifier#\d+:=#\d+:param_start#/], ['call', /#(?<tnr>\d+):@#\d+:property#\d+:call_start#/], ['call', /#(?<tnr>\d+):identifier#\d+:call_start#/]];
    //-----------------------------------------------------------------------------------------------------------
    match_tokenline = function(tokenline) {
      var count, d0, d1, i, len, match, name, pattern, pattern_idx, tag, tnr;
      count = 0;
      for (pattern_idx = i = 0, len = patterns.length; i < len; pattern_idx = ++i) {
        [tag, pattern] = patterns[pattern_idx];
        if ((match = tokenline.match(pattern)) == null) {
          continue;
        }
        count++;
        tnr = parseInt(match.groups.tnr, 10);
        d0 = registry[tnr];
        d1 = registry[tnr + 1];
        if (d0.text === '@') {
          name = d0.text + d1.text;
        } else {
          name = d0.text;
        }
        help(pattern_idx, CND.reverse(` ${tag} ${name} `));
      }
      if (count === 0) {
        return warn(CND.reverse(" no match "));
      }
    };
    // break
    //-----------------------------------------------------------------------------------------------------------
    register = function(d) {
      registry.push(d);
      return registry.length - 1;
    };
    //-----------------------------------------------------------------------------------------------------------
    push = function(d) {
      var tnr;
      tnr = register(d);
      (collector != null ? collector : collector = []).push(`${tnr}:${d.name}`);
      return null;
    };
    //-----------------------------------------------------------------------------------------------------------
    flush = function() {
      var ref, tokenline;
      if (!(((ref = collector != null ? collector.length : void 0) != null ? ref : 0) > 0)) {
        return null;
      }
      tokenline = '#' + (collector.join('#')) + '#';
      help(rpr(lines[lnr - 1]));
      urge(tokenline);
      match_tokenline(tokenline);
      collector = null;
      return null;
    };
    ref = CS.tokens(source);
    //-----------------------------------------------------------------------------------------------------------
    for (i = 0, len = ref.length; i < len; i++) {
      [name, text, d] = ref[i];
      // { range: [ 0, 1 ], first_line: 0, first_column: 0, last_line: 0, last_column: 0, last_line_exclusive: 0, last_column_exclusive: 1 }
      lnr = d.first_line + 1;
      cnr = d.first_column + 1;
      name = name.toLowerCase();
      switch (name) {
        case 'indent':
        case 'outdent':
          null;
          break;
        case 'terminator':
          flush();
          info();
          break;
        default:
          push({lnr, name, text});
      }
    }
    // info lnr, { name, text, }
    flush();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await @demo()
      return this.demo_lexer();
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map