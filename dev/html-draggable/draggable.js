

/* thx to http://jsfiddle.net/robertc/kKuqH/
https://stackoverflow.com/a/6239882/7568091 */

// const log         = console.log;
const dragme_dom        = document.getElementById('dragme');

const on_drag_start = function ( event ) {
    const style = µ.DOM.get_live_styles( event.target );
    const x = ( parseInt( style.left, 10 ) - event.clientX );
    const y = ( parseInt( style.top,  10 ) - event.clientY );
    const data = JSON.stringify( { x, y, } );
    event.dataTransfer.setData( 'application/json', data );
    // dragme_dom.style.left = ( x + event.clientX ) + 'px';
    // dragme_dom.style.top  = ( y + event.clientY ) + 'px';
};
const on_drag_over = function ( event ) {
    event.preventDefault();
    return false;
};
const on_drop = function ( event ) {
    const { x, y, } = JSON.parse( event.dataTransfer.getData( 'application/json' ) );
    const left      = event.clientX + x + 'px';
    const top       = event.clientY + y + 'px';
    µ.DOM.set_style_rule( dragme_dom, 'left', left );
    µ.DOM.set_style_rule( dragme_dom, 'top',  top  );
    log( '^3334^', { x, y, }, { left, top, } );
    event.preventDefault();
    return false;
};

// const on_drag = function ( event ) {
//   log( '^on_drag@6676^', µ.rpr( event.dataTransfer.getData( 'application/json' ) ) )
// };
// dragme_dom.addEventListener('drag',on_drag,false);

dragme_dom.addEventListener('dragstart',on_drag_start,false);
document.body.addEventListener('dragover',on_drag_over,false);
document.body.addEventListener('drop',on_drop,false);


document.body.addEventListener( 'drag',      ( ( e ) => { log( 'drag'      ); } ), false );
document.body.addEventListener( 'dragstart', ( ( e ) => { log( 'dragstart' ); } ), false );
document.body.addEventListener( 'dragend',   ( ( e ) => { log( 'dragend'   ); } ), false );
document.body.addEventListener( 'dragexit',  ( ( e ) => { log( 'dragexit'  ); } ), false );
// document.body.addEventListener( 'dragenter', ( ( e ) => { log( 'dragenter' ); } ), false );
// document.body.addEventListener( 'dragleave', ( ( e ) => { log( 'dragleave' ); } ), false );
// document.body.addEventListener( 'dragover',  ( ( e ) => { log( 'dragover'  ); } ), false );
document.body.addEventListener( 'drop',      ( ( e ) => { log( 'drop'      ); } ), false );





