import React, {Component} from "react";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import {AUTH_TOKEN} from "../constants";

class Header extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);

        return (
            <div className="flex pa2 justify-between nowrap bb bg-near-white">
                <div className="flex flex-fixed">
                    <div className="f6 b mr4">Menu</div>
                    <Link to="/" className="mh2 f6 no-underline dim black">
                        List
                    </Link>
                    <Link to="/search" className="mh2 f6 no-underline dim black">
                        Search a link
                    </Link>
                    {authToken && (
                        <Link to="/create" className="mh2 f6 no-underline dim black">
                            Add new
                        </Link>
                    )}
                </div>
                <div className="flex flex-fixed">
                    {authToken ? (
                        <div
                            className="pointer mh2 f6 no-underline dim black"
                            onClick={() => {
                                localStorage.removeItem(AUTH_TOKEN);
                                this.props.history.push("/");
                            }}
                        >
                            Logout
                        </div>
                    ) : (
                        <Link to="/login" className="mh2 f6 no-underline dim black">
                            Login/Sign Up
                        </Link>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
