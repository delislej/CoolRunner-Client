import React, { Component } from 'react'
import { Platform, StyleSheet, View, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'

import RouteTypeButton from '../components/RouteTypeButton'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class HomeScreen extends Component {
  // Component Lifecycle functions
  constructor (props) {
    super(props)
    this.state = {
      region: {
        latitude: 37.7775,
        longitude: -122.416389,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      location: null,
      error: null
    }

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState(
        { error: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!' }
      )
    }
  }

  componentDidMount () {
    async function GetLocation () {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        this.setState({ error: 'Permission to access location was denied' })
      }

      return await Location.getCurrentPositionAsync({})
    }
    (async () => {
      const location = await GetLocation()
      this.setState({ location: location })

      const region = { ...this.state.region }
      region.latitude = this.state.location.coords.latitude
      region.longitude = this.state.location.coords.longitude
      this.setState({ region: region })
    })()
  }

  // Member functions
  handleGenRoute = () => {
    console.log('Generating route lel')
  }

  handleFreeRun = () => {
    console.log('free running')
  }

  render () {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle} showsUserLocation region={this.state.region}
        />
        <View style={{
          position: 'absolute'
        }}
        />
        <RouteTypeButton onRoute={this.handleGenRoute} onFree={this.handleFreeRun} />
      </View>
    )
  }
}

HomeScreen.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
