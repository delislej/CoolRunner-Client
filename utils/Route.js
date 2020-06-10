import React, { Component } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'
import HistoryCard from '../components/HistoryCard'

class Route extends Component {
  constructor (props) {
    super()
    this.state = { arr: [] }
  }

  async componentDidMount () {
    var runTest = {
      lines: [],
      time: '1:21',
      distance: 1.85,
      score: 1337,
      elevation: 183
    }

    var postData = { coordinates: [[this.props.long, this.props.lat]], options: { round_trip: { length: this.props.length, points: this.props.points, seed: 1337 } }, units: 'mi', geometry: true }
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        Authorization: '5b3ce3597851110001cf62480c136b87463e48a797a452337946abb0'
      }
    }

    const encPoly = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car', postData, axiosConfig)
      .then((res) => {
        console.log('RESPONSE RECEIVED: ', res.data.routes[0].geometry)
        return res.data.routes[0].geometry
      })
      .catch((err) => {
        console.log('AXIOS ERROR: ', err)
      })

    runTest.lines = this.arr(encPoly, false)
    // console.log('planner')
    // console.log(runTest)
    // console.log('valid')
    const valid = {
      lines: [
        { latitude: 37.434903, longitude: -122.200559 },
        { latitude: 37.435337, longitude: -122.201411 },
        { latitude: 37.434638, longitude: -122.202044 },
        { latitude: 37.433484, longitude: -122.199834 },
        { latitude: 37.434119, longitude: -122.199147 },
        { latitude: 37.434903, longitude: -122.200559 }
      ],
      time: '1:21',
      distance: 1.85,
      score: 1337,
      elevation: 183
    }
    // console.log(valid)

    this.setState({ arr: valid })
  }

  arr = (encodedPolyline, includeElevation) => {
    // array that holds the points
    const points = []
    let index = 0
    const len = encodedPolyline.length
    let lat = 0
    let lng = 0
    let ele = 0
    while (index < len) {
      let b
      let shift = 0
      let result = 0
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63 // finds ascii
        // and subtract it by 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)

      lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
      shift = 0
      result = 0
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))

      if (includeElevation) {
        shift = 0
        result = 0
        do {
          b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
          result |= (b & 0x1f) << shift
          shift += 5
        } while (b >= 0x20)
        ele += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
      }
      try {
        const location = { latitude: (lat / 1E5), longitude: (lng / 1E5) }
        if (includeElevation) location.push((ele / 100))
        points.push(location)
      } catch (e) {
        console.log(e)
      }
    }
    return points
  }

  render () {
    return (
      <View>
        <HistoryCard data={this.state.arr} />
      </View>
    )
  }
}

export default Route
