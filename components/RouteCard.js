import React, { Component } from 'react'
import { Card } from 'react-native-paper'
import Collapsible from 'react-native-collapsible'
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'

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
            this.mapRef.fitToCoordinates(this.props.lines, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
            // console.log('card data')
            // console.log(this.props.data)
          }} showsUserLocation
        >

          <Polyline
            coordinates={this.props.lines}
            strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={3}
          />
        </MapView>
        <Card style={styles.instructCard}><Text style={styles.headerText}>{this.props.distance} mi</Text></Card>
        <TouchableOpacity onPress={this.toggleExpanded}>
          <View>

            <Card style={styles.instructCard}><Text style={styles.headerText}>Instructions</Text></Card>

          </View>
        </TouchableOpacity>
        {/* Content of Single Collapsible */}
        <Collapsible collapsed={this.state.collapsed} align='center'>
          <ScrollView>{this.props.directions}</ScrollView>
        </Collapsible>

        <TouchableOpacity onPress={() => {
          this.props.setGenRoute(this.props.lines)
        }}
        >
          <View>

            <Card style={styles.instructCard}><Text style={styles.headerText}>Select Card</Text></Card>

          </View>
        </TouchableOpacity>

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

function mapDispatchToProps (dispatch) {
  return {
    yell: (stuff) => dispatch({ type: 'YELL', payload: stuff }),
    setGenRoute: (waypoints) => dispatch({ type: 'SET_GENERATED_POLY', payload: waypoints })
  }
}

function mapStateToProps (state) {
  return {
    generatedLine: state.generatedLine,
    freeRunLine: state.freeRunLine
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps)(RouteCard)
