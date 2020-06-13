import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { Card } from 'react-native-paper'
import { getRoute, decodePoly } from './Route'

import RouteCard from '../components/RouteCard'

class RouteCardBuilder extends Component {
  constructor (props) {
    super()
    this.state = {
      gotData: false,
      arr: [],

      directions: []
    }
    console.log(this.state.seed)
  }

  async componentDidMount () {
    var runTest = {
      lines: [],
      time: '',
      distance: 0,
      score: 0,
      elevation: 0
    }
    const response = await getRoute(this.props.long, this.props.lat, this.props.length, this.props.points)
    runTest.lines = decodePoly(response.geometry, false)
    console.log(response.geometry)
    this.setState({ arr: runTest, directions: [], gotData: true })
    const directs = response.segments[0].steps.map((direction) => direction.instruction)
    const listItems = directs.map((instructions, i) =>
      <Card key={i} style={styles.card}><Text>{instructions}</Text></Card>
    )
    // console.log(this.arr('_p~iF~ps|U_ulLnnqC_mqNvxq`@', false))
    this.setState({ directions: listItems })
  }

  render () {
    return (
      <View>
        {this.state.gotData ? <View><RouteCard data={this.state.arr} directions={this.state.directions} /></View> : (
          <Text>Loading</Text>
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
