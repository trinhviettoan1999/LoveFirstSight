/* eslint-disable no-undef */
import React from 'react';
import {StatusBarStyle} from 'react-native';
import {Header, HeaderProps} from 'react-native-elements';
import {color, spacing} from '../../theme';

type propsHeader = {
  title?: string;
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  centerComponent?: JSX.Element;
  backgroundStatusBar?: string;
  barStyle?: StatusBarStyle;
  removeBorderWidth?: boolean;
  textColor?: string;
  ViewComponent?: React.Component;
  height?: number;
};

export const HeaderCustom = ({
  title,
  leftComponent,
  rightComponent,
  centerComponent,
  backgroundStatusBar = color.second,
  barStyle = 'dark-content',
  removeBorderWidth = false,
  textColor = color.primary,
  height,
}: propsHeader) => {
  return (
    <Header
      statusBarProps={{
        barStyle: barStyle,
        backgroundColor: backgroundStatusBar,
      }}
      centerComponent={
        centerComponent || {
          text: title,
          style: {
            fontWeight: 'bold',
            color: textColor,
            fontSize: 20,
            fontStyle: 'normal',
          },
        }
      }
      containerStyle={{
        height: height,
        backgroundColor: backgroundStatusBar,
        paddingHorizontal: spacing[4],
        borderBottomWidth: removeBorderWidth ? 0 : 1,
      }}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
      centerContainerStyle={{flex: 1}}
      rightContainerStyle={{
        justifyContent: 'center',
        flex: 1,
      }}
      leftContainerStyle={{
        justifyContent: 'center',
        flex: 1,
      }}
    />
  );
};
