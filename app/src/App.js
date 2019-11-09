import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DefaultButton, Callout, Link, getTheme, FontWeights, mergeStyleSets, getId } from 'office-ui-fabric-react';
import Map from './Map';
import axios from 'axios';

function App() {
  const [funTime, setFunTime] = useState(null);





  useEffect(async () => {
    const { data } = await axios.get('https://hackthejourney.azurewebsites.net/api/funTimeEstimator?code=ml7BNPu1yn5X1isuPib9EsHlDN5saulowFaEB3F9NoLC0ARBy0lZGQ%3D%3D')
    const { funTime } = data
    setFunTime(funTime);
  }, [setFunTime])




  // document.addEventListener('DOMContentLoaded', function() {
  //   console.log('DOM is ready');
  //   loadMap();
  // });

  const activityFilterBoxes = [
    { name: 'Points of Interest',
      key: 'checkbox1',
    },
    { name: 'Restaurants',
      key: 'checkbox2',
    },
    { name: 'Charities',
      key: 'checkbox3',
    },
  ]

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type = 'checkbox' ? target.checked : target.value;
    const name = target.name
  }

  return (
    <div className="App">
      <Map funTime={funTime}></Map>
      <div style={{width: '200px', height: '200px'}}>
      {activityFilterBoxes.map( item => (
       <label>
         {item.name}
         <input
       name={item.name}
       type='checkbox'
      //  onChange= {this.handleInputChange}
       ></input>
       </label>
      ))}
    </div>
    </div>
  );
}

export default App;
