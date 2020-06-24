import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Button, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import { connect } from 'react-redux'
import RouteTypeButton from '../components/RouteTypeButton'
import { getRoute, decodePoly, calcDistance } from '../utils/Route'
import BottomSheet from 'reanimated-bottom-sheet'

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
      error: null,
      watching: false,
      coordinates: [37.7775, -122.416389],
      routeCoordinates: [],
      prevLatLng: []
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
   handleGenRoute = async (distance) => {
     navigator.geolocation.getCurrentPosition(
       async position => {
         const { latitude, longitude } = position.coords
         console.log(latitude, longitude)
         const route = await getRoute(longitude, latitude, distance, 10, Math.trunc(1 + Math.random() * (100000 - 1)))
         this.props.setGenRoute(decodePoly(route.geometry, true))
       },
       error => console.log(error),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 500, distanceFilter: 10 }
     )
   }

   freeRunMenu = () => {
     return (
       <View><TouchableOpacity><Button title='Resume' onPress={() => { this.resumeRun(); this.sheetRef.current.snapTo(2) }} /></TouchableOpacity>
         <TouchableOpacity><Button title='Stop' onPress={() => { this.stopRun(); this.sheetRef.current.snapTo(2) }} /></TouchableOpacity>
       </View>)
   }

   instantGenMenu = () => {
     return (
       <View style={styles.panel}><TouchableNativeFeedback><Button title='1mi' onPress={() => { this.handleGenRoute(1000); this.sheetRef.current.snapTo(2) }} /></TouchableNativeFeedback>
         <Button title='2mi' onPress={() => { this.handleGenRoute(2000); this.sheetRef.current.snapTo(2) }} />
       </View>)
   }

  handleFreeRun = () => {
    console.log(this.state.watching)
    if (this.state.watching === false) {
      this.setState({ watching: true }); this.props.setFreerunRoute([]); const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { distanceTravelled } = this.state
            const { latitude, longitude } = position.coords
            const newCoordinate = {
              latitude,
              longitude
            }
            this.props.setFreerunRoute(this.props.freeRunLine.concat([newCoordinate]))
            this.setState({
              distanceTravelled:
               distanceTravelled + calcDistance(newCoordinate, this.state.prevLatLng),
              prevLatLng: newCoordinate
            })
            console.log(this.state.distanceTravelled)
          },
          error => console.log(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 500, distanceFilter: 10 }
        )
      }, 3000)
      this.setState({ intervalId: interval })
    }
    if (this.state.watching === true) {
      // pause by clearing interval
      clearInterval(this.state.intervalId)
      this.sheetRef.current.snapTo(0)
    }
  }

  stopRun = () => {
    this.setState({ watching: false })
    console.log('clearing interval')
  }

  getSheet = (sheet) => {
    if (sheet === 1) {
      return this.instantGenMenu
    } else {
      return this.freeRunMenu
    }
  }

  resumeRun = () => {
    this.setState({ watching: true })
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { distanceTravelled } = this.state
          const { latitude, longitude } = position.coords
          const newCoordinate = {
            latitude,
            longitude
          }
          this.props.setFreerunRoute(this.props.freeRunLine.concat([newCoordinate]))
          console.log('watching')
          this.setState({
            distanceTravelled:
             distanceTravelled + this.calcDistance(newCoordinate),
            prevLatLng: newCoordinate
          })
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 500, distanceFilter: 10 }
      )
    }, 3000)
    this.setState({ intervalId: interval })
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
        <BottomSheet
          ref={this.sheetRef}
          initialSnap={2}
          snapPoints={[450, 300, 0]}
          renderHeader={this.renderHeader}
          renderContent={this.getSheet(this.state.sheet)}
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
        <RouteTypeButton onRoute={() => { this.setState({ sheet: 1 }); this.sheetRef.current.snapTo(0) }} onFree={() => { this.setState({ sheet: 2 }); this.handleFreeRun() }} />

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

HomeScreen.navigationOptions = {
  header: null
}

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
    height: 600,
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
