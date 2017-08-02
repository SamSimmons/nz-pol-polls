import { flatten, map, includes, orderBy, startsWith, filter } from 'lodash'

const validParties = [
  "National",
  "Labour",
  "Green",
  "ACT",
  "Maori",
  "United Future",
  "Mana",
  "NZ First",
  "Conservative",
  "Mana/Internet",
  "Internet",
  "Greens",
  "Conservatives",
  "Opportunities"
]

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
