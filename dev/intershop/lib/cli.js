(function() {
  'use strict';
  var CND, CP, alert, badge, cast, debug, echo, help, info, isa, rpr, type_of, types, urge, validate, warn, whisper;

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
  types = (require('intershop')).types;

  ({isa, validate, cast, type_of} = types.export());

  CP = require('child_process');

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
  this.new_intershop_runner = function(project_path) {
    var INTERSHOP;
    INTERSHOP = require('intershop/lib/intershop');
    return INTERSHOP.new_intershop(project_path);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._prepare_commandline = function(me) {
    var cwd, db_name, db_user;
    cwd = me.get('intershop/host/path');
    db_name = me.get('intershop/db/name');
    db_user = me.get('intershop/db/user');
    return {cwd, db_user, db_name};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.psql_run_file = function(me, path) {
    return this._psql_run(me, '-f', path);
  };

  this.psql_run_command = function(me, command) {
    return this._psql_run(me, '-c', command);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._psql_run = function(me, selector, pargument) {
    return new Promise((resolve, reject) => {
      /* TAINT how to respect `sudo -u postgres` and similar? */
      var cmd, cp, parameters, settings;
      validate.intershop_cli_psql_run_selector(selector);
      cmd = this._prepare_commandline(me);
      parameters = ['-U', cmd.db_user, '-d', cmd.db_name, selector, pargument];
      // parameters  = [ '-d', cmd.db_name, selector, pargument, ]
      // debug '^37363^', parameters
      whisper('^psql_run@@3367^', `psql ${parameters.join(' ')}`);
      settings = {
        cwd: cmd.cwd,
        shell: false,
        stdio: ['inherit', 'inherit', 'inherit']
      };
      cp = CP.spawn('psql', parameters, settings);
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
      var command, file_path, me, project_path, ref, ref1, ref2, ref3;
      // has_command = true
      // info "^5561^ #{rpr ( key for key of d )}"
      // info "^5562^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      // info "^5563^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path = (ref = d.options.file) != null ? ref : null;
      command = (ref1 = d.options.command) != null ? ref1 : null;
      project_path = (ref2 = (ref3 = d.options.p) != null ? ref3 : d.options.project) != null ? ref2 : process.cwd();
      info(`^5564^ file_path: ${rpr(file_path)}`);
      info(`^5565^ project_path: ${rpr(project_path)}`);
      // debug '^2223^', rpr command
      // debug '^2223^', rpr project_path
      me = this.new_intershop_runner(project_path);
      if (file_path != null) {
        // info "^5566^ running psql with #{rpr { file: d.file, command: d.command, }}"
        await this.psql_run_file(me, file_path);
      }
      if (command != null) {
        await this.psql_run_command(me, command);
      }
      return null;
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
    var INTERSHOP, PATH, i, k, key, keys, len, project_path, setting, shop;
    PATH = require('path');
    project_path = PATH.resolve(PATH.join(__dirname, '../../../../hengist'));
    project_path = PATH.resolve(PATH.join(__dirname, '../../../../interplot'));
    debug('^3335-1^');
    INTERSHOP = require('intershop/lib/intershop');
    debug('^3335-2^');
    shop = INTERSHOP.new_intershop(project_path);
    debug('^3335-3^');
    keys = ((function() {
      var results;
      results = [];
      for (k in shop.settings) {
        results.push(k);
      }
      return results;
    })()).sort();
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (key.startsWith('os/')) {
        continue;
      }
      setting = shop.settings[key];
      echo(CND.gold(key.padEnd(42)), CND.lime(setting.value));
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var rpc;
      // await @demo()
      rpc = (await this.serve());
      await this.cli();
      return (await rpc.stop());
    })();
  }

  // @demo_intershop_object()

}).call(this);

//# sourceMappingURL=cli.js.map