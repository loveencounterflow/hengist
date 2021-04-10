
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/UCDB/FONT-OUTLINES'
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
PATH                      = require 'path'
resolve_path              = ( P... ) -> PATH.resolve PATH.join __dirname, '../../../', P...



############################################################################################################
if module is require.main then do =>
  UFO   = require './font-outlines'
  db    = require resolve_path 'intershop/lib/db'
  font  = resolve_path 'assets/jizura-fonts/lmroman10-italic.otf'
  gid   = 56
  debug '^44438^', await UFO.svg_pathdata_from_gid db, font, gid







