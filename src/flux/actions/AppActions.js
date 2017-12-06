const AppDispatcher = require( 'flux/AppDispatcher' );

const AppActions = {
      
    setCameraVelocity: function( newVelocity ) {
        AppDispatcher.handleAppAction({
            actionType: AppDispatcher.SET_CAMERA_VELOCITY,
            newVelocity
        });
    }
}
module.exports = AppActions;