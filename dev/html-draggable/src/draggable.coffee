
### thx to http://jsfiddle.net/robertc/kKuqH/
https://stackoverflow.com/a/6239882/7568091 ###

provide = ->

  @make_draggable = ( selector ) ->
    @_make_draggable element for element in nodes = @select_all selector
    return nodes.length

  @_make_draggable = ( element ) ->
      log '^333^', "select:", element
    return null

provide.apply µ.DOM

# log         = console.log;
dragme_dom        = µ.DOM.select '#dragme'
log '^334^', "dragme_dom.style.left:", µ.rpr dragme_dom.style.left
log '^334^', "µ.DOM.get_style_rule dragme_dom, 'left':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'left'
log '^334^', "µ.DOM.get_style_rule dragme_dom, 'top':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'top'

on_drag_start = ( event ) ->
  style = µ.DOM.get_live_styles( event.target )
  x     = ( parseInt style.left, 10 ) - event.clientX
  y     = ( parseInt style.top,  10 ) - event.clientY
  event.dataTransfer.setData 'application/json', JSON.stringify { x, y, }

on_drag_over = ( event ) ->
  event.preventDefault()
  return false

on_drop = ( event ) ->
  { x, y, } = JSON.parse event.dataTransfer.getData 'application/json'
  left      = event.clientX + x + 'px'
  top       = event.clientY + y + 'px'
  log '^3332^', event.target
  µ.DOM.set_style_rule dragme_dom, 'left', left
  µ.DOM.set_style_rule dragme_dom, 'top',  top
  log( '^3334^', { x, y, }, { left, top, } )
  event.preventDefault()
  return false


# on_dragend = ( event ) ->
#   { x, y, } = JSON.parse event.dataTransfer.getData 'application/json'
#   left      = event.clientX + x + 'px'
#   top       = event.clientY + y + 'px'
#   log '^3332^', "dragend", { left, top, }, event.target
# on_drag = ( event ) -> log( '^on_drag@6676^', µ.rpr( event.dataTransfer.getData( 'application/json' ) ) )
# dragme_dom.addEventListener('drag',on_drag,false)

dragme_dom.addEventListener     'dragstart',  on_drag_start,  false
document.body.addEventListener  'dragover',   on_drag_over,   false
document.body.addEventListener  'drop',       on_drop,        false
# document.body.addEventListener  'dragend',    on_dragend,     false


document.body.addEventListener( 'drag',      ( ( e ) => log( 'drag'      ) ), false )
document.body.addEventListener( 'dragstart', ( ( e ) => log( 'dragstart' ) ), false )
document.body.addEventListener( 'dragend',   ( ( e ) => log( 'dragend'   ) ), false )
document.body.addEventListener( 'dragexit',  ( ( e ) => log( 'dragexit'  ) ), false )
# document.body.addEventListener( 'dragenter', ( ( e ) => log( 'dragenter' ) ), false )
# document.body.addEventListener( 'dragleave', ( ( e ) => log( 'dragleave' ) ), false )
# document.body.addEventListener( 'dragover',  ( ( e ) => log( 'dragover'  ) ), false )
document.body.addEventListener( 'drop',      ( ( e ) => log( 'drop'      ) ), false )





