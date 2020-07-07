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
      count_interval: 1,
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
      /* TAINT must properly escape path literal */
      var CP, command, cp, settings;
      CP = require('child_process');
      command = `psql -U interplot -d interplot -f \"${path}\"`;
      whisper('^psql_run_file@3366^', path);
      settings = {
        cwd: cwd,
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit']
      };
      cp = CP.spawn(command, null, settings);
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
  this.demo = async function() {
    var rpc;
    rpc = (await this.serve());
    // T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
    await this.psql_run_file('/home/flow/jzr/interplot', 'db/080-intertext.sql');
    await this.psql_run_file('/home/flow/jzr/interplot', 'db/100-harfbuzz.sql');
    await this.psql_run_file('/home/flow/jzr/interplot', 'db/tests/080-intertext.tests.sql');
    debug('^3334^', process.argv);
    info(rpc.counts);
    await rpc.stop();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cli = async function() {
    var program;
    ({program} = require('@caporal/core'));
    //.........................................................................................................
    // program.action ( { logger, } ) => logger.info "Hello, world!"
    //.........................................................................................................
    program.name('intershop').command('psql', "run psql").option('-f --file <file>', "read commands from file rather than standard input; may be combined, repeated").option('-c --command <command>', "execute the given command string; may be combined, repeated").action(async(d) => { //, collect, [] //, collect, []
      var file_path, has_command, project_path, ref, ref1, ref2;
      has_command = true;
      // info "^556^ #{rpr ( key for key of d )}"
      // info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      // info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path = (ref = d.options.file) != null ? ref : null;
      project_path = (ref1 = (ref2 = d.options.p) != null ? ref2 : d.options.project) != null ? ref1 : process.cwd();
      info(`^556^ file_path: ${rpr(file_path)}`);
      info(`^556^ project_path: ${rpr(project_path)}`);
      // info "^556^ running psql with #{rpr { file: d.file, command: d.command, }}"
      if (file_path != null) {
        return (await this.psql_run_file(project_path, file_path));
      }
    });
    //.........................................................................................................
    program.option('-p --project <project>', "set path to InterShop project (only needed if not current directory)", {
      global: true
    });
    //.........................................................................................................
    return (await program.run());
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

}).call(this);

//# sourceMappingURL=cli.js.map