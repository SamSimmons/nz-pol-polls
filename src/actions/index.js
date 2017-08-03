export function loadData (data) {
  return {
    type: 'LOAD_DATA',
    data
  }
}

export function loadPollData (data, weighted) {
  return {
    type: 'LOAD_POLL_DATA',
    data,
    weighted
  }
}
