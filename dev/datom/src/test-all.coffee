
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
  whisper }               = GUY.trm.get_loggers 'DATOM/TESTS/MAIN'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
test                      = require 'guy-test'
my_filename               = PATH.basename __filename


############################################################################################################
L = @
do ->
  paths = FS.readdirSync __dirname
  for path in paths
    filename = PATH.basename path
    continue if path.endsWith '.js.map'
    continue if filename is my_filename
    continue unless filename.startsWith 'test-'
    path = PATH.join __dirname, path
    module = require path
    for key, value of module
      continue if key.startsWith '_'
      # debug '39838', path, key
      throw new Error "duplicate key #{rpr key}" if L[ key ]?
      L[ key ] = value.bind L
  test L, { timeout: 5000, }


