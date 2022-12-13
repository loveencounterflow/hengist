
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
  whisper }               = GUY.trm.get_loggers 'KASEKI/TESTS/BASIC'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require '../../../lib/helpers'
FS                        = require 'node:fs'

#-----------------------------------------------------------------------------------------------------------
@kaseki_zero = ( T, done ) ->
  { Kaseki } = require '../../../apps/kaseki'
  GUY.temp.with_directory ({ path: repo_home, }) ->
    GUY.temp.with_directory ({ path: checkout_home, }) ->
      debug '^98-1^', rpr repo_home
      debug '^98-2^', rpr checkout_home
      repo_path     = PATH.join repo_home,     'kaseki-demo.fossil'
      checkout_path = PATH.join checkout_home
      ksk           = new Kaseki { repo_path, checkout_path, }
      info  '^98-3^', rpr ksk.get_fossil_version_text()
      urge  '^98-4^', ksk.init()
      urge  '^98-5^', ksk.init()
      try ksk.init { if_exists: 'error', } catch error then warn GUY.trm.reverse error.message
      urge  '^98-6^', ksk.open()
      urge  '^98-7^', ksk.list_file_names()
      urge  '^98-8^', ksk.list_file_paths()
      urge  '^98-9^', ksk.ls()
      #.....................................................................................................
      readme_path = PATH.join checkout_home, 'README.md'
      FS.writeFileSync readme_path, """
        # MyProject

        A fancy text explaing MyProject.
        """
      help  '^98-10^', rpr ksk._spawn 'fossil', 'changes'
      urge  '^98-11^', ksk.add readme_path
      urge  '^98-12^', ksk.commit "add README.md"
      urge  '^98-13^', ksk.list_file_names()
      #.....................................................................................................
      FS.appendFileSync readme_path, "\n\nhelo"
      strange_name = '  strange.txt'
      FS.appendFileSync ( PATH.join checkout_path, strange_name ), "\n\nhelo"
      help  '^98-14^', rpr ksk._spawn 'fossil', 'changes'
      help  '^98-15^', rpr ksk._spawn 'fossil', 'extras'
      help  '^98-16^', rpr ksk.add strange_name
      urge  '^98-17^', ksk.commit "add file with strange name"
      help  '^98-18^', rpr ksk.change_texts()
      #.....................................................................................................
      FS.appendFileSync ( PATH.join checkout_path, strange_name ), "\n\nhelo again"
      help  '^98-19^', rpr ksk.change_texts()
      help  '^98-19^', rpr ksk.list_of_changes()
      help  '^98-19^', rpr ksk.has_changes()
      help  '^98-19^', rpr ksk.changes_by_file()
      #.....................................................................................................
      urge  '^98-22^', ksk._status()
      help  '^98-23^', ksk.status()
      info  '^98-24^', ( k.padEnd 20 ), v for k, v of ksk.status()
      help  '^98-25^', ksk.list_file_names()
      urge  '^98-26^', FS.readdirSync repo_home
      urge  '^98-27^', FS.readdirSync checkout_home
      # urge  '^98-28^', FS.readFileSync ( PATH.join checkout_home, '.fslckout' ), { encoding: 'utf-8', }
  #.........................................................................................................
  done?()


############################################################################################################
if module is require.main then do =>
  return null
