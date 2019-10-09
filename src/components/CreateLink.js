import React, {Component} from "react";
import {Mutation} from "react-apollo";
import gql from "graphql-tag";

class CreateLink extends Component {
    state = {
        description: "",
        url: "",
    };

    render() {
        const {description, url} = this.state;
        const mutation = gql(`
            mutation PostMutation($description: String!, $url: String!) {
                post(description: $description, url: $url) {
                    id
                    url
                    description
                    createdAt
                }
            }
        `);

        return (
            <div className="ma3 measure">
                <p className="f4 fw6 ph0 mh0">Add link</p>
                <div className="flex flex-column mt3">
                    <label for="description" className="db fw6 lh-copy f6">
                        Description
                    </label>
                    <input
                        type="text"
                        className="pa2 input-reset ba w-100 mb2"
                        value={description}
                        name="description"
                        id="description"
                        placeholder="Give a description of a link"
                        onChange={e => this.setState({description: e.target.value})}
                    />
                    <label htmlFor="url" className="db fw6 lh-copy f6">
                        URL
                    </label>
                    <input
                        type="text"
                        className="pa2 input-reset ba w-100"
                        value={url}
                        name="url"
                        id="url"
                        placeholder="Give an URL of a link"
                        onChange={e => this.setState({url: e.target.value})}
                    />
                </div>
                <Mutation
                    mutation={mutation}
                    variables={{description, url}}
                    onCompleted={() => this.props.history.push("/")}
                >
                    {postMutation => (
                        <button
                            onClick={postMutation}
                            className="b ph3 pv2 mt3 input-reset ba b--black-80 bg-transparent dim pointer f6 dib"
                        >
                            Submit
                        </button>
                    )}
                </Mutation>
            </div>
        );
    }
}

export default CreateLink;
