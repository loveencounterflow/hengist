
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

  # #---------------------------------------------------------------------------------------------------------
  # _keys_from_button = ( button ) ->
  #   switch µ.DOM.get button, 'latching'
  #     when 'toggle' then  return  [ 'up', 'down', 'toggle', ]
  #     when 'latch'  then  return  [ 'up', 'down', 'latch', ]
  #     when 'both'   then  return  [ 'up', 'down', 'toggle', 'latch', ]
  #     when 'tlatch' then  return  [ 'up', 'down', 'tlatch', ]
  #   return                        [ 'up', 'down', ]

  #---------------------------------------------------------------------------------------------------------
  update_button = ( button, keyname, behavior, state ) =>
    if state
      button.innerHTML = "#{keyname} #{behavior}"
      µ.DOM.add_class     button, behavior
    else
      button.innerHTML = "#{keyname} <strike>#{behavior}</strike>"
      µ.DOM.remove_class  button, behavior
    return null

  #---------------------------------------------------------------------------------------------------------
  keynames  = null
  do =>
    keynames  = ( µ.DOM.get button, 'name' for button in µ.DOM.select_all '.btn' )
    keynames  = [ ( new Set keynames )..., ]
  #.........................................................................................................
  do =>
    #.......................................................................................................
    # debug '^3646346^', µ.DOM.select_all '.btn'
    all_buttons = [ ( µ.DOM.select_all '.btn' )..., ]
    for keyname in keynames
      for behavior in [ 'push', 'toggle', 'latch', 'tlatch', ]
          # debug '^ops@4453^', { keyname, behavior, }
        buttons = all_buttons.filter ( x ) => keyname is µ.DOM.get x, 'name'
        buttons = switch behavior
          when 'push'       then buttons
          when 'toggle'     then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) in [ 'both', 'toggle', ]
          when 'latch'      then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) in [ 'both', 'latch',  ]
          when 'tlatch'     then buttons.filter ( x ) => ( µ.DOM.get x, 'latching' ) is 'tlatch'
        # debug '^ops@338^', { keyname, behavior, buttons, }
        for button in buttons
          do ( keyname, behavior, button ) =>
            #...............................................................................................
            µ.KB._listen_to_key keyname, behavior, ( d ) =>
              if behavior is 'latch'
                debug '^ops@338^', { keyname, behavior, state: d.state, d, }
              update_button button, keyname, behavior, d.state
              return null
            return null
          #.................................................................................................
    return null
  #.........................................................................................................
  return null

