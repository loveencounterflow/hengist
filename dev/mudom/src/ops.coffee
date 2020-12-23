
globalThis.µ              = require 'mudom'
CND                       = require 'cnd'
INTERTYPE                 = require 'intertype'
Intermatic                = require 'intermatic'
log                       = console.log;
rpr                       = CND.rpr
after                     = ( dts, f ) -> setTimeout f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done

#-----------------------------------------------------------------------------------------------------------
µ.DOM.ready ->

  #---------------------------------------------------------------------------------------------------------
  update_button = ( button, name, state, keys ) =>
    text              = "#{name} "
    for key in keys
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
      for behavior in [ 'up', 'down', 'toggle', 'latch', ]
        do ( keyname, behavior ) =>
          #.................................................................................................
          µ.KB._listen_to_key keyname, behavior, ( d ) =>
            for button in µ.DOM.select_all ".btn[name=#{keyname}]"
              switch µ.DOM.get button, 'latching'
                when 'toggle' then  keys = [ 'up', 'down', 'toggle', ]
                when 'latch'  then  keys = [ 'up', 'down', 'latch', ]
                when 'both'   then  keys = [ 'up', 'down', 'toggle', 'latch', ]
                # when 'tlatch' then  keys = [ 'up', 'down', 'tlatch', ]
                else                keys = [ 'up', 'down', ]
              update_button button, keyname, d.state, keys
            return null
          #.................................................................................................
          return null
    return null
  #.........................................................................................................
  return null

