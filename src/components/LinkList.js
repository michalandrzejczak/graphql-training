import React, {Component} from "react";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link.js";

export const LINKS_QUERY = gql(`
    {
        feed (orderBy: createdAt_DESC) {
            links {
                id
                url
                description
                createdAt
                user {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`);

class LinkList extends Component {
    render() {
        return (
            <Query query={LINKS_QUERY}>
                {({loading, error, data}) => {
                    if (loading) return <div className="ma3 measure">Loading...</div>;
                    if (error) return <div className="dark-red">Unexpected error!</div>;

                    const linksToRender = data.feed.links;

                    return (
                        <div className="ma3 measure">
                            <p className="f4 fw6 ph0 mh0">Link list</p>
                            <ul className="list pl0">
                                {linksToRender.map((link, index) => (
                                    <Link key={link.id} link={link} index={index} updateStoreAfterVote={this._updateCacheAfterVote}/>
                                ))}
                            </ul>
                        </div>
                    );
                }}
            </Query>
        );
    }

    _updateCacheAfterVote = (store, createVote, linkId) => {
        const data = store.readQuery({query: LINKS_QUERY});

        data.feed.links.find(link => link.id === linkId).votes.push(createVote);

        store.writeQuery({query: LINKS_QUERY, data});
    }
}

export default LinkList;
