import React from 'react';
let _ = require('lodash');
let moment = require('moment-timezone');

class Departure extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        // console.log('Departure:componentDidMount');
    }

    componentDidMount() {
        // console.log('Departure:componentDidMount');
    }

    componentWillReceiveProps(nextProps) {
        // console.log('Departure:componentWillReceiveProps');
    }

    componentWillUpdate() {
        // console.log('Departure:componentWillUpdate');
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('Departure:shouldComponentUpdate');
        return true;
    }

    render() {
        let that = this;
        let indexColumnNameMapping = _.invert(this.props.columnNameIndexMapping);

        function renderCells() {
            let scheduledTimeIndex = that.props.columnNameIndexMapping['ScheduledTime'];

            return this.props.departure.map((value, index, departure) => {
                let key = departure[that.props.columnNameIndexMapping[that.props.departureKeyField]] + '_' + index;

                if (_.includes(that.props.indexesToBeSkipped, index)) {
                    //let lastUpdatedTime = moment.tz(parseInt(value), that.props.momentTimezone).format('dddd, MMMM Do YYYY, h:mm:ss a');
                    return null;
                } else if (indexColumnNameMapping[index] == 'ScheduledTime') {
                    return <td key={key}>{moment.tz(parseInt(value), that.props.momentTimezone).format('h:m:s a')} </td>
                } else if (indexColumnNameMapping[index] == 'Lateness') {
                    let delay = parseInt(value);

                    if (delay != 0) {
                        let scheduledTime = moment.tz(parseInt(departure[scheduledTimeIndex]), that.props.momentTimezone);
                        let finalTime = scheduledTime.clone().add(delay, 'milliseconds');
                        return <td key={key}>{finalTime.from(scheduledTime)} </td>
                    }
                }
                return <td key={key}>{value}</td>
            });
        }

        return (
            <tr>
                {renderCells.bind(this)()}
            </tr>
        );
    }
}

Departure.defaultProps = {
    'TimeStamp': 0,
    'Origin': '',
    'Trip': 0,
    'Destination': '',
    'ScheduledTime': 0,
    'Lateness': 0,
    'Track': 0,
    'Status': '',
    dataTypes: {

    },
    departureKeyField: 'Trip'
};

Departure.propTypes = {
    'TimeStamp': React.PropTypes.number,
    'Origin': React.PropTypes.string,
    'Trip': React.PropTypes.number,
    'Destination': React.PropTypes.string,
    'ScheduledTime': React.PropTypes.number,
    'Lateness': React.PropTypes.number,
    'Track': React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    'Status': React.PropTypes.string
};

module.exports = Departure;
