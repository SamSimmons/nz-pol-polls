import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { line, curveCardinal } from 'd3-shape'
import { map } from 'lodash'
import * as moment from 'moment'
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
    const { scales, data, party } = this.props
    const { xScale, yScale } = scales
    const drawLine = line()
      .curve(curveCardinal)
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))

    const formatted = map(data, (d) => {
      return {
        x: new Date(moment(d.date, 'DD/MM/YYYY').format('MM/DD/YYYY')),
        y: d[party]
      }
    })
    return (
      <g>
        <path
          d={drawLine(formatted)}
          style={{
            fill: 'transparent',
            strokeWidth: 10,
            stroke: this.props.color ? this.props.color : 'tomato',
            opacity: 0.3
          }}
        />
        <path
          d={drawLine(formatted)}
          style={{
            fill: 'transparent',
            strokeWidth: 0.5,
            stroke: this.props.color ? this.props.color : 'tomato',
            opacity: 0.5
          }}
        />
      </g>
    )
  }
}
