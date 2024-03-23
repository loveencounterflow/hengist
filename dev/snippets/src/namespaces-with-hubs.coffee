


'use strict'


#===========================================================================================================
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'intertalk'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
# WG                        = require '../../../apps/webguy'
# hub_s                     = Symbol.for 'hub'


###

**Note**: I first had in mind to use an ingenious / tricky / treacherous construction that would allow the
'secondary' to reference methods on the host / primary using `this` / `@`; this would have allowed both the
primary and the secondary to use a unified notation like `@f`, `@$.f` to reference `f` on the primary and on
the secondary. However this also would be surprising because now `this` means not the secondary, but the
primary instance in methods of the secondary instance which is too surprising to sound right.

Instead, we're using composition, albeit with a backlink.

###



#===========================================================================================================
class Host

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    @$ = new Secondary @
    return undefined

  #---------------------------------------------------------------------------------------------------------
  show: ->
    help '^650-1^', @
    help '^650-2^', @$
    help '^650-3^', @$.show
    return null

#===========================================================================================================
class Secondary

  #---------------------------------------------------------------------------------------------------------
  constructor: ( host ) ->
    # WG.props.hide @, '_', host
    @_ = host
    return undefined

  #---------------------------------------------------------------------------------------------------------
  show: ->
    urge '^650-4^', @
    urge '^650-5^', @_
    urge '^650-6^', @_.show
    urge '^650-7^', @_.show()
    return null


#===========================================================================================================
if module is require.main then await do =>
  h = new Host()
  h.$.show()

