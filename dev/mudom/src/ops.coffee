
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
  _keys_from_button = ( button ) ->
    switch µ.DOM.get button, 'latching'
      when 'toggle' then  return  [ 'up', 'down', 'toggle', ]
      when 'latch'  then  return  [ 'up', 'down', 'latch', ]
      when 'both'   then  return  [ 'up', 'down', 'toggle', 'latch', ]
      when 'tlatch' then  return  [ 'up', 'down', 'tlatch', ]
    return                        [ 'up', 'down', ]

  #---------------------------------------------------------------------------------------------------------
  update_button = ( button, name, state ) =>
    text = "#{name} "
    for key in _keys_from_button button
      continue unless state[ key ] ? false
      text += "#{key} "
    # log '^4443^', ( µ.DOM.get button, 'id' ), name, state
    classes           = "btn #{text}"
    button.innerHTML  = text
    µ.DOM.set button, 'class', classes
    return null

  #---------------------------------------------------------------------------------------------------------
  keynames  = null
  do =>
    keynames  = ( µ.DOM.get button, 'name' for button in µ.DOM.select_all '.btn' )
    keynames  = [ ( new Set keynames )..., ]
  #.........................................................................................................
  do =>
    #.......................................................................................................
    for keyname in keynames
      for behavior in [ 'up', 'down', 'toggle', 'latch', 'tlatch', ]
        do ( keyname, behavior ) =>
          #.................................................................................................
          debug '^ops@4453^', { keyname, behavior, }
          µ.KB._listen_to_key keyname, behavior, ( d ) =>
            for button in µ.DOM.select_all ".btn[name=#{keyname}]"
              update_button button, keyname, d.state
            return null
          #.................................................................................................
          return null
    return null
  #.........................................................................................................
  return null

