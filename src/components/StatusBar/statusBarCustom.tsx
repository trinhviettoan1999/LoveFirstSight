import React from 'react';
import {StatusBar, View, Platform} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const StatusBarCustom = ({backgroundColor, barStyle}: any) => {
  return (
    <View style={{height: STATUSBAR_HEIGHT, backgroundColor: backgroundColor}}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};
export default StatusBarCustom;
