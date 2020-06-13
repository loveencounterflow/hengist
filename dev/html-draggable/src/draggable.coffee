

provide = ->

  #---------------------------------------------------------------------------------------------------------
  @on = ( element, name, handler ) ->
    ### TAINT add options ###
    return element.addEventListener name, handler, false

  #---------------------------------------------------------------------------------------------------------
  @_attach_dragover = ->
    ### TAINT Apparently need for correct dragging behavior, but what if we wanted to handle this event? ###
    @on document.body, 'dragover', on_dragover = ( event ) -> event.preventDefault(); return false
    @_attach_dragover = ->
    return null

  @_prv_draggable_id = 0

  #---------------------------------------------------------------------------------------------------------
  @make_draggable = ( element ) ->
    ### thx to http://jsfiddle.net/robertc/kKuqH/
    https://stackoverflow.com/a/6239882/7568091 ###
    @_attach_dragover()
    @_prv_draggable_id++
    id = @_prv_draggable_id
    @set element, 'draggable', true
    #.......................................................................................................
    @on element, 'dragstart', on_drag_start = ( event ) ->
      log '^236^', "dragstart", { element, id, }
      style = µ.DOM.get_live_styles event.target
      x     = ( parseInt style.left, 10 ) - event.clientX
      y     = ( parseInt style.top,  10 ) - event.clientY
      event.dataTransfer.setData 'application/json', JSON.stringify { x, y, id, }
    #.......................................................................................................
    @on document.body, 'drop', on_drop = ( event ) ->
      transfer  = JSON.parse event.dataTransfer.getData 'application/json'
      return unless id is transfer.id
      left      = event.clientX + transfer.x + 'px'
      top       = event.clientY + transfer.y + 'px'
      µ.DOM.set_style_rule element, 'left', left
      µ.DOM.set_style_rule element, 'top',  top
      event.preventDefault()
      return false
    #.......................................................................................................
    return null

provide.apply µ.DOM

# dragme_dom = µ.DOM.select '#dragme'
# µ.DOM.make_draggable dragme_dom
µ.DOM.make_draggable element for element in µ.DOM.select_all 'ruler'
µ.DOM.make_draggable element for element in µ.DOM.select_all 'p'
# log '^334^', "dragme_dom.style.left:", µ.rpr dragme_dom.style.left
# log '^334^', "µ.DOM.get_style_rule dragme_dom, 'left':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'left'
# log '^334^', "µ.DOM.get_style_rule dragme_dom, 'top':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'top'

# on_dragend = ( event ) ->
#   { x, y, } = JSON.parse event.dataTransfer.getData 'application/json'
#   left      = event.clientX + x + 'px'
#   top       = event.clientY + y + 'px'
#   log '^3332^', "dragend", { left, top, }, event.target
# on_drag = ( event ) -> log( '^on_drag@6676^', µ.rpr( event.dataTransfer.getData( 'application/json' ) ) )
# dragme_dom.addEventListener('drag',on_drag,false)

# document.body.addEventListener  'dragend',    on_dragend,     false


document.body.addEventListener( 'drag',      ( ( e ) => log( 'drag'      ) ), false )
document.body.addEventListener( 'dragstart', ( ( e ) => log( 'dragstart' ) ), false )
document.body.addEventListener( 'dragend',   ( ( e ) => log( 'dragend'   ) ), false )
document.body.addEventListener( 'dragexit',  ( ( e ) => log( 'dragexit'  ) ), false )
# document.body.addEventListener( 'dragenter', ( ( e ) => log( 'dragenter' ) ), false )
# document.body.addEventListener( 'dragleave', ( ( e ) => log( 'dragleave' ) ), false )
# document.body.addEventListener( 'dragover',  ( ( e ) => log( 'dragover'  ) ), false )
document.body.addEventListener( 'drop',      ( ( e ) => log( 'drop'      ) ), false )





