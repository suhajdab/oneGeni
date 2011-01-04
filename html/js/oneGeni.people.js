var oneGeni = oneGeni || {};

oneGeni.people = ( function ( $ ) {
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
    center,
    iTouch;

  var people = {},
    focusId;
  
  function Person ( data ) {
    if ( !data ) return;
    var that = this;
    that.pos = false;
    that.data = data;
    that.data.children = [];
    that.data.parents = [];
    that.data.partners = [];
    
    var html = document.createElement( 'article' );

    var name = document.createElement( 'h1' );
    name.innerHTML = that.data.first_name + ' ' 
      + ( that.data.middle_name ? that.data.middle_name.substring( 0, 1 ) + '. ' : '' ) 
      + that.data.last_name;

    var bday = document.createElement( 'h3' );
    bday.innerHTML = that.data.birth_date ? '(' + that.data.birth_date.substr( -4, 4 ) + ')' : '';

    var img = document.createElement( 'img' );
    img.src = 'img/' + that.data.gender + '_silhouette.png';

    $( html )
      .attr( 'role', 'person' )
      .attr( 'id', that.data.id )
      .addClass( that.data.gender )
      .append( img )
      .append( name )
      .bind( 'position', that.handlePosition )
      .append( bday );

    cont.append( html );
    that.elm = html;
  }
  
  Person.prototype = {
    
    attr: function ( key, val ) {
      if ( !val ) {
        return that[ key ];
      } else {
        that[ key ] = val;
      }
    },
    
    children: function ( c ) {
      var that = this;
      if ( !c ) return that.data.children;
      if ( typeof c == 'string' && !that.data.children.contains( c ) ) 
        that.data.children.push( c );
      else if ( c instanceof Array ) 
        that.data.children = c;
    },
    
    parents: function ( p ) {
      var that = this;
      if ( !p ) return that.data.parents;
      if ( typeof p == 'string' && !that.data.parents.contains( p ) ) 
        that.data.parents.push( p );
      else if ( p instanceof Array ) 
        that.data.parents = p;
    },
    
    partners: function ( p, status ) {
      var that = this;
      if ( !p ) return that.data.partners;
      if ( typeof p == 'string' && !that.data.partners.contains( p + ':' + status ) ) 
        that.data.partners.push( p + ':' + status );
      else if ( p instanceof Array ) 
        that.data.partners = p;
    },
    
    position: function ( pos, animate ) {
      var that = this;
      if ( !pos ) return that.pos;
      else {
        that.pos = pos;
        that.elm.style.webkitTransitionDuration = animate ? '1s' : 0;
        that.elm.style.webkitTransform = 'translate3d(' + ( center.x + pos.x ) + 'px,' + ( center.y + pos.y ) + 'px,0)';
      }
    },
    
    init: function () {
      //  position immidiate family
      var that = this,
        y, x, l, w;
      if ( this.data.id == focusId ) {
        that.position({ x: 0, y: 0 });
      }
      //  position children
      y = elm.h + margin;
      l = that.data.children.length;
      w = l * ( elm.w + margin );
      var mid = l / 2  + ( that.data.gender == 'male' ? 0 : 1 );
      for ( var i = 0; i < l; i++ ) {
        x = that.pos.x - w / 2 + ( mid - i ) * ( elm.w + margin );
        people[ that.data.children[ i ] ].position({ x: x, y: y });
      }
    },
    
    handlePosition: function ( e ) {
      
    }
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
    center = {
      x: Math.floor( ( window.outerWidth - elm.w ) / 2 ),
      y: Math.floor( ( window.outerHeight - elm.h ) / 2 )
    }
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
		
	  cont.css( '-webkit-transform', 'translate(' + ( pos.x + delta.x ) + 'px,' + ( pos.y + delta.y ) + 'px)' );
  }
  
  function endHandler ( e ) {
    cancelEvent();
    pos.x += delta.x;
    pos.y += delta.y;
  }
  
  function parse ( d ) {
    if ( !d ) return;

    data = d;
    
    for ( var id in data.nodes ) {
      //  if id is a profile & isn't in people yet
      if ( id.indexOf( 'profile' ) > -1 && !people[ id ] ) {
        //  if person is in focus use extended data to create person
        if ( id == data.focus.id ) people[ id ] = new Person ( data.focus );
        else people[ id ] = new Person ( data.nodes[ id ] );
      }
    }

    for ( var id in data.nodes ) {
      if ( id.indexOf( 'union' ) > -1 ) relate( data.nodes[ id ] );
    }
    

    //  if focus ( initially loaded profile ) isn't set yet
    if ( !focusId ) {
      focusId = data.focus.id;
      $( '#' + focusId ).addClass( 'focus' );
      people[ focusId ].init();
    }
  }
  
  function relate ( union ) {
    var edges = union.edges
      parents = [],
      children = [];
      
    for ( var id in edges ) {
      for ( var id2 in edges ) {
        if ( id == id2 ) continue;
        if ( edges[ id ].rel == 'partner' && edges[ id2 ].rel == 'child' ) people[ id ].children( id2 );
        if ( edges[ id ].rel == 'child' && edges[ id2 ].rel == 'partner' ) people[ id ].parents( id2 );        
        if ( edges[ id ].rel == 'partner' && edges[ id2 ].rel == 'partner' ) people[ id ].partners( id2, union.status );
      }
    }
    
    // var edges = union.edges,
    //      totalW = elm.w + margin,
    //      totalH = elm.h + margin;
    //    //if ( ! edges[ data.focus.id ] ) return;
    //    for ( var id in edges ) {
    //      var x, y;
    //      if ( id == data.focus.id ) continue;
    //      if ( edges[ data.focus.id ].rel == 'child' ) {
    //        if ( edges[ id ].rel == 'child' ) {
    //          data.focus.siblings = ( !!data.focus.siblings ) 
    //            ? data.focus.siblings + 1 
    //            : 1;
    //          y = 0;
    //          x = ( people[ data.focus.id ].data.gender == 'male' ) 
    //            ? - totalW * data.focus.siblings
    //            : totalW * data.focus.siblings;
    //        } else {
    //          y = - totalH;
    //          x = ( people[ id ].data.gender == 'male' ) 
    //            ? - totalW / 2 
    //            : totalW / 2;
    //        }
    //        
    //        
    //      } else if ( edges[ data.focus.id ].rel == 'partner' ) {
    //        if ( edges[ id ].rel == 'partner' ) {
    //          y = 0;
    //          x = ( people[ id ].data.gender == 'male' )
    //            ? - totalW
    //            : totalW;
    //        } else if ( edges[ id ].rel == 'child' ) {
    //          y = totalH;
    //          x = ( people[ data.focus.id ].data.gender == 'male' ) 
    //            ? totalW / 2
    //            : - totalW / 2;
    //        }
    //      }
    //      
    //      
    //      if ( edges[ id ].rel == 'partner' ) $( people[ id ].elm ).addClass( union.status );
    //      else if ( edges[ id ].rel == 'child' ) $( people[ id ].elm ).addClass( 'child' );
    //      
    //      people[ id ].position({ x: x, y: y });
    //    }
  }
 
  
  $( init );
  
  return people;
  
})( Zepto );