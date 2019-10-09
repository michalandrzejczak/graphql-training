import React, {Component} from "react";

class Link extends Component {
    render() {
        return (
            <li className="mb3">
                {this.props.link.description} <span className="i f6 db">{this.props.link.url}</span>
            </li>
        );
    }
}

export default Link;
