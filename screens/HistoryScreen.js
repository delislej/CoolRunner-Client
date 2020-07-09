
import * as React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import HistoryCard from '../components/HistoryCard'


export default function HistoryScreen () {
  const runTest = {
    line: 'concFnhzhVwAhDjC|BfFyL_CgC{CxG',
    time: '1:21',
    distance: 1.85,
    score: 1337,
    elevation: 183
  }

  return (
    <ScrollView style={styles.container}>
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
