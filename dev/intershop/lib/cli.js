(function() {
  'use strict';
  var CND, alert, badge, cast, debug, echo, help, info, isa, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERSHOP/INTERSHOP-CLI-NG';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types.export());

  /* TAINT

  consider to move to https://caporal.io

  */
  //-----------------------------------------------------------------------------------------------------------
  this.serve = async function() {
    var IX, Rpc, after, hyphenate, rpc, slabjoints_from_text;
    Rpc = require('../../../apps/intershop-rpc');
    // DB                        = require '../../../apps/intershop/intershop_modules/db'
    // DATOM                     = require '../../../apps/datom'
    IX = require('../../../apps/intertext');
    after = function(time_s, f) {
      return setTimeout(f, time_s * 1000);
    };
    //.........................................................................................................
    rpc = (await Rpc.create({
      show_counts: true,
      count_interval: 100,
      logging: true
    }));
    //.........................................................................................................
    rpc.contract('^hyphenate', function(d) {
      return hyphenate(d.$value);
    });
    rpc.contract('^slabjoints_from_text', function(d) {
      return slabjoints_from_text(d.$value);
    });
    rpc.contract('^shyphenate', function(d) {
      return slabjoints_from_text(hyphenate(d.$value));
    });
    // debug '^447^', rpr text
    //.........................................................................................................
    hyphenate = function(text) {
      validate.text(text);
      return IX.HYPH.hyphenate(text);
    };
    //.........................................................................................................
    slabjoints_from_text = function(text) {
      validate.text(text);
      return IX.SLABS.slabjoints_from_text(text);
    };
    //.........................................................................................................
    return rpc;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.psql_run_file = function(cwd, path) {
    return new Promise((resolve, reject) => {
      /* TAINT must properly escape path literal or not use shell */
      var CP, cmdline, cp, settings;
      CP = require('child_process');
      cmdline = `psql -U interplot -d interplot -f \"${path}\"`;
      whisper('^psql_run_file@3366^', path);
      settings = {
        cwd: cwd,
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit']
      };
      cp = CP.spawn(cmdline, null, settings);
      cp.on('close', function(code) {
        if (code === 0) {
          return resolve(0);
        }
        return reject(new Error(`^psql_run_file@34478^ processs exited with code ${code}`));
      });
      cp.on('error', function(error) {
        return reject(error);
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.psql_run_command = function(cwd, command) {
    return new Promise((resolve, reject) => {
      /* TAINT must properly escape command literal or not use shell */
      var CP, cmdline, cp, settings;
      CP = require('child_process');
      cmdline = `psql -U interplot -d interplot -c \"${command}\"`;
      whisper('^psql_run_file@3367^', cmdline);
      settings = {
        cwd: cwd,
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit']
      };
      cp = CP.spawn(cmdline, null, settings);
      cp.on('close', function(code) {
        if (code === 0) {
          return resolve(0);
        }
        return reject(new Error(`^psql_run_file@34479^ processs exited with code ${code}`));
      });
      cp.on('error', function(error) {
        return reject(error);
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cli = async function() {
    var program;
    ({program} = require('@caporal/core'));
    //.........................................................................................................
    // program.action ( { logger, } ) => logger.info "Hello, world!"
    //.........................................................................................................
    //.......................................................................................................
    program.name('intershop').command('start-rpc-server', "start RPC server (to be accessed from psql scripts)").action((d) => {
      return setTimeout((function() {}), 1e6);
    //.......................................................................................................
    }).command('psql', "run psql").option('-f --file <file>', "read commands from file rather than standard input; may be combined, repeated").option('-c --command <command>', "execute the given command string; may be combined, repeated").action(async(d) => { //, collect, [] //, collect, []
      var command, file_path, project_path, ref, ref1, ref2, ref3;
      // has_command = true
      // info "^556^ #{rpr ( key for key of d )}"
      // info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      // info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path = (ref = d.options.file) != null ? ref : null;
      command = (ref1 = d.options.command) != null ? ref1 : null;
      project_path = (ref2 = (ref3 = d.options.p) != null ? ref3 : d.options.project) != null ? ref2 : process.cwd();
      info(`^556^ file_path: ${rpr(file_path)}`);
      info(`^556^ project_path: ${rpr(project_path)}`);
      if (file_path != null) {
        // info "^556^ running psql with #{rpr { file: d.file, command: d.command, }}"
        await this.psql_run_file(project_path, file_path);
      }
      if (command != null) {
        return (await this.psql_run_command(project_path, command));
      }
    });
    //.........................................................................................................
    program.option('-p --project <project>', "set path to InterShop project (only needed if not current directory)", {
      global: true
    });
    //.........................................................................................................
    return (await program.run());
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @demo = ->
  //   rpc = await @serve()
  //   # T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
  //   await @psql_run_file '/home/flow/jzr/interplot', 'db/080-intertext.sql'
  //   await @psql_run_file '/home/flow/jzr/interplot', 'db/100-harfbuzz.sql'
  //   await @psql_run_file '/home/flow/jzr/interplot', 'db/tests/080-intertext.tests.sql'
  //   debug '^3334^', process.argv
  //   info rpc.counts
  //   await rpc.stop()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.demo_intershop_object = function() {
    var INTERSHOP, PATH, k, project_path;
    PATH = require('path');
    project_path = PATH.resolve(PATH.join(__dirname, '../../../../hengist'));
    project_path = PATH.resolve(PATH.join(__dirname, '../../../../interplot'));
    INTERSHOP = (require('intershop')).new_intershop(project_path);
    debug('^334^', (function() {
      var results;
      results = [];
      for (k in INTERSHOP) {
        results.push(k);
      }
      return results;
    })());
// debug '^334^', INTERSHOP.PTV_READER
    for (k in INTERSHOP.settings) {
      if (k.startsWith('os/')) {
        continue;
      }
      echo(CND.gold(k.padEnd(42)), CND.lime(INTERSHOP.settings[k].value));
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await @demo()
      // rpc = await @serve()
      // await @cli()
      // await rpc.stop()
      return this.demo_intershop_object();
    })();
  }

}).call(this);

//# sourceMappingURL=cli.js.map