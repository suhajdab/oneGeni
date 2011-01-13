var oneGeni = oneGeni || {};

oneGeni.profiles = ( function ( $ ) {
  var margin = 20;
  
  var cont,
    data = {},
    elm = {},
    center,
    iTouch;

  var profiles = {};
  
  function Profile ( data ) {
    if ( !data ) return;
    var that = this;
    that.pos = false;
    that.data = data;
    
    that.build();
  }
  
  Profile.prototype = {
    
    attr: function ( key, val ) {
      if ( !val ) {
        return that[ key ];
      } else {
        that[ key ] = val;
      }
    },
    
    position: function ( pos, animate ) {
      var that = this;
      if ( !pos ) return that.pos;
      else {
        that.pos = pos;
        that.elm.css({
          webkitTransitionDuration: animate ? animate : 0,
          left: pos.x + 'px',
          top: pos.y + 'px'
        });
      }
    },
    
    build: function () {
      var that = this;
      var name = that.data.first_name + ' ' 
        + ( that.data.middle_name ? that.data.middle_name.substring( 0, 1 ) + '. ' : '' ) 
        + that.data.last_name;

      var bday = that.data.birth_date ? '(' + that.data.birth_date.substr( -4, 4 ) + ')' : '';


      var html = tmpl( 'profile_tmpl', {
        id: that.data.id,
        name: name,
        lived: bday,
        gender: that.data.gender
      });

      that.elm = $( html )
        .bind( 'position', that.handlePosition );

      cont.append( that.elm.get(0) );
    },
    
    init: function () {
      //  position immidiate family
      var that = this,
        male = that.data.gender == 'male',
        y, x, l, w;
      if ( this.data.id == focusId ) {
        that.position({ x: center.x, y: center.y }, '0.5s' );
      }
      //  position children
      y = that.pos.y + ( elm.h + margin );
      l = that.data.children.length;
      w = l * ( elm.w + margin );
      var offset = ( male ? 0 : 1 );
      for ( var i = 0; i < l; i++ ) {
        var child = profiles[ that.data.children[ i ] ];
        if ( !!child.position() ) continue;
        x = that.pos.x - w / 2 + ( i + offset ) * ( elm.w + margin );
        child.position({ x: x, y: y }, '1s');
        that.connect( that.data.id, that.data.children[ i ] );
      }
      
      //  position parents
      y = that.pos.y - ( elm.h + margin );
      var parent1 = profiles[ that.data.parents[ 0 ] ];
      var parent2 = profiles[ that.data.parents[ 1 ] ];
      parent1.position({
        x: that.pos.x + ( elm.w + margin ) / ( parent1.data.gender == 'male' ? 2 : -2 ),
        y: y
      }, '4s');
      parent2.position({
        x: that.pos.x + ( elm.w + margin ) / ( parent2.data.gender == 'male' ? 2 : -2 ),
        y: y
      }, '4s');
      //  TODO: parents status??
      that.connect( that.data.parents[ 0 ], that.data.parents[ 1 ] /*, status */ );
      
      //  position partners
      y = that.pos.y;
      l = that.data.partners.length;
      if ( l > 0 )
      for ( var i = 0; i < l; i++ ) {
        x = that.pos.x + ( i + 1 ) * ( elm.w + margin ) * ( male ? -1 : 1 );
        var id = that.data.partners[ i ].split( ':' )[ 0 ],
        status = that.data.partners[ i ].split( ':' )[ 1 ];
        profiles[ id ].position({ x: x, y: y }, '2s');
        that.connect( that.data.id, id, status );
      }

      //  position siblings
      y = that.pos.y;
      l = that.data.siblings.length;
      for ( var i = 0; i < l; i++ ) {
        x = that.pos.x + ( i + 1 ) * ( elm.w + margin ) * ( male ? 1 : -1 );
        profiles[ that.data.siblings[ i ]].position({ x: x, y: y }, '3s');
      }
    },
    
    handlePosition: function ( e ) {
      
    },
    
    //  TODO: parse union directly?
    connect: function ( id1, id2, status ) {
      var pos1 = profiles[ id1 ].position(),
        pos2 = profiles[ id2 ].position(),
        div = document.createElement( 'div' ),
        className = 'line-' + id1 + ' line-' + id2;
      className += status ? ' ' + status : '';
      div.className = className;
      div.setAttribute( 'role', 'relation' );
      cont.append( div );
      if ( pos1.y == pos2.y ) {
        div.x = ( pos1.x > pos2.x ? pos2.x : pos1.x ) + elm.w / 2;
        div.y = pos1.y + elm.h / 2;
        div.style.webkitTransform = 'translate3d(' + div.x + 'px,' + div.y + 'px,0)';
        div.className += ' horizontal';
        div.style.width = Math.abs( pos1.x - pos2.x ) + 'px';
      }
    }
  } 
  
  
  function init () {
    //  TODO: DRY iTouch
    iTouch = ( 'ontouchstart' in window );
    cont = oneGeni.ui.cont;
    $( 'body' ).delegate( 'article', iTouch ? 'doubleTap' : 'dblclick', handleDTap );
  }
  
  function add ( profile ) {
    if ( profiles[ profile.id ] ) {
      $.extend( profiles[ profile.id ].data, profile );
    } else {
      profiles[ profile.id ] = new Profile ( profile );
    }
  }
  
  function setFocus ( id ) {
    $( 'article.focus' ).removeClass( 'focus' );
    $( '#' + id ).addClass( 'focus' );
  }
  
  function reset () {
    profiles = {};
    cont.html('');
    focusId = false;
  }
  //  TODO: separate out event handling
  function handleDTap ( e ) {
    oneGeni.load( this.id );
  }
 
  
  $( init );
  
  return {
    get: profiles,
    add: add
  }
  
})( Zepto );