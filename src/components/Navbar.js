import React from 'react';
let _ = require('lodash');
//let $ = require('jquery');


class Navbar extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        // console.log('TableHead:componentDidMount');
    }

    componentDidMount() {
        // console.log('TableHead:componentDidMount');
    }

    componentWillReceiveProps(nextProps) {
        // console.log('TableHead:componentWillReceiveProps');
    }

    componentWillUpdate() {
        // console.log('TableHead:componentWillUpdate');
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('TableHead:shouldComponentUpdate');
        return true;
    }

    onClick(station, proxy, event) {
        if (_.isUndefined(event)) {
            event = proxy;
        }
        event.preventDefault();
        event.stopPropagation();

        this.props.updateState({station: station});
    }

    render() {
        /* return (
            <div>
                <strong className="text-center">Select origin station:</strong>
                <nav className="navbar navbar-default">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#stations" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse" id="stations">
                        <ul className="nav navbar-nav">
                            <li className="navbar-btn"><a href="#"> <span className="sr-only">North Station</span>North Station</a></li>
                            <li className="navbar-btn"><a href="#"> <span className="sr-only">South Station</span>South Station</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        ); */

        return (
            <div className="panel-heading">
                <strong className="text-center">Select origin station:&nbsp;</strong>
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default"  onClick={_.bind(this.onClick, this, '')}>All</button>
                    <button type="button" className="btn btn-default"  onClick={_.bind(this.onClick, this, 'North Station')}>North Station</button>
                    <button type="button" className="btn btn-default"  onClick={_.bind(this.onClick, this, 'South Station')}>South Station</button>
                </div>
            </div>
        );
    }
}

Navbar.defaultProps = {
    names: []
};

module.exports = Navbar;
