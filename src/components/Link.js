import React, {Component} from "react";
import {AUTH_TOKEN} from "../constants";
import {timeDifferenceForDate} from "../utils";
import {Mutation} from "react-apollo";
import gql from "graphql-tag";

class Link extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        const VOTE_MUTATION = gql(`
            mutation VoteMutation($linkId: ID!) {
                vote(linkId: $linkId) {
                    id
                    link {
                        votes {
                            id
                            user {
                                id
                            }
                        }
                    }
                    user {
                        id
                    }
                }
            }
        `);

        return (
            <li className="mb3">
                <div className="flex items-center">
          <span>
            {this.props.index + 1}. {this.props.link.description}
          </span>
                </div>
                <div className="ml3">
                    <span className="i f6 db">{this.props.link.url}</span>
                    <div className="f6 lh-copy gray">
                        {this.props.link.votes.length} votes{" "}
                        {authToken && (
                            <Mutation
                                mutation={VOTE_MUTATION}
                                variables={{linkId: this.props.link.id}}
                                update={(store, {data: {vote}}) => this.props.updateStoreAfterVote(store, vote, this.props.link.id)}
                            >
                                {voteMutation => (
                                    <span
                                    className="ml1 gray pointer dim"
                                    onClick={voteMutation}
                                    >
                                        Vote ▲{" "}
                                    </span>
                                )}
                            </Mutation>
                        )}
                        | by{" "}
                        <span className="black-80">{this.props.link.user ? this.props.link.user.name : "Unknown"}{" "}</span>
                        {timeDifferenceForDate(this.props.link.createdAt)}
                    </div>
                </div>
            </li>
        );
    }

    _voteForLink() {
    }
}

export default Link;
