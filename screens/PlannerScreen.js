
import React, { Component } from 'react'

import { Platform, StyleSheet, View, Dimensions, ScrollView, Slider } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import RouteCardBuilder from '../components/RouteCardBuilder'
import { connect } from 'react-redux'

class PlannerScreen extends Component {
  constructor (props) {
    super()
    this.state = {
      location: null,
      ready: false,
      distance: 1,
      routes: 1
    }
  }

  componentDidMount () {
    this.setState({ distance: 1, routes: 1 })
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      )
    } else {
      (async () => {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
          console.log('Permission to access location was denied')
        }

        const location = await Location.getCurrentPositionAsync({})
        this.setState({ location })
      })()
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View>

          <Text style={{ color: '#acacac' }}>Distance: {this.state.distance} mi</Text>
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
          <Text style={{ color: '#acacac' }}>Routes: {this.state.routes}</Text>
          <Slider
            minimumValue={1}
            maximumValue={4}
            minimumTrackTintColor='white'
            maximumTractTintColor='red'
            step={1}
            value={1}
            onValueChange={value => this.setState({ routes: value })}
            style={styles.slider}
            thumbTintColor='#1EB1FC'
          />
          <Button
            color='#001584'
            backgroundColor='#acacac'
            mode='contained'
            onPress={() => {
              if (this.state.location && this.state.ready !== true) { this.setState({ ready: true }) } else if (this.state.location && this.state.ready) { this.setState({ ready: false }) }
            }}
          >
            {this.state.ready ? 'More' : 'Generate'}
          </Button>

        </View>
        {this.state.ready ? <RouteCardBuilder long={this.state.location.coords.longitude} lat={this.state.location.coords.latitude} length={this.state.distance * 1000} points={15} cards={this.state.routes} /> : (
          <Text />
        )}
      </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2
  },
  container: {
    backgroundColor: '#2a2a2a',
    paddingLeft: 20,
    paddingRight: 0,
    paddingTop: 10,
    paddingHorizontal: 20
  }
})

function mapDispatchToProps (dispatch) {
  return {

  }
}

function mapStateToProps (state) {
  return {
    generatedLine: state.generatedLine,
    freeRunLine: state.freeRunLine
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps)(PlannerScreen)
