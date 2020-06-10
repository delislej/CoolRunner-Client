import React, { Component } from 'react'
import { Card } from 'react-native-paper'
import { StyleSheet, Dimensions } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

class RouteCard extends Component {
  state = { }

  render () {
    return (

      <Card style={styles.card}>

        <MapView
          style={styles.mapStyle} ref={(ref) => { this.mapRef = ref }} onMapReady={() => {
            this.mapRef.fitToCoordinates(this.props.data.lines, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
            // console.log('card data')
            // console.log(this.props.data)
          }}
        >

          <Polyline
            coordinates={this.props.data.lines}
            strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000'
            ]}
            strokeWidth={6}
          />
        </MapView>

      </Card>

    )
  }
}
const styles = StyleSheet.create({
  mapStyle: {
    paddingTop: 10,
    paddingLeft: 10,
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').height / 4
  },
  card: {
    borderRadius: 8,
    width: Dimensions.get('window').width - 40,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#acacac'
  },
  miniCard: {
    width: Dimensions.get('window').width / 6,
    height: Dimensions.get('window').height / 24,
    backgroundColor: '#fafafa'
  }

})

export default RouteCard
