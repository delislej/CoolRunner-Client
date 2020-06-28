
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { lightTheme, darkTheme } from './constants/Colors' // eslint-disable-line
import HomeScreen from './screens/HomeScreen'
import HistoryScreen from './screens/HistoryScreen'
import PlannerScreen from './screens/PlannerScreen'

const Tab = createBottomTabNavigator()
export default class CoolRunner extends Component {
  render () {
    return (
      <PaperProvider theme={lightTheme}>
        <NavigationContainer theme={lightTheme}>
          <Tab.Navigator>
            <Tab.Screen name='Planner' component={PlannerScreen} />
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='History' component={HistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>

    )
  }
}
