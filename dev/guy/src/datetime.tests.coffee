
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'GUY/datetime'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
H                         = require './helpers'
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types


#-----------------------------------------------------------------------------------------------------------
@guy_datetime_api = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  T?.eq ( type_of GUY.datetime.parse   ), 'function'
  T?.eq ( type_of GUY.datetime.format  ), 'function'
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
@_demo_datetime = ( cfg ) ->
  GUY     = require H.guy_path
  D       = GUY.datetime
  #---------------------------------------------------------------------------------------------------------
  debug '^34534-1^', D.from_now '20220101-183000Z'
  debug '^34534-2^', D.format D.now(), 'YYYYMMDD-HHmmssZ'
  debug '^34534-3^', D.format D.now(), 'YYYY-MM-DD HH:mm UTC'
  debug '^34534-4^', D.srts_from_isots '2022-05-17T19:40:58Z'
  # since Only show notifications updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
  d = D._dayjs().subtract 7, 'year'
  # D.
  debug '^34534-5^', d
  debug '^34534-6^', D.isots_from_srts '20220101-183000Z'
  debug '^34534-7^', D.now()
  debug '^34534-8^', D.now { subtract: [ 1, 'week', ], }
  debug '^34534-9^', D.now { subtract: [ 1, 'month', ], }
  debug '^34534-10^', D.now { add: [ 1, 'week', ], }
  debug '^34534-11^', D.now { subtract: [ 1, 'week', ], add: [ 1, 'week', ], }
  debug '^34534-9^', D.isots_from_srts D.now { subtract: [ 1, 'month', ], }
  return null

# #-----------------------------------------------------------------------------------------------------------
# @_demo_dayjs_duration = ->
#   GUY     = require H.guy_path
#   D       = GUY.datetime
#   debug '^353453^', DBay._dayjs
#   debug '^353453^', ( new DBay() )._dayjs
#   dayjs                     = require 'dayjs'
#   do =>
#     utc               = require 'dayjs/plugin/utc';               dayjs.extend utc
#     relativeTime      = require 'dayjs/plugin/relativeTime';      dayjs.extend relativeTime
#     toObject          = require 'dayjs/plugin/toObject';          dayjs.extend toObject
#     customParseFormat = require 'dayjs/plugin/customParseFormat'; dayjs.extend customParseFormat
#     duration          = require 'dayjs/plugin/duration';          dayjs.extend duration
#   help '^45323^', ( dayjs.duration { hours:   1, } ).asSeconds()
#   help '^45323^', ( dayjs.duration { minutes: 1, } ).asSeconds()
#   help '^45323^', ( dayjs.duration { minutes: -1, } ).asSeconds()
#   # help '^45323^', ( dayjs.duration "1 minute" ).asSeconds()
#   return null



############################################################################################################
if require.main is module then do =>
  # @guy_str_escape_for_regex()
  # test @
  @_demo_datetime()
