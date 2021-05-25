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

  types = require('./types');

  ({isa, type_of, validate} = types.export());

  ({Tokenwalker} = require('./tokenwalker'));

  ({Scda} = require('..'));

  //-----------------------------------------------------------------------------------------------------------
  this.demo_scda = function() {
    var ignore_names, ignore_short_paths, prefix, scda, schema;
    schema = 'scda';
    prefix = PATH.resolve(PATH.join(__dirname, '../../../../icql-dba/src'));
    // prefix            = PATH.resolve PATH.join __dirname, '../src'
    ignore_names = ['rpr', 'require'];
    ignore_short_paths = ['types.coffee', 'common.coffee', 'errors.coffee'];
    scda = new Scda({schema, prefix, ignore_names, ignore_short_paths});
    info('^334^', scda);
    //.........................................................................................................
    scda.add_sources();
    console.table([...(scda.dba.query("select * from scda.paths order by path;"))]);
    // help '^3344^', row for row from scda.dba.query """
    //   select * from scda.lines
    //   where true
    //     -- and ( lnr between 111 and 123 )
    //     -- and ( line != '' )
    //   order by short_path, lnr;"""
    // console.table [ ( scda.dba.query "select short_path, lnr, name from scda.defs order by name;" )..., ]
    // console.table [ ( scda.dba.query "select short_path, lnr, type, role, name from scda.occurrences order by name;" )..., ]
    // console.table [ ( scda.dba.query "select * from scda.occurrences order by name;" )..., ]
    console.table([...(scda.dba.query("select * from scda.occurrences order by 1, 2, 3, 4;"))]);
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
some.object.f x`;
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
      // @demo_lexer()
      return this.demo_scda();
    })();
  }

  // @demo_tokenwalker()

}).call(this);

//# sourceMappingURL=demo.js.map