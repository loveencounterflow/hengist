

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'TEMPFILES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
FS                        = require 'fs'
PATH                      = require 'path'
glob                      = require 'glob'
#-----------------------------------------------------------------------------------------------------------
time_now = ->
  t = process.hrtime()
  return "#{t[ 0 ]}" + "#{t[ 1 ]}".padStart 9, '0'

#-----------------------------------------------------------------------------------------------------------
demo_tempy = ->
  trash       = require 'trash'
  TMP         = require 'tempy'
  tmpdir_path = null
  # debug path = TMP.file { name: 'abc.db', }
  # debug path = TMP.file { name: 'abc.db', }
  # debug path = TMP.file { name: 'abc.db', }
  do_work = ( tmpdir_path ) ->
    info { tmpdir_path, }
    FS.writeFileSync ( PATH.join tmpdir_path, 'somefile.db' ), 'text'
    info glob.sync PATH.join tmpdir_path, '**'
    return 42
  try
    help 'before'

    debug tmpdir_path = TMP.directory { name: 'abc.db', }
    help do_work tmpdir_path
    help 'after'
  finally
    warn "removing #{tmpdir_path}"
    trash tmpdir_path ### NOTE `trash` command is async, consider to `await` ###
  return tmpdir_path


############################################################################################################
if module is require.main then do =>
  debug tmpdir_path = demo_tempy()
  info glob.sync PATH.join tmpdir_path, '**'

