
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GIT-ANNOTATE'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
PATH                      = require 'path'
# dpan                      = require '../../dpan'
pkg_fspath                = PATH.resolve PATH.join __dirname, '..'
CP                        = require 'child_process'
{ to_width }              = require 'to-width'
do =>
  PKGDIR                    = await import( 'pkg-dir' )
  staged_paths              = CP.execSync 'git diff --cached --name-only', { encoding: 'utf-8', }
  staged_paths              = staged_paths.split /\n/
  staged_paths              = ( staged_path.trim() for staged_path in staged_paths )
  staged_modules            = new Set()
  for staged_path in staged_paths
    staged_modules.add PATH.basename PKGDIR.packageDirectorySync staged_path
  staged_modules            = ( name for name from staged_modules ).join ' '
  staged_modules            = ( to_width staged_modules, 50 ).trim()
  echo "[#{staged_modules}]"



