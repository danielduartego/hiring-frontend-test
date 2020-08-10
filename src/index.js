import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            chartData: {},
        };
    }

    componentDidMount() {
        let $ = this;
        // Already prepared for the "from - to" api
        let today = moment().format('YYYY-MM-DD');
        let from = moment(today).subtract(7, 'days').format('YYYY-MM-DD');
        let to = today;
        let currentDate = from;
        let dateRange = [];
        let promises = [];
        // Build a dateRange array with dates to fech the API
        while (currentDate < to) {
            dateRange.push(moment(currentDate).format('YYYY-MM-DD'));
            currentDate = moment(currentDate)
                .add(1, 'days')
                .format('YYYY-MM-DD');
        }

        // Loop to creaate an array with promises
        dateRange.forEach(function (date) {
            promises.push(
                `https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=${date}&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51`
            );
        });
        // Execute the promise
        Promise.all(promises.map((url) => fetch(url)))
            .then((responses) =>
                Promise.all(responses.map((res) => res.json()))
            )
            .then(function (result) {
                let temp = [];
                let solar = [];
                let evapo = [];

                for (var i = 0; i < result.length; i++) {
                    temp.push(result[i].meanDailyAirTemperatureC);
                    solar.push(result[i].meanSolarRadiationMJ);
                    evapo.push(result[i].evapotranspirationIN);
                }
                // Update the data
                $.setState({
                    isLoading: false,
                    chartData: {
                        title: {
                            text: 'Evapo Chart',
                        },
                        yAxis: [
                            {
                                title: {
                                    text: 'Evapotranspiration ',
                                },
                            },
                        ],
                        xAxis: {
                            title: {
                                text: 'Date',
                            },
                            categories: dateRange,
                        },
                        series: [
                            {
                                name: 'Temperature (C)',
                                type: 'line',
                                data: temp,
                            },
                            {
                                name: 'Solar (MJ)',
                                type: 'line',
                                data: solar,
                            },
                            {
                                name: 'Evapo (In)',
                                type: 'line',
                                data: evapo,
                            },
                        ],
                    },
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        const { chartData, isLoading } = this.state;
        return (
            <div>
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartData}
                    />
                )}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
