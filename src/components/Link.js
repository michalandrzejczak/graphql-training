import React, {Component} from "react";

class Link extends Component {
    render() {
        return (
            <li className={"white bg-dark-blue w-50 br-pill pa2 ma2 grow pointer"}>
                {this.props.link.description} <span className={"i f6"}>{this.props.link.url}</span>
            </li>
        );
    }
}

export default Link;
