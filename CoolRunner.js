
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { lightTheme, darkTheme } from './constants/Colors' // eslint-disable-line
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from './screens/HomeScreen'
import HistoryScreen from './screens/HistoryScreen'
import PlannerScreen from './screens/PlannerScreen'
import BackgroundGeolocation from 'react-native-background-geolocation'

const Tab = createBottomTabNavigator()
export default class CoolRunner extends Component {
  componentWillMount () {

  }

  // You must remove listeners when your component unmounts
  componentWillUnmount () {
    BackgroundGeolocation.removeListeners()
  }

  

  render () {
    return (
      <PaperProvider theme={lightTheme}>
        <NavigationContainer theme={lightTheme}>
          <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen name='Planner' component={PlannerScreen} options={{ tabBarLabel: 'Planner', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='directions-fork' color={color} size={size} />) }} />
            <Tab.Screen name='Home' component={HomeScreen} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='home' color={color} size={size} />) }} />
            <Tab.Screen name='History' component={HistoryScreen} options={{ tabBarLabel: 'History', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='history' color={color} size={size} />) }} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>

    )
  }
}
