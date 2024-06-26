
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MIXA/DEMO'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
GUY                       = require '../../../apps/guy'
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  validate
  create
  type_of }               = types
misfit                    = Symbol 'misfit'

#-----------------------------------------------------------------------------------------------------------
show_cat = ( cfg ) ->
  echo()
  echo CND.white CND.reverse CND.bold """       |\\      _,,,---,,_              """
  echo CND.white CND.reverse CND.bold """ ZZZzz /,`.-'`'    -.  ;-;;,_          """
  echo CND.white CND.reverse CND.bold """      |,4-  ) )-,_. ,\\ (  `'-'         """
  echo CND.white CND.reverse CND.bold """     '---''(_/--'  `-'\\_)  Felix Lee   """
  if cfg.say?
    message = " #{cfg.say} "
    message = message.padEnd ( Math.max 0, 45 - message.length ), ' '
    echo CND.gold CND.reverse message
  echo()
  return null

#-----------------------------------------------------------------------------------------------------------
@cli = ( argv = null ) ->
  MIXA = require '../../../apps/mixa'
  #.........................................................................................................
  types.declare.mx_cat_cfg
    fields:
      say:      'optional.nonempty.text'
    default:
      say:      null
  #.........................................................................................................
  jobdefs =
    # meta:
    commands:
      #-----------------------------------------------------------------------------------------------------
      'help':
        runner: ( d ) =>
          # debug '^690-1^', process.argv
          echo GUY.trm.lime """The feline assistant"""
          echo GUY.trm.blue """
            Usage:
              node #{__filename} <command> [flags]

              Commands:
                cat                   show the cat
                  --say         -s    make the cat say something
            """
      #-----------------------------------------------------------------------------------------------------
      'cat':
        description:  "show a cat"
        runner: ( d ) =>
          cfg             = types.create.mx_cat_cfg d.verdict.parameters
          show_cat cfg
          return null
        flags:
          'say':
            alias:        's'
            type:         String
            description:  "make the cat say something"
  #.........................................................................................................
  MIXA.run jobdefs, process.argv
  return null




############################################################################################################
if module is require.main then do =>
  @cli()


