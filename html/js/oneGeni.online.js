var oneGeni = oneGeni || {};

oneGeni.online = ( function ( $ ) {
  var online;
  
  function init () {
    window.addEventListener( 'online', function () {
      online = true;
      $( 'body' ).trigger( 'onlinechange' );
    })
    
    window.addEventListener( 'offline', function () {
      online = false;
      $( 'body' ).trigger( 'onlinechange' );
    })
  }
  
  $( init );
  
  return online;
  
})( Zepto );