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
                    if (loading) return <div>Loading...</div>;
                    if (error) return <div>Unexpected error!</div>;

                    const linksToRender = data.feed.links;

                    return (
                        <ul className={"list p10"}>
                            {linksToRender.map(link => (
                                <Link key={link.id} link={link}/>
                            ))}
                        </ul>
                    );
                }}
            </Query>
        );
    }
}

export default LinkList;
