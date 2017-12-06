import ObjectPool from 'ObjectPool';
import EventEmitter from 'events';

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

// initialize some stars
for( var i = 0; i < 10000; ++i ) {
   activeStars.push( starPool.get({
      x: -100000 + Math.random()*150000, // this._VIEW_RANGE_XY - Math.random() * this._VIEW_RANGE_XY * 2,
      y: -100000 + Math.random()*150000, // this._VIEW_RANGE_XY - Math.random() * this._VIEW_RANGE_XY * 2,
      z: -100 + Math.random()*200 // this._camera_Z + Math.random() * this._VIEW_RANGE_Z
   }))
} 

const StarModelStore = Object.assign( {}, EventEmitter.prototype, {
    getAll: function() {
      return {
         stars: activeStars,
         cameraZPos
      };
    }
});
export default StarModelStore;

var cameraVelocity = 0.8;
/*function setCameraVelocity( action ) {
   cameraVelocity = action.newVelocity;
}*/

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

   newCameraZPos = cameraZPos + cameraVelocity/deltaTime;
   if( !isNaN(newCameraZPos) ) {
      // console.log( 'cameraZPos: ', cameraZPos );
      cameraZPos = newCameraZPos;
   }

   requestAnimationFrame( update );
   lastUpdate = now;
};
update();

/*package
{
   import flash.display.Bitmap;
   import flash.display.BitmapData;
   import flash.display.Stage;
   import flash.events.Event;
   import flash.geom.Rectangle;
   
   public class StarEngine
   {
       
      
      private var _stage:Stage;
      
      private var _canvas:BitmapData;
      
      private const _CANVAS_RECT:Rectangle = new Rectangle(0,0,Main.STAGE_WIDTH,Main.STAGE_HEIGHT);
      
      public var cameraSpeed:Number = 100;
      
      private var _camera_Z:Number = 0;
      
      private const _VIEW_RANGE_Z:Number = 200000.0;
      
      private const _VIEW_RANGE_XY:Number = 1000000.0;
      
      private var _starPool:Vector.<Star>;
      
      private var _activeStars:Vector.<Star>;
      
      private const INITIAL_STARS:uint = 200000;
      
      public var newStarsPerFrame:uint = 15;
      
      private var _runTime:Number;
      
      private var _lastUpdate:Number;
      
      private var _deltaTime:Number;
      
      public function StarEngine(param1:Stage)
      {
         this._canvas = new BitmapData(Main.STAGE_WIDTH,Main.STAGE_HEIGHT,false,0);
         this._starPool = new Vector.<StarEngine>();
         this._activeStars = new Vector.<StarEngine>();
         super();
         this._stage = param1;
      }
      
      public function get numStars() : uint
      {
         return this._activeStars.length;
      }
      
      public function init() : void
      {
         var _loc1_:int = 0;
         while(_loc1_ < 300 * 1000)
         {
            this._starPool.push(new Star());
            _loc1_++;
         }
         _loc1_ = 0;
         while(_loc1_ < this.INITIAL_STARS)
         {
            this.activateNewStar();
            this._activeStars[_loc1_].z = this._camera_Z + Math.random() * this._VIEW_RANGE_Z;
            _loc1_++;
         }
         this._lastUpdate = new Date().valueOf();
         this._stage.addChild(new Bitmap(this._canvas));
         this._stage.addEventListener(Event.ENTER_FRAME,this.onEnterFrame);
      }
      
      private function activateNewStar() : void
      {
         var _loc1_:Star = this._starPool.length > 0?this._starPool.pop():new Star();
         this._activeStars.push(_loc1_);
         _loc1_.x = this._VIEW_RANGE_XY - Math.random() * this._VIEW_RANGE_XY * 2;
         _loc1_.y = this._VIEW_RANGE_XY - Math.random() * this._VIEW_RANGE_XY * 2;
         _loc1_.z = this._camera_Z + this._VIEW_RANGE_Z;
      }
      
      private function onEnterFrame(param1:Event) : void
      {
         var _loc2_:int = 0;
         this._runTime = new Date().valueOf();
         this._deltaTime = this._runTime - this._lastUpdate;
         this._lastUpdate = this._runTime;
         this._camera_Z = this._camera_Z + this.cameraSpeed / this._deltaTime;
         if(this.cameraSpeed > 0 && this.newStarsPerFrame > 0)
         {
            _loc2_ = 0;
            while(_loc2_ < this.newStarsPerFrame)
            {
               this.activateNewStar();
               _loc2_++;
            }
         }
         this._canvas.lock();
         this.drawStars();
         this._canvas.unlock();
      }
   }
}*/