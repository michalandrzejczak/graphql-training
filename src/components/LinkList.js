import React, {Component} from "react";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {LINKS_PER_PAGE} from "../constants";

import Link from "./Link.js";
import {parse} from "graphql";

export const LINKS_QUERY = gql`
    query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
        feed(first: $first, skip: $skip, orderBy: $orderBy) {
            links {
                id
                createdAt
                url
                description
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
            count
        }
    }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink {
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
    subscription {
        newVote {
            id
            link {
                id
                url
                description
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
            user {
                id
            }
        }
    }
`;

class LinkList extends Component {
    _updateCacheAfterVote = (store, createVote, linkId) => {
        const isNewPage = this.props.location.pathname.includes("new");
        const page = parseInt(this.props.match.params.page, 10);

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 10;
        const orderBy = isNewPage ? "createdAt_DESC" : null;
        const data = store.readQuery({
            query: LINKS_QUERY,
            variables: {first, skip, orderBy},
        });

        data.feed.links.find(link => link.id === linkId).votes.push(createVote);

        store.writeQuery({query: LINKS_QUERY, data});
    };

    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;

                const newLink = subscriptionData.data.newLink;
                const exists = prev.feed.links.find(({id}) => id === newLink.id);

                if (exists) return prev;

                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
                        __typename: prev.feed.__typename,
                    },
                });
            },
        });
    };

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION,
        });
    };

    _getQueryVariables = () => {
        const isNewPage = this.props.location.pathname.includes("new");
        const page = parseInt(this.props.match.params.page, 10);

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 10;
        const orderBy = isNewPage ? "createdAt_DESC" : null;

        return {first, skip, orderBy};
    };

    _getLinksToRender = data => {
        const isNewPage = this.props.location.pathname.includes("new");
        if (isNewPage) {
            return data.feed.links;
        }

        const rankedLinks = data.feed.links.slice();
        rankedLinks.sort((link1, link2) => link2.votes.length - link1.votes.length);

        return rankedLinks;
    };

    _nextPage = data => {
        const page = parseInt(this.props.match.params.page, 10);
        if (page <= data.feed.count / LINKS_PER_PAGE) {
            this.props.history.push(`/new/${page + 1}`);
        }
    };

    _previousPage = () => {
        const page = parseInt(this.props.match.params.page, 10);

        if (page > 1) {
            this.props.history.push(`/new/${page - 1}`);
        }
    };

    render() {
        return (
            <Query query={LINKS_QUERY} variables={this._getQueryVariables()}>
                {({loading, error, data, subscribeToMore}) => {
                    if (loading) return <div className="ma3 measure">Loading...</div>;
                    if (error) return <div className="dark-red">Unexpected error!</div>;

                    this._subscribeToNewLinks(subscribeToMore);
                    this._subscribeToNewVotes(subscribeToMore);

                    const linksToRender = this._getLinksToRender(data);
                    const isNewPage = this.props.location.pathname.includes("new");
                    const pageIndex = this.props.match.params.page
                        ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
                        : 0;

                    return (
                        <div className="ma3 measure">
                            <p className="f4 fw6 ph0 mh0">{isNewPage ? "Link list" : "Top 10 links"}</p>
                            <ul className="list pl0">
                                {linksToRender.map((link, index) => (
                                    <Link
                                        key={link.id}
                                        link={link}
                                        index={index}
                                        updateStoreAfterVote={this._updateCacheAfterVote}
                                    />
                                ))}
                            </ul>
                            {isNewPage && (
                                <div className="flex ml4 mv3 gray">
                                    <div className="pointer mr2" onClick={this._previousPage}>
                                        Previous
                                    </div>
                                    <div className="pointer" onClick={() => this._nextPage(data)}>
                                        Next
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default LinkList;
