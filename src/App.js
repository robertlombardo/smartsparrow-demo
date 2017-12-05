import React, { Component } from 'react';
import './App.css';
import Script from 'react-load-script';

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
    
    // root containers that will hold the scenes we draw.
    PIXI.stage = new PIXI.Container();        
    PIXI.stage._width = window.innerWidth;
    PIXI.stage._height = window.innerHeight;

    /*PIXI.loader.add([ 
        'assets/star-small.png'
    ]).load( this.onAssetsLoaded );*/

    // PIXI.loader.add('star','../assets/star-small.png').load( this.onAssetsLoaded.bind(this) );
    const loader = new PIXI.loaders.Loader();
    loader.add( 'star', './assets/star-small.png' );
    loader.onError.add((err) => {console.log(err)}); // called once per errored file
    loader.load( this.onAssetsLoaded.bind(this) );
  }

  onAssetsLoaded( loader, resources ) {
    console.log( resources );

    const star = new PIXI.Sprite( resources.star.texture );

    // Setup the position of the star
    star.x = PIXI.stage._width / 2;
    star.y = PIXI.stage._height / 2;

    // Rotate around the center
    star.anchor.x = 0.5;
    star.anchor.y = 0.5;

    // Add the star to the scene we are building
    PIXI.stage.addChild( star );

    /*var effect = new PIXI.Graphics();
    effect.beginFill( 0xff0000 );
    effect.drawRect( -20.5, -50, 50, 100 );
    effect.endFill();
    effect.x = PIXI.stage._width/2;
    effect.y = PIXI.stage._height/2;
    PIXI.stage.addChild( effect );*/

    // canvas rendering loop
    const updateCanvas = () => {
      PIXI.renderer.render( PIXI.stage );

      star.rotation += 0.001;

      if( !this.state.done ) {
          requestAnimationFrame( updateCanvas );
      }            
    }
    updateCanvas();
  }
}
export default App;
