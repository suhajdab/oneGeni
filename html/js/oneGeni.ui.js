var oneGeni = oneGeni || {};

oneGeni.ui = ( function ( $ ) {
  var cont,
    start = {},
    pos = {
      x: 0,
      y: 0
    },
    delta = {},
    iTouch = ( 'ontouchstart' in window );
  function init () {
    
    cont = $( 'section' );
    
    document.body.addEventListener( iTouch ? 'touchstart' : 'mousedown', startHandler, false );
  }
  
  function cancelEvent () {
    document.body.removeEventListener( iTouch ? 'touchmove' : 'mousemove', moveHandler );
    document.body.removeEventListener( iTouch ? 'touchend' : 'mouseup', endHandler );
    
    start = { x: 0, y: 0 };
  }
  
  function startHandler ( e ) {
    if ( iTouch && e.touches.length > 1 ) return;
    
    start = {
 			x: iTouch ? e.touches[ 0 ].pageX : e.clientX,
 			y: iTouch ? e.touches[ 0 ].pageY : e.clientY
    }
     
    document.body.addEventListener( iTouch ? 'touchmove' : 'mousemove', moveHandler, false );
    document.body.addEventListener( iTouch ? 'touchend' : 'mouseup', endHandler, false );
  }
  
  function moveHandler ( e ) {
    if ( iTouch && e.touches.length > 1 ) {
      cancelEvent();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    
		delta.x = ( iTouch ? e.touches[ 0 ].pageX : e.clientX ) - start.x;
		delta.y = ( iTouch ? e.touches[ 0 ].pageY : e.clientY ) - start.y;
    console.log( delta )
		
	  cont.css( '-webkit-transform', 'translate(' + ( pos.x + delta.x ) + 'px,' + ( pos.y + delta.y ) + 'px)' );
  }
  
  function endHandler ( e ) {
    cancelEvent();
    pos.x += delta.x;
    pos.y += delta.y;
  }
  
  init();
  
  return {
    cont: cont
  }
})( Zepto );