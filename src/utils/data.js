import { flatten, map, includes, orderBy, startsWith, filter, zip, sum } from 'lodash'
import * as moment from 'moment'

const validParties = [
  'National',
  'Labour',
  'Green',
  'ACT',
  'Maori',
  'United Future',
  'Mana',
  'NZ First',
  'Conservative',
  'Mana/Internet',
  'Internet',
  'Greens',
  'Conservatives',
  'Opportunities'
]

const partyNames = [
  'National',
  'Labour',
  'ACT',
  'Maori',
  'United Future',
  'NZ First',
  'Conservative',
  'Mana/Internet',
  'Greens',
  'The Opportunities Party'
]

export function weightData (data) {
  const parties = map(partyNames, (party) => {
    return {
      party,
      x: map(data, 'date_published').slice(1),
      y: map(data, (d, i) => {
        return unzipData(d, data.slice(0, i), party)
      }).slice(1)
    }
  })

  return parties
}

function unzipData (p, data, party) {
  const partyData = map(data, party)

  const partyWeight = map(data, (poll) => {
    const pollDate = new Date(moment(poll.date_published, 'DD/MM/YYYY').format('MM/DD/YYYY'))
    const thirty = new Date(moment(p.date_published, 'DD/MM/YYYY').subtract(30, 'd').format('MM/DD/YYYY'))
    const sixty = new Date(moment(p.date_published, 'DD/MM/YYYY').subtract(60, 'd').format('MM/DD/YYYY'))
    const ninety = new Date(moment(p.date_published, 'DD/MM/YYYY').subtract(90, 'd').format('MM/DD/YYYY'))
    const oneTwenty = new Date(moment(p.date_published, 'DD/MM/YYYY').subtract(120, 'd').format('MM/DD/YYYY'))

    if (pollDate > thirty) { return 0.5 }
    if (pollDate > sixty) { return 0.25 }
    if (pollDate > ninety) { return 0.125 }
    if (pollDate > oneTwenty) { return 0.0625 }
    return 0
  })
  return weightedAverage(partyData, partyWeight)
}

function weightedAverage (values, weights) {
  let weightSum = sum(weights)
  weights = map(weights, (w) => w / weightSum)
  return sum(
    map(
      zip(values, weights),
      (pair) => pair[0] * pair[1]
    )
  )
}

export function wrangleData (data) {
  const allPolls = flatten(data)
  const validPolls = map(allPolls, (poll) => {
    return {
      ...poll,
      data: map(poll.data, parsePollString)
    }
  })
  return orderBy(validPolls, d => new Date(d.date))
}

export function parseName (str) {
  const matching = filter(validParties, (partyName) => {
    return (startsWith(str, partyName))
  })
  if (matching.length > 0) {
    return matching[0]
  }
  return undefined
}

export function parseValue (str) {
  return str.match(/\d{1,2}\.\d{1,2}|\d{1,2}/) ? +str.match(/\d{1,2}\.\d{1,2}|\d{1,2}/)[0] : undefined
}

export function parsePollString (str) {
  return {
    party: parseName(str),
    value: parseValue(str)
  }
}

export function checkPartyNameWhitelist (name) {
  return includes(validParties, name)
}
