Array.prototype.contains = function( v ) {
  for ( var i = 0, l = this.length; i < l; i++ ) { 
    if ( this[ i ] === v ) return true; 
  }
  return false;
}

//  TODO: proper error logging
function log ( m ) {
  alert( m );
}