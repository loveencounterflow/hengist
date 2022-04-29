
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DEMO-OBJECT-CREATION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
#...........................................................................................................
# ( require 'mixa/lib/check-package-versions' ) require '../pinned-package-versions.json'
# PATH                      = require 'path'
# FS                        = require 'fs'
# got                       = require 'got'
# CHEERIO                   = require 'cheerio'
# GUY                       = require '../../../apps/guy'
# { DBay, }                 = require '../../../apps/dbay'
# { SQL, }                  = DBay
# { Vogue,
#   Vogue_scraper }         = require '../../../apps/dbay-vogue'
# { HDML, }                 = require '../../../apps/dbay-vogue/lib/hdml2'
# H                         = require '../../../apps/dbay-vogue/lib/helpers'
# glob                      = require 'glob'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { Vogue 
    Vogue_db 
    Vogue_scraper } = require '../../../apps/dbay-vogue'
  debug '^45354^', { Vogue, }
  debug '^45354^', { Vogue_db, }
  debug '^45354^', { Vogue_scraper, }
  vogue = new Vogue()
  debug '^45354^', { vogue, }
  debug '^45354^', vogue.vdb
  debug '^45354^', vogue.vdb.hub is vogue
  return null


############################################################################################################
if module is require.main then do =>
  await demo_1()

