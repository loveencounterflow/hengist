(function() {
  'use strict';
  var CND, CP, alert, badge, cast, debug, defer, echo, help, info, isa, rpr, t0, type_of, types, urge, validate, warn, whisper;

  t0 = process.hrtime.bigint();

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERSHOP/INTERSHOP-CLI-NG';

  debug = CND.get_logger('debug', badge);

  debug('^76483-1^', Date.now() / 1000);

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

  defer = setImmediate;

  debug('^76483-2^', Date.now() / 1000);

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
    var IX, M3, R, contract, hyphenate, slabjoints_from_text;
    IX = require('../../../apps/intertext');
    M3 = require('../../../apps/mojikura3-model/intershop_modules/rpc');
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
  this._prepare_psql_commandline = function(me) {
    var cwd, db_name, db_user;
    cwd = me.get('intershop/host/path');
    db_name = me.get('intershop/db/name');
    db_user = me.get('intershop/db/user');
    return {cwd, db_user, db_name};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.psql_run = function(me, settings) {
    return new Promise((resolve, reject) => {
      var cmd, cp, parameters;
      cmd = this._prepare_psql_commandline(me);
      parameters = ['-U', cmd.db_user, '-d', cmd.db_name, ...settings.verdict.argv];
      whisper('^psql_run@@3367^', `psql ${CND.shellescape(parameters)}`);
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
  this.nodexh_run_file = function(project_path, file_path) {
    return new Promise((resolve, reject) => {
      var cp, parameters, settings;
      parameters = [file_path];
      whisper('^psql_run@@3367^', `psql ${parameters.join(' ')}`);
      settings = {
        cwd: project_path,
        shell: false,
        stdio: ['inherit', 'inherit', 'inherit']
      };
      cp = CP.spawn('nodexh', parameters, settings);
      cp.on('close', function(code) {
        if (code === 0) {
          return resolve(0);
        }
        return reject(new Error(`^nodexh_run_file@34479^ processs exited with code ${code}`));
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
  this._cli_get_project_path = function(d) {
    var ref;
    return (ref = d.verdict.cd) != null ? ref : process.cwd();
  };

  //-----------------------------------------------------------------------------------------------------------
  this._cli = async function() {
    var MIXA, R, jobdef;
    debug('^76483-3^', Date.now() / 1000);
    MIXA = require('../../../apps/mixa');
    debug('^76483-4^', Date.now() / 1000);
    //.........................................................................................................
    // program.action ( { logger, } ) => logger.info "Hello, world!"
    //.........................................................................................................
    jobdef = {
      // .name 'intershop'
      //.......................................................................................................
      commands: {
        'start-rpc-server': {
          description: "start RPC server (to be accessed from psql scripts)",
          allow_extra: true,
          runner: (d) => {
            return new Promise(async(done) => {
              var project_path, shop;
              project_path = this._cli_get_project_path(d);
              return shop = (await this.serve(project_path));
            });
          }
        },
        //.....................................................................................................
        'psql': {
          description: "run psql",
          allow_extra: true,
          runner: (d) => {
            return new Promise(async(done) => {
              var me, project_path, shop;
              project_path = this._cli_get_project_path(d);
              shop = (await this.serve(project_path));
              /* TAINT */
              info(`^5564^ d.verdict: ${rpr(d.verdict)}`);
              info(`^5565^ project_path: ${rpr(project_path)}`);
              // debug '^2223^', rpr command
              // debug '^2223^', rpr project_path
              me = this.new_intershop_runner(project_path);
              // info "^5566^ running psql with #{rpr { file: d.file, command: d.command, }}"
              await this.psql_run(me, d);
              await shop.rpc.stop();
              done();
              return null;
            });
          }
        },
        //.....................................................................................................
        'nodexh': {
          description: "run nodexh",
          allow_extra: true,
          runner: MIXA.runners.execSync
        },
        //.....................................................................................................
        'node': {
          description: "run node",
          allow_extra: true,
          runner: MIXA.runners.execSync
        }
      }
    };
    //.........................................................................................................
    whisper('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', CND.format_number(process.hrtime.bigint() - t0)); // / 1000000000n
    debug('^33344^', MIXA.parse(jobdef, process.argv));
    whisper('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', CND.format_number(process.hrtime.bigint() - t0)); // / 1000000000n
    R = (await MIXA.run(jobdef, process.argv));
    whisper('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', CND.format_number(process.hrtime.bigint() - t0)); // / 1000000000n
    return R;
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