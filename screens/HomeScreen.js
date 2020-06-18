import React, { Component } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { connect } from 'react-redux'
import RouteTypeButton from '../components/RouteTypeButton'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class HomeScreen extends Component {
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
        
        <TouchableOpacity onPress={() => this.props.yell('plzwork')}>
          <Text style={{ fontSize: 20 }}>Decrease</Text>
        </TouchableOpacity>
        <MapView
          style={styles.mapStyle} showsUserLocation region={this.state.region}
        >
          <Polyline
            coordinates={this.props.generatedLine}
            strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={3}
          />
        </MapView>
        <View style={{
          position: 'absolute'
        }}
        />
        <RouteTypeButton onRoute={this.handleGenRoute} onFree={this.handleFreeRun} />

      </View>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    yell: (stuff) => dispatch({ type: 'YELL', payload: stuff })

  }
}

function mapStateToProps (state) {
  return {
    phrase: state.phrase,
    generatedLine: state.generatedLine,
    freeRunLine: state.freeRunLine
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

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
