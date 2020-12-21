
globalThis.µ              = require 'mudom'
CND                       = require 'cnd'
INTERTYPE                 = require 'intertype'
Intermatic                = require 'intermatic'
log                       = console.log;
rpr                       = CND.rpr

log { Intermatic, }
# log { INTERTYPE, }
# log new INTERTYPE.Intertype()
# log CND.rpr( Array.from( 'abcd' ) )
log Array.from 'abcd'
# ### NOTE `require` with local file *must* use file extension
###
µ.KB.XXXXXXXXXXXX_foobar()
µ.DOM.on document, 'µ_kb_capslock_changed', ( event ) =>
  log '^33334^', "µ_kb_capslock_changed", event.detail
  return null

µ.DOM.on document, 'µ_kb_modifier_changed', ( event ) =>
  log '^33334^', "µ_kb_modifier_changed", event.detail
  for key, value of event.detail
    continue if key.startsWith '_'
    selector  = "[name=#{key}]"
    btn       = µ.DOM.select selector, null
    continue unless btn?
    log '^344^', key, rpr value, selector
    switch value
      when true then  µ.DOM.swap_class btn, 'false', 'true'
      when false then µ.DOM.swap_class btn, 'true',  'false'
      else µ.DOM.insert_as_last btn, rpr value
  return null
###

µ.KB._listen_to_key 'Alt', 'down', ( d ) => log "^22209^ 'Alt', 'down', ", d
µ.KB._listen_to_key 'Alt', null,   ( d ) => log "^22209^ 'Alt', null,   ", d
µ.KB._listen_to_key null, 'down',  ( d ) => log "^22209^ null, 'down',  ", d
µ.KB._listen_to_key null, null,    ( d ) => log "^22209^ null, null,    ", d


