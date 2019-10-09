import React, {Component} from "react";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";

class Header extends Component {
    render() {
        return (
            <div className="flex pa2 justify-between nowrap bb bg-near-white">
                <div className="flex flex-fixed black">
                    <div className="f6 b mr4">Menu</div>
                    <Link to="/" className="mh2 f6 no-underline dim black">
                        New
                    </Link>
                    <Link to="/create" className="mh2 f6 no-underline dim black">
                        Submit
                    </Link>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
