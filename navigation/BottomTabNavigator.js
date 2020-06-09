import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as React from 'react'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import History from '../screens/History'
import PlannerScreen from '../screens/PlannerScreen'

const BottomTab = createBottomTabNavigator()
const INITIAL_ROUTE_NAME = 'Home'

export default function BottomTabNavigator ({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) })

  return (

    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name='Planner'
        component={PlannerScreen}
        options={{
          title: 'Plan',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name='md-git-branch' />
        }}
      />
      <BottomTab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name='md-home' />
        }}
      />
      <BottomTab.Screen
        name='History'
        component={History}
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name='md-book' />
        }}
      />
    </BottomTab.Navigator>
  )
}

function getHeaderTitle (route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME

  switch (routeName) {
    case 'Home':
      return 'Home'
    case 'History':
      return 'Previous runs'
    case 'Planner':
      return 'Plan a route'
  }
}
