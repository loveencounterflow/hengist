
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/SETS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# { freeze }                = require 'letsfreezethat'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()


#-----------------------------------------------------------------------------------------------------------
@guy_sets_basics = ( T, done ) ->
  # T?.halt_on_error()
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ { method: 'unite',      sets: [ '',  '',  '',                           ], }, '',                         ]
    [ { method: 'unite',      sets: [ 'a', 'b', 'a',                          ], }, 'ab',                       ]
    [ { method: 'unite',      sets: [ 'ab', 'cb', 'a',                        ], }, 'abc',                      ]
    [ { method: '_intersect', sets: [ '',  '',                                ], }, '',                         ]
    [ { method: '_intersect', sets: [ 'a', 'b',                               ], }, '',                         ]
    [ { method: '_intersect', sets: [ 'ab', 'cb',                             ], }, 'b',                        ]
    [ { method: 'intersect',  sets: [ '',  '',                                ], }, '',                         ]
    [ { method: 'intersect',  sets: [ 'a', 'b',                               ], }, '',                         ]
    [ { method: 'intersect',  sets: [ 'ab', 'cb',                             ], }, 'b',                        ]
    [ { method: 'intersect',  sets: [ 'a', 'b', 'c',                          ], }, '',                         ]
    [ { method: 'intersect',  sets: [ 'ab', 'cb',                             ], }, 'b',                        ]
    [ { method: 'intersect',  sets: [ 'abcdefghijklmnopqrstuvwxyz', 'das da', ], }, 'ads',                      ]
    [ { method: 'subtract',   sets: [ 'abcdefghijklmnopqrstuvwxyz', 'das da', ], }, 'bcefghijklmnopqrtuvwxyz',  ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      { method
        sets  } = probe
      sets      = ( new Set s for s in sets )
      result    = GUY.sets[ method ] sets...
      T?.ok isa.set result
      result    = [ result..., ].join ''
      resolve result
  #.........................................................................................................
  return done?()


############################################################################################################
if require.main is module then do =>
  # test @
  test @guy_sets_basics
