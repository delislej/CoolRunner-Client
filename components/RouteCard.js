import React, { Component } from 'react'
import { Card } from 'react-native-paper'
import Collapsible from 'react-native-collapsible'
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { ScrollView } from 'react-native-gesture-handler'

class RouteCard extends Component {
  state = {
    // default active selector
    activeSections: [],
    // collapsed condition for the single collapsible
    collapsed: true,
    // multipleSelect is for the Multiple Expand allowed
    // true: You can expand multiple at a time
    // false: One can be expand at a time and other will be closed automatically
    multipleSelect: false
  };

  toggleExpanded = () => {
    // Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed })
  };

  render () {
    return (

      <Card style={styles.card}>

        <MapView
          style={styles.mapStyle} ref={(ref) => { this.mapRef = ref }} onMapReady={() => {
            this.mapRef.fitToCoordinates(this.props.data.lines, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
            // console.log('card data')
            // console.log(this.props.data)
          }} showsUserLocation
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
            strokeWidth={3}
          />
        </MapView>

        <TouchableOpacity onPress={this.toggleExpanded}>
          <View>
            <Card style={styles.instructCard}><Text style={styles.headerText}>Instructions</Text></Card>

          </View>
        </TouchableOpacity>
        {/* Content of Single Collapsible */}
        <Collapsible collapsed={this.state.collapsed} align='center'>
          <ScrollView>{this.props.directions}</ScrollView>
        </Collapsible>

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
  instructCard: {
    borderRadius: 8,
    width: Dimensions.get('window').width - 60,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#cacaca'
  },
  miniCard: {
    width: Dimensions.get('window').width / 6,
    height: Dimensions.get('window').height / 24,
    backgroundColor: '#fafafa'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  }

})

export default RouteCard
