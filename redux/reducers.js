const initialState = {
  generatedLine: [],
  freeRunLine: []
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GENERATED_POLY':
      return { ...state, generatedLine: action.payload }
    case 'CLEAR_GENERATED_POLY':
      return {...state, generatedLine: [] }
    case 'SET_FREERUN_POLY':
      return action.payload.freeRunLine
    case 'CLEAR_FREERUN_POLY':
      return { freeRunLine: [] }
    case 'YELL':
      return { ...state, phrase: action.payload }
    default:
      return {
        phrase: 'default',
        generatedLine: [],
        freeRunLine: []
      }
  }
}

export default reducer