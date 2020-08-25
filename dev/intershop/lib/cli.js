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
  this.serve = async function(project_path = null) {
    var INTERSHOP, PATH, RPC, i, len, rpc_key, rpc_keys, shop;
    PATH = require('path');
    INTERSHOP = require('intershop/lib/intershop');
    RPC = require('../../../apps/intershop-rpc');
    if (project_path == null) {
      project_path = PATH.resolve(PATH.join(__dirname, '../../../../hengist'));
    }
    process.chdir(project_path);
    shop = INTERSHOP.new_intershop(project_path);
    /* TAINT in the future `db`, `rpc` will be delivered with `new_intershop()` */
    // shop.db                   = require '../../../apps/intershop/intershop_modules/db'
    shop.db = require('intershop/lib/db');
    shop.rpc = (await RPC.create({
      show_counts: true,
      count_interval: 100,
      logging: true
    }));
    //.........................................................................................................
    rpc_keys = [];
    rpc_keys = [...rpc_keys, ...((await this._contract_registered_rpc_methods(shop)))];
    rpc_keys = [...rpc_keys, ...((await this._contract_demo_rpc_methods(shop)))];
    whisper('-'.repeat(108));
    urge("^4576^ registered RPC keys:");
    for (i = 0, len = rpc_keys.length; i < len; i++) {
      rpc_key = rpc_keys[i];
      info(`^4576^   ${rpc_key}`);
    }
    whisper('-'.repeat(108));
    //.........................................................................................................
    return shop;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._contract_registered_rpc_methods = async function(shop) {
    var R, addon, i, len, method_name, method_names, module, ref, sql;
    R = [];
    sql = "select aoid, path from ADDONS.files where target = 'rpc' order by aoid, path;";
    ref = (await shop.db.query([sql]));
    for (addon of ref) {
      module = require(addon.path);
      method_names = (Object.keys(module)).sort();
      for (i = 0, len = method_names.length; i < len; i++) {
        method_name = method_names[i];
        ((module, method_name) => {
          var rpc_key;
          rpc_key = `^${addon.aoid}/${method_name}`;
          R.push(rpc_key);
          /* TAINT in upcoming intershop-rpc version, all calls must pass a single list with arguments
                 to be applied to the contractor; this will then be done in `shop.rpc.contract(). For the
                 time being, we're applying arguments right here: */
          shop.rpc.contract(rpc_key, function(d) {
            var type;
            if ((type = type_of(d.$value)) !== 'list') {
              throw new Error(`^intershop/cli@3376^ in RPC call to ${rpc_key}, expected a list for d.$value, got a ${type}`);
            }
            return module[method_name](...d.$value);
          });
          return null;
        })(module, method_name);
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._contract_demo_rpc_methods = function(shop) {
    var IX, R, contract, hyphenate, slabjoints_from_text;
    IX = require('../../../apps/intertext');
    R = [];
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
    contract = (key, method) => {
      shop.rpc.contract(key, method);
      R.push(key);
      return null;
    };
    //.........................................................................................................
    contract('^hyphenate', function(d) {
      return hyphenate(d.$value);
    });
    contract('^slabjoints_from_text', function(d) {
      return slabjoints_from_text(d.$value);
    });
    contract('^shyphenate', function(d) {
      return slabjoints_from_text(hyphenate(d.$value));
    });
    return R;
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
    // shop = await @serve()
    await this._cli();
    // await shop.rpc.stop()
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._cli = async function() {
    var program;
    ({program} = require('@caporal/core'));
    //.........................................................................................................
    // program.action ( { logger, } ) => logger.info "Hello, world!"
    //.........................................................................................................
    //.......................................................................................................
    program.name('intershop').command('start-rpc-server', "start RPC server (to be accessed from psql scripts)").action((d) => {
      return new Promise((done) => {}); // setTimeout ( -> done() ), 1e26
    //.......................................................................................................
    }).command('psql', "run psql").option('-f --file <file>', "read commands from file rather than standard input; may be combined, repeated").option('-c --command <command>', "execute the given command string; may be combined, repeated").action(async(d) => { //, collect, [] //, collect, []
      var command, file_path, me, project_path, ref, ref1, ref2, ref3, shop;
      // has_command = true
      // info "^5561^ #{rpr ( key for key of d )}"
      // info "^5562^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      // info "^5563^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path = (ref = d.options.file) != null ? ref : null;
      command = (ref1 = d.options.command) != null ? ref1 : null;
      project_path = (ref2 = (ref3 = d.options.p) != null ? ref3 : d.options.project) != null ? ref2 : process.cwd();
      info(`^5564^ d.options: ${rpr(d.options)}`);
      info(`^5564^ file_path: ${rpr(file_path)}`);
      info(`^5565^ project_path: ${rpr(project_path)}`);
      shop = (await this.serve(project_path));
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
      await shop.rpc.stop();
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
    INTERSHOP = require('intershop/lib/intershop');
    shop = INTERSHOP.new_intershop(project_path);
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

  //-----------------------------------------------------------------------------------------------------------
  this.demo_query_addons = async function() {
    var INTERSHOP, PATH, RPC, addon, k, method_name, module, project_path, ref, rpc, shop, sql;
    PATH = require('path');
    project_path = PATH.resolve(PATH.join(__dirname, '../../../../hengist'));
    INTERSHOP = require('intershop/lib/intershop');
    shop = INTERSHOP.new_intershop(project_path);
    /* TAINT in the future `db` will be delivered with `new_intershop()` */
    shop.db = require('intershop/lib/db');
    RPC = require('../../../apps/intershop-rpc');
    rpc = (await RPC.create({
      show_counts: true,
      count_interval: 100,
      logging: true
    }));
    debug(((function() {
      var results;
      results = [];
      for (k in shop.db) {
        results.push(k);
      }
      return results;
    })()).sort());
    // for addon from await shop.db.query [ "select * from ADDONS.addons;", ]
    //   info addon.aoid
    //   for file from await shop.db.query [ "select * from ADDONS.files where aoid = $1;", addon.aoid, ]
    //     urge '  ', ( CND.blue file.target ), ( CND.yellow file.path )
    sql = "select * from ADDONS.files where target = 'rpc' order by aoid;";
    ref = (await shop.db.query([sql]));
    for (addon of ref) {
      module = require(addon.path);
      for (method_name in module) {
        ((module, method_name) => {
          var rpc_name;
          rpc_name = `^${addon.aoid}/${method_name}`;
          debug('^3334^', rpc_name);
          rpc.contract(rpc_name, function(d) {
            return module[method_name](d.$value);
          });
          return null;
        })(module, method_name);
      }
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await @demo()
      return (await this.cli());
    })();
  }

  // await @demo_query_addons()
// @demo_intershop_object()

}).call(this);

//# sourceMappingURL=cli.js.map