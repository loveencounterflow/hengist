(function() {
  'use strict';
  var CND, PATH, _strip_ansi, badge, debug, demo_1, demo_2, demo_3, demo_configurator, demo_generator, echo, freeze, help, info, lets, resolve_recursively, rpr, strip_ansi, test, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/MIXA';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  _strip_ansi = require('strip-ansi');

  types = new (require('intertype')).Intertype();

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

  //-----------------------------------------------------------------------------------------------------------
  strip_ansi = function(x) {
    var type;
    switch (type = types.type_of(x)) {
      case 'text':
        return _strip_ansi(x);
      case 'object':
        return lets(x, function(x) {
          var k, results1, v;
          results1 = [];
          for (k in x) {
            v = x[k];
            results1.push(x[k] = strip_ansi(v));
          }
          return results1;
        });
      case 'list':
        return lets(x, function(x) {
          var i, k, len, results1, v;
          results1 = [];
          for (v = i = 0, len = x.length; i < len; v = ++i) {
            k = x[v];
            results1.push(x[k] = strip_ansi(v));
          }
          return results1;
        });
    }
    return x;
  };

  //-----------------------------------------------------------------------------------------------------------
  resolve_recursively = function(x, path) {
    var R, i, len, p;
    R = x;
    for (i = 0, len = path.length; i < len; i++) {
      p = path[i];
      R = R[p];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA types"] = async function(T, done) {
    var MIXA, error, i, len, matcher, probe, probes_and_matchers;
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'mixa_flagdef',
          {
            alias: 'h',
            type: Boolean,
            description: "show help and exit"
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'd',
            type: String,
            description: "change to directory before running command"
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 't',
            type: Boolean,
            description: "trace options parsing (for debugging)"
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            name: 'XXXX',
            alias: 't',
            type: Boolean,
            description: "trace options parsing (for debugging)"
          }
        ],
        false
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: false,
            type: Boolean,
            description: "trace options parsing (for debugging)"
          }
        ],
        false
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'd',
            type: false
          }
        ],
        false
      ],
      [
        [
          'mixa_flagdef',
          {
            description: 489234
          }
        ],
        false
      ],
      [['mixa_jobdef',
      null],
      false],
      [['mixa_flagdefs',
      null],
      false],
      [['mixa_cmddefs',
      null],
      false],
      [['_mixa_multiple',
      null],
      true],
      [['mixa_cmddef',
      null],
      false],
      [['mixa_cmddef',
      {}],
      true],
      [
        [
          'mixa_cmddef',
          {
            name: 'abc'
          }
        ],
        false
      ],
      [
        [
          'mixa_cmddef',
          {
            someother: 'abc'
          }
        ],
        false
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: false
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: null
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b',
                lazyMultiple: true
              }
            }
          }
        ],
        false
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b',
                multiple: true
              }
            }
          }
        ],
        false
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'b'
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'b',
            multiple: false
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'b',
            multiple: 'greedy'
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdef',
          {
            alias: 'b',
            multiple: 'lazy'
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdefs',
          {
            blah: {
              alias: 'b'
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdefs',
          {
            blah: {
              alias: 'b',
              multiple: false
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdefs',
          {
            blah: {
              alias: 'b',
              multiple: 'greedy'
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_flagdefs',
          {
            blah: {
              alias: 'b',
              multiple: 'lazy'
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b'
              }
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b',
                multiple: false
              }
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b',
                multiple: 'greedy'
              }
            }
          }
        ],
        true
      ],
      [
        [
          'mixa_cmddef',
          {
            description: 'great',
            allow_extra: true,
            flags: {
              blah: {
                alias: 'b',
                multiple: 'lazy'
              }
            }
          }
        ],
        true
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var type, value;
          [type, value] = probe;
          //.....................................................................................................
          if (matcher) {
            try {
              MIXA.types.validate(type, value);
              T.ok(true);
            } catch (error1) {
              error = error1;
              T.fail(`testcase-8936698: ${rpr(error.message)}`);
            }
          } else {
            try {
              //.....................................................................................................
              MIXA.types.validate(type, value);
              T.fail('testcase-893457');
            } catch (error1) {
              error = error1;
              T.ok(true);
            }
          }
          //.....................................................................................................
          return resolve(MIXA.types.isa(type, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with defaults"] = async function(T, done) {
    var MIXA, error, i, len, matcher, probe, probes_and_matchers;
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    probes_and_matchers = [
      [
        [],
        {
          error: {
            code: 10,
            tag: 'MISSING_CMD',
            message: 'missing command'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['-h'],
        {
          cmd: 'help'
        },
        null
      ],
      [
        ['--help'],
        {
          cmd: 'help'
        },
        null
      ],
      [
        ['help'],
        {
          argv: [],
          parameters: {},
          cmd: 'help'
        },
        null
      ],
      [
        ['help cats!'],
        {
          error: {
            code: 11,
            tag: 'UNKNOWN_CMD',
            message: "unknown command 'help cats!'"
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['help',
        'cats!'],
        {
          argv: [],
          parameters: {
            topic: 'cats!'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--cd',
        'some/place',
        'help',
        'cats!'],
        {
          cd: 'some/place',
          argv: [],
          parameters: {
            topic: 'cats!'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['-d'],
        {
          error: {
            code: 13,
            tag: 'NEEDS_VALUE',
            message: 'must give target directory when using --dd, -d'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--cd'],
        {
          error: {
            code: 13,
            tag: 'NEEDS_VALUE',
            message: 'must give target directory when using --dd, -d'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['-d',
        'some/where'],
        {
          cd: 'some/where',
          error: {
            code: 10,
            tag: 'MISSING_CMD',
            message: 'missing command'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--cd',
        'some/where'],
        {
          cd: 'some/where',
          error: {
            code: 10,
            tag: 'MISSING_CMD',
            message: 'missing command'
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['-x'],
        {
          error: {
            code: 14,
            tag: 'UNKNOWN_FLAG',
            message: "unknown flag '-x'"
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--xxx'],
        {
          error: {
            code: 14,
            tag: 'UNKNOWN_FLAG',
            message: "unknown flag '--xxx'"
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--cd',
        'some/place',
        'ls'],
        {
          cd: 'some/place',
          error: {
            code: 11,
            tag: 'UNKNOWN_CMD',
            message: "unknown command 'ls'"
          },
          cmd: 'help'
        },
        null
      ],
      [
        ['--cd',
        'some/place',
        'cats!'],
        {
          cd: 'some/place',
          argv: [],
          parameters: {},
          cmd: 'cats!'
        },
        null
      ],
      [
        ['version'],
        {
          argv: [],
          parameters: {},
          cmd: 'version'
        },
        null
      ],
      [
        ['cats!'],
        {
          argv: [],
          parameters: {},
          cmd: 'cats!'
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve((strip_ansi(MIXA.parse({}, probe))).verdict);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with settings 1"] = function(T, done) {
    var MIXA, jobdef, result;
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    jobdef = {
      commands: {
        psql: {
          allow_extra: true,
          description: "use `psql` to run SQL"
        },
        node: {
          allow_extra: true,
          description: "use `node` to run JS"
        },
        nodexh: {
          allow_extra: true,
          description: "use `nodexh` to run JS"
        }
      }
    };
    result = MIXA.parse(jobdef, ['psql', '-c', 'select * from CATALOG.catalog;']);
    debug('^334-1^', result);
    T.eq(result.verdict, {
      argv: ['-c', 'select * from CATALOG.catalog;'],
      parameters: {},
      cmd: 'psql'
    });
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA settings validation 1"] = async function(T, done) {
    var MIXA, error, i, isa, jobdef, len, matcher, probe, probes_and_matchers, validate;
    MIXA = require('../../../apps/mixa');
    ({isa, validate} = MIXA.types.export());
    //.........................................................................................................
    jobdef = {
      commands: {
        psql: {
          description: "use `psql` to run SQL",
          allow_extra: false,
          flags: {
            command: {
              alias: 'c',
              type: String,
              multiple: 'lazy',
              description: ''
            },
            file: {
              alias: 'f',
              type: String,
              multiple: 'lazy',
              description: ''
            },
            user: {
              alias: 'U',
              type: String,
              description: ''
            }
          }
        }
      }
    };
    //.........................................................................................................
    probes_and_matchers = [[['mixa_flagdef', ['commands', 'psql', 'flags', 'command']], true], [['mixa_flagdef', ['commands', 'psql', 'flags', 'file']], true], [['mixa_flagdef', ['commands', 'psql', 'flags', 'user']], true], [['mixa_flagdefs', ['commands', 'psql', 'flags']], true], [['mixa_cmddef', ['commands', 'psql']], true], [['mixa_cmddefs', ['commands']], true], [['mixa_jobdef', []], true]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var path, type, value;
          [type, path] = probe;
          value = resolve_recursively(jobdef, path);
          // debug '^33334^', ( d for d in ( MIXA.types.types_of value ) when /mixa/.test d ), CND.grey value
          return resolve(MIXA.types.isa(type, value));
        });
      });
    }
    try {
      //.........................................................................................................
      validate.mixa_flagdef(jobdef.commands.psql.flags.command);
      T.ok(true);
    } catch (error1) {
      error = error1;
      T.fail("^testcase-8779345^");
      warn('^3908^', error.message);
    }
    try {
      //.........................................................................................................
      validate.mixa_jobdef(jobdef);
      T.ok(true);
    } catch (error1) {
      error = error1;
      T.fail("^testcase-777362^");
      warn('^3908^', error.message);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA settings validation 2"] = function(T, done) {
    var MIXA, isa, jobdef, result, validate;
    MIXA = require('../../../apps/mixa');
    ({isa, validate} = MIXA.types.export());
    //.........................................................................................................
    jobdef = {
      commands: {
        psql: {
          description: "use `psql` to run SQL",
          allow_extra: false,
          flags: {
            command: {
              alias: 'c',
              type: String,
              multiple: 'lazy',
              description: ''
            },
            file: {
              alias: 'f',
              type: String,
              multiple: 'lazy',
              description: ''
            },
            user: {
              alias: 'U',
              type: String,
              description: '',
              xxxxxxxxxxxxxx: true
            }
          }
        }
      }
    };
    //.........................................................................................................
    result = MIXA._compile_jobdef(jobdef);
    debug('^33736^', result);
    T.eq(MIXA.types.is_sad(result), true);
    T.eq(result, {
      error: {
        code: 17,
        tag: 'ILLEGAL_SETTINGS',
        message: "not a valid mixa_jobdef object: violates 'x.?commands is a mixa_cmddefs'"
      },
      cmd: 'help'
    });
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with settings 2"] = function(T, done) {
    var MIXA, jobdef, result;
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    jobdef = {
      commands: {
        psql: {
          description: "use `psql` to run SQL",
          allow_extra: false,
          flags: {
            command: {
              alias: 'c',
              type: String,
              multiple: false,
              description: ''
            },
            file: {
              alias: 'f',
              type: String,
              multiple: false,
              description: ''
            },
            user: {
              alias: 'U',
              type: String,
              description: ''
            }
          }
        }
      }
    };
    //.........................................................................................................
    // debug '^7766^', jobdef.commands.psql.flags.file
    // debug '^7766^', MIXA.types.isa.mixa_flagdef jobdef.commands.psql.flags.file
    // debug '^7766^', MIXA._compile_jobdef jobdef; process.exit 1
    MIXA.types.validate.mixa_flagdef(jobdef.commands.psql.flags.command);
    MIXA.types.validate.mixa_flagdef(jobdef.commands.psql.flags.file);
    MIXA.types.validate.mixa_flagdef(jobdef.commands.psql.flags.user);
    //.........................................................................................................
    result = MIXA.parse(jobdef, ['psql', '-c', 'select * from CATALOG.catalog;']);
    debug('^334-2^', result);
    // T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
    //.........................................................................................................
    result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 42;']);
    debug('^334-2^', result);
    // T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
    //.........................................................................................................
    result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 42;']);
    debug('^334-2^', result);
    // T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
    // #.........................................................................................................
    // result = MIXA.parse jobdef, [ 'psql', '-f', 'path/to/this.sql', 'path/to/that.sql' ]
    // debug '^334-3^', result
    // T.eq result, {
    //   argv: [ 'path/to/that.sql' ],
    //   parameters: { file: [ 'path/to/this.sql' ] },
    //   error: {
    //     code: 15,
    //     tag: 'EXTRA_FLAGS',
    //     message: "command 'psql' does not allow extra, got [ 'path/to/that.sql' ]" },
    //   cmd: 'help' }
    // #.........................................................................................................
    // result = MIXA.parse jobdef, [ 'psql', '-U', 'jpfx', '-f', 'path/to/this.sql', '-f', 'path/to/that.sql' ]
    // debug '^334-4^', result
    // T.eq result, { argv: [], parameters: { user: 'jpfx', file: [ 'path/to/this.sql', 'path/to/that.sql' ] }, cmd: 'psql' }
    // #.........................................................................................................
    // # debug '^334-5^', MIXA._compile_jobdef jobdef
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with settings 3"] = function(T, done) {
    var MIXA, jobdef, result;
    jobdef = {
      commands: {
        psql: {
          allow_extra: false,
          flags: {
            command: {
              alias: 'c',
              type: String,
              multiple: false
            },
            file: {
              alias: 'f',
              type: String,
              multiple: false
            },
            user: {
              alias: 'U',
              type: String
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    jobdef.commands.psql.flags.command.multiple = false;
    urge('^5554-1^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-1^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      error: {
        code: 16,
        tag: 'OTHER',
        message: 'Singular option already set [command=select 42;]'
      },
      cmd: 'help'
    });
    debug('^4445-2^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      argv: ['select 43;', '-U', 'x'],
      parameters: {
        command: 'select 42;'
      },
      error: {
        code: 15,
        tag: 'EXTRA_FLAGS',
        message: "command 'psql' does not allow extra, got [ 'select 43;', '-U', 'x' ]"
      },
      cmd: 'help'
    });
    jobdef.commands.psql.flags.command.multiple = 'lazy';
    urge('^5554-2^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-3^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      argv: [],
      parameters: {
        command: ['select 42;', 'select 43;'],
        user: 'x'
      },
      cmd: 'psql'
    });
    debug('^4445-4^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      argv: ['select 43;', '-U', 'x'],
      parameters: {
        command: ['select 42;']
      },
      error: {
        code: 15,
        tag: 'EXTRA_FLAGS',
        message: "command 'psql' does not allow extra, got [ 'select 43;', '-U', 'x' ]"
      },
      cmd: 'help'
    });
    jobdef.commands.psql.flags.command.multiple = 'greedy';
    urge('^5554-3^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-5^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      argv: [],
      parameters: {
        command: ['select 42;', 'select 43;'],
        user: 'x'
      },
      cmd: 'psql'
    });
    debug('^4445-6^', result = MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    T.eq(result.verdict, {
      argv: [],
      parameters: {
        command: ['select 42;', 'select 43;'],
        user: 'x'
      },
      cmd: 'psql'
    });
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with settings 4"] = function(T, done) {
    var MIXA, jobdef;
    jobdef = {
      commands: {
        frobulate: {
          allow_extra: false,
          flags: {
            width: {
              alias: 'w',
              type: Number,
              fallback: 123
            },
            height: {
              alias: 'h',
              type: Number,
              // positional:     true
              fallback: 10
            },
            image: {
              alias: 'i',
              positional: true,
              type: String
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    if (T != null) {
      T.eq((MIXA.parse(jobdef, ['frobulate', 'path/to/image'])).verdict, {
        argv: [],
        parameters: {
          width: 123,
          height: 10,
          image: 'path/to/image'
        },
        cmd: 'frobulate'
      });
    }
    jobdef.commands.frobulate.flags.image.positional = false;
    if (T != null) {
      T.eq((MIXA.parse(jobdef, ['frobulate', 'path/to/image'])).verdict, {
        argv: ['path/to/image'],
        parameters: {
          width: 123,
          height: 10
        },
        error: {
          code: 15,
          tag: 'EXTRA_FLAGS',
          message: "command 'frobulate' does not allow extra, got [ 'path/to/image' ]"
        },
        cmd: 'help'
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA parse with default command"] = function(T, done) {
    var MIXA, jobdef, jubilee_runner, result;
    jubilee_runner = function(...P) {
      return 42;
    };
    jobdef = {
      default_command: 'jubilee',
      commands: {
        jubilee: {
          runner: jubilee_runner
        },
        frobulate: {
          allow_extra: false,
          flags: {
            width: {
              alias: 'w',
              type: Number,
              fallback: 123
            },
            height: {
              alias: 'h',
              type: Number,
              // positional:     true
              fallback: 10
            },
            image: {
              alias: 'i',
              positional: true,
              type: String
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    if (T != null) {
      T.eq((MIXA.parse(jobdef, ['jubilee'])).verdict, {
        argv: [],
        parameters: {},
        runner: jubilee_runner,
        cmd: 'jubilee'
      });
    }
    if (T != null) {
      T.eq((MIXA.parse(jobdef, [])).verdict, {
        argv: [],
        parameters: {},
        runner: jubilee_runner,
        cmd: 'jubilee'
      });
    }
    result = MIXA.run(jobdef, []);
    if (T != null) {
      T.eq(types.type_of(result), 'object');
    }
    if (T != null) {
      T.eq(types.type_of(result.verdict), 'object');
    }
    if (T != null) {
      T.eq(result.verdict.argv, []);
    }
    if (T != null) {
      T.eq(result.verdict.parameters, {});
    }
    if (T != null) {
      T.eq(result.verdict.cmd, 'jubilee');
    }
    if (T != null) {
      T.eq(result.verdict.runner, jubilee_runner);
    }
    if (T != null) {
      T.eq(result.output, 42);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA inhibitor avoids rewriting of single-dash flags"] = function(T, done) {
    var MIXA, jobdef, result;
    jobdef = {
      commands: {
        search: {
          allow_extra: true,
          flags: {
            verbose: {
              alias: 'v',
              type: Boolean
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    // demonstrate problematic behavior; this should be configurable but for now users must remember to insert
    // `'--'` at the appropriate position:
    result = MIXA.parse(jobdef, ['search', '-iname', 'whatever']);
    // debug '^33344^', result
    T.eq(result.verdict.argv, ['-i', '-n', '-a', '-m', '-e', 'whatever']);
    //.........................................................................................................
    result = MIXA.parse(jobdef, ['search', '--', '-iname', 'whatever']);
    // debug '^33344^', result
    T.eq(result.verdict.argv, ['-iname', 'whatever']);
    if (done != null) {
      //.........................................................................................................
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["MIXA --cd changes process directory"] = function(T, done) {
    var MIXA, dpath, jobdef, opath, result;
    MIXA = require('../../../apps/mixa');
    //.........................................................................................................
    jobdef = {
      commands: {
        foo: {
          runner: function(d) {
            help('^223392^', d);
            urge(process.cwd());
            urge(dpath);
            return T.eq(process.cwd(), dpath);
          }
        }
      }
    };
    //.........................................................................................................
    opath = process.cwd();
    dpath = __dirname;
    if (dpath === opath) {
      process.chdir('..');
    }
    // result  = MIXA.run jobdef, [ 'foo', ]
    result = MIXA.run(jobdef, ['--cd', dpath, 'foo']);
    T.eq(result.verdict.cd, dpath);
    process.chdir(opath);
    if (done != null) {
      //.........................................................................................................
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3 = function() {
    var MIXA, compiled_settings, jobdef, result;
    jobdef = {
      commands: {
        multiply: {
          flags: {
            a: {
              alias: 'a',
              type: Number,
              fallback: 1
            },
            b: {
              alias: 'b',
              type: Number,
              fallback: 1
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    compiled_settings = MIXA._compile_jobdef(jobdef);
    if (MIXA.types.is_sad(compiled_settings)) {
      warn('^44445^', compiled_settings);
    } else {
      help('^44445^', compiled_settings);
    }
    result = MIXA.parse(jobdef, ['frobulate', '--width', '123']);
    if (MIXA.types.is_sad(result)) {
      warn('^44445^', result);
    } else {
      help('^44445^', result);
    }
    if (typeof done !== "undefined" && done !== null) {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var MIXA, compiled_settings, jobdef, ref, ref1, result;
    jobdef = {
      commands: {
        frobulate: {
          allow_extra: false,
          flags: {
            width: {
              alias: 'w',
              type: Number,
              fallback: 123
            },
            height: {
              alias: 'h',
              type: Number,
              fallback: 10
            },
            image: {
              alias: 'i',
              positional: true,
              type: String
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    compiled_settings = MIXA._compile_jobdef(jobdef);
    if (MIXA.types.is_sad(compiled_settings)) {
      warn('^44445^', compiled_settings);
    } else {
      help('^44445^', compiled_settings);
    }
    result = MIXA.parse(jobdef, ['frobulate', '--width', '123']);
    if (MIXA.types.is_sad(result)) {
      warn('^44445^', result);
    } else {
      help('^44445^', result);
    }
    debug('^344874-1^', (ref = (MIXA._compile_jobdef(jobdef)).commands) != null ? (ref1 = ref.frobulate) != null ? ref1.flags : void 0 : void 0);
    debug('^344874-2^', result = MIXA.parse(jobdef, ['frobulate', '--width', '123']));
    debug('^344874-3^', result = MIXA.parse(jobdef, ['frobulate', '--width']));
    debug('^344874-4^', result = MIXA.parse(jobdef, ['frobulate', '-w', '123', '-h', '99']));
    debug('^344874-5^', result = MIXA.parse(jobdef, ['frobulate', '-w', '-h', '99']));
    debug('^344874-6^', result = MIXA.parse(jobdef, ['frobulate']));
    debug('^344874-6^', result = MIXA.parse(jobdef, ['frobulate', 'path/to/image']));
    jobdef.commands.frobulate.flags.image.positional = false;
    debug('^344874-6^', result = MIXA.parse(jobdef, ['frobulate', 'path/to/image']));
    if (typeof done !== "undefined" && done !== null) {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var MIXA, jobdef;
    jobdef = {
      commands: {
        psql: {
          allow_extra: false,
          // run:          MIXA.run.execSync
          flags: {
            command: {
              alias: 'c',
              type: String,
              multiple: false
            },
            file: {
              alias: 'f',
              type: String,
              multiple: false
            },
            user: {
              alias: 'U',
              type: String
            }
          }
        }
      }
    };
    MIXA = require('../../../apps/mixa');
    jobdef.commands.psql.flags.command.multiple = false;
    urge('^5554-1^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-1^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    debug('^4445-2^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    jobdef.commands.psql.flags.command.multiple = 'lazy';
    urge('^5554-2^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-3^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    debug('^4445-4^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    jobdef.commands.psql.flags.command.multiple = 'greedy';
    urge('^5554-3^', (MIXA._compile_jobdef(jobdef)).commands.psql.flags);
    debug('^4445-5^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x']));
    debug('^4445-6^', MIXA.parse(jobdef, ['psql', '-c', 'select 42;', 'select 43;', '-U', 'x']));
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @demo_run_1 = ( T, done ) ->
  //   MIXA = require '../../../apps/mixa'
  //   jobdef =
  //     exit_on_error:  false
  //     meta:
  //       hqx: { type: String, }
  //     commands:
  //       list:
  //         allow_extra:  true
  //         runner:       MIXA.runners.execSync
  //         plus:         { executable: 'ls', }
  //         flags:
  //           table: { alias: 't', description: "format as ASCII table", type: Boolean, }
  //   # debug '^4445-1^', MIXA.parse jobdef, [ 'ls', '-AlF', ]
  //   # urge '^21226^', MIXA.parse jobdef, [ '-hd', 'xx/yy', 'ls', '-AlF', ]
  //   # urge '^21226^', MIXA.parse jobdef, [ 'ls', 'find', '--', 'dev', '-iname', '*benchmark*', ]
  //   # result = MIXA.parse jobdef, [ '--cd', '/tmp', 'list', '--', '-AlF', '.', ]
  //   PATH = require 'path'
  //   path = PATH.relative process.cwd(), PATH.resolve PATH.join __dirname, '../src'
  //   #.........................................................................................................
  //   echo '-'.repeat 108
  //   result = MIXA.run jobdef, [ '--cd', path, 'list', '--', '-AlF', '.', ]
  //   urge '^21226^', result
  //   ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  //   # #.........................................................................................................
  //   # echo '-'.repeat 108
  //   # result = MIXA.run jobdef, [ '--cd', path, 'list', '--', '-AlF', '*', ]
  //   # urge '^21226^', result
  //   # ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  //   # #.........................................................................................................
  //   # echo '-'.repeat 108
  //   # result = MIXA.run jobdef, [ '--cd', path, ]
  //   # urge '^21226^', result
  //   # ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  //   # #.........................................................................................................
  //   # echo '-'.repeat 108
  //   # debug '^2233^', process.argv
  //   # help ( MIXA.parse jobdef, [ '--cd', path, 'list', ] ).verdict
  //   # help ( MIXA.parse jobdef, [ 'node', '--cd', path, 'list', ] ).verdict
  //   # help ( MIXA.parse jobdef, [ '/usr/local/bin/node', '--cd', path, 'list', ] ).verdict
  //   # help ( MIXA.parse jobdef, [ '/usr/local/bin/node', '/path/to/file', '--cd', path, 'list', ] ).verdict
  //   # help ( MIXA.parse jobdef, process.argv ).verdict
  //   # help ( MIXA.parse jobdef, process.argv[ .. ] ).verdict
  //   return done?()

  //-----------------------------------------------------------------------------------------------------------
  demo_generator = function() {
    return new Promise(async(done) => {
      var $, $drain, $watch, SP, g, pipeline, ref, source, x;
      //---------------------------------------------------------------------------------------------------------
      g = async function*() {
        /* thx to https://stackoverflow.com/a/59347615/7568091 */
        var cp, new_catcher, promise, resolve, results, results1, spawn, x;
        ({spawn} = require('child_process'));
        results = [];
        resolve = () => {
          return null;
        };
        promise = new Promise((r) => {
          return resolve = r;
        });
        done = false;
        // cp         = spawn 'ls', [ '-AlF', ]
        // cp         = spawn 'cat', [ __filename, ]
        cp = spawn('node', [PATH.join(__dirname, '_generator.js')]);
        // cp.stdout.setEncoding 'utf-8'
        // cp.stderr.setEncoding 'utf-8'
        //.......................................................................................................
        new_catcher = function($key) {
          return (data) => {
            var $value, i, len, ref;
            if (types.isa.buffer(data)) {
              data = data.toString();
            }
            data = data.replace(/\n$/, '');
            ref = data.split('\n');
            for (i = 0, len = ref.length; i < len; i++) {
              $value = ref[i];
              results.push(Object.freeze({$key, $value}));
            }
            resolve();
            return promise = new Promise((r) => {
              return resolve = r;
            });
          };
        };
        //.......................................................................................................
        cp.stdout.on('data', new_catcher('^stdout'));
        cp.stderr.on('data', new_catcher('^stderr'));
        cp.on('error', new_catcher('^error'));
        //.......................................................................................................
        cp.on('close', () => {
          return done = true;
        });
        results1 = [];
        //.......................................................................................................
        while (!done) {
          await promise;
// debug '^334455^', rpr results
          for (x of results) {
            yield x;
          }
          results1.push(results = []);
        }
        return results1;
      };
      //---------------------------------------------------------------------------------------------------------
      debug('^3334^');
      SP = require('steampipes');
      ({$, $watch, $drain} = SP.export());
      source = SP.new_push_source();
      pipeline = [];
      pipeline.push(source);
      // pipeline.push SP.$split()
      pipeline.push($watch(function(d) {
        return urge(d);
      }));
      pipeline.push($drain(function() {
        return done();
      }));
      SP.pull(...pipeline);
      ref = g();
      for await (x of ref) {
        source.send(x);
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this["configurator"] = function(T, done) {
    var H, MIXA, cfg, key, value;
    H = require('../../../lib/helpers');
    MIXA = require('../../../apps/mixa');
    cfg = MIXA.configurator.read_cfg('hengist-mixa');
    cfg = (function() {
      var results1;
      results1 = [];
      for (key in cfg) {
        value = cfg[key];
        results1.push({key, value});
      }
      return results1;
    })();
    H.tabulate("cfg", cfg);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_configurator = function() {
    var H, MIXA, flatten;
    H = require('../../../lib/helpers');
    MIXA = require('../../../apps/mixa');
    flatten = require('flat');
    (() => {      //.........................................................................................................
      var cfg, key, value;
      cfg = MIXA.configurator.read_cfg();
      info((require('util')).inspect(cfg));
      cfg = flatten(cfg, {
        delimiter: '.'
      });
      cfg = (function() {
        var results1;
        results1 = [];
        for (key in cfg) {
          value = cfg[key];
          results1.push({key, value});
        }
        return results1;
      })();
      return H.tabulate("cfg", cfg);
    })();
    (() => {      //.........................................................................................................
      var cfg, key, value;
      cfg = MIXA.configurator.read_cfg({
        start_path: __dirname,
        module_name: 'hengist'
      });
      info((require('util')).inspect(cfg));
      cfg = flatten(cfg, {
        delimiter: '.'
      });
      cfg = (function() {
        var results1;
        results1 = [];
        for (key in cfg) {
          value = cfg[key];
          results1.push({key, value});
        }
        return results1;
      })();
      return H.tabulate("cfg", cfg);
    })();
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // MIXA = require '../../../apps/mixa'
      // debug '^4445^', MIXA.parse null, [ '--cd', 'some/place', 'ls', ]
      // debug '^4445^', MIXA.parse null, [ 'cats!' ]
      demo_configurator();
      return test(this);
    })();
  }

  // test @[ "MIXA --cd changes process directory" ]
// test @[ "MIXA parse with defaults" ]
// test @[ "MIXA settings validation 2" ]
// test @[ "MIXA types" ]
// test @[ "MIXA parse with settings 3" ]
// test @[ "MIXA parse with settings 1" ]
// @[ "MIXA parse with default command" ]()
// test @[ "MIXA parse with default command" ]
// test @[ "MIXA inhibitor avoids rewriting of single-dash flags" ]
// demo_3()
// @demo_run_1()
// test @[ "demo_run_1" ]
// await demo_generator()

}).call(this);

//# sourceMappingURL=main.tests.js.map