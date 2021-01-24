
globalThis.µ              = require 'mudom'
CND                       = require 'cnd'
INTERTYPE                 = require 'intertype'
Intermatic                = require 'intermatic'
log                       = console.log
debug                     = console.debug
rpr                       = CND.rpr
after                     = ( dts, f ) -> setTimeout f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done

#-----------------------------------------------------------------------------------------------------------
µ.DOM.ready ->

  #---------------------------------------------------------------------------------------------------------
  keynames = null

  #---------------------------------------------------------------------------------------------------------
  get_mbmcd_state = -> ( µ.DOM.select '#mbmcd' ).checked

  #---------------------------------------------------------------------------------------------------------
  setup = =>
    keynames    = ( µ.DOM.get button, 'name' for button in µ.DOM.select_all '.btn' )
    keynames    = [ ( new Set keynames )..., ]
    return null

  #---------------------------------------------------------------------------------------------------------
  demo_toggling_etc = =>
    all_buttons = [ ( µ.DOM.select_all '.btn' )..., ]
    behaviors   = [ 'push', 'toggle', 'latch', 'tlatch', 'ptlatch', 'ntlatch', ]
    for keyname in keynames
      for behavior in behaviors
        buttons = all_buttons.filter ( x ) => keyname is µ.DOM.get x, 'name'
        buttons = switch behavior
          when 'push'     then buttons
          when 'toggle'   then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) in [ 'both', 'toggle', ]
          when 'latch'    then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) in [ 'both', 'latch',  ]
          when 'tlatch'   then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) is 'tlatch'
          when 'ptlatch'  then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) is 'ptlatch'
          when 'ntlatch'  then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) is 'ntlatch'
        for button in buttons
          do ( keyname, behavior, button ) =>
            µ.KB._listen_to_key keyname, behavior, ( d ) =>
              update_button button, keyname, behavior, d.state
              return null
            return null

  #---------------------------------------------------------------------------------------------------------
  use_event_names = ->
    ### Demo for using event names instead of callbacks: ###
    for keyname in keynames # "y Y Space Alt AltGraph Control Meta Shift CapsLock".split /\s+/
      µ.KB._listen_to_key keyname, 'toggle', 'pushed_key_y'
    eventdetail_div = µ.DOM.select '#eventdetail'
    µ.DOM.on document, 'pushed_key_y', ( event ) =>
      eventdetail_div.innerHTML = µ.TEXT._escape "event.detail: #{rpr event.detail}"
      return null
    return null

  #---------------------------------------------------------------------------------------------------------
  watch_modifiers = =>
    modblink_div = µ.DOM.select '#modblink'
    µ.KB._listen_to_modifiers ( d ) ->
      # log '^9801^', d
      # log '^9801^', µ.KB._prv_modifiers
      µ.DOM.add_class modblink_div, 'hilite'
      after 0.25, => µ.DOM.remove_class modblink_div, 'hilite'
      # µ.DOM.on document, 'keydown'
      use_mbmcd = get_mbmcd_state()
      for key, state of d
        continue if key is '_type'
        if use_mbmcd
          eventname = if state then 'keydown' else 'keyup'
          document.dispatchEvent new KeyboardEvent eventname, { key, }
        key_div = µ.DOM.select ".lamp[name=#{key}]"
        if state then µ.DOM.add_class     key_div, 'push'
        else          µ.DOM.remove_class  key_div, 'push'
      return null

  #---------------------------------------------------------------------------------------------------------
  update_button = ( button, keyname, behavior, state ) =>
    if state
      # button.innerHTML = "#{keyname} #{behavior}"
      µ.DOM.add_class     button, behavior
    else
      # button.innerHTML = "#{keyname} <strike>#{behavior}</strike>"
      µ.DOM.remove_class  button, behavior
    return null

  #---------------------------------------------------------------------------------------------------------
  setup()
  demo_toggling_etc()
  use_event_names()
  watch_modifiers()

  #.........................................................................................................
  return null

