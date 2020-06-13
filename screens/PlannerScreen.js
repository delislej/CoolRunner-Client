
import React, { useState, useEffect } from 'react'

import { Platform, StyleSheet, View, Dimensions, ScrollView, Slider } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import RouteCardBuilder from '../components/RouteCardBuilder'

export default function PlannerScreen () {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [ready, setReady] = useState(false)
  const [distance, setDistance] = useState(1)

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      )
    } else {
      (async () => {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied')
        }

        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
      })()
    }
  })

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={{ color: '#acacac' }}>Distance: {distance}mi</Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          minimumTrackTintColor='#1EB1FC'
          maximumTractTintColor='#1EB1FC'
          step={1}
          value={1}
          onValueChange={value => setDistance(value)}
          style={styles.slider}
          thumbTintColor='#1EB1FC'
        />
        <Button
          color='#841584'
          backgroundColor='#acacac'
          mode='contained'
          onPress={() => {
            if (location) { setReady(true) }
            // console.log(location)
          }}
        >
            Generate
        </Button>
      </View>
      {ready ? <RouteCardBuilder long={location.coords.longitude} lat={location.coords.latitude} length={distance * 1000} points={5} /> : (
        <Text />
      )}
    </ScrollView>

  )
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
