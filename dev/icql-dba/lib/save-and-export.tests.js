(function() {
  'use strict';
  var CND, H, PATH, badge, debug, demo_tempy, echo, help, info, isa, rpr, test, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/BASICS';

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

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  ({to_width} = require('to-width'));

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: save()"] = async function(T, done) {
    var Dba, cfg, template_path_1, template_path_2, work_path_1, work_path_2, work_path_3;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    //.........................................................................................................
    cfg = H.get_cfg();
    cfg.ref = 'save-export';
    //.........................................................................................................
    cfg.size = 'small';
    cfg.mode = 'fle';
    template_path_1 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_1 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_1:  ", work_path_1);
    //.........................................................................................................
    cfg.size = 'big';
    cfg.mode = 'fle';
    template_path_2 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_2 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_2:  ", work_path_2);
    //.........................................................................................................
    cfg.size = 'new';
    cfg.mode = 'fle';
    work_path_3 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_3:  ", work_path_3);
    await (async() => {      //.........................................................................................................
      var dba, path, schema;
      path = work_path_1;
      schema = 's1';
      await H.copy_over(template_path_1, path);
      dba = new Dba();
      dba.open({path, schema});
      debug('^74487^', {template_path_1});
      debug('^74487^', {path});
      return debug('^74487^', dba.sqlt);
    })();
    //   T.eq dba.get_schemas(), { main: '', s1: path, }
    //   T.eq ( dba.is_empty { schema: 'main', } ), true
    //   T.eq ( dba.is_empty { schema: 's1', } ), false
    //   T.eq ( d.name for d from dba.walk_objects { schema, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
    // #.........................................................................................................
    // await do =>
    //   path    = work_path_1
    //   schema  = 'foo'
    //   await H.copy_over template_path_1, path
    //   dba     = new Dba()
    //   dba.open { path, schema, }
    //   help '^298789^', dba.get_schemas()
    //   T.eq dba.get_schemas(), { main: '', [schema]: path, }
    //   T.eq dba.is_empty { schema: 'main', }, true
    //   T.eq dba.is_empty { schema, }, false
    //   T.eq ( d.name for d from dba.walk_objects { schema, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
    // #.........................................................................................................
    // await do =>
    //   schema_1  = 'datamill'
    //   schema_2  = 'chinook'
    //   await H.copy_over template_path_1, work_path_1
    //   await H.copy_over template_path_2, work_path_2
    //   dba       = new Dba { path: work_path_1, schema: schema_1, }
    //   debug '^567^', dba
    //   debug '^567^', ( k for k of dba )
    //   debug '^567^', dba.open { path: work_path_2, schema: schema_2, }
    //   help '^58733^', dba.get_schemas()
    //   # T.eq dba.get_schemas(), { main: '', [schema]: path, }
    //   T.eq dba.is_empty { schema: 'main', }, true
    //   T.eq dba.is_empty { schema: schema_1, }, false
    //   T.eq dba.is_empty { schema: schema_2, }, false
    //   T.eq ( d.name for d from dba.walk_objects { schema: schema_1, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
    // #.........................................................................................................
    // await do =>
    //   ### use `Dba.open()` without arguments, get empty RAM DB in schema `main` ###
    //   schema_1  = 'datamill'
    //   schema_2  = 'chinook'
    //   schema_3  = 'new'
    //   await H.copy_over template_path_1, work_path_1
    //   await H.copy_over template_path_2, work_path_2
    //   await H.try_to_remove_file work_path_3
    //   dba       = new Dba()
    //   dba.open { path: work_path_1, schema: schema_1, }
    //   dba.open { path: work_path_2, schema: schema_2, }
    //   dba.open { path: work_path_3, schema: schema_3, }
    //   help '^58733^', dba.get_schemas()
    //   # T.eq dba.get_schemas(), { main: '', [schema]: path, }
    //   T.eq dba.is_empty { schema: 'main', }, true
    //   T.eq dba.is_empty { schema: schema_1, }, false
    //   T.eq dba.is_empty { schema: schema_2, }, false
    //   T.eq ( d.name for d from dba.walk_objects { schema: schema_1, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
    //   dba.execute "create table new.t ( id integer );"
    //   dba.execute "insert into new.t values ( #{n} );" for n in [ 1 .. 9 ]
    //   T.eq ( dba.list dba.first_values dba.query "select * from new.t;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
    // #.........................................................................................................
    // await do =>
    //   ### test whether data from previous test was persisted ###
    //   schema_3  = 'new'
    //   dba       = new Dba()
    //   dba.open { path: work_path_3, schema: schema_3, }
    //   T.eq ( dba.list dba.first_values dba.query "select * from new.t;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
    // #.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["dba has associated property path"] = function(T, done) {
    var Dba, TMP, trash;
    T.halt_on_error();
    trash = require('trash');
    TMP = require('tempy');
    ({Dba} = require('../../../apps/icql-dba'));
    (async() => {      //.........................................................................................................
      var dba, path;
      try {
        path = TMP.file({
          extension: 'db'
        });
        help(`^4758^ opening DB at ${rpr(path)}`);
        dba = new Dba({path});
        debug('^868943^', dba);
        T.eq(dba._schemas.main.path, path);
      } finally {
        warn(`removing ${path}`);
        await trash(path);
        /* NOTE `trash` command is async, consider to `await` */        warn(`... done removing ${path}`);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var dba, path;
      path = '';
      dba = new Dba({path});
      debug('^868943^', dba);
      T.eq(dba._schemas.main.path, path);
      return null;
    })();
    (() => {      //.........................................................................................................
      var dba, path;
      path = ':memory:';
      dba = new Dba({path});
      debug('^868943^', dba);
      T.eq(dba._schemas.main.path, path);
      return null;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tempy = function() {
    var TMP, do_work, tmpdir_path, trash;
    trash = require('trash');
    TMP = require('tempy');
    tmpdir_path = null;
    // debug path = TMP.file { name: 'abc.db', }
    // debug path = TMP.file { name: 'abc.db', }
    // debug path = TMP.file { name: 'abc.db', }
    do_work = function(tmpdir_path) {
      info({tmpdir_path});
      FS.writeFileSync(PATH.join(tmpdir_path, 'somefile.db'), 'text');
      info(glob.sync(PATH.join(tmpdir_path, '**')));
      return 42;
    };
    try {
      help('before');
      debug(tmpdir_path = TMP.directory({
        name: 'abc.db'
      }));
      help(do_work(tmpdir_path));
      help('after');
    } finally {
      warn(`removing ${tmpdir_path}`);
      trash(tmpdir_path);
    }
/* NOTE `trash` command is async, consider to `await` */    return tmpdir_path;
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    // test @[ "DBA: save()" ]
    test(this["dba has associated property path"]);
  }

}).call(this);

//# sourceMappingURL=save-and-export.tests.js.map