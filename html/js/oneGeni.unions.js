var oneGeni = oneGeni || {};

oneGeni.unions = ( function () {
  var unions = {};
  
  function add ( union ) {
    if ( unions[ union.id ] ) $.extend( unions[ union.id ], union );
    else unions[ union.id ] = union;
  }
  
  function find ( id ) {
    var r = [];
    for ( u in unions ) {
      for ( key in unions[ u ].edges ) {
        if ( key == id ) {
          r.push( unions[ u ] );
          break;
        }
      }
    }  
    return r;
  }
  
  return {
    add: add,
    get: unions,
    find: find
  }
})();