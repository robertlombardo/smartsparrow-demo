import React, { Component } from 'react';
import './App.css';
import Script from 'react-load-script';
import VelocityControlPanel from 'components/DOM/VelocityControlPanel';
import StarField from 'components/canvas/StarField';

var PIXI;

class App extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      done: false
    };
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
    const mainStar = new PIXI.Sprite( resources.star.texture );
    mainStar.x = PIXI.stage._width / 2;
    mainStar.y = PIXI.stage._height / 2;
    mainStar.anchor.x = 0.5;
    mainStar.anchor.y = 0.5;
    PIXI.stage.addChild( mainStar );

    // canvas rendering loop
    const updateCanvas = () => {
      mainStar.rotation += 0.001;
      starField.update();

      PIXI.renderer.render( PIXI.stage );      

      if( !this.state.done ) {
          requestAnimationFrame( updateCanvas );
      }            
    }
    starField.update();
    updateCanvas();
  }
}
export default App;
