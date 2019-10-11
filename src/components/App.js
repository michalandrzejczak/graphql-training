import React, {Component} from "react";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import Login from "./Login";
import Search from "./Search";
import {Route, Switch, Redirect} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div className="black-80">
                <Header/>
                <div className="ph3 pv1">
                    <Switch>
                        <Route exact path='/' render={() => <Redirect to='/new/1' />} />
                        <Route exact path='/create' component={CreateLink} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/search' component={Search} />
                        <Route exact path='/top' component={LinkList} />
                        <Route exact path='/new/:page' component={LinkList} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
