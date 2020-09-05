
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERSHOP/INTERSHOP-CLI-NG'
debug                     = CND.get_logger 'debug',     badge
debug '^76483-1^', Date.now() / 1000
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = ( require 'intershop' ).types
{ isa
  validate
  cast
  type_of }               = types.export()
CP                        = require 'child_process'
defer                     = setImmediate
debug '^76483-2^', Date.now() / 1000


#-----------------------------------------------------------------------------------------------------------
@serve = ( project_path = null ) ->
  PATH                      = require 'path'
  INTERSHOP                 = require 'intershop/lib/intershop'
  RPC                       = require '../../../apps/intershop-rpc'
  project_path             ?= PATH.resolve PATH.join __dirname, '../../../../hengist'
  process.chdir project_path
  shop                      = INTERSHOP.new_intershop project_path
  ### TAINT in the future `db`, `rpc` will be delivered with `new_intershop()` ###
  # shop.db                   = require '../../../apps/intershop/intershop_modules/db'
  shop.db                   = require 'intershop/lib/db'
  shop.rpc                  = await RPC.create { show_counts: true, count_interval: 100, logging: true, }
  #.........................................................................................................
  rpc_keys  = []
  rpc_keys  = [ rpc_keys..., ( await @_contract_registered_rpc_methods  shop )..., ]
  rpc_keys  = [ rpc_keys..., ( await @_contract_demo_rpc_methods        shop )..., ]
  whisper '-'.repeat 108
  urge "^4576^ registered RPC keys:"
  info "^4576^   #{rpc_key}" for rpc_key in rpc_keys
  whisper '-'.repeat 108
  #.........................................................................................................
  return shop

#-----------------------------------------------------------------------------------------------------------
@_contract_registered_rpc_methods = ( shop ) ->
  R   = []
  sql = "select aoid, path from ADDONS.files where target = 'rpc' order by aoid, path;"
  for addon from await shop.db.query [ sql, ]
    module        = require addon.path
    method_names  = ( Object.keys module ).sort()
    for method_name in method_names
      do ( module, method_name ) =>
        rpc_key = "^#{addon.aoid}/#{method_name}"
        R.push rpc_key
        ### TAINT in upcoming intershop-rpc version, all calls must pass a single list with arguments
        to be applied to the contractor; this will then be done in `shop.rpc.contract(). For the
        time being, we're applying arguments right here: ###
        shop.rpc.contract rpc_key, ( d ) ->
          unless ( type = type_of d.$value ) is 'list'
            throw new Error "^intershop/cli@3376^ in RPC call to #{rpc_key}, expected a list for d.$value, got a #{type}"
          module[ method_name ] d.$value...
        return null
  return R

#-----------------------------------------------------------------------------------------------------------
@_contract_demo_rpc_methods = ( shop ) ->
  IX  = require '../../../apps/intertext'
  R   = []
  #.........................................................................................................
  hyphenate = ( text ) ->
    validate.text text
    return IX.HYPH.hyphenate text
  #.........................................................................................................
  slabjoints_from_text = ( text ) ->
    validate.text text
    return IX.SLABS.slabjoints_from_text text
  #.........................................................................................................
  contract = ( key, method ) =>
    shop.rpc.contract key, method
    R.push key
    return null
  #.........................................................................................................
  contract '^hyphenate',            ( d ) -> hyphenate d.$value
  contract '^slabjoints_from_text', ( d ) -> slabjoints_from_text d.$value
  contract '^shyphenate',           ( d ) -> slabjoints_from_text hyphenate d.$value
  return R

#-----------------------------------------------------------------------------------------------------------
@new_intershop_runner = ( project_path ) ->
  INTERSHOP = require 'intershop/lib/intershop'
  return INTERSHOP.new_intershop project_path

#-----------------------------------------------------------------------------------------------------------
@_prepare_psql_commandline = ( me ) ->
  cwd       = me.get 'intershop/host/path'
  db_name   = me.get 'intershop/db/name'
  db_user   = me.get 'intershop/db/user'
  return { cwd, db_user, db_name, }

#-----------------------------------------------------------------------------------------------------------
@psql_run_file    = ( me, path    ) -> @_psql_run me, '-f', path
@psql_run_command = ( me, command ) -> @_psql_run me, '-c', command

#-----------------------------------------------------------------------------------------------------------
@_psql_run = ( me, selector, pargument ) -> new Promise ( resolve, reject ) =>
  validate.intershop_cli_psql_run_selector selector
  cmd         = @_prepare_psql_commandline me
  ### TAINT how to respect `sudo -u postgres` and similar? ###
  parameters  = [ '-U', cmd.db_user, '-d', cmd.db_name, selector, pargument, ]
  # parameters  = [ '-d', cmd.db_name, selector, pargument, ]
  # debug '^37363^', parameters
  whisper '^psql_run@@3367^', "psql #{parameters.join ' '}"
  settings    =
    cwd:    cmd.cwd
    shell:  false
    stdio:  [ 'inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn 'psql', parameters, settings
  cp.on 'close', ( code   ) ->
    return resolve 0 if code is 0
    reject new Error "^psql_run_file@34479^ processs exited with code #{code}"
  cp.on 'error', ( error  ) -> reject error
  return null

#-----------------------------------------------------------------------------------------------------------
@nodexh_run_file = ( project_path, file_path ) -> new Promise ( resolve, reject ) =>
  parameters  = [ file_path, ]
  whisper '^psql_run@@3367^', "psql #{parameters.join ' '}"
  settings    =
    cwd:    project_path
    shell:  false
    stdio:  [ 'inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn 'nodexh', parameters, settings
  cp.on 'close', ( code   ) ->
    return resolve 0 if code is 0
    reject new Error "^nodexh_run_file@34479^ processs exited with code #{code}"
  cp.on 'error', ( error  ) -> reject error
  return null

#-----------------------------------------------------------------------------------------------------------
@cli = ->
  # shop = await @serve()
  await @_cli()
  # await shop.rpc.stop()
  return null

#-----------------------------------------------------------------------------------------------------------
@_cli_get_project_path = ( d ) -> d.options.p ? d.options.project ? process.cwd()

#-----------------------------------------------------------------------------------------------------------
@_cli = ->
  debug '^76483-3^', Date.now() / 1000
  MIXA = require '../../../apps/mixa'
  debug '^76483-4^', Date.now() / 1000
  #.........................................................................................................
  # program.action ( { logger, } ) => logger.info "Hello, world!"
  #.........................................................................................................
  jobdef =
    # .name 'intershop'
    #.......................................................................................................
    commands
      'start-rpc-server':
        description:        "start RPC server (to be accessed from psql scripts)"
        allow_extra:        true
        runner:             ( d ) => new Promise ( done ) =>
          project_path  = d.verdict.cd ? process.cwd()
          shop          = await @serve project_path
      #.....................................................................................................
      'psql':
        description:        "run psql"
        allow_extra:        true
        runner:             ( d ) => new Promise ( done ) =>
          project_path  = d.verdict.cd ? process.cwd()
          shop          = await @serve project_path
          ### TAINT ###
          project_path  = @_cli_get_project_path d
          info "^5564^ d.options: #{rpr d.options}"
          info "^5564^ file_path: #{rpr file_path}"
          info "^5565^ project_path: #{rpr project_path}"
          shop = await @serve project_path
          # debug '^2223^', rpr command
          # debug '^2223^', rpr project_path
          me            = @new_intershop_runner project_path
          # info "^5566^ running psql with #{rpr { file: d.file, command: d.command, }}"
          await @psql_run_file    me, file_path if file_path?
          await @psql_run_command me, command   if command?
          await shop.rpc.stop()
          return null
      #.....................................................................................................
      'nodexh':
        description:        "run nodexh"
        allow_extra:        false
        flags:
          'file':
            alias:            'f'
            description:      "file to run"
        runner:             ( d ) => new Promise ( done ) =>
          ### TAINT ###
          file_path     = d.args.file
          project_path  = @_cli_get_project_path d
          info "^5565^ file_path:     #{rpr file_path}"
          info "^5565^ project_path:  #{rpr project_path}"
          shop          = await @serve project_path
          await @nodexh_run_file project_path, file_path
          await shop.rpc.stop()
          await defer -> process.exit()
          return null
  #.........................................................................................................
  return await MIXA.run jobdef, process.argv()

# #-----------------------------------------------------------------------------------------------------------
# @demo = ->
#   rpc = await @serve()
#   # T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/080-intertext.sql'
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/100-harfbuzz.sql'
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/tests/080-intertext.tests.sql'
#   debug '^3334^', process.argv
#   info rpc.counts
#   await rpc.stop()
#   return null

#-----------------------------------------------------------------------------------------------------------
@demo_intershop_object = ->
  PATH          = require 'path'
  project_path  = PATH.resolve PATH.join __dirname, '../../../../hengist'
  project_path  = PATH.resolve PATH.join __dirname, '../../../../interplot'
  INTERSHOP     = require 'intershop/lib/intershop'
  shop          = INTERSHOP.new_intershop project_path
  keys          = ( k for k of shop.settings ).sort()
  for key in keys
    continue if key.startsWith 'os/'
    setting = shop.settings[ key ]
    echo ( CND.gold key.padEnd 42 ), ( CND.lime setting.value )
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_query_addons = ->
  PATH          = require 'path'
  project_path  = PATH.resolve PATH.join __dirname, '../../../../hengist'
  INTERSHOP     = require 'intershop/lib/intershop'
  shop          = INTERSHOP.new_intershop project_path
  ### TAINT in the future `db` will be delivered with `new_intershop()` ###
  shop.db       = require 'intershop/lib/db'
  RPC           = require '../../../apps/intershop-rpc'
  rpc           = await RPC.create { show_counts: true, count_interval: 100, logging: true, }
  debug ( k for k of shop.db ).sort()
  # for addon from await shop.db.query [ "select * from ADDONS.addons;", ]
  #   info addon.aoid
  #   for file from await shop.db.query [ "select * from ADDONS.files where aoid = $1;", addon.aoid, ]
  #     urge '  ', ( CND.blue file.target ), ( CND.yellow file.path )
  sql = "select * from ADDONS.files where target = 'rpc' order by aoid;"
  for addon from await shop.db.query [ sql, ]
    module = require addon.path
    for method_name of module
      do ( module, method_name ) =>
        rpc_name = "^#{addon.aoid}/#{method_name}"
        debug '^3334^', rpc_name
        rpc.contract rpc_name, ( d ) -> module[ method_name ] d.$value
        return null
  return null


############################################################################################################
if module is require.main then do =>
  # await @demo()
  await @cli()
  # await @demo_query_addons()
  # @demo_intershop_object()


