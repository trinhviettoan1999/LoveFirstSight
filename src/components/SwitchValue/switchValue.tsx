import React, {useState} from 'react';
import {Switch} from 'react-native';

const SwitchValue = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <Switch
      trackColor={{false: '#F1F1F1', true: '#6A1616'}}
      thumbColor="#FFFFFF"
      onValueChange={toggleSwitch}
      value={isEnabled}
      style={{flex: 1, transform: [{scaleX: 1.3}, {scaleY: 1.4}]}}
    />
  );
};

export default SwitchValue;
