import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { find, map, filter } from 'lodash'
import { interpolateLab } from 'd3-interpolate'

export default class Scatter extends Component {
  constructor (props) {
    super(props)

    this.colorScale = scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#F3E5F5', '#7B1FA2'])
      .interpolate(interpolateLab)
  }

  render () {
    const { scales, margins, data, dimensions } = this.props
    const { xScale, yScale } = scales
    const { height } = dimensions

    const party = filter(map(data, (d) => {
      const y = find(d.data, ['party', this.props.party])
      ? find(d.data, ['party', this.props.party]).value
      : undefined
      return {
        x: new Date(d.date),
        y
      }
    }), d => (!!d.x && !!d.y))
    return (
      <g>
        {
          party.map(
            (d, i) => {
              return <circle
                key={`${this.props.party}--${i}`}
                r={2}
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
