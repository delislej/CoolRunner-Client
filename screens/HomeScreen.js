import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Slider } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import { connect } from 'react-redux'
import MetricsCard from '../components/MetricsCard'
import RouteTypeButton from '../components/RouteTypeButton'
import { getRoute, decodePoly, calcDistance } from '../utils/Route'
import BottomSheet from 'reanimated-bottom-sheet'
import BackgroundGeolocation from 'react-native-background-geolocation'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.005
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class HomeScreen extends Component {
  // Component Lifecycle functions
  constructor (props) {
    super(props)
    this.sheetRef = React.createRef()
    this.state = {
      distanceTravelled: 0,
      intervalId: null,
      sheet: 1,
      region: {
        latitude: 37.7775,
        longitude: -122.416389,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      location: null,
      distance: 1,
      error: null,
      watching: false,
      paused: true,
      coordinates: [37.7775, -122.416389],
      routeCoordinates: [],
      prevLatLng: []
    }
  }

  componentDidMount = () => {
    /// /
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    console.log('5')
    BackgroundGeolocation.onLocation((location) => {
      if (this.state.paused === false) { this.recordLocation(location) }
    }, (error) => {
      console.log('[onLocation] ERROR: ', error)
    })

    // 2.  Execute #ready method (required)
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 0,
      locationUpdateInterval: 1000,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: false, // <-- Auto start tracking when device is powered-up.
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true // <-- [Default: true] Set true to sync each location to server as it arrives.
    }, (state) => {
      console.log('- BackgroundGeolocation is configured and ready: ', state.enabled)

      if (!state.enabled) {
        BackgroundGeolocation.start()
      }
    }, (error) => { console.log(error) })

    BackgroundGeolocation.getCurrentPosition({
      timeout: 30, // 30 second timeout to fetch location
      persist: true, // Defaults to state.enabled
      maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
      desiredAccuracy: 5, // Try to fetch a location with an accuracy of `10` meters.
      samples: 3 // How many location samples to attempt.
    }, (location) => {
      this.setState({ location: location })
      const region = { ...this.state.region }
      region.latitude = this.state.location.coords.latitude
      region.longitude = this.state.location.coords.longitude
      this.setState({ region: region })
    }, (error) => {
      console.log('[onLocation] ERROR: ', error)
    })
  }

  componentWillUnmount () {
    BackgroundGeolocation.removeListeners()
  }

  recordLocation = (data) => {
    const { distanceTravelled } = this.state
    const { latitude, longitude } = data.coords
    const region = { ...this.state.region }
    const newCoordinate = {
      latitude,
      longitude
    }
    region.latitude = newCoordinate.latitude
    region.longitude = newCoordinate.longitude

    this.props.setFreerunRoute(this.props.freeRunLine.concat([newCoordinate]))
    this.setState({
      distanceTravelled: distanceTravelled + calcDistance(newCoordinate, this.state.prevLatLng),
      prevLatLng: newCoordinate,
      region: region
    })
  }

  onError (error) {
    console.warn('[location] ERROR -', error)
  }

   handleGenRoute = async (distance) => {
     const location = await Location.getCurrentPositionAsync({})
     const { latitude, longitude } = location.coords
     console.log(latitude, longitude)
     const route = await getRoute(longitude, latitude, distance, 10, Math.trunc(1 + Math.random() * (100000 - 1)))
     this.props.setGenRoute(decodePoly(route.geometry, true))
   }

  handleFreeRun = () => {
    console.log(this.state.watching)
    if (this.state.watching === false) {
      this.setState({ watching: true, paused: false, distanceTravelled: 0 })
      BackgroundGeolocation.start()
      BackgroundGeolocation.destroyLocations()
      this.props.setFreerunRoute([])
      BackgroundGeolocation.changePace(true)
    }
    if (this.state.watching === true) {
      this.setState({ paused: true })
      this.sheetRef.current.snapTo(0)
    }
  }

  resumeRun = () => {
    this.setState({ paused: false })
    BackgroundGeolocation.changePace(true)
    BackgroundGeolocation.start()
  }

  stopRun = () => {
    this.setState({ watching: false })
    BackgroundGeolocation.stop()
  }

  getSheet = () => {
    if (this.state.sheet === 1) {
      return (
        <View style={styles.panel}>
          <Text style={{ color: '#cacaca' }}>Distance: {this.state.distance} mi</Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            minimumTrackTintColor='#1EB1FC'
            maximumTractTintColor='#1EB1FC'
            step={0.5}
            value={1}
            onValueChange={value => this.setState({ distance: value })}
            style={styles.slider}
            thumbTintColor='#1EB1FC'
          />
          <Button title='Select' onPress={() => { this.handleGenRoute(this.state.distance * 1000); this.sheetRef.current.snapTo(2) }} />
        </View>)
    } else {
      return (
        <View style={styles.panel}><TouchableOpacity><Button title='Resume' onPress={() => { this.resumeRun(); this.sheetRef.current.snapTo(2) }} /></TouchableOpacity>
          <TouchableOpacity><Button title='Stop' onPress={() => { this.stopRun(); this.sheetRef.current.snapTo(2) }} /></TouchableOpacity>
        </View>
      )
    }
  }

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  render () {
    return (

      <View style={styles.container}>
        <MetricsCard distance={this.state.distanceTravelled.toFixed(2)} time={0} />
        <BottomSheet
          ref={this.sheetRef}
          initialSnap={2}
          enabledContentGestureInteraction={false}
          enabledContentTapInteraction={false}
          snapPoints={[450, 300, 0]}
          renderHeader={this.renderHeader}
          renderContent={this.getSheet}
        />
        <MapView style={styles.mapStyle} showsUserLocation region={this.state.region}>
          <Polyline coordinates={this.props.freeRunLine} strokeColor='#0cf' strokeWidth={10} />
          <Polyline
            coordinates={this.props.generatedLine}
            strokeWidth={5}
            lineDashPattern={[3, 3]}
            strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
          />
        </MapView>
        <View style={{
          position: 'absolute'
        }}
        />
        <RouteTypeButton onRoute={() => { this.setState({ sheet: 1 }); this.sheetRef.current.snapTo(0) }} onFree={() => { this.setState({ sheet: 2 }); this.handleFreeRun() }} paused={this.state.watching} />

      </View>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setFreerunRoute: (waypoints) => dispatch({ type: 'SET_FREERUN_POLY', payload: waypoints }),
    setGenRoute: (waypoints) => dispatch({ type: 'SET_GENERATED_POLY', payload: waypoints })
  }
}

function mapStateToProps (state) {
  return {
    generatedLine: state.generatedLine,
    freeRunLine: state.freeRunLine
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10
  },
  panel: {
    height: 400,
    padding: 20,
    backgroundColor: '#acacac'
  },
  panel2: {
    height: 400,
    padding: 20,
    backgroundColor: '#acacac'
  },
  startButton: {
    position: 'absolute',
    top: '80%',
    left: '25%',
    right: '50%'
  }
})
