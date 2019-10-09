import React, {Component} from "react";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link.js";

class LinkList extends Component {
    render() {
        const linksQuery = gql(`
            {
                feed (orderBy: createdAt_DESC) {
                    links {
                        id
                        url
                        description
                    }
                }
            }
        `);

        return (
            <Query query={linksQuery}>
                {({loading, error, data}) => {
                    if (loading) return <div className="ma3 measure">Loading...</div>;
                    if (error) return <div className="dark-red">Unexpected error!</div>;

                    const linksToRender = data.feed.links;

                    return (
                        <div className="ma3 measure">
                            <p className="f4 fw6 ph0 mh0">Link list</p>
                            <ul className="list pl0">
                                {linksToRender.map(link => (
                                    <Link key={link.id} link={link}/>
                                ))}
                            </ul>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default LinkList;
