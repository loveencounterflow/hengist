

'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CONFIGURATOR'
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
flatten                   = require 'flat'
H                         = require '../../../lib/helpers'
OSPATH                    = require 'ospath'
TOML                      = require '@iarna/toml'
module_name               = 'hengist'
filename                  = ".#{module_name}.toml"
FINDUP                    = require 'find-up'
# { findUp
#   pathExists} from 'find-up'

#-----------------------------------------------------------------------------------------------------------
get_cfg_search_path = ->
  R     = []
  path  = FINDUP.sync filename, { cwd: process.cwd(), };  R.push path if path?
  path  = PATH.join OSPATH.home(), filename;              R.push path if FINDUP.sync.exists path
  return R

#-----------------------------------------------------------------------------------------------------------
read_cfg = ->
  R = { $routes: [], }
  for route, route_idx in get_cfg_search_path()
    try
      partial_cfg = TOML.parse FS.readFileSync route
    catch error
      throw error unless error.code is 'ENOENT'
      warn "^cfg@1^ no such file: #{rpr path}, skipping"
      continue
    R.$routes.push route
    partial_cfg   = flatten partial_cfg, { delimiter: '.', safe: true, }
    R             = { R..., partial_cfg..., }
  return R





############################################################################################################
if module is require.main then do =>
  cfg           = read_cfg()
  cfg           = ( { key, value, } for key, value of cfg )
  H.tabulate "cfg", cfg







