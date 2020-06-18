export const setGenRoute = route => {
  return {
    type: 'SET_GENERATED_POLY',
    payload: {
      generatedLine: route
    }
  }
}

export const yell = phrase => {
  return {
    type: 'YELL',
    payload: phrase
  }
}

export const clearGenRoute = () => {
  return {
    type: 'CLEAR_GENERATED_POLY'
  }
}

export const setFreerunRoute = route => {
  return {
    type: 'SET_FREERUN_ROUTE',
    payload: {
      freeRunLine: route
    }
  }
}

export const clearFreerunRoute = () => {
  return {
    type: 'CLEAR_FREERUN_ROUTE'
  }
}
