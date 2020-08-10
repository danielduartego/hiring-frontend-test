import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
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
                    categories: ['Aug 5', 'Aug 5', 'Aug 7'],
                },
                series: [],
            },
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: false,
        });
        Promise.all([
            fetch(
                'https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-08-05&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51'
            ),
            fetch(
                'https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-08-06&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51'
            ),
            fetch(
                'https://stage.altrac-api.com/evapo/address/26002e000c51343334363138?date=2020-08-07&tzOffset=-7&elevation=160.9&latitude=43.2624613&Kc=0.51'
            ),
        ])
            .then(([res1, res2, res3]) => {
                return Promise.all([res1.json(), res2.json(), res3.json()]);
            })
            .then(([res1, res2, res3]) => {
                this.setState({
                    isLoading: false,
                    chartData: {
                        series: [
                            {
                                name: 'Temperature (F)',
                                type: 'line',
                                data: [
                                    res1.meanDailyAirTemperatureC,
                                    res2.meanDailyAirTemperatureC,
                                    res3.meanDailyAirTemperatureC,
                                ],
                            },
                            {
                                name: 'Solar (MJ)',
                                type: 'line',
                                data: [
                                    res1.meanSolarRadiationMJ,
                                    res2.meanSolarRadiationMJ,
                                    res3.meanSolarRadiationMJ,
                                ],
                            },
                            {
                                name: 'Evapo (In)',
                                type: 'line',
                                data: [
                                    res1.evapotranspirationIN,
                                    res2.evapotranspirationIN,
                                    res3.evapotranspirationIN,
                                ],
                            },
                        ],
                    },
                });
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
