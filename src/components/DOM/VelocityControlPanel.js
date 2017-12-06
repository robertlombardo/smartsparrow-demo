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
        <div className="velocity-display">Velocity: {this.state.velocity} km/s</div>
        <Slider 
          className="velocity-slider" 
          min={-100}
          max={100}
          defaultValue={this.state.velocity} 
          onChange={this.onSliderChange.bind(this)}/>
      </div>
    );
  }

  onSliderChange( value ) {
    AppActions.setCameraVelocity( value );
  }
}
export default VelocityControlPanel;
