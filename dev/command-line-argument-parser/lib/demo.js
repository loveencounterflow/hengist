(function() {
  'use strict';
  var CND, PATH, alert, badge, debug, defer, echo, get_cmd_literal, help, info, misfit, parse_argv, pluck, relpath, rpr, show_help_and_exit, show_help_for_topic_and_exit, urge, warn, whisper;

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

  PATH = require('path');

  relpath = PATH.relative(process.cwd(), __filename);

  //-----------------------------------------------------------------------------------------------------------
  pluck = function(d, name, fallback = misfit) {
    var R;
    R = d[name];
    delete d[name];
    if (R == null) {
      if (fallback !== misfit) {
        return fallback;
      }
      throw new Error(`^cli@5477^ no such attribute: ${rpr(name)}`);
    }
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
      return CND.lime(`${cmd}`);
    }
    return CND.lime(`${cmd} ${parameters}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  show_help_for_topic_and_exit = function(q, argv) {
    if (argv.length > 0) {
      return show_help_and_exit(113, `^cli@5478^ extraneous arguments ${rpr(argv)}`);
    }
    switch (q.parameters.topic) {
      case null:
      case void 0:
        return show_help_and_exit(0);
      case 'topics':
        echo(CND.blue("(this should be a list of topics)"));
        process.exit(0);
        break;
      case 'help':
        /* TAINT use custom function to output help */
        echo(CND.blue(`\n\`node ${relpath} help [topic]\`:\nget help about \`topic\`\n`));
        process.exit(0);
    }
    return show_help_and_exit(120, `^cli@5887^ unknown help topic ${rpr(q.parameters.topic)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  show_help_and_exit = function(code = 0, message = null) {
    var usage;
    usage = `node demo.js [metaflags] <command> [flags] p...

  metaflags:
    --help      -h      show this help
    --trace     -t      show CLI parsing trace
    --cd        -d      change to directory before running command

  internal commands:
    help                general help
    help [topic]        help on topic; run \`help topics\` to see a list

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
      var d, flag, p, q, ref, s;
      //---------------------------------------------------------------------------------------------------------
      q = {
        trace: false,
        help: false,
        testing: argv != null,
        cmd: null,
        parameters: {}
      };
      //---------------------------------------------------------------------------------------------------------
      // Stage: Metaflags
      //.........................................................................................................
      argv = argv != null ? argv : process.argv;
      d = [
        {
          name: 'help',
          alias: 'h',
          type: Boolean
        },
        {
          name: 'cd',
          alias: 'd',
          type: String
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
      argv = pluck(p, '_unknown', []);
      q.help = pluck(p, 'help', false);
      q.trace = pluck(p, 'trace', false);
      q.cd = pluck(p, 'cd', null);
      if (q.trace) {
        urge("Stage: Metaflags", {q, argv});
      }
      if (q.help) {
        return show_help_and_exit(0);
      }
      if ((ref = (flag = argv[0])) != null ? ref.startsWith('-') : void 0) {
        return show_help_and_exit(112, `^cli@5598^ extraneous flag ${rpr(flag)}`);
      }
      //---------------------------------------------------------------------------------------------------------
      if (q.cd != null) {
        process.chdir(q.cd);
      }
      if (q.trace) {
        urge(CND.yellow(`current working directory is now ${process.cwd()}`));
      }
      //---------------------------------------------------------------------------------------------------------
      // Stage: Internal Commands
      // Internal commands must parse their specific flags and other arguments.
      //.........................................................................................................
      d = {
        name: 'cmd',
        defaultOption: true
      };
      p = parse_argv(d, {
        argv,
        stopAtFirstUnknown: true
      });
      q.cmd = pluck(p, 'cmd', null);
      argv = pluck(p, '_unknown', []);
      if (q.trace) {
        urge("Stage: Commands", {q, argv});
      }
      if (q.cmd == null) {
        return show_help_and_exit(114, "^cli@5479^ missing command");
      }
      //.........................................................................................................
      switch (q.cmd) {
        case 'help':
          d = {
            name: 'topic',
            defaultOption: true
          };
          p = parse_argv(d, {
            argv,
            stopAtFirstUnknown: true
          });
          q.parameters.topic = pluck(p, 'topic', null);
          argv = pluck(p, '_unknown', []);
          if (q.trace) {
            urge("running internal command `help`", {q, argv});
          }
          return show_help_for_topic_and_exit(q, argv);
      }
      //---------------------------------------------------------------------------------------------------------
      // Stage: External Commands
      //.........................................................................................................
      // External commands call a child process that is passed the remaing command line arguments, so those
      // can be dealt with summarily.
      //.........................................................................................................
      p = parse_argv([], {
        argv,
        stopAtFirstUnknown: true
      });
      argv = pluck(p, '_unknown', []);
      q.parameters.argv = argv.slice(0);
      if (q.trace) {
        urge("Stage: External Commands", {q, argv});
      }
      //.........................................................................................................
      switch (q.cmd) {
        //-------------------------------------------------------------------------------------------------------
        case 'psql':
          if (q.trace) {
            urge(`running external command ${get_cmd_literal(q.cmd, argv)}`);
          }
          return resolve();
        //-------------------------------------------------------------------------------------------------------
        case 'nodexh':
        case 'node':
          if (q.trace) {
            urge(`running external command ${get_cmd_literal(q.cmd, argv)}`);
          }
          return resolve();
      }
      //.........................................................................................................
      return show_help_and_exit(115, `^cli@5480^ Unknown command ${CND.reverse(rpr(q.cmd))}`);
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return debug('^3387^', (await this.cli()));
    })();
  }

  // debug await @cli [ '-t', null, '-t', ]

}).call(this);

//# sourceMappingURL=demo.js.map