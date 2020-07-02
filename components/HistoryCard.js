import React, { Component } from 'react'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Card } from 'react-native-paper'
import { StyleSheet, Text, Dimensions } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

class HistoryCard extends Component {
  state = { }

  render () {
    return (

      <Card style={styles.card}>

        <Grid>
          <Col>
            <MapView
              style={styles.mapStyle} ref={(ref) => { this.mapRef = ref }} onMapReady={() => {
                this.mapRef.fitToCoordinates(this.props.data.lines, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
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
          </Col>
          <Col>
            <Row>
              <Card style={styles.miniCard}>
                <Text>Time: {this.props.data.time}</Text>
              </Card>
            </Row>
            <Row>
              <Card style={styles.miniCard}>
                <Text>Distance: {this.props.data.distance}</Text>
              </Card>
            </Row>
          </Col>
          <Col>
            <Row>
              <Card style={styles.miniCard}>
                <Text>Score: {this.props.data.score}</Text>
              </Card>
            </Row>
            <Row>
              <Card style={styles.miniCard}>
                <Text>Elevation: {this.props.data.elevation}</Text>
              </Card>
            </Row>
          </Col>
        </Grid>

      </Card>

    )
  }
}
const styles = StyleSheet.create({
  mapStyle: {
    paddingTop: 10,
    paddingLeft: 10,
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 8
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

export default HistoryCard
