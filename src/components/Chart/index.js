import React, { Component } from 'react'
import { connect } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import Axes from './Axes'
import * as moment from 'moment'
import Line from './Line'
import Scatter from './Scatter'
import './chart.css'

const getColor = (party) => {
  switch (party) {
    case 'National': { return '#09608A' }
    case 'Labour': { return '#E35C4F' }
    case 'Green': { return '#4A8A50' }
    case 'ACT': { return '#465F8A' }
    case 'Maori': { return '#8A2923' }
    case 'United Future': { return '#8A2882' }
    case 'NZ First': { return '#616263' }
    case 'Mana/Internet': { return '#FF72EC' }
    case 'Conservative': { return '#469BB2' }
    case 'The Opportunities Party': { return '#5D538A' }
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

    const formatDate = (date) => new Date(moment(date, 'DD/MM/YYYY').format('MM/DD/YYYY'))

    const xScale = this.xScale
      .domain([formatDate(data[0].date_published), formatDate(data[data.length - 1].date_published)])
      .range([margins.left, dimensions.width - margins.right])

    const yScale = this.yScale
      .domain([0, 60])
      .range([dimensions.height - margins.bottom, margins.top])

    const uniqueParties = [
      'National',
      'Labour',
      'ACT',
      'Maori',
      'United Future',
      'NZ First',
      'Conservative',
      'Mana/Internet',
      'Green',
      'The Opportunities Party'
    ]

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
                <g key={`party-wrapper-${party}`}>
                  <Line
                    scales={{ xScale, yScale }}
                    data={this.props.weighted}
                    margins={margins}
                    maxValue={60}
                    dimensions={dimensions}
                    party={party}
                    color={getColor(party)}
                  />
                  <Scatter
                    scales={{ xScale, yScale }}
                    data={this.props.data}
                    margins={margins}
                    maxValue={60}
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
    weighted: state.data.weighted
  }
}

export default connect(mapStateToProps)(Chart)
