



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/MIXA'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
_strip_ansi               = require 'strip-ansi'
types                     = new ( require 'intertype' ).Intertype()
{ freeze
  lets }                  = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
# resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
strip_ansi = ( x ) ->
  switch type = types.type_of x
    when 'text'   then return _strip_ansi x
    when 'object' then return lets x, ( x ) -> x[ k ] = strip_ansi v for k, v of x
    when 'list'   then return lets x, ( x ) -> x[ k ] = strip_ansi v for k, v in x
  return x

#-----------------------------------------------------------------------------------------------------------
resolve_recursively = ( x, path ) ->
  R = x
  for p in path
    R = R[ p ]
  return R

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA types" ] = ( T, done ) ->
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'mixa_flagdef', { alias: 'h', type: Boolean, description: "show help and exit", }, ], true, ]
    [ [ 'mixa_flagdef', { alias: 'd', type: String,  description: "change to directory before running command", }, ], true, ]
    [ [ 'mixa_flagdef', { alias: 't', type: Boolean, description: "trace options parsing (for debugging)", }, ], true, ]
    [ [ 'mixa_flagdef', { name: 'XXXX', alias: 't', type: Boolean, description: "trace options parsing (for debugging)", }, ], false, ]
    [ [ 'mixa_flagdef', { alias: false, type: Boolean, description: "trace options parsing (for debugging)", }, ], false, ]
    [ [ 'mixa_flagdef', { alias: 'd', type: false, }, ], false, ]
    [ [ 'mixa_flagdef', { description: 489234, }, ], false, ]
    [ [ 'mixa_jobdef',    null, ], false, ]
    [ [ 'mixa_flagdefs',    null, ], false, ]
    [ [ 'mixa_cmddefs',     null, ], false, ]
    [ [ '_mixa_multiple',   null, ], true, ]
    [ [ 'mixa_cmddef',      null, ], false, ]

    [ [ 'mixa_cmddef',      {}, ], true, ]
    [ [ 'mixa_cmddef',      { name: 'abc', }, ], false, ]
    [ [ 'mixa_cmddef',      { someother: 'abc', }, ], false, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: false, }, ], true, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: null, }, ], true, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', lazyMultiple: true } }, }, ], false, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', multiple: true } }, }, ], false, ]

    [ [ 'mixa_flagdef',     { alias: 'b', }                        ], true, ]
    [ [ 'mixa_flagdef',     { alias: 'b', multiple: false }        ], true, ]
    [ [ 'mixa_flagdef',     { alias: 'b', multiple: 'greedy', }    ], true, ]
    [ [ 'mixa_flagdef',     { alias: 'b', multiple: 'lazy', }      ], true, ]

    [ [ 'mixa_flagdefs',    { blah: { alias: 'b', } },                     ], true, ]
    [ [ 'mixa_flagdefs',    { blah: { alias: 'b', multiple: false } },     ], true, ]
    [ [ 'mixa_flagdefs',    { blah: { alias: 'b', multiple: 'greedy', } }, ], true, ]
    [ [ 'mixa_flagdefs',    { blah: { alias: 'b', multiple: 'lazy', } },   ], true, ]

    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', } }, }, ], true, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', multiple: false } }, }, ], true, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', multiple: 'greedy', } }, }, ], true, ]
    [ [ 'mixa_cmddef',      { description: 'great', allow_extra: true, flags: { blah: { alias: 'b', multiple: 'lazy', } }, }, ], true, ]

    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ type, value, ] = probe
      #.....................................................................................................
      if matcher
        try
          MIXA.types.validate type, value
          T.ok true
        catch error
          T.fail "testcase-8936698: #{rpr error.message}"
      #.....................................................................................................
      else
        try
          MIXA.types.validate type, value
          T.fail 'testcase-893457'
        catch error
          T.ok true
      #.....................................................................................................
      resolve MIXA.types.isa type, value
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA parse with defaults" ] = ( T, done ) ->
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  probes_and_matchers = [
    [ [], { error: { code: 10, tag: 'MISSING_CMD', message: 'missing command' }, cmd: 'help' }, null ]
    [ [ '-h' ], { cmd: 'help' }, null ]
    [ [ '--help' ], { cmd: 'help' }, null ]
    [ [ 'help' ], { argv: [], parameters: {}, cmd: 'help' }, null ]
    [ [ 'help cats!' ], { error: { code: 11, tag: 'UNKNOWN_CMD', message: "unknown command 'help cats!'" }, cmd: 'help' }, null ]
    [ [ 'help', 'cats!' ], { argv: [], parameters: { topic: 'cats!' }, cmd: 'help' }, null ]
    [ [ '--cd', 'some/place', 'help', 'cats!' ], { cd: 'some/place', argv: [], parameters: { topic: 'cats!' }, cmd: 'help' }, null ]
    [ [ '-d' ], { error: { code: 13, tag: 'NEEDS_VALUE', message: 'must give target directory when using --dd, -d' }, cmd: 'help' }, null ]
    [ [ '--cd' ], { error: { code: 13, tag: 'NEEDS_VALUE', message: 'must give target directory when using --dd, -d' }, cmd: 'help' }, null ]
    [ [ '-d', 'some/where' ], { cd: 'some/where', error: { code: 10, tag: 'MISSING_CMD', message: 'missing command' }, cmd: 'help' }, null ]
    [ [ '--cd', 'some/where' ], { cd: 'some/where', error: { code: 10, tag: 'MISSING_CMD', message: 'missing command' }, cmd: 'help' }, null ]
    [ [ '-x' ], { error: { code: 14, tag: 'UNKNOWN_FLAG', message: "unknown flag '-x'" }, cmd: 'help' }, null ]
    [ [ '--xxx' ], { error: { code: 14, tag: 'UNKNOWN_FLAG', message: "unknown flag '--xxx'" }, cmd: 'help' }, null ]
    [ [ '--cd', 'some/place', 'ls' ], { cd: 'some/place', error: { code: 11, tag: 'UNKNOWN_CMD', message: "unknown command 'ls'" }, cmd: 'help' }, null ]
    [ [ '--cd', 'some/place', 'cats!' ], { cd: 'some/place', argv: [], parameters: {}, cmd: 'cats!' }, null ]
    [ [ 'version' ], { argv: [], parameters: {}, cmd: 'version' }, null ]
    [ [ 'cats!' ], { argv: [], parameters: {}, cmd: 'cats!' }, null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve ( strip_ansi MIXA.parse {}, probe ).verdict
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA parse with settings 1" ] = ( T, done ) ->
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  jobdef =
    commands:
      psql:
        allow_extra: true
        description: "use `psql` to run SQL"
      node:
        allow_extra: true
        description: "use `node` to run JS"
      nodexh:
        allow_extra: true
        description: "use `nodexh` to run JS"
  result = MIXA.parse jobdef, [ 'psql', '-c', 'select * from CATALOG.catalog;', ]
  debug '^334-1^', result
  T.eq result.verdict, { argv: [ '-c', 'select * from CATALOG.catalog;' ], parameters: {}, cmd: 'psql' }
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA settings validation 1" ] = ( T, done ) ->
  MIXA          = require '../../../apps/mixa'
  { isa
    validate  } = MIXA.types.export()
  #.........................................................................................................
  jobdef =
    commands:
      psql:
        description: "use `psql` to run SQL"
        allow_extra: false
        flags:
          command:  { alias: 'c', type: String, multiple: 'lazy', description: '', }
          file:     { alias: 'f', type: String, multiple: 'lazy', description: '', }
          user:     { alias: 'U', type: String, description: '', }
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'mixa_flagdef',   [ 'commands', 'psql', 'flags', 'command', ] ], true, ]
    [ [ 'mixa_flagdef',   [ 'commands', 'psql', 'flags', 'file',    ] ], true,  ]
    [ [ 'mixa_flagdef',   [ 'commands', 'psql', 'flags', 'user',    ] ], true,  ]
    [ [ 'mixa_flagdefs',  [ 'commands', 'psql', 'flags',            ] ], true, ]
    [ [ 'mixa_cmddef',    [ 'commands', 'psql',                     ] ], true, ]
    [ [ 'mixa_cmddefs',   [ 'commands',                             ] ], true, ]
    [ [ 'mixa_jobdef',  []                                          ], true, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ type, path, ] = probe
      value           = resolve_recursively jobdef, path
      # debug '^33334^', ( d for d in ( MIXA.types.types_of value ) when /mixa/.test d ), CND.grey value
      resolve MIXA.types.isa type, value
  #.........................................................................................................
  try
    validate.mixa_flagdef jobdef.commands.psql.flags.command
    T.ok true
  catch error
    T.fail "^testcase-8779345^"
    warn '^3908^', error.message
  #.........................................................................................................
  try
    validate.mixa_jobdef jobdef
    T.ok true
  catch error
    T.fail "^testcase-777362^"
    warn '^3908^', error.message
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA settings validation 2" ] = ( T, done ) ->
  MIXA          = require '../../../apps/mixa'
  { isa
    validate  } = MIXA.types.export()
  #.........................................................................................................
  jobdef =
    commands:
      psql:
        description: "use `psql` to run SQL"
        allow_extra: false
        flags:
          command:  { alias: 'c', type: String, multiple: 'lazy', description: '', }
          file:     { alias: 'f', type: String, multiple: 'lazy', description: '', }
          user:     { alias: 'U', type: String, description: '', xxxxxxxxxxxxxx: true, }
  #.........................................................................................................
  result = MIXA._compile_jobdef jobdef
  debug '^33736^', result
  T.eq ( MIXA.types.is_sad result ), true
  T.eq result, { error: { code: 17, tag: 'ILLEGAL_SETTINGS', message: "not a valid mixa_jobdef object: violates 'x.?commands is a mixa_cmddefs'" }, cmd: 'help', }
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA parse with settings 2" ] = ( T, done ) ->
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  jobdef =
    commands:
      psql:
        description: "use `psql` to run SQL"
        allow_extra: false
        flags:
          command:
            alias:          'c'
            type:           String
            multiple:       false
            description:    ''
          file:
            alias:          'f'
            type:           String
            multiple:       false
            description:    ''
          user:
            alias:          'U'
            type:           String
            description:    ''
  #.........................................................................................................
  # debug '^7766^', jobdef.commands.psql.flags.file
  # debug '^7766^', MIXA.types.isa.mixa_flagdef jobdef.commands.psql.flags.file
  # debug '^7766^', MIXA._compile_jobdef jobdef; process.exit 1
  MIXA.types.validate.mixa_flagdef jobdef.commands.psql.flags.command
  MIXA.types.validate.mixa_flagdef jobdef.commands.psql.flags.file
  MIXA.types.validate.mixa_flagdef jobdef.commands.psql.flags.user
  #.........................................................................................................
  result = MIXA.parse jobdef, [ 'psql', '-c', 'select * from CATALOG.catalog;', ]
  debug '^334-2^', result
  # T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
  #.........................................................................................................
  result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 42;', ]
  debug '^334-2^', result
  # T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
  #.........................................................................................................
  result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 42;', ]
  debug '^334-2^', result
  # T.eq result, { argv: [], parameters: { command: [ 'select * from CATALOG.catalog;' ] }, cmd: 'psql' }
  # #.........................................................................................................
  # result = MIXA.parse jobdef, [ 'psql', '-f', 'path/to/this.sql', 'path/to/that.sql' ]
  # debug '^334-3^', result
  # T.eq result, {
  #   argv: [ 'path/to/that.sql' ],
  #   parameters: { file: [ 'path/to/this.sql' ] },
  #   error: {
  #     code: 15,
  #     tag: 'EXTRA_FLAGS',
  #     message: "command 'psql' does not allow extra, got [ 'path/to/that.sql' ]" },
  #   cmd: 'help' }
  # #.........................................................................................................
  # result = MIXA.parse jobdef, [ 'psql', '-U', 'jpfx', '-f', 'path/to/this.sql', '-f', 'path/to/that.sql' ]
  # debug '^334-4^', result
  # T.eq result, { argv: [], parameters: { user: 'jpfx', file: [ 'path/to/this.sql', 'path/to/that.sql' ] }, cmd: 'psql' }
  # #.........................................................................................................
  # # debug '^334-5^', MIXA._compile_jobdef jobdef
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA parse with settings 3" ] = ( T, done ) ->
  jobdef =
    commands:
      psql:
        allow_extra: false
        flags:
          command:
            alias:          'c'
            type:           String
            multiple:       false
          file:
            alias:          'f'
            type:           String
            multiple:       false
          user:
            alias:          'U'
            type:           String
  MIXA = require '../../../apps/mixa'
  jobdef.commands.psql.flags.command.multiple = false
  urge '^5554-1^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-1^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { error: { code: 16, tag: 'OTHER', message: 'Singular option already set [command=select 42;]' }, cmd: 'help' }
  debug '^4445-2^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { argv: [ 'select 43;', '-U', 'x' ], parameters: { command: 'select 42;' }, error: { code: 15, tag: 'EXTRA_FLAGS', message: "command 'psql' does not allow extra, got [ 'select 43;', '-U', 'x' ]" }, cmd: 'help' }
  jobdef.commands.psql.flags.command.multiple = 'lazy'
  urge '^5554-2^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-3^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { argv: [], parameters: { command: [ 'select 42;', 'select 43;' ], user: 'x' }, cmd: 'psql' }
  debug '^4445-4^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { argv: [ 'select 43;', '-U', 'x' ], parameters: { command: [ 'select 42;' ] }, error: { code: 15, tag: 'EXTRA_FLAGS', message: "command 'psql' does not allow extra, got [ 'select 43;', '-U', 'x' ]" }, cmd: 'help' }
  jobdef.commands.psql.flags.command.multiple = 'greedy'
  urge '^5554-3^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-5^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { argv: [], parameters: { command: [ 'select 42;', 'select 43;' ], user: 'x' }, cmd: 'psql' }
  debug '^4445-6^', result = MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  T.eq result.verdict, { argv: [], parameters: { command: [ 'select 42;', 'select 43;' ], user: 'x' }, cmd: 'psql' }
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA parse with settings 4" ] = ( T, done ) ->
  jobdef =
    commands:
      frobulate:
        allow_extra: false
        flags:
          width:
            alias:          'w'
            type:           Number
            fallback:       123
          height:
            alias:          'h'
            type:           Number
            # positional:     true
            fallback:       10
          image:
            alias:          'i'
            positional:     true
            type:           String
  MIXA = require '../../../apps/mixa'
  T.eq ( MIXA.parse jobdef, [ 'frobulate', 'path/to/image' ] ).verdict, \
    { argv: [], parameters: { width: 123, height: 10, image: 'path/to/image' }, cmd: 'frobulate' }
  jobdef.commands.frobulate.flags.image.positional = false
  T.eq ( MIXA.parse jobdef, [ 'frobulate', 'path/to/image' ] ).verdict, \
    { argv: [ 'path/to/image' ], parameters: { width: 123, height: 10 }, \
      error: {
        code: 15,
        tag: 'EXTRA_FLAGS',
        message: "command 'frobulate' does not allow extra, got [ 'path/to/image' ]" }, \
      cmd: 'help' }
  done() if done?
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "MIXA inhibitor avoids rewriting of single-dash flags" ] = ( T, done ) ->
  jobdef =
    commands:
      search:
        allow_extra: true
        flags:
          verbose:
            alias:          'v'
            type:           Boolean
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  # demonstrate problematic behavior; this should be configurable but for now users must remember to insert
  # `'--'` at the appropriate position:
  result  = MIXA.parse jobdef, [ 'search', '-iname', 'whatever', ]
  debug '^33344^', result
  T.eq result.verdict.argv, [ '-i', '-n', '-a', '-m', '-e', 'whatever' ]
  #.........................................................................................................
  result  = MIXA.parse jobdef, [ 'search', '--', '-iname', 'whatever', ]
  debug '^33344^', result
  T.eq result.verdict.argv, [ '-iname', 'whatever' ]
  #.........................................................................................................
  done() if done?
  return null

#-----------------------------------------------------------------------------------------------------------
demo_3 = ->
  jobdef =
    commands:
      multiply:
        flags:
          a:
            alias:          'a'
            type:           Number
            fallback:       1
          b:
            alias:          'b'
            type:           Number
            fallback:       1
  MIXA = require '../../../apps/mixa'
  compiled_settings = ( MIXA._compile_jobdef jobdef )
  if MIXA.types.is_sad compiled_settings  then  warn '^44445^', compiled_settings
  else                                          help '^44445^', compiled_settings
  result = MIXA.parse jobdef, [ 'frobulate', '--width', '123', ]
  if MIXA.types.is_sad result             then  warn '^44445^', result
  else                                          help '^44445^', result
  done() if done?
  return null

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  jobdef =
    commands:
      frobulate:
        allow_extra: false
        flags:
          width:
            alias:          'w'
            type:           Number
            fallback:       123
          height:
            alias:          'h'
            type:           Number
            fallback:       10
          image:
            alias:          'i'
            positional:     true
            type:           String
  MIXA = require '../../../apps/mixa'
  compiled_settings = ( MIXA._compile_jobdef jobdef )
  if MIXA.types.is_sad compiled_settings  then  warn '^44445^', compiled_settings
  else                                          help '^44445^', compiled_settings
  result = MIXA.parse jobdef, [ 'frobulate', '--width', '123', ]
  if MIXA.types.is_sad result             then  warn '^44445^', result
  else                                          help '^44445^', result
  debug '^344874-1^', ( MIXA._compile_jobdef jobdef ).commands?.frobulate?.flags
  debug '^344874-2^', result = MIXA.parse jobdef, [ 'frobulate', '--width', '123', ]
  debug '^344874-3^', result = MIXA.parse jobdef, [ 'frobulate', '--width', ]
  debug '^344874-4^', result = MIXA.parse jobdef, [ 'frobulate', '-w', '123', '-h', '99', ]
  debug '^344874-5^', result = MIXA.parse jobdef, [ 'frobulate', '-w', '-h', '99', ]
  debug '^344874-6^', result = MIXA.parse jobdef, [ 'frobulate', ]
  debug '^344874-6^', result = MIXA.parse jobdef, [ 'frobulate', 'path/to/image' ]
  jobdef.commands.frobulate.flags.image.positional = false
  debug '^344874-6^', result = MIXA.parse jobdef, [ 'frobulate', 'path/to/image' ]
  done() if done?
  return null

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  jobdef =
    commands:
      psql:
        allow_extra:  false
        # run:          MIXA.run.execSync
        flags:
          command:
            alias:          'c'
            type:           String
            multiple:       false
          file:
            alias:          'f'
            type:           String
            multiple:       false
          user:
            alias:          'U'
            type:           String
  MIXA = require '../../../apps/mixa'
  jobdef.commands.psql.flags.command.multiple = false
  urge '^5554-1^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-1^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  debug '^4445-2^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  jobdef.commands.psql.flags.command.multiple = 'lazy'
  urge '^5554-2^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-3^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  debug '^4445-4^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  jobdef.commands.psql.flags.command.multiple = 'greedy'
  urge '^5554-3^', ( MIXA._compile_jobdef jobdef ).commands.psql.flags
  debug '^4445-5^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', '-c', 'select 43;', '-U', 'x', ]
  debug '^4445-6^', MIXA.parse jobdef, [ 'psql', '-c', 'select 42;', 'select 43;', '-U', 'x', ]
  return null

#-----------------------------------------------------------------------------------------------------------
demo_run_1 = ->
  MIXA = require '../../../apps/mixa'
  jobdef =
    exit_on_error:  false
    meta:
      hqx: { type: String, }
    commands:
      list:
        allow_extra:  true
        runner:       MIXA.runners.execSync
        plus:         { executable: 'ls', }
        flags:
          table: { alias: 't', description: "format as ASCII table", type: Boolean, }
  # debug '^4445-1^', MIXA.parse jobdef, [ 'ls', '-AlF', ]
  # urge '^21226^', MIXA.parse jobdef, [ '-hd', 'xx/yy', 'ls', '-AlF', ]
  # urge '^21226^', MIXA.parse jobdef, [ 'ls', 'find', '--', 'dev', '-iname', '*benchmark*', ]
  # result = MIXA.parse jobdef, [ '--cd', '/tmp', 'list', '--', '-AlF', '.', ]
  PATH = require 'path'
  path = PATH.relative process.cwd(), PATH.resolve PATH.join __dirname, '../src'
  #.........................................................................................................
  echo '-'.repeat 108
  result = MIXA.run jobdef, [ '--cd', path, 'list', '--', '-AlF', '.', ]
  urge '^21226^', result
  ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  #.........................................................................................................
  echo '-'.repeat 108
  result = MIXA.run jobdef, [ '--cd', path, 'list', '--', '-AlF', '*', ]
  urge '^21226^', result
  ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  #.........................................................................................................
  echo '-'.repeat 108
  result = MIXA.run jobdef, [ '--cd', path, ]
  urge '^21226^', result
  ( help line for line in output.split '\n' ) if ( output = result.output?.ok )?
  #.........................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  # MIXA = require '../../../apps/mixa'
  # debug '^4445^', MIXA.parse null, [ '--cd', 'some/place', 'ls', ]
  # debug '^4445^', MIXA.parse null, [ 'cats!' ]
  # test @
  # test @[ "MIXA parse with defaults" ]
  # test @[ "MIXA settings validation 2" ]
  # test @[ "MIXA types" ]
  # test @[ "MIXA parse with settings 3" ]
  # test @[ "MIXA parse with settings 1" ]
  # @[ "MIXA parse with settings 4" ]()
  # test @[ "MIXA parse with settings 4" ]
  # test @[ "MIXA inhibitor avoids rewriting of single-dash flags" ]
  # demo_3()
  demo_run_1()

