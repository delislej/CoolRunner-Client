import React, { Component } from 'react'
import { Col, Grid } from 'react-native-easy-grid'
import { Card } from 'react-native-paper'
import { StyleSheet, Text, Dimensions } from 'react-native'

class MetricsCard extends Component {
  state = { }

  render () {
    return (

      <Grid>
        <Col>
          <Card style={styles.miniCard}>
            <Text>Distance: {this.props.distance}</Text>
          </Card>
        </Col>
        <Col>
          <Card style={styles.miniCard}>
            <Text>Time: {this.props.time}</Text>
          </Card>
        </Col>
      </Grid>

    )
  }
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    width: Dimensions.get('window').width - 40,
    height: 200,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#cacaca'
  },
  miniCard: {
    width: Dimensions.get('window').width / 6,
    height: Dimensions.get('window').height / 24,
    backgroundColor: '#cacaca'
  }

})

export default MetricsCard
