import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import { Card } from 'react-native-paper'
import { getRoute, decodePoly } from '../utils/Route'

import RouteCard from './RouteCard'

class RouteCardBuilder extends Component {
  constructor (props) {
    super()
    this.state = {
      gotData: false,
      arr: [],

      directions: []
    }
  }

  async componentDidMount () {
    const routes = []

    for (var i = 0; i < this.props.cards; i++) {
      var response = await getRoute(this.props.long, this.props.lat, this.props.length, this.props.points, Math.trunc(1 + Math.random() * (100000 - 1)))
      var lines = decodePoly(response.geometry, true)
      var distance = response.segments[0].distance
      var directionCards = response.segments[0].steps.map((direction) => direction.instruction).map((instructions, i) =>
        <Card key={i} style={styles.card}><Text>{instructions}</Text></Card>
      )

      routes.push(<RouteCard key={'route' + i} distance={distance} lines={lines} directions={directionCards} />)
    }
    this.setState({ routes: routes, gotData: true })
  }

  render () {
    return (
      <View>
        {this.state.gotData ? <ScrollView>{this.state.routes}</ScrollView> : (
          <ActivityIndicator animating />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 10,
    paddingVertical: 10,
    width: Dimensions.get('window').width - 60,
    backgroundColor: '#cacaca'
  }

})

export default RouteCardBuilder
