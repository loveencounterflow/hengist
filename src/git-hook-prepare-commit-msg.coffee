
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
cwd                       = process.cwd()
join                      = ( P... ) -> PATH.resolve PATH.join P...

do =>
  PKGDIR                    = await import( 'pkg-dir' )
  staged_paths              = CP.execSync 'git diff --cached --name-only', { encoding: 'utf-8', }
  staged_paths              = ( staged_path for staged_path in ( staged_paths.split /\n/ ) \
    when staged_path isnt '' )
  for staged_path, idx in staged_paths
    staged_paths[ idx ] = join cwd, PATH.dirname staged_path.trim()
  staged_modules            = new Set()
  for staged_path in staged_paths
    staged_modules.add PATH.basename PKGDIR.packageDirectorySync { cwd: staged_path, }
  staged_modules            = ( name for name from staged_modules ).join ' '
  # staged_modules += ' | ' + staged_paths.join ', '
  echo "[#{staged_modules}]"



