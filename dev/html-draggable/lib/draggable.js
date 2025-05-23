(function() {
  var element, i, len, provide, ref;

  provide = function() {
    //---------------------------------------------------------------------------------------------------------
    this.on = function(element, name, handler) {
      /* TAINT add options */
      return element.addEventListener(name, handler, false);
    };
    //---------------------------------------------------------------------------------------------------------
    this._attach_dragover = function() {
      var on_dragover;
      /* TAINT Apparently need for correct dragging behavior, but what if we wanted to handle this event? */
      this.on(document.body, 'dragover', on_dragover = function(event) {
        event.preventDefault();
        return false;
      });
      this._attach_dragover = function() {};
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    this._prv_draggable_id = 0;
    //---------------------------------------------------------------------------------------------------------
    return this.make_draggable = function(element) {
      var id, on_drag_start, on_drop;
      /* thx to http://jsfiddle.net/robertc/kKuqH/
         https://stackoverflow.com/a/6239882/7568091 */
      this._attach_dragover();
      this._prv_draggable_id++;
      id = this._prv_draggable_id;
      this.set(element, 'draggable', true);
      //.......................................................................................................
      this.on(element, 'dragstart', on_drag_start = function(event) {
        var style, x, y;
        style = µ.DOM.get_live_styles(event.target);
        x = (parseInt(style.left, 10)) - event.clientX;
        y = (parseInt(style.top, 10)) - event.clientY;
        return event.dataTransfer.setData('application/json', JSON.stringify({x, y, id}));
      });
      //.......................................................................................................
      this.on(document.body, 'drop', on_drop = function(event) {
        var left, top, transfer;
        transfer = JSON.parse(event.dataTransfer.getData('application/json'));
        if (id !== transfer.id) {
          return;
        }
        left = event.clientX + transfer.x + 'px';
        top = event.clientY + transfer.y + 'px';
        µ.DOM.set_style_rule(element, 'left', left);
        µ.DOM.set_style_rule(element, 'top', top);
        event.preventDefault();
        return false;
      });
      //.......................................................................................................
      return null;
    };
  };

  provide.apply(µ.DOM);

  ref = µ.DOM.select_all('ruler');
  for (i = 0, len = ref.length; i < len; i++) {
    element = ref[i];
    // dragme_dom = µ.DOM.select '#dragme'
    // µ.DOM.make_draggable dragme_dom
    µ.DOM.make_draggable(element);
  }

  // µ.DOM.make_draggable element for element in µ.DOM.select_all 'p'
// log '^334^', "dragme_dom.style.left:", µ.rpr dragme_dom.style.left
// log '^334^', "µ.DOM.get_style_rule dragme_dom, 'left':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'left'
// log '^334^', "µ.DOM.get_style_rule dragme_dom, 'top':", µ.rpr µ.DOM.get_style_rule dragme_dom, 'top'

  // on_dragend = ( event ) ->
//   { x, y, } = JSON.parse event.dataTransfer.getData 'application/json'
//   left      = event.clientX + x + 'px'
//   top       = event.clientY + y + 'px'
//   log '^3332^', "dragend", { left, top, }, event.target
// on_drag = ( event ) -> log( '^on_drag@6676^', µ.rpr( event.dataTransfer.getData( 'application/json' ) ) )
// dragme_dom.addEventListener('drag',on_drag,false)

  // document.body.addEventListener  'dragend',    on_dragend,     false

  // document.body.addEventListener( 'drag',      ( ( e ) => log( 'drag'      ) ), false )
// document.body.addEventListener( 'dragstart', ( ( e ) => log( 'dragstart' ) ), false )
// document.body.addEventListener( 'dragend',   ( ( e ) => log( 'dragend'   ) ), false )
// document.body.addEventListener( 'dragexit',  ( ( e ) => log( 'dragexit'  ) ), false )
// # document.body.addEventListener( 'dragenter', ( ( e ) => log( 'dragenter' ) ), false )
// # document.body.addEventListener( 'dragleave', ( ( e ) => log( 'dragleave' ) ), false )
// # document.body.addEventListener( 'dragover',  ( ( e ) => log( 'dragover'  ) ), false )
// document.body.addEventListener( 'drop',      ( ( e ) => log( 'drop'      ) ), false )

}).call(this);

//# sourceMappingURL=draggable.js.map