import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DefaultButton, Callout, Link, getTheme, FontWeights, mergeStyleSets, getId } from 'office-ui-fabric-react';
import Map from './Map';
import axios from 'axios';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

function App() {
  const [funTime, setFunTime] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const stackTokens = { childrenGap: 10 };

  
  useEffect(() => {
    const getFunTime = async () => {
      const { data } = await axios.get('https://hackthejourney.azurewebsites.net/api/funTimeEstimator?code=ml7BNPu1yn5X1isuPib9EsHlDN5saulowFaEB3F9NoLC0ARBy0lZGQ%3D%3D')
      const { funTime } = data
      setFunTime(funTime);
    }
    getFunTime();
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

  const onChange = (checked) => {
    setIsChecked(!!checked);
  }


  return (
    <div className="App">
    <Callout style={{width: '200px', height: '100px', padding: '20px'}}>
        <Stack tokens={stackTokens}>
        {activityFilterBoxes.map( item => (
          <Checkbox label={item.name} checked={isChecked} onChange={onChange} />
          ))}
        </Stack>
        </Callout>
      <Map funTime={funTime}>
      </Map>
    </div>
  );
}

export default App;
