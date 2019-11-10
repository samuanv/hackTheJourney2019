import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DefaultButton, Callout, FontIcon, Link, getTheme, FontWeights, mergeStyleSets, getId, Label } from 'office-ui-fabric-react';
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
      const { data } = await axios.get('https://hackthejourney.azurewebsites.net/api/funTimeEstimator?code=ml7BNPu1yn5X1isuPib9EsHlDN5saulowFaEB3F9NoLC0ARBy0lZGQ%3D%3D&dateTimeArrival=2019-11-10%208:30&dateTimeDeparture=2019-11-10%2013:30')
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
  const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
  }
  const [hour, min] = convertMinsToHrsMins(parseInt(funTime)).split(':');
  const label = `${hour} hours and ${min} minutes`;
  return (
    <div className="App">
    <Callout style={{width: '200px', height: '150px', padding: '20px'}}>
        <Stack tokens={stackTokens}>
        {activityFilterBoxes.map( item => (
          <Checkbox label={item.name} checked={isChecked} onChange={onChange} />
          ))}
        </Stack>
        </Callout>
        <Callout style={{width: '200px', height: '70px', padding: '20px', marginTop: '200px'}}>
          {!funTime && <Spinner size={SpinnerSize.large} label="Calculating distances, please wait" ariaLive="assertive" labelPosition="top" />}
          {funTime &&
 <Label> Fun Time calculated:<br/>  You have {label} to enjoy Barcelona!</Label>}
        </Callout>
      <Map funTime={funTime}>
      </Map>
    </div>
  );
}

export default App;
