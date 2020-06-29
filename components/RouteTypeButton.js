import React from 'react'
import { View, StyleSheet } from 'react-native'
import { LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'

const RouteTypeButton = (props) => {
  // basically just a bool, 1 for gen route, 0 for free running

  // taphandler is nested inside longpress with a view for a button being the rendered component.
  return (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        // console.log(`event lpgh: ${nativeEvent.state} v ${State.ACTIVE}`)
        if (nativeEvent.state === State.ACTIVE) {
          props.onRoute()
          // console.log(`type: ${type}`)
        }
      }}
      minDurationMs={500}
    >
      <TapGestureHandler
        numberOfTaps={1} onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            props.onFree()
          }
        }}
      >

        <View style={styles.viewContainer}>
          <Button
            mode='outlined'
            onPress={() => { console.log() }} // needed to get the animation, not sure how to remove
          >
            {props.paused ? 'Pause' : 'Start run'}
          </Button>
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute',
    top: '90%',
    left: '25%',
    right: '25%'
  }
})

export default RouteTypeButton
