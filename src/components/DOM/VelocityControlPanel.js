import React, { Component } from 'react';
import StarModelStore from 'flux/stores/StarModelStore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AppActions from 'flux/actions/AppActions';

class VelocityControlPanel extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      velocity: StarModelStore.getAll().cameraVelocity
    };

    StarModelStore.on( StarModelStore.CAMERA_VELOCITY_CHANGED, (newVelocity)=>{
      this.setState({
        velocity: newVelocity
      })
    });
  }

  render() { 
    return (
      <div className="velocity-control-panel">
        <div className="velocity-display">Velocity: {this.state.velocity.toFixed(2)} km/s</div>
        <Slider 
          className="velocity-slider" 
          min={0}
          max={1}
          step={0.001}
          defaultValue={0.9} 
          onChange={this.onSliderChange.bind(this)}/>
      </div>
    );
  }

  onSliderChange( value ) {
    // slider value is from 0~1
    // since the total velocity range (from -100 to 100) is 200, we want to convert our slider scale to 0~Math.sqrt(200)
    value *= Math.sqrt( 200 );
    var newVelocity = -100 + Math.pow(value,2);

    AppActions.setCameraVelocity( newVelocity );
  }
}
export default VelocityControlPanel;
