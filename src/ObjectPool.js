export default function( createObjFunc, resetObjFunc, startingNum ) {
	var poolResult;
	var pool = [];

	for( var i = 0; i < startingNum; ++i ) {
		pool.push( createObjFunc() );
	}

	this.get = ( data ) => {
		if( pool.length > 0 ) {
			poolResult = pool.pop();
			resetObjFunc( poolResult, data );
		} else {			
			poolResult = createObjFunc( data );
		}

		return poolResult;
	};

	this.put = ( obj ) => {
		pool.push( obj );
	};
}