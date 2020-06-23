#!node

CND                       = require 'cnd'
badge                     = 'DIFF'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ stdin
  stdout
  stderr }                = process
{ Intertype, }            = require 'intertype'
types                     = new Intertype()
{ isa
  validate
  type_of  }              = types.export()
{ to_width, width_of, }   = require 'to-width'
CAT                       = require 'multimix/lib/cataloguing'





#-----------------------------------------------------------------------------------------------------------
colorize = ( delta_code, text ) ->
  lines = text.split '\n'
  color = switch delta_code
    when -1 then CND.orange
    when  0 then CND.white
    when +1 then CND.lime
  return ( CND.reverse color line for line in lines ).join '\n'

#-----------------------------------------------------------------------------------------------------------
get_tty_width = ->
  return R if ( R = process.stdout.columns )?
  { execSync, } = require 'child_process'
  return parseInt ( execSync "tput cols", { encoding: 'utf-8', } ), 10

#-----------------------------------------------------------------------------------------------------------
demo_diff_match_patch = ( old_text, new_text ) ->
  DMP   = require 'diff-match-patch'
  # width = Math.min 500, process.stdout.columns ? 108
  width = Math.min 500, get_tty_width() ? 108
  _cnd  = require 'cnd/lib/TRM-CONSTANTS'
  # debug CAT.all_keys_of DMP
  # debug type_of DMP.diff_match_patch
  # debug CAT.all_keys_of DMP.diff_match_patch
  type_of dmp = new DMP.diff_match_patch()
  # debug CAT.all_keys_of new DMP.diff_match_patch()
  # debug diff = dmp.diff_main 'dogs bark', 'cats bark'
  # debug diff = dmp.diff_main 'mouse', 'sofas'
  diff = dmp.diff_main old_text, new_text
  whisper dmp.diff_prettyHtml diff
  dmp.diff_cleanupSemantic diff
  whisper dmp.diff_prettyHtml diff
  help diff
  colorized = ( colorize dd, text for [ dd, text, ] in diff ).join ''
  lines     = colorized.split '\n'
  for line in lines
    # line += ' '.repeat Math.max 0, line.replace //
    line += _cnd.reverse + _cnd.colors.white
    line  = ( to_width line, width ) + '\n'
    process.stdout.write line
    # process.stdout.write ( to_width width, line ) + '\n'
  process.stdout.write CND.white CND.reverse ( ' '.repeat width ) + '\n'
  # { Diff, } = DMP
  # dmp   = new Diff()
  # debug CAT.all_keys_of dmp
  # debug ( k for k of dmp )
  # diff  = dmp.diff_main 'dogs bark', 'cats bark'
  # // You can also use the following properties:
  # urge DMP.DIFF_DELETE
  # urge DMP.DIFF_INSERT
  # urge DMP.DIFF_EQUAL


############################################################################################################
if module is require.main then do =>
  # await demo()
  FS = require 'fs'
  old_text  = FS.readFileSync '/tmp/old-galley-main.html', { encoding: 'utf-8', }
  new_text  = FS.readFileSync '/tmp/new-galley-main.html', { encoding: 'utf-8', }
  await demo_diff_match_patch old_text, new_text


