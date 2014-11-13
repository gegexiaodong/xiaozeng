'use strict'

var React = require('react')
var Chartist = require('react-chartist')
var GLOBALStore = require('../stores/GLOBALStore')
var _ = require('lodash')

var Average = React.createClass({

  displayName: 'Average',

  render() {
    var average

    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var selected_year = GLOBALStore.getSelectedYear()
    var globals = GLOBALStore.get()
    var configs = this.props.configs

    var Chart = null
    var values = []
    var countryList = null

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(globals)) {
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years) {
        values = _.map(_.map(globals.data.locations, selected_indicator), function(data) {
          return data['years'][selected_year]
        })

        countryList = Object.keys(globals.meta.locations).map(function(countryName) {
          return globals.meta.locations[countryName]
        }).map(function(countryLabel) {
          return (
            <li className='countryItem'>
              <span className='label'>{countryLabel}</span>
              <span className='value'>42%</span>
            </li>
          )
        })

        average = globals.meta.indicators[selected_indicator].avg.years[selected_year].toFixed(2)
        var dataSeries = _.map(globals.meta.indicators[selected_indicator].avg.years, function(value) {
          return (value.toFixed(2))/1000
        })

        var barChartData = {
          labels: globals.meta.indicators[selected_indicator].years,
          series: [dataSeries]
        }
        var barChartOptions = {
          showArea: true,
          low: globals.meta.indicators[selected_indicator].min_value,
          axisY: {
            labelInterpolationFnc(value) {
              return value + ' K'
            }
          }
        }

        Chart = <Chartist type={'Line'} data={barChartData} options={barChartOptions} />
      } else {
        values = _.map(globals.data.locations, selected_indicator)
        average = globals.meta.indicators[selected_indicator].avg.toFixed(2)
      }

    }

    return (
      <div className='card'>
        <div className='average-box'>
          <h5>AVERAGE: {average}</h5>
          {Chart}
          <div className='average-chart'>
            <ul className='country-list'>
              {countryList}
            </ul>
          </div>
        </div>
      </div>
    )
  }

})

module.exports = Average