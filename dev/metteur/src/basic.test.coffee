
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
  whisper }               = GUY.trm.get_loggers 'METTEUR/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
rvr                       = GUY.trm.reverse
nameit                    = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype()


#-----------------------------------------------------------------------------------------------------------
@mtr_template_is_constructor = ( T, done ) ->
  MTR = require '../../../apps/metteur'
  T?.ok types.isa.function MTR.Template
  T?.throws /not a valid mtr_new_template/, -> try new MTR.Template() catch e then warn rvr e.message; throw e
  # debug new MTR.Template { template: '', }
  T?.ok ( new MTR.Template { template: '', } ) instanceof MTR.Template
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_and_cfg_are_strict = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "helo {name}."
  tpl       = new MTR.Template { template, }
  T?.throws /instance does not have property 'NONEXISTANT'/, -> try tpl.NONEXISTANT     catch e then warn rvr e.message; throw e
  T?.throws /instance does not have property 'NONEXISTANT'/, -> try tpl.cfg.NONEXISTANT catch e then warn rvr e.message; throw e
  T?.ok Object.isFrozen tpl.cfg
  T?.ok Object.isFrozen tpl._cfg
  T?.eq tpl.cfg.open,   '{'
  T?.eq tpl.cfg.close,  '}'
  T?.eq tpl._cfg, { open: '\\{', close: '\\}', rx: /\{(?<key>[^\}]*)\}/g, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_defaults = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "helo {name}."
  tpl       = new MTR.Template { template, }
  result    = tpl.fill { name: "world", }
  T?.eq result, "helo world."
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  test @
  # @mtr_template_and_cfg_are_strict()
