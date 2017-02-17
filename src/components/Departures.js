import React from 'react';
//import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
let _ = require('lodash');
let moment = require('moment-timezone');
import Departure from './Departure';
import Navbar from './Navbar';
import { getDepartures } from './Models';


class Departures extends React.Component {
    constructor() {
        super();
        this.state = {
            timeStamp: 0,
            names: [],
            departures: [],
            indexesToBeSkipped: [],
            columnNameIndexMapping: {},
            fetchingData: false,
            stations: [],
            station: ''
        }
    }

    selectionStation(event) {
        event.preventDefault();
    }

    updateState(newState) {
        let that = this;
        let payload = {};

        let columnNameIndexMapping = {};
        function configureColumnNameIndexMapping() {
            _.forEach(newState['names'], (column, index2) => {
                columnNameIndexMapping[column] = index2;
            });

            if (!_.isEqual(columnNameIndexMapping, this.state.columnNameIndexMapping)) {
                payload['columnNameIndexMapping'] = columnNameIndexMapping;
            }
        }

        let indexesToBeSkipped = [];
        function configureDisableColumns() {
            _.forEach(this.props.columnsToBeSkipped, (column, index) => {
                indexesToBeSkipped.push(columnNameIndexMapping[column]);
            });

            let diff1 = _.difference(this.state['indexesToBeSkipped'], indexesToBeSkipped);
            let diff2 = _.difference(indexesToBeSkipped, this.state['indexesToBeSkipped']);
            if (diff1.length != diff2.length || diff2.length != 0) {
                payload['indexesToBeSkipped'] = indexesToBeSkipped;
            }
        }

        function checkNames() {
            if (_.has(newState, 'names')) {
                configureColumnNameIndexMapping.call(that);
                configureDisableColumns.call(this);
                
                let diff1 = _.difference(this.state['names'], newState['names']);
                let diff2 = _.difference(newState['names'], this.state['names']);
                if (diff1.length != diff2.length || diff2.length != 0) {
                    payload['names'] = newState['names'];
                }
            }
        }

        function checkDepartures() {
            if (_.has(newState, 'departures')) {
                let timeStamp = newState['departures'][0][columnNameIndexMapping['TimeStamp']];
                payload['timeStamp'] = parseInt(timeStamp);
                payload['departures'] = newState['departures'];
            }
        }

        if (_.has(newState, 'station')) {
            payload['station'] = newState['station'];
        }

        checkNames.call(this);
        checkDepartures.call(this);

        if (!_.isEmpty(payload)) {
            this.setState(payload);
        }
    }

    fetchData() {
        //this.setState({ fetchingData: true });
        getDepartures(this.updateState.bind(this));
    }

    componentWillMount() {
        // console.log('Departures:componentDidMount');
        this.fetchData();
    }

    componentDidMount() {
        // console.log('Departures:componentDidMount');
        //this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        // console.log('Departures:componentWillReceiveProps');
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('Departures:componentDidUpdate');
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log('Departures:componentWillUpdate');
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('Departures:shouldComponentUpdate');
        return true;
    }

    stationButtionHandler(event, value) {

    }

    formatTime(timeStamp) {
        return moment.tz(timeStamp, this.props.momentTimezone).format(this.props.momentCurrentTimeFormat);
    }
    
    render() {
        let that = this;

        function renderHeadCells() {
            return this.state.names.map((name, index, names) => {
                if (_.includes(that.state.indexesToBeSkipped, index)) {
                    return null;
                }
                return <td key={index}>{name}</td>
            });
        }

        function renderBodyRows() {
            let departures = this.state.departures;

            if (this.state.station !== '') {
                let srcStationIndex = that.state.columnNameIndexMapping['Origin'];
                departures = _.filter(departures, (departure) => {
                    if (departure[srcStationIndex] === that.state.station) {
                        return true;
                    }
                })
            }

            departures = _.sortBy(departures, [(departure) => {
                let scheduledTime = parseInt(departure[that.state.columnNameIndexMapping['ScheduledTime']]);
                return scheduledTime;
            }, (departure) => {
                let scheduledTime = parseInt(departure[that.state.columnNameIndexMapping['Lateness']]);
                return scheduledTime;
            }]);


            return departures.map((departure, index) => {
                let key = departure[that.state.columnNameIndexMapping[that.props.departureKeyField]];
                return <Departure key={key}
                    departure={departure}
                    indexesToBeSkipped={that.state.indexesToBeSkipped}
                    columnNameIndexMapping={that.state.columnNameIndexMapping}
                    momentTimezone={that.props.momentTimezone}></Departure>
            })
        }

        return (
            <div id="departureBoard">
                <div className="container panel panel-default">
                    <div className="panel-heading">
                        <strong>Last Updated:&nbsp;</strong>{this.state.timeStamp ? this.formatTime(this.state.timeStamp) : ''}
                    </div>

                    <Navbar stations={this.props.sourceStations} updateState={this.updateState.bind(this)}></Navbar>

                    <div className="panel-body">
                        <div className="row">
                            <a className="btn btn-default center" href="#" role="button">On Time</a>
                            <a className="btn btn-info center" href="#" role="button">Arriving</a>
                            <a className="btn btn-primary center" href="#" role="button">Departing soon</a>
                            <a className="btn btn-warning center" href="#" role="button">Delayed</a>
                            <a className="btn btn-danger center" href="#" role="button">Cancelled</a>
                            <a className="btn btn-success center" href="#" role="button">Departed</a>
                        </div>
                    </div>
                    <div className="panel-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    {renderHeadCells.bind(this)()}
                                </tr>
                            </thead>

                            <tbody>
                                {renderBodyRows.bind(this)()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

Departures.defaultProps = {
    Statuses: {},
    colorClasses: {
        'On Time': 'btn-default',
        'Arriving': 'btn-info',
        'Departing soon': 'btn-primary',
        'Delayed': 'btn-warning',
        'Cancelled': 'btn-danger',
        'Departed': 'btn-success'
    },
    columnsToBeSkipped: ['TimeStamp'],
    sourceStations: ['North Station', 'South Station'],
    departureKeyField: 'Trip'
};

export default Departures;
