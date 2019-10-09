import React, {Component} from "react";
import {AUTH_TOKEN} from "../constants";
import {Mutation} from "react-apollo";
import gql from "graphql-tag";

class Login extends Component {
    state = {
        login: true,
        email: "",
        password: "",
        name: "",
    };

    render() {
        const {login, email, password, name} = this.state;
        const SIGNUP_MUTATION = gql(`
            mutation SignupMutation($email: String!, $password: String!, $name: String!) {
                signup(email: $email, password: $password, name: $name) {
                    token
                }
            }
        `);

        const LOGIN_MUTATION = gql(`
            mutation LoginMutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                }
            }
        `);

        return (
            <div className="ma3 measure">
                <p className="f4 fw6 ph0 mh0">{login ? "Login" : "Sign Up"}</p>
                <div className="flex flex-column mt3">
                    {!login && (
                        <div>
                            <label htmlFor="name" className="db fw6 lh-copy f6">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                name="name"
                                id="name"
                                placeholder="Your name"
                                className="pa2 input-reset ba w-100 mb2"
                                onChange={e => this.setState({name: e.target.value})}
                            />
                        </div>
                    )}
                    <label htmlFor="email" className="db fw6 lh-copy f6">
                        Email
                    </label>
                    <input
                        type="text"
                        value={email}
                        name="email"
                        id="email"
                        placeholder="Your email"
                        className="pa2 input-reset ba w-100 mb2"
                        onChange={e => this.setState({email: e.target.value})}
                    />
                    <label htmlFor="password" className="db fw6 lh-copy f6">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        name="password"
                        id="password"
                        placeholder="Your password"
                        className="pa2 input-reset ba w-100 mb2"
                        onChange={e => this.setState({password: e.target.value})}
                    />
                </div>
                <div className="flex mt3">
                    <Mutation
                        mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{email, password, name}}
                        onCompleted={data => this._confirm(data)}
                    >
                        {mutation => (
                            <div
                                className="pointer b ph3 pv2 mt3 mr2 ba b--black-80 bg-transparent dim pointer f6 dib"
                                onClick={mutation}
                            >
                                {login ? "Login" : "Create account"}
                            </div>
                        )}
                    </Mutation>
                    <div
                        className="pointer b ph3 pv2 mt3 ba b--black-80 bg-transparent dim pointer f6 dib"
                        onClick={() => this.setState({login: !login})}
                    >
                        {login ? "Need to create an account?" : "Already have an account?"}
                    </div>
                </div>
            </div>
        );
    }

    _confirm = async data => {
        const {token} = this.state.login ? data.login : data.signup;
        this._saveUserData(token);
        this.props.history.push("/");
    };

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token);
    };
}

export default Login;
