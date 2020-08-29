(function() {
  'use strict';
  var CND, alert, badge, debug, defer, echo, get_cmd_literal, help, info, misfit, parse_argv, pluck, rpr, show_help_and_exit, show_help_for_command_and_exit, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/CL-PARSER';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  // types                     = ( require 'intershop' ).types
  // { isa
  //   validate
  //   cast
  //   type_of }               = types.export()
  // CP                        = require 'child_process'
  defer = setImmediate;

  parse_argv = require('command-line-args');

  // cnd_parse                 = require 'cnd/parse-command-line'
  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  pluck = function(d, name, fallback = misfit) {
    var R;
    if ((R = d[name]) == null) {
      if (fallback !== misfit) {
        return fallback;
      }
      throw new Error(`^cli@5477^ no such attribute: ${rpr(name)}`);
    }
    delete d[name];
    return R;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // check_extraneous = ( d ) ->
  //   return if ( Object.keys d ).length is 0
  //   show_help_and_exit 111, "unknown arguments: #{rpr d}"

  //-----------------------------------------------------------------------------------------------------------
  get_cmd_literal = function(cmd, argv) {
    var parameters;
    if ((parameters = CND.shellescape(argv)).length === 0) {
      return `\`${cmd}\``;
    }
    return `\`${cmd} ${parameters}\``;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_help_for_command_and_exit = function(p, argv) {
    var command;
    if (argv.length > 0) {
      return show_help_and_exit(113, `^cli@5478^ extraneous arguments ${rpr(argv)}`);
    }
    if ((command = pluck(p, 'command', null)) == null) {
      return show_help_and_exit(0);
    }
    switch (command) {
      case 'help':
        /* TAINT use custom function to output help */
        echo(CND.blue(`\n\`node ${__filename} help [command]\`:\nget help about \`command\`\n`));
        process.exit(0);
    }
    return show_help_and_exit(120, `^cli@5887^ unknown help topic ${rpr(command)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  show_help_and_exit = function(code = 0, message = null) {
    var usage;
    usage = `node demo.js [metaflags] <command> [flags] p...

  metaflags:
    --help      -h      show this help
    --trace     -t      show CLI parsing trace
    --cwd       -d      change to directory before running command

  internal commands:
    help [command]      help on commands

  external commands:
    psql                run SQL with psql
    node                run JS with node
    nodexh              run JS with node (enhanced stacktraces)`;
    usage = '\n' + (CND.blue(usage)) + '\n';
    if (message != null) {
      usage += '\n' + (CND.red(message)) + '\n';
    }
    echo(usage);
    return process.exit(code);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cli = function(argv = null) {
    return new Promise(function(resolve, reject) {
      var cmd, d, flag, p, q, ref, ref1, s;
      //---------------------------------------------------------------------------------------------------------
      q = {
        trace: false,
        help: false,
        testing: argv != null,
        cmd: null,
        parameters: null
      };
      //---------------------------------------------------------------------------------------------------------
      // Stage: Pre-Command
      //.........................................................................................................
      argv = argv != null ? argv : process.argv;
      d = [
        {
          name: 'help',
          alias: 'h',
          type: Boolean
        },
        {
          name: 'trace',
          alias: 't',
          type: Boolean
        }
      ];
      s = {
        argv,
        stopAtFirstUnknown: true
      };
      p = parse_argv(d, s);
      if (p.trace) {
        whisper(p);
      }
      argv = pluck(p, '_unknown', []);
      q.help = pluck(p, 'help', false);
      q.trace = pluck(p, 'trace', false);
      //.........................................................................................................
      if (q.trace) {
        urge("Stage: Pre-Command      ", rpr(q));
      }
      if (q.help) {
        //.........................................................................................................
        return show_help_and_exit(0);
      }
      if ((ref = (flag = argv[0])) != null ? ref.startsWith('-') : void 0) {
        //---------------------------------------------------------------------------------------------------------
        // Stage: Command
        //.........................................................................................................
        return show_help_and_exit(112, `extraneous flag ${rpr(flag)}`);
      }
      //.........................................................................................................
      d = {
        name: 'cmd',
        defaultOption: true
      };
      p = parse_argv(d, {
        argv,
        stopAtFirstUnknown: true
      });
      argv = pluck(p, '_unknown', []);
      if (q.trace) {
        whisper(p);
        urge("Stage: Command          ", 'cmd', (ref1 = p.cmd) != null ? ref1 : 'UNKNOWN');
      }
      //---------------------------------------------------------------------------------------------------------
      // Stage: Internal Commands
      //.........................................................................................................
      // Internal commands must parse their specific flags and other arguments.
      //.........................................................................................................
      switch (p.cmd) {
        case 'help':
          d = {
            name: 'command',
            defaultOption: true
          };
          p = parse_argv(d, {
            argv,
            stopAtFirstUnknown: true
          });
          argv = pluck(p, '_unknown', []);
          if (q.trace) {
            whisper(p);
            urge("Stage: internal command `help`", {p, argv});
          }
          return show_help_for_command_and_exit(p, argv);
      }
      //---------------------------------------------------------------------------------------------------------
      // Stage: External Commands
      //.........................................................................................................
      // External commands call a child process that is passed the remaing command line arguments, so those
      // can be dealt with summarily.
      //.........................................................................................................
      cmd = p.cmd;
      if (cmd == null) {
        return show_help_and_exit(114, "^cli@5479^ missing command");
      }
      p = parse_argv([], {
        argv,
        stopAtFirstUnknown: true
      });
      argv = pluck(p, '_unknown', []);
      //.........................................................................................................
      switch (cmd) {
        //-------------------------------------------------------------------------------------------------------
        case 'psql':
          whisper(argv);
          if (q.trace) {
            urge(`Stage: Command: running ${get_cmd_literal(cmd, argv)}`);
          }
          return resolve();
        //-------------------------------------------------------------------------------------------------------
        case 'nodexh':
        case 'node':
          whisper(argv);
          if (q.trace) {
            urge(`Stage: Command: running ${get_cmd_literal(cmd, argv)}`);
          }
          return resolve();
      }
      //.........................................................................................................
      return show_help_and_exit(115, `^cli@5480^ Unknown command ${CND.reverse(rpr(p.cmd))}`);
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return debug((await this.cli()));
    })();
  }

  // debug await @cli [ '-t', null, '-t', ]

}).call(this);

//# sourceMappingURL=demo.js.map