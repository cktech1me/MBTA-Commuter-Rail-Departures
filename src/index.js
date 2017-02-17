import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import createHistory from 'history'
import App from './components/App';
import Departures from './components/Departures';


//const history = createHistory({
//    basename: '/mbta'
//});

// Render the main component into the dom
let rootApp = document.getElementById('app');

//ReactDOM.render(<App />, rootApp);
ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Departures} />
        </Route>
        <Route path="/:station" component={Departures}>
        </Route>
    </Router>
), rootApp);
