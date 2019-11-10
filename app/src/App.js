import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DefaultButton, Callout, Link, getTheme, FontWeights, mergeStyleSets, getId } from 'office-ui-fabric-react';
import Map from './Map';
import axios from 'axios';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

function App() {
  const [funTime, setFunTime] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const stackTokens = { childrenGap: 10 };
  initializeIcons();

  
  useEffect(() => {
    const getFunTime = async () => {
      const { data } = await axios.get('https://hackthejourney.azurewebsites.net/api/funTimeEstimator?code=ml7BNPu1yn5X1isuPib9EsHlDN5saulowFaEB3F9NoLC0ARBy0lZGQ%3D%3D')
      const { funTime } = data
      setFunTime(funTime);
    }
    getFunTime();
  }, [setFunTime])

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
    { name: 'Cooking Classes',
      key: 'checkbox4',
    },{ name: 'Theatres',
    key: 'checkbox5',
  },

  ]

  const onChange = (checked) => {
    setIsChecked(!!checked);
  }


  return (
    <div className="App">
    <Callout style={{width: '200px', height: '150px', padding: '20px'}}>
        <Stack tokens={stackTokens}>
        {activityFilterBoxes.map( item => (
          <Checkbox label={item.name} checked={isChecked} onChange={onChange} />
          ))}
        </Stack>
        </Callout>
        {!funTime && <div><Callout style={{width: '200px', height: '70px', padding: '20px', marginTop: '200px'}}>
        <Spinner size={SpinnerSize.large} label="Calculating distances, please wait" ariaLive="assertive" labelPosition="top" />
        </Callout></div>}
      <Map funTime={funTime}>
      </Map>
    </div>
  );
}

export default App;
