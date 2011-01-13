var oneGeni = oneGeni || {};

oneGeni.position = ( function ( $ ){
  var center, dimensions;
  
  function init () {
    cont = oneGeni.ui.cont;
    var html = document.createElement( 'article' );
    cont.append( html );
    html = $( html )
      .attr( 'role', 'person' );
    dimensions = {
      w: html.width(),
      h: html.height()
    };
    center = {
      x: Math.floor( ( window.outerWidth - dimensions.w ) / 2 ),
      y: Math.floor( ( window.outerHeight - dimensions.h ) / 2 )
    };
    html.remove();
    
    $( 'body' ).bind( 'loaded', loadedHandler );
  }
  
  function loadedHandler () {
    //  check if focused profile is positioned
    if ( !oneGeni.profiles.get[ oneGeni.focused ].pos ) {
      oneGeni.profiles.get[ oneGeni.focused ].position( center );
    }
  }
  
  init();
  
})( Zepto );