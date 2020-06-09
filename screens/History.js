
import * as React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import HistoryCard from '../components/HistoryCard'
import Route from '../utils/Route'

export default function History () {
  const runTest = {
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

  return (
    <ScrollView style={styles.container}>
      <Route />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />
      <HistoryCard data={runTest} />

    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    paddingLeft: 20,
    paddingRight: 0,
    paddingTop: 10,
    paddingHorizontal: 20
  }
})
