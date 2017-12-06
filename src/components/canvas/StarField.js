import StarModelStore from 'flux/stores/StarModelStore';

export default function() {
    const PIXI = window.PIXI;
    const StarField = function() {
        PIXI.Graphics.call( this );

        this.update = ()=>{
          this.clear();

          const stars = StarModelStore.getAll().stars;
          const cameraZPos = StarModelStore.getAll().cameraZPos;
          // console.log( 'cameraZPos: ', cameraZPos );

          // console.log( stars );

          this.beginFill( 0xffffff );
          for( var i = 0; i < stars.length; ++i ) {
            var star = stars[ i ];
            // console.log( "star: ", star );
            var zRelative = star.z - cameraZPos;
            if( zRelative<0 || zRelative>50 ) {
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
               this.drawRect( screenXPos, screenYPos, 1, 1 );
            }
          }
          this.endFill();
        };

        // StarModelStore.on( StarModelStore.NEW_CAMERA_POSITION, this.update );
    }
    StarField.prototype = Object.create( PIXI.Graphics.prototype );
    StarField.prototype.constructor = StarField;
    return( new StarField() );
};