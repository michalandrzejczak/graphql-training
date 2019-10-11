import React, {Component} from "react";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link.js";

export const LINKS_QUERY = gql`
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
          id,
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
        const data = store.readQuery({query: LINKS_QUERY});

        data.feed.links.find(link => link.id === linkId).votes.push(createVote);

        store.writeQuery({query: LINKS_QUERY, data});
    };

    _subscribeToNewLinks = (subscribeToMore) => {
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
                })
            },
        })
    };

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    };

    render() {
        return (
            <Query query={LINKS_QUERY}>
                {({loading, error, data, subscribeToMore}) => {
                    if (loading) return <div className="ma3 measure">Loading...</div>;
                    if (error) return <div className="dark-red">Unexpected error!</div>;

                    this._subscribeToNewLinks(subscribeToMore);
                    this._subscribeToNewVotes(subscribeToMore);

                    const linksToRender = data.feed.links;

                    return (
                        <div className="ma3 measure">
                            <p className="f4 fw6 ph0 mh0">Link list</p>
                            <ul className="list pl0">
                                {linksToRender.map((link, index) => (
                                    <Link key={link.id} link={link} index={index}
                                          updateStoreAfterVote={this._updateCacheAfterVote}/>
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
