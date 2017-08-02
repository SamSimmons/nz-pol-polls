import React, { Component } from 'react'
import { connect } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import { max, map, uniqBy, flatten, find } from 'lodash'
import Axes from './Axes'
import Line from './Line'
import Scatter from './Scatter'
import './chart.css'

const getColor = (party) => {
  switch (party) {
    case 'National': { return '#09608A' }
    case 'Labour': { return '#E35C4F' }
    case "Green": { return "#4A8A50" }
    case "NZ First": { return "#616263" }
    case "Maori": { return "#8A2923" }
    case "United Future": { return "#8A2882" }
    case "ACT": { return "#465F8A" }
    case "Mana": { return "#8A3421" }
    case "Conservative": { return "#469BB2" }
    case "Internet": { return "#FF72EC" }
    case "Opportunities": { return "#5D538A" }
    default: { return '#fcfcfc' }
  }
}

class Chart extends Component {
  constructor (props) {
    super(props)
    this.xScale = scaleLinear()
    this.yScale = scaleLinear()
  }

  render () {
    if (this.props.data.length < 1) {
      return <div className='wrapper' />
    }
    const { data } = this.props
    const margins = { top: 50, right: 20, bottom: 100, left: 60 }
    const dimensions = { width: 800, height: 500 }
    const maxY = max(map(data, d => max(map(d.data, 'value'))))

    const xScale = this.xScale
      .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
      .range([margins.left, dimensions.width - margins.right])

    const yScale = this.yScale
      .domain([0, maxY])
      .range([dimensions.height - margins.bottom, margins.top])

    const allPolls = flatten(map(data, 'data'))
    const uniqueParties = map(uniqBy(allPolls, 'party'), 'party')
    console.log(uniqueParties)

    return (
      <div className='wrapper'>
        <svg width={dimensions.width} height={dimensions.height}>
          <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            dimensions={dimensions}
          />
          {
            uniqueParties.map(
              (party, i) =>
                <g key={`party-line-${i}`}>
                  <Line
                    scales={{ xScale, yScale }}
                    data={this.props.data}
                    margins={margins}
                    maxValue={maxY}
                    dimensions={dimensions}
                    party={party}
                    color={getColor(party)}
                  />
                  <Scatter
                    scales={{ xScale, yScale }}
                    data={this.props.data}
                    margins={margins}
                    maxValue={maxY}
                    dimensions={dimensions}
                    party={party}
                    color={getColor(party)}
                  />
                </g>
            )
          }
        </svg>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data.polls,

  }
}

export default connect(mapStateToProps)(Chart)
