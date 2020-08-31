(function() {
  'use strict';
  var CND, PATH, X, alert, badge, cast, compile_settings, debug, default_settings, defer, echo, freeze, generate_documentation, get_cmd_literal, help, info, isa, lets, misfit, parse_argv, pluck, relpath, rpr, run_external_command, show_cat_and_exit, show_help_and_exit, show_help_for_topic_and_exit, type_of, types, urge, user_settings, validate, warn, whisper;

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
  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types.export());

  // CP                        = require 'child_process'
  defer = setImmediate;

  parse_argv = require('command-line-args');

  // cnd_parse                 = require 'cnd/parse-command-line'
  misfit = Symbol('misfit');

  PATH = require('path');

  relpath = PATH.relative(process.cwd(), __filename);

  ({freeze, lets} = require('letsfreezethat'));

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
  generate_documentation = function() {
    var cmd, commandLineUsage, descriptions, doc_settings, i, j, len, len1, ref, ref1, ref2;
    commandLineUsage = require('command-line-usage');
    doc_settings = [];
    doc_settings.push({
      header: "Usage",
      content: `node ${relpath} [meta] command [parameters]

[meta]:       optional general flags
command:      internal or external command to run (obligatory)
[parameters]: parameters to be passed to internal or external command;
* for internal parameters and flags, see below
* for external parameters and flags, refer to the documentation of the respective command`
    });
    doc_settings.push({
      header: "meta",
      optionList: X.meta
    });
    ref = X.internals;
    for (i = 0, len = ref.length; i < len; i++) {
      cmd = ref[i];
      doc_settings.push({
        header: `Internal command: ${cmd.name}`,
        optionList: cmd
      });
    }
    if ((Object.keys(X.externals)).length > 0) {
      descriptions = [];
      ref1 = X.externals;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        cmd = ref1[j];
        descriptions.push({
          content: `${cmd.name}: ${(ref2 = cmd.description) != null ? ref2 : '???'}`
        });
      }
      doc_settings.push({
        header: "External commands: ",
        content: descriptions
      });
    }
    return '\n' + commandLineUsage(doc_settings);
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
    usage = generate_documentation();
    usage = '\n' + (CND.blue(usage)) + '\n';
    if (message != null) {
      usage += '\n' + (CND.red(message)) + '\n';
    }
    echo(usage);
    return process.exit(code);
  };

  //-----------------------------------------------------------------------------------------------------------
  show_help_and_exit = function(code = 0, message = null) {
    var usage;
    usage = generate_documentation();
    usage = '\n' + (CND.blue(usage)) + '\n';
    if (message != null) {
      usage += '\n' + (CND.red(message)) + '\n';
    }
    echo(usage);
    return process.exit(code);
  };

  //-----------------------------------------------------------------------------------------------------------
  show_cat_and_exit = function() {
    echo();
    echo(CND.white(CND.reverse(CND.bold(`       |\\      _,,,---,,_              `))));
    echo(CND.white(CND.reverse(CND.bold(` ZZZzz /,\`.-'\`'    -.  ;-;;,_          `))));
    echo(CND.white(CND.reverse(CND.bold(`      |,4-  ) )-,_. ,\\ (  \`'-'         `))));
    echo(CND.white(CND.reverse(CND.bold(`     '---''(_/--'  \`-'\\_)  Felix Lee   `))));
    echo();
    return process.exit(0);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cli = function(argv = null) {
    var d, flag, p, q, ref, ref1, s;
    //---------------------------------------------------------------------------------------------------------
    q = {
      trace: false, // place under `meta`
      help: false, // place under `meta`
      testing: argv != null, // place under `meta`
      stage: null,
      cmd: null,
      parameters: {}
    };
    //---------------------------------------------------------------------------------------------------------
    // Stage: Metaflags
    //.........................................................................................................
    q.stage = 'meta';
    argv = argv != null ? argv : process.argv;
    d = X.meta;
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
      if (q.trace) {
        urge(CND.yellow(`working directory is now ${process.cwd()}`));
      }
    }
    //---------------------------------------------------------------------------------------------------------
    // Stage: Internal Commands
    // Internal commands must parse their specific flags and other arguments.
    //.........................................................................................................
    q.stage = 'internal';
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
        d = X.internals.help;
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
      case 'cat':
        return show_cat_and_exit();
    }
    //---------------------------------------------------------------------------------------------------------
    // Stage: External Commands
    //.........................................................................................................
    // External commands call a child process that is passed the remaing command line arguments, so those
    // can be dealt with summarily.
    //.........................................................................................................
    q.stage = 'external';
    p = parse_argv([], {
      argv,
      stopAtFirstUnknown: true
    });
    argv = pluck(p, '_unknown', []);
    q.parameters.argv = argv.slice(0);
    if (q.trace) {
      urge("Stage: External Commands", {q, argv});
    }
    /* TAINT derive list from settings */
    if ((ref1 = q.cmd) === 'psql' || ref1 === 'node' || ref1 === 'nodexh') {
      return q;
    }
    return q.error = {
      code: 115,
      message: `^cli@5480^ Unknown command ${CND.reverse(rpr(q.cmd))}`
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  run_external_command = function() {};

  // #.........................................................................................................
  // switch q.cmd
  //   #-------------------------------------------------------------------------------------------------------
  //   when 'psql'
  //     urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
  //     return resolve()
  //   #-------------------------------------------------------------------------------------------------------
  //   when 'nodexh', 'node'
  //     urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
  //     return resolve()
  //.........................................................................................................

  //-----------------------------------------------------------------------------------------------------------
  compile_settings = function(dft, usr) {
    var R, description, e, externals, internals, is_external, meta, name, ref, ref1;
    meta = [];
    internals = [];
    externals = [];
    R = {meta, internals, externals};
    if (usr.meta != null) {
      //.........................................................................................................
      validate.object(usr.meta);
    }
    ref = Object.assign({}, dft.meta, usr.meta);
    for (name in ref) {
      description = ref[name];
      if (description.name != null) {
        throw Error(`^cli@5587^ must not have attribute name, got ${rpr(description)}`);
      }
      meta.push(lets(description, function(d) {
        return d.name = name;
      }));
    }
    if (usr.commands != null) {
      //.........................................................................................................
      validate.object(usr.commands);
    }
    ref1 = Object.assign({}, dft.commands, usr.commands);
    for (name in ref1) {
      description = ref1[name];
      if (description.name != null) {
        throw Error(`^cli@5588^ must not have attribute name, got ${rpr(description)}`);
      }
      is_external = false;
      e = lets(description, function(d) {
        d.name = name;
        return is_external = pluck(d, 'external', false);
      });
      if (is_external) {
        externals.push(e);
      } else {
        internals.push(e);
      }
    }
    //.........................................................................................................
    return freeze(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  default_settings = freeze({
    meta: {
      help: {
        alias: 'h',
        type: Boolean,
        description: "show help and exit"
      },
      cd: {
        alias: 'd',
        type: String,
        description: "change to directory before running command"
      },
      trace: {
        alias: 't',
        type: Boolean,
        description: "trace options parsing (for debugging)"
      }
    },
    commands: {
      cat: {
        description: "draw a cat"
      },
      version: {
        description: "show project version and exit"
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  user_settings = freeze({
    // meta:
    // internal:
    commands: {
      psql: {
        external: true,
        description: "use `psql` to run SQL"
      },
      node: {
        external: true,
        description: "use `node` to run JS"
      },
      nodexh: {
        external: true,
        description: "use `nodexh` to run JS"
      }
    }
  });

  X = compile_settings(default_settings, user_settings);

  debug('^6767^', JSON.stringify(X, null, '  '));

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return debug('^3387^', (await this.cli()));
    })();
  }

  // debug await @cli [ '-t', null, '-t', ]

  // {
//   header: 'Typical Example',
//   content: 'A simple example demonstrating typical usage.'
// },
// {
//   content: 'Project home: {underline https://github.com/me/example}'
// }

}).call(this);

//# sourceMappingURL=demo.js.map