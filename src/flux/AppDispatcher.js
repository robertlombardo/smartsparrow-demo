const Dispatcher = require('flux').Dispatcher;
const assign = require( 'object-assign' );

const AppDispatcher = assign( new Dispatcher(), {
	NAME: 'APP_DISPATCHER',

	SET_CAMERA_VELOCITY: 'SET_CAMERA_VELOCITY',

    handleAppAction: function(action) {
        this.dispatch({
            source: AppDispatcher.NAME,
            action
        });
    }
});
module.exports = AppDispatcher;