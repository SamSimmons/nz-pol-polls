import { wrangleData } from '../utils/data'

export default function (state = {polls: []}, action) {
  switch (action.type) {
    case 'LOAD_DATA': {
      return {
        ...state,
        polls: wrangleData(action.data)
      }
    }
    case 'LOAD_POLL_DATA': {
      return {
        ...state,
        polls: action.data,
        weighted: action.weighted
      }
    }
    default: {
      return state
    }
  }
}
