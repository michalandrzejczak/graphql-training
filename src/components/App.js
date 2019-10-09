import React, {Component} from "react";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";

class App extends Component {
    render() {
        return (
            <div className="black-80">
                <CreateLink/>
                <LinkList/>
            </div>
        );
    }
}

export default App;
