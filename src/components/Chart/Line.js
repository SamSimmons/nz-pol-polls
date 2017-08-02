import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'
import { find, map, filter } from 'lodash'
import { interpolateLab } from 'd3-interpolate'

export default class Line extends Component {
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
    const drawLine = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))

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
        <path
          d={drawLine(party)}
          style={{
            fill: 'transparent',
            strokeWidth: 20,
            stroke: this.props.color ? this.props.color : 'tomato',
            opacity: 0.3
          }}
        />
      </g>
    )
  }
}
