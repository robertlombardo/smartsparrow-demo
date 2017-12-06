import ObjectPool from 'ObjectPool';
import EventEmitter from 'events';
import AppDispatcher from 'flux/AppDispatcher';

const starPool = new ObjectPool(
    // create func
    ( position ) => {
        if( position ) {
          return { x:position.x, y:position.y, z:position.z };
        } else {
          return { x:0, y:0, z:0 };
        }
    },

    // reset func
    ( poolResult, newPosition ) => {
      poolResult.x = newPosition.x;
      poolResult.y = newPosition.y;
      poolResult.z = newPosition.z;
    },

    // starting num
    0
);

// the stuff we serve:
var activeStars = [];
var cameraZPos = 0;
var cameraVelocity = 50;

const TARGET_NUM_STARS = 1000;
const VIEW_RANGE_XY = 10000;
const VIEW_RANGE_Z = 10;

// initialize some stars
for( var i = 0; i < TARGET_NUM_STARS; ++i ) {
   activeStars.push( starPool.get({
      x: -VIEW_RANGE_XY + Math.random()*2*VIEW_RANGE_XY,
      y: -VIEW_RANGE_XY + Math.random()*2*VIEW_RANGE_XY,
      z: -VIEW_RANGE_Z + Math.random()*2*VIEW_RANGE_Z
   }));
} 

const StarModelStore = Object.assign( {}, EventEmitter.prototype, {
   CAMERA_VELOCITY_CHANGED: 'CAMERA_VELOCITY_CHANGED',


    getAll: function() {
      return {
         stars: activeStars,
         cameraZPos,
         cameraVelocity
      };
    }
});
export default StarModelStore;

const HANDLERS = {
    [AppDispatcher.SET_CAMERA_VELOCITY]: setCameraVelocity    
}; 

AppDispatcher.register( function(payload) {
    if( HANDLERS[payload.action.actionType] ) {
        HANDLERS[payload.action.actionType]( payload.action );
    }
    return true;
});

function setCameraVelocity( action ) {
   cameraVelocity = action.newVelocity;
   StarModelStore.emit( StarModelStore.CAMERA_VELOCITY_CHANGED, cameraVelocity );
}

// update camera z position according to camera velocity
var now;
var deltaTime;
var lastUpdate = new Date().getTime();
var newCameraZPos;
const update = ()=>{
   now = new Date().getTime();
   deltaTime = now - lastUpdate;
   if( deltaTime===0 ) {
      requestAnimationFrame( update );
      return;
   }

   newCameraZPos = cameraZPos + (cameraVelocity/100)/deltaTime;
   if( !isNaN(newCameraZPos) ) {
      // console.log( 'cameraZPos: ', cameraZPos );
      cameraZPos = newCameraZPos;
   }

   requestAnimationFrame( update );
   lastUpdate = now;
};
update();

// on a less frequent loop (for performance), add or remove stars
setInterval( ()=>{
   // remove stars out of range
   for( var i = activeStars.length-1; i >= 0; --i ) {
      if( Math.abs(cameraZPos-activeStars[i].z) > VIEW_RANGE_Z ) {
         starPool.put( activeStars.splice(i,1)[0] );
      }
   }

   const numStarsToAdd = TARGET_NUM_STARS - activeStars.length;

   for( var j = 0; j < numStarsToAdd; ++j ) {
      activeStars.push( starPool.get({
         x: -VIEW_RANGE_XY + Math.random()*2*VIEW_RANGE_XY,
         y: -VIEW_RANGE_XY + Math.random()*2*VIEW_RANGE_XY,
         z: cameraVelocity>0? cameraZPos+VIEW_RANGE_Z:cameraZPos-VIEW_RANGE_Z 
      }));
   }
}, 100 );

