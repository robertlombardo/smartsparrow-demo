import StarModelStore from 'flux/stores/StarModelStore';

export default function() {
    const PIXI = window.PIXI;
    const StarField = function() {
        PIXI.Graphics.call( this );

        this.update = ()=>{
          this.clear();

          const stars = [].concat( StarModelStore.getAll().stars ); // we want a shallow copy
          const cameraZPos = StarModelStore.getAll().cameraZPos;
          const VIEW_RANGE_Z = StarModelStore.getAll().VIEW_RANGE_Z;

          // console.log( stars );

          for( var i = 0; i < stars.length; ++i ) {
            var star = stars[ i ];
            // console.log( "star: ", star );
            var zRelative = star.z - cameraZPos;
            if( zRelative<0 || zRelative>VIEW_RANGE_Z ) {
                // star is behind the camera or beyond view range
                continue;
            }

            var screenXPos = PIXI.stage._width/2 + star.x/zRelative;
            var screenYPos = PIXI.stage._height/2 + star.y/zRelative;

            // console.log( "(x:"+screenXPos+",y:"+screenYPos+")" );
            
            if(    isNaN(screenXPos) || isNaN(screenYPos)
                || screenXPos<0 || screenXPos>PIXI.stage._width 
                || screenYPos<0 || screenYPos>PIXI.stage._height ) {
               // do something?
            } else {
               this.beginFill( 0xffffff, Math.abs((VIEW_RANGE_Z-zRelative)/VIEW_RANGE_Z) );          
               this.drawRect( screenXPos, screenYPos, star.size, star.size );
               this.endFill();
            }
          }
        };

        // StarModelStore.on( StarModelStore.NEW_CAMERA_POSITION, this.update );
    }
    StarField.prototype = Object.create( PIXI.Graphics.prototype );
    StarField.prototype.constructor = StarField;
    return( new StarField() );
};