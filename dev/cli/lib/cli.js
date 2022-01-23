(function() {
  'use strict';
  var CND, FS, INTERTEXT, PATH, after, alert, assign, async_command, badge, cast, debug, defaults, defer, echo, help, info, isa, jr, log, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DEV-CLI/CLI';

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

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  defer = setImmediate;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  types = require('./types');

  ({isa, validate, cast, defaults, type_of} = types);

  //...........................................................................................................

  //-----------------------------------------------------------------------------------------------------------
  async_command = function() {
    return new Promise((resolve) => {
      // defer => resolve()
      whisper("^445^ waiting for async task...");
      return after(0.5, () => {
        urge("^445^ async task complete");
        return resolve();
      });
    });
  };

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
      app.command('helo <name>').description("say helo").action((name, d) => {
        has_command = true;
        info(`^5576^ Helo ${rpr(name)}`);
        return done();
      });
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
          help "^6531^ ok"
          done()
       */
      //.........................................................................................................
      app.command('async').action(async(d) => {
        has_command = true;
        await async_command();
        help("^6532^ ok");
        return done();
      });
      //.........................................................................................................
      whisper('^730^', rpr(process.argv));
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

  // await async_command()
// help "^fontmirror/cli@43892^ terminating."

}).call(this);

//# sourceMappingURL=cli.js.map