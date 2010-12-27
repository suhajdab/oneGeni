var oneGeni = oneGeni || {};

oneGeni.load = ( function () {
  var margin = 20,
    start = {},
    pos = {
      x: 0,
      y: 0
    },
    delta = {};
  
  var cont,
    data = {},
    elm = {},
    iTouch;
  
  
  
  var person = function ( data ) {
    this.data = data;
  }
  
  
  
  function init () {
    
    iTouch = ( 'ontouchstart' in window );
    
    cont = $( 'section' );
    var html = document.createElement( 'article' );
    cont.append( html );
    html = $( html )
      .attr( 'role', 'person' );
    elm.w = html.width();
    elm.h = html.height();
    html.remove();
    
    // TEMP
    var tm = 3233935,
      sa = 3233940,
      hz = 3234120,
      sb = 3233920
    
    $.ajax({
      url: 'dev/profile-' + sb + '.json',
      dataType: 'json',
      success: parse
    });
    
    document.body.addEventListener( iTouch ? 'touchstart' : 'mousedown', startHandler, false );
    //window.addEventListener( 'touchmove', prevent, false );
  }
  
  function prevent ( e ) {
    e.preventDeault();
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
    e.preventDefault();
    
		delta.x = ( iTouch ? e.touches[ 0 ].pageX : e.clientX ) - start.x;
		delta.y = ( iTouch ? e.touches[ 0 ].pageY : e.clientY ) - start.y;
		
	  cont.css( '-webkit-transform', 'translate(' + ( pos.x + delta.x ) + 'px,' + ( pos.y + delta.y ) + 'px)' );
  }
  
  function endHandler ( e ) {
    pos.x += delta.x;
    pos.y += delta.y;
    
    document.body.removeEventListener( iTouch ? 'touchmove' : 'mousemove', moveHandler );
    document.body.removeEventListener( iTouch ? 'touchend' : 'mouseup', endHandler );
  }
  
  function parse ( d ) {

    data = d;
    
    for ( var id in data.nodes ) {
      if ( id.indexOf( 'profile' ) > -1 ) add( data.nodes[ id ] );
    }

    for ( var id in data.nodes ) {
      if ( id.indexOf( 'union' ) > -1 ) relate( data.nodes[ id ] );
    }
    
    data.focus.elm = $( '#' + data.focus.id ).addClass( 'focus' );
  }
  
  function add ( person ) {
    var html = document.createElement( 'article' );
    $( html )
      .attr( 'role', 'person' )
      .attr( 'id', person.id )
      .addClass( person.gender )
      .text( person.first_name + ' ' + ( person.middle_name ? person.middle_name + ' ' : '' ) + person.last_name );
      
    cont.append( html );
    data.nodes[ person.id ].elm = html;
  }
  
  function relate ( union ) {
    var edges = union.edges,
      totalW = elm.w + margin,
      totalH = elm.h + margin;
    //if ( ! edges[ data.focus.id ] ) return;
    for ( var id in edges ) {
      var x, y;
      if ( id == data.focus.id ) continue;
      if ( edges[ data.focus.id ].rel == 'child' ) {
        if ( edges[ id ].rel == 'child' ) {
          data.focus.siblings = ( !!data.focus.siblings ) 
            ? data.focus.siblings + 1 
            : 1;
          y = 0;
          x = ( data.nodes[ data.focus.id ].gender == 'male' ) 
            ? - totalW * data.focus.siblings
            : totalW * data.focus.siblings;
        } else {
          y = - totalH;
          x = ( data.nodes[ id ].gender == 'male' ) 
            ? - totalW / 2 
            : totalW / 2;
        }
        
        
      } else if ( edges[ data.focus.id ].rel == 'partner' ) {
        if ( edges[ id ].rel == 'partner' ) {
          y = 0;
          x = ( data.nodes[ id ].gender == 'male' )
            ? - totalW
            : totalW;
        } else if ( edges[ id ].rel == 'child' ) {
          y = totalH;
          x = ( data.nodes[ data.focus.id ].gender == 'male' ) 
            ? totalW / 2
            : - totalW / 2;
        }
      }
      
      
      if ( edges[ id ].rel == 'partner' ) $( data.nodes[ id ].elm ).addClass( union.status );
      else if ( edges[ id ].rel == 'child' ) $( data.nodes[ id ].elm ).addClass( 'child' );
      
      data.nodes[ id ].elm.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
    }
  }
  
  window.addEventListener( 'load', init );
  
})();