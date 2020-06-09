import React from 'react'
import { Text } from 'react-native'
import axios from 'axios'

const route = (props) => {
  
  var postData = { coordinates: [[8.681495, 49.41461], [8.686507, 49.41943], [8.687872, 49.420318]] }

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      Authorization: '5b3ce3597851110001cf62480c136b87463e48a797a452337946abb0'
    }
  }

  let encPoly = axios.post('https://api.openrouteservice.org/v2/directions/driving-car', postData, axiosConfig)
    .then((res) => {
      // console.log('RESPONSE RECEIVED: ', res)
      return res.data.routes.geometry
    })
    .catch((err) => {
      console.log('AXIOS ERROR: ', err)
    })

  const arr = (encodedPolyline, includeElevation) => {
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
        const location = [(lat / 1E5), (lng / 1E5)]
        if (includeElevation) location.push((ele / 100))
        points.push(location)
      } catch (e) {
        console.log(e)
      }
    }
    return points
  }
  const x = arr(encPoly, true)
  return (
    <Text>{x}</Text>
  )
}

export default route
