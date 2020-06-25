
import axios from 'axios'
import haversine from 'haversine'

export async function getRoute (long, lat, length, round, seed) {
  console.log(seed)
  var postData = { coordinates: [[long, lat]], options: { round_trip: { length: length, points: round, seed: seed } }, elevation: true, units: 'mi', geometry: true }
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      Authorization: '5b3ce3597851110001cf62480c136b87463e48a797a452337946abb0'
    }
  }

  const response = await axios.post('https://api.openrouteservice.org/v2/directions/foot-walking', postData, axiosConfig)
    .then((res) => {
      return res.data.routes[0]
    })
    .catch((err) => {
      console.log('AXIOS ERROR: ', err)
    })
  return response
}

export function decodePoly (encodedPolyline, includeElevation) {
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
      const location = { latitude: (lat / 1E5), longitude: (lng / 1E5), ele: 0 }
      if (includeElevation) location.ele = (ele / 100)
      points.push(location)
    } catch (e) {
      console.log(e)
    }
  }
  return points
}

export function calcDistance (newLatLng, oldLatLng) {
  return haversine(oldLatLng, newLatLng, { unit: 'mile' }).toFixed(2) || 0
};
