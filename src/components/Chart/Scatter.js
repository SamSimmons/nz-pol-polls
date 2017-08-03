import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { map, filter, has } from 'lodash'
import { interpolateLab } from 'd3-interpolate'
import * as moment from 'moment'

export default class Scatter extends Component {
  constructor (props) {
    super(props)

    this.colorScale = scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#F3E5F5', '#7B1FA2'])
      .interpolate(interpolateLab)
  }

  render () {
    const { scales, data, party } = this.props
    const { xScale, yScale } = scales

    const partyData = filter(map(data, (poll, i) => {
      const formattedDate = moment(poll.date_published, 'DD/MM/YYYY').format('MM/DD/YYYY')
      return {
        x: new Date(formattedDate),
        y: has(poll, party) ? poll[party] : ''
      }
    }), d => (d.x && d.y))
    return (
      <g>
        {
          partyData.map(
            (d, i) => {
              return <circle
                key={`dot-${this.props.party}--${i}`}
                r={1.5}
                cx={xScale(d.x)}
                cy={yScale(d.y)}
                style={{
                  fill: this.props.color ? this.props.color : 'steelblue'
                }}
              />
            }
          )
        }
      </g>
    )
  }
}
