

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTYPE/TESTS/MAIN'
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
FS                        = require 'fs'
test                      = require 'guy-test'
my_basename               = PATH.basename __filename


############################################################################################################
L = @
do ->
  paths = FS.readdirSync __dirname
  for path in paths
    debug '^3534^', path
    debug '^3534^', PATH.basename path
    continue if path.endsWith '.js.map'
    continue if ( PATH.basename path ) is my_basename
    continue unless path.endsWith '.tests.js'
    path = PATH.join __dirname, path
    module = require path
    for key, value of module
      continue if key.startsWith '_'
      # debug '39838', path, key
      throw new Error "duplicate key #{rpr key}" if L[ key ]?
      L[ key ] = value.bind L
  test L, { timeout: 5000, }


