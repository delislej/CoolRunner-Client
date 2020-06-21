
import React, { Component } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider as PaperProvider } from 'react-native-paper'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import LinkingConfiguration from './navigation/LinkingConfiguration'
  import { lightTheme, darkTheme } from './constants/Colors' // eslint-disable-line

const Stack = createStackNavigator()

export default class CoolRunner extends Component {
  render () {
    return (
      <PaperProvider theme={lightTheme}>
        <NavigationContainer theme={lightTheme} linking={LinkingConfiguration}>
          <Stack.Navigator>
            <Stack.Screen name='Root' component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>

    )
  }
}
