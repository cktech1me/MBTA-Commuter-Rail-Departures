import React from 'react';
require('bootstrap-webpack');
require('font-awesome-webpack');
require('../styles/App.css');
let $ = require('jquery');
let _ = require('lodash');
let moment = require('moment-timezone');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      prevLocale: moment().locale(),
      locale: 'en',
      momentTimezone: 'America/New_York',
      momentCurrentTimeFormat: 'dddd, MMMM Do YYYY, h:mm:ss a'
    }
  }

  componentWillMount() {
    // console.log('App:componentWillMount');
    this.setState({
      timeinterval: setInterval(this.renderCurrentTime.bind(this), 1000)
    });
  }

  componentDidMount() {
    // console.log('App:componentDidMount');

    this.setState({
      $currentTime: $('#currentTime')
    });
  }

  componentWillUnmount() {
    // console.log('App:componentWillUnmount');

    clearInterval(this.state.timeinterval);

    this.setState({
      timeinterval: undefined
    });
  }

  updateState(newState) {
    let payload = {};

    if (!_.isEmpty(payload)) {
      this.setState(payload);
    }
  }

  renderCurrentTime() {
    let timeString = this.formatTime(Date.now());
    if (this.state.$currentTime) {
      this.state.$currentTime.text(timeString);
    }
  }

  formatTime(timeStamp) {
    return moment.tz(timeStamp, this.state.momentTimezone).format(this.state.momentCurrentTimeFormat);
  }

  renderChildren() {
    var that = this;

    //Passing properties to children
    var children = React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        locale: that.state.locale,
        momentTimezone: that.state.momentTimezone,
        momentCurrentTimeFormat: that.state.momentCurrentTimeFormat,
        updateState: that.updateState.bind(that)
      })
    })

    return <div>{children}</div>
  }

  render() {
    moment.locale(this.state.locale);

    return (
      <div>
        <div id="menuBoard" className="container fixed">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1>MBTA Commuter Rail Departures</h1>
            </div>

            <div className="panel-heading">
              <strong>Current Time:&nbsp;</strong><span id="currentTime">{this.formatTime(Date.now())}</span>
            </div>
          </div>
        </div>

        {this.renderChildren()}
      </div>
    );
  }
}

App.defaultProps = {

};

export default App;
