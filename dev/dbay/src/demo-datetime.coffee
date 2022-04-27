
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/DEMO'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ raw }                   = String

#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> H.tabulate query, db query


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_datetime = ( cfg ) ->
  ### https://day.js.org ###
  dayjs                     = require 'dayjs'
  do =>
    utc           = require 'dayjs/plugin/utc';           dayjs.extend utc
    relativeTime  = require 'dayjs/plugin/relativeTime';  dayjs.extend relativeTime
    toObject      = require 'dayjs/plugin/toObject';      dayjs.extend toObject
  #.........................................................................................................
  { DBay }        = require '../../../apps/dbay'
  { SQL }         = DBay
  db              = new DBay()
  db.create_stdlib()
  # #---------------------------------------------------------------------------------------------------------
  # db ->
  #   #.......................................................................................................
  #   db.create_function
  #     name:     'digits_from_time'
  #     call:     ( time ) -> JSON.stringify ( parseInt d, 10 for d in time when d isnt ':' )
  #   #.......................................................................................................
  #   db SQL"""
  #     drop table if exists times;
  #     create table times (
  #       nr      integer not null primary key,
  #       time    text not null unique,
  #       digits  json not null generated always as ( digits_from_time( time ) ) virtual,
  #       check ( std_re_is_match( time, '^([01][0-9]|2[0-3]):[0-5][0-9]$' ) ) );"""
  #---------------------------------------------------------------------------------------------------------
  db ->
    tabulate db, SQL"""select date(     1092941466, 'auto', 'utc' ) as date;"""
    tabulate db, SQL"""select time(     1092941466, 'auto', 'utc' ) as time;"""
    tabulate db, SQL"""select datetime( 1092941466, 'auto', 'utc' ) as datetime;"""
    debug '^45354-1^', dayjs().format                                   'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-2^', dayjs().utc().format                             'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-3^', ( dayjs    '2022-01-01,18:30' ).format           'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-4^', ( dayjs    '2022-01-01,18:30' ).utc().format     'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-5^', dayjs.utc( '2022-01-01,18:30' ).format           'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-6^', dayjs.utc( '2022-01-01,18:30' ).fromNow()
    debug '^45354-7^', dayjs.utc( '2023-01-01,18:30' ).fromNow()
    debug '^45354-8^', dayjs.utc( '2022-01-01,18:30:00Z' ).format       'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-9^', dayjs.utc( '2022-01-01,18:30:00Z Mon' ).format   'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^45354-10^', dayjs().toISOString()
    debug '^45354-11^', dayjs().utc().toISOString()
    debug '^45354-12^', dayjs().toObject()
    debug '^45354-13^', dayjs().utc().toObject()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_stdlib_api_pre = ( cfg ) ->
  ### https://day.js.org ###
  dayjs                     = require 'dayjs'
  do =>
    utc           = require 'dayjs/plugin/utc';           dayjs.extend utc
    relativeTime  = require 'dayjs/plugin/relativeTime';  dayjs.extend relativeTime
    toObject      = require 'dayjs/plugin/toObject';      dayjs.extend toObject
  #.........................................................................................................
  { DBay }        = require '../../../apps/dbay'
  { SQL }         = DBay
  db              = new DBay()
  db.create_stdlib()
  db.types.declare 'dbay_dt_valid_dayjs', tests:
    "( @type_of x ) is 'm'":  ( x ) -> ( @type_of x ) is 'm'
    "@isa.float x.$y":        ( x ) -> @isa.float x.$y
    "@isa.float x.$M":        ( x ) -> @isa.float x.$M
    "@isa.float x.$D":        ( x ) -> @isa.float x.$D
    "@isa.float x.$W":        ( x ) -> @isa.float x.$W
    "@isa.float x.$H":        ( x ) -> @isa.float x.$H
    "@isa.float x.$m":        ( x ) -> @isa.float x.$m
    "@isa.float x.$s":        ( x ) -> @isa.float x.$s
    "@isa.float x.$ms":       ( x ) -> @isa.float x.$ms
  #---------------------------------------------------------------------------------------------------------
  create_stdlib = ->
    DBay_timestamp_template = 'YYYY-MM-DD,HH:mm:ss[Z]'
    prefix                  = 'std_'
    #-------------------------------------------------------------------------------------------------------
    @create_function
      ### Returns a DBay_timestamp representing the present point in time. ###
      name:           prefix + 'dt_now'
      deterministic:  false
      varargs:        false
      call:           => dayjs().utc().format DBay_timestamp_template
    #-------------------------------------------------------------------------------------------------------
    @create_function
      ### Given a DBay_timestamp, returns an English human-readable text indicating the remoteness of that
      time relative to now, like 'four minutes ago' or 'in a week'. ###
      name:           prefix + 'dt_from_now'
      deterministic:  false
      varargs:        false
      call:           ( dt ) => ( dayjs().utc dt ).fromNow()
    #-------------------------------------------------------------------------------------------------------
    @dt_parse = ( dbay_timestamp ) ->
      unless /^\d\d\d\d-\d\d-\d\d,\d\d:\d\d:\d\dZ$/.test dbay_timestamp
        throw new Error "not a valid dbay_timestamp: #{rpr dbay_timestamp}"
      R = dayjs.utc dbay_timestamp
      unless @types.isa.dbay_dt_valid_dayjs R
        throw new Error "not a valid dbay_timestamp: #{rpr dbay_timestamp}"
      return R
  #---------------------------------------------------------------------------------------------------------
  create_stdlib.apply db
  db ->
    # tabulate db, SQL"""select date(     1092941466, 'auto', 'utc' ) as date;"""
    # tabulate db, SQL"""select time(     1092941466, 'auto', 'utc' ) as time;"""
    # tabulate db, SQL"""select datetime( 1092941466, 'auto', 'utc' ) as datetime;"""
    debug '^453-1^', dayjs().format                                   'YYYY-MM-DD,HH:mm:ss[Z]'
    tabulate db, SQL"""select std_dt_now() as dt;"""
    debug '^453-2^', dayjs().utc().format                             'YYYY-MM-DD,HH:mm:ss[Z]'
    debug '^453-3^', db.dt_parse '2022-01-01,18:30:00Z'
    debug '^453-3^', db.dt_parse '2022-01-01,18:30:99Z'
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_dayjs_parse_custom_format = ->
  dayjs                     = require 'dayjs'
  do =>
    utc               = require 'dayjs/plugin/utc';               dayjs.extend utc
    relativeTime      = require 'dayjs/plugin/relativeTime';      dayjs.extend relativeTime
    toObject          = require 'dayjs/plugin/toObject';          dayjs.extend toObject
    customParseFormat = require 'dayjs/plugin/customParseFormat'; dayjs.extend customParseFormat
  debug '^34534534^', ( dayjs '19951225-123456Z', 'YYYYMMDD-HHmmssZ' )
  debug '^34534534^', ( dayjs '19951225-123456Z', 'YYYYMMDD-HHmmssZ' ).toISOString()
  debug '^34534534^', ( dayjs '20220101-123456Z', 'YYYYMMDD-HHmmssZ' )
  debug '^34534534^', ( dayjs '20220101-123456Z', 'YYYYMMDD-HHmmssZ' ).toISOString()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_stdlib_api = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { SQL }         = DBay
  db              = new DBay()
  db.create_stdlib()
  #---------------------------------------------------------------------------------------------------------
  db ->
    debug '^34534^', db.dt_now()
    debug '^34534^', db.dt_from_now '20220101-183000Z'
    tabulate db, SQL"""select std_dt_now() as date;"""
    tabulate db, SQL"""select std_dt_from_now( '20220101-183000Z' ) as date;"""
  return null

############################################################################################################
if require.main is module then do =>
  # @demo_datetime()
  @demo_stdlib_api()
  # @demo_dayjs_parse_custom_format()
