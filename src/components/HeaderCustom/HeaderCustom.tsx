/* eslint-disable no-undef */
import React from 'react';
import {StatusBarStyle} from 'react-native';
import {Header} from 'react-native-elements';
import {color, spacing} from '../../theme';
import {typography} from '../../theme/typography';

type propsHeader = {
  title?: string;
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  backgroundStatusBar?: string;
  barStyle?: StatusBarStyle;
  removeBorderWidth?: boolean;
  textColor?: string;
};

export const HeaderCustom = ({
  title,
  leftComponent,
  rightComponent,
  backgroundStatusBar = color.second,
  barStyle = 'dark-content',
  removeBorderWidth = false,
  textColor = color.text,
}: propsHeader) => {
  return (
    <Header
      statusBarProps={{
        barStyle: barStyle,
        backgroundColor: backgroundStatusBar,
      }}
      centerComponent={{
        text: title,
        style: {
          fontWeight: '700',
          color: textColor,
          fontSize: 24,
          lineHeight: 36,
          fontStyle: 'normal',
        },
      }}
      containerStyle={{
        backgroundColor: backgroundStatusBar,
        paddingHorizontal: spacing[4],
        borderBottomWidth: removeBorderWidth ? 0 : 1,
      }}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
      rightContainerStyle={{justifyContent: 'center'}}
      leftContainerStyle={{justifyContent: 'center'}}
    />
  );
};
