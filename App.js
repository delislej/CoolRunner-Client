import {
  NavigationContainer
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import {
  Provider as PaperProvider
} from 'react-native-paper'

import useCachedResources from './hooks/useCachedResources'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import LinkingConfiguration from './navigation/LinkingConfiguration'
import { lightTheme, darkTheme } from './constants/Colors' // eslint-disable-line

const Stack = createStackNavigator()

export default function App (props) {
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
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
