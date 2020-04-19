(function() {
  'use strict';
  var CND, FS, PATH, alert, assign, badge, cast, debug, defaults, echo, help, info, isa, jr, log, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/CLI';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  FS = require('fs');

  PATH = require('path');

  ({assign, jr} = CND);

  // { walk_cids_in_cid_range
  //   cwd_abspath
  //   cwd_relpath
  //   here_abspath
  //   _drop_extension
  //   project_abspath }       = require './helpers'
  types = require('./types');

  ({isa, validate, cast, defaults, type_of} = types);

  //...........................................................................................................
  // require                   './exception-handler'

  //-----------------------------------------------------------------------------------------------------------
  this.cli = function() {
    return new Promise((done) => {
      var app, has_command, pkg;
      pkg = require('../package.json');
      app = require('commander');
      has_command = false;
      //.........................................................................................................
      app.name(pkg.name).version(pkg.version);
      //.........................................................................................................
      app.command('benchmarks [project]').description("run benchmarks").action((project, d) => {
        has_command = true;
        info(`^556^ running benchmarks for project ${rpr(project)}`);
        return done();
      });
      // #.........................................................................................................
      // app
      //   .command 'source [source_path]'
      //   .description "set or get location of source fonts"
      //   .action ( source_path, d ) =>
      //     has_command = true
      //     source_path = PATH.resolve source_path if source_path?
      //     await FONTMIRROR.CFG.set_or_get 'source_path', source_path, true
      //     done()
      // #.........................................................................................................
      // app
      //   .command 'target [target_path]'
      //   .description "set or get location where tagged links and outlines are to be stored"
      //   .action ( target_path, d ) =>
      //     has_command = true
      //     target_path = PATH.resolve target_path if target_path?
      //     await FONTMIRROR.CFG.set_or_get 'target_path', target_path, true
      //     done()
      // #.........................................................................................................
      // app
      //   .command 'link-all-sources'
      //   .description "rewrite links to fonts in target/all"
      //   .option '-d --dry',     "show what links would be written"
      //   .option '-q --quiet',   "only report totals"
      //   .action ( d ) =>
      //     has_command = true
      //     me          = @new_tagger d
      //     await FONTMIRROR.LINKS.link_all_sources me
      //     done()
      // #.........................................................................................................
      // app
      //   .command 'refresh-tags'
      //   .description "rewrite tagged links as described in target/cfg/tags.txt"
      //   .option '-d --dry',     "show what links would be written"
      //   .option '-q --quiet',   "only report totals"
      //   .action ( d ) =>
      //     has_command = true
      //     me          = FONTMIRROR.CFG.new_tagger d
      //     debug '^33653^', me; process.exit 1
      //     await FONTMIRROR.TAGS.refresh me
      //     done()
      // #.........................................................................................................
      // app
      //   .command 'cache-outlines [tags]'
      //   .description "read all outlines from fonts and store them in target/outlines"
      //   .option '-f --force', "force overwrite existing outline files"
      //   .action ( d ) =>
      //     has_command     = true
      //     force_overwrite = d.force ? false
      //     info '^33332^', "cache", force_overwrite
      //     # await FONTMIRROR.cache_font_outlines source_path, target_path, force_overwrite
      //     done()
      /*
      #.........................................................................................................
      app
        .command 'sync'
        .action ( d ) =>
          has_command     = true
          sync_command()
          help 'ok'
          done()
      #.........................................................................................................
      app
        .command 'async'
        .action ( d ) =>
          has_command     = true
          await async_command()
          help 'ok'
          done()
       */
      //.........................................................................................................
      debug('^730^', process.argv);
      app.parse(process.argv);
      if (!has_command) {
        app.outputHelp(function(message) {
          return CND.orange(message);
        });
      }
      // debug '^33376^', ( k for k of app).sort().join ', '
      return null;
    });
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await this.cli());
    })();
  }

  // help "^fontmirror/cli@43892^ terminating."

}).call(this);
