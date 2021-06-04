(function() {
  'use strict';
  var CND, Dba, PATH, Readlines, Scda, Tokenwalker, badge, debug, echo, freeze, glob, help, info, isa, lets, rpr, type_of, types, urge, validate, warn, whisper;

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

  types = require('../../../apps/scda/lib/types');

  ({isa, type_of, validate} = types.export());

  ({Tokenwalker} = require('../../../apps/scda/lib/tokenwalker'));

  ({Scda} = require('../../../apps/scda'));

  //-----------------------------------------------------------------------------------------------------------
  this.demo_scda = function() {
    var dependencies, ignore_names, ignore_spaths, prefix, scda, schema;
    schema = 'scda';
    prefix = PATH.resolve(PATH.join(__dirname, '../../../../icql-dba/src'));
    // prefix            = PATH.resolve PATH.join __dirname, '../src'
    ignore_names = ['rpr', 'get_logger', 'require', 'isa', 'type_of', 'text', 'list', 'nonempty_text', 'object', 'cardinal', 'bind'];
    ignore_spaths = ['types.coffee', 'common.coffee', 'errors.coffee'];
    dependencies = ['main.coffee', 'import-export-mixin.coffee', 'sql-mixin.coffee'];
    scda = new Scda({
      schema,
      prefix,
      ignore_names,
      ignore_spaths,
      dependencies,
      verbose: false
    });
    // info '^334^', scda
    //.........................................................................................................
    scda.add_sources();
    // console.table [ ( scda.dba.query "select * from scda.paths order by path;" )..., ]
    // console.table [ ( scda.dba.query "select * from scda.occurrences where role = 'call' order by name, spath, lnr, cnr;" )..., ]
    // console.table [ ( scda.dba.query "select * from scda.occurrences where role = 'def' order by name, spath, lnr, cnr;" )..., ]
    console.table([...(scda.dba.query("select * from scda.dependencies;"))]);
    console.table([...scda.walk_level_violations()]);
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_tokenwalker = function() {
    var d, ref, source, tokenwalker;
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
foo value, ( blah.bar value ), value
@foo = -> 42
foo value
foo value, value, value; bar = ->
some.object.f = -> x
some.object.f x
foo: ->
foo: ( x ) ->`;
    tokenwalker = new Tokenwalker({
      lnr: 0,
      source,
      verbose: true
    });
    ref = tokenwalker.walk();
    // debug '^4433^', tokenwalker
    for (d of ref) {
      // whisper '^333443^', tokenwalker
      info('^333443^', d);
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_scda();
    })();
  }

  // @demo_tokenwalker()

}).call(this);

//# sourceMappingURL=demo.js.map