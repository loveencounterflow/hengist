
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate
  validate_optional }     = types
PHASH                     = require 'phash-im'
glob                      = require 'glob'


############################################################################################################
if module is require.main then await do =>
  PATH = require 'node:path'
  #.........................................................................................................
  pattern = PATH.resolve PATH.join __dirname, '../../../../../Downloads/b/*'
  count1 = 0
  for path1 in glob.sync pattern
    continue unless path1.endsWith '.jpg'
    count1++
    urge '^423^', path1
    h1 = await PHASH.compute path1
    break if count1 > 5
    count2 = 0
    for path2 in glob.sync pattern
      continue unless path2.endsWith '.jpg'
      count2++
      break if count2 > 5
      help '^423^', path2
      h2 = await PHASH.compute path2
      info '^423^', await PHASH.compare h1, h2
  return null

