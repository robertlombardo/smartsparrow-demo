import React, { Component } from 'react';
import './App.css';
import Script from 'react-load-script';
import VelocityControlPanel from 'components/DOM/VelocityControlPanel';
import StarField from 'components/canvas/StarField';
import StarModelStore from 'flux/stores/StarModelStore';

var PIXI;
var mainStar;

class App extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      done: false
    };

    window.addEventListener( "resize", this.handleResize );
    window.addEventListener( "orientationchange", this.handleResize );
  }

  render() {
    return (
      <div className="App">
        <div className="root-canvas" id="root-canvas"></div>
        
        <div className="ui-root">
          <div className="ui-header"></div>
          <div className="ui-body"></div>
          <div className="ui-footer">
            <VelocityControlPanel />
          </div>
        </div>

        <Script url="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.6.2/pixi.min.js"
                onError={this.onPixiLoadError.bind(this)}
                onLoad={this.onPixiLoaded.bind(this)}>
        </Script>
      </div>
    );
  }

  onPixiLoadError() {
    console.error( "Error loading PixiJS" );
  }

  onPixiLoaded() {      
    PIXI = window.PIXI;

    // create renderer
    const RendererClass = PIXI.autoDetectRenderer;
    PIXI.renderer = new RendererClass( 
        window.innerWidth, 
        window.innerHeight, 
        {
            backgroundColor: 0x000000, 
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoResize: true,
            roundPixels: false
        } 
    );

    // insert PIXI canvas elements into the DOM.
    document.getElementById('root-canvas').appendChild( PIXI.renderer.view );
    
    // root container that will hold the scene we draw.
    PIXI.stage = new PIXI.Container();        
    PIXI.stage._width = window.innerWidth;
    PIXI.stage._height = window.innerHeight;

    // load image assets
    const loader = new PIXI.loaders.Loader();
    loader.add( 'star', './assets/star-small.png' );
    loader.onError.add((err) => {console.log(err)});
    loader.load( this.onAssetsLoaded.bind(this) );
  }

  onAssetsLoaded( loader, resources ) {
    // star field backdrop
    const starField = new StarField();
    PIXI.stage.addChild( starField );

    // main character star
    mainStar = new PIXI.Sprite( resources.star.texture );
    const redOverlay = new PIXI.Sprite( resources.star.texture );
    const blueOverlay = new PIXI.Sprite( resources.star.texture );
    redOverlay.anchor.x = 0.5;
    redOverlay.anchor.y = 0.5;
    blueOverlay.anchor.x = 0.5;
    blueOverlay.anchor.y = 0.5;
    redOverlay.tint = 0xff0000;
    blueOverlay.tint = 0x0000ff;
    mainStar.addChild( redOverlay );
    mainStar.addChild( blueOverlay );

    mainStar.x = PIXI.stage._width / 2;
    mainStar.y = PIXI.stage._height / 2;
    mainStar.anchor.x = 0.5;
    mainStar.anchor.y = 0.5;
    PIXI.stage.addChild( mainStar );

    // canvas rendering loop
    const updateCanvas = () => {
      starField.update();

      const camVelocity = StarModelStore.getAll().cameraVelocity;
      redOverlay.alpha = Math.max( 0, -camVelocity/200 );
      blueOverlay.alpha = Math.max( 0, camVelocity/200 );

      mainStar.rotation += 0.001;

      PIXI.renderer.render( PIXI.stage );      

      if( !this.state.done ) {
          requestAnimationFrame( updateCanvas );
      }            
    }
    starField.update();
    updateCanvas();
  }

  handleResize() {
    PIXI.stage._width = window.innerWidth;
    PIXI.stage._height = window.innerHeight;
    PIXI.renderer.resize( window.innerWidth, window.innerHeight );

    mainStar.x = PIXI.stage._width / 2;
    mainStar.y = PIXI.stage._height / 2;
  }
}
export default App;
