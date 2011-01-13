var oneGeni = oneGeni || {};

oneGeni.load = ( function ( $ ) {
  
  var q = [],
    loading;
  
  function success ( d ) {
    if ( !d ) return;
    data = d;
    
    if ( !oneGeni.focused && data.focus ) oneGeni.focused = data.focus.id;
    
    for ( var id in data.nodes ) {
      //  if id is a profile
      if ( id.indexOf( 'profile' ) > -1 ) {
        //  if person is in focus use extended data to create person
        if ( id == data.focus.id ) data.nodes[ id ] = data.focus;
        oneGeni.profiles.add( data.nodes[ id ] );
      }
    }

    for ( var id in data.nodes ) {
      if ( id.indexOf( 'union' ) > -1 ) {
        data.nodes[ id ].id = id;
        oneGeni.unions.add( data.nodes[ id ] );
      }
    }
    
    if ( q.length > 0 ) load ( q.pop() );
    else loading = false;
    
    $( 'body' ).trigger( 'loaded' );
  }
  
  function error ( err ) {
    log( err );
  }
  
  function queue ( id ) {
    if ( q.contains( id ) ) return;
    q.push( id );
    if ( !loading ) load( q.pop() );
  }
  
  function load ( id ) {
    loading = true;
    $( 'body' ).trigger( 'loading' );
    $.ajax({
      url: 'dev/' + id + '.json',
      dataType: 'json',
      success: success,
      error: error
    });
  };
  
  return queue;
  
})( Zepto );