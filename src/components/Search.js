import React, {Component} from "react";
import {withApollo} from "react-apollo";
import Link from "./Link";
import gql from "graphql-tag";

const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter: String!) {
        feed(filter: $filter) {
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

class Search extends Component {
    state = {
        links: [],
        filter: "",
        loading: false,
        executed: false,
    };

    render() {
        return (
            <div>
                <div>
                    <p className="f4 fw6 ph0 mh0">Search a link</p>
                    <form onSubmit={e => this._executeSearch(e)}>
                        <input
                            type="text"
                            className="pa2 input-reset ba w-100"
                            placeholder="Search a link by description or url"
                            onChange={e => this.setState({filter: e.target.value})}
                        />
                        <button
                            className="b ph3 pv2 mt3 ml3 input-reset ba b--black-80 bg-transparent dim pointer f6 dib">
                            OK
                        </button>
                    </form>
                </div>
                {this.state.links.length > 0 && (
                    <p className="f4 fw6 ph0 mh0">Search results</p>
                )}
                {this.state.loading && <p className="mt3">Loading...</p>}
                <ul className="list pl0">
                    {this.state.links.map((link, index) => (
                        <Link key={link.id} link={link} index={index}/>
                    ))}
                </ul>
                {this.state.links.length === 0 &&
                !this.state.loading &&
                this.state.executed && <p className="mt3">No results found</p>}
            </div>
        );
    }

    _executeSearch = async e => {
        e.preventDefault();
        this.setState({loading: true, executing: false});
        const {filter} = this.state;
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: {filter},
        });

        const links = result.data.feed.links;
        this.setState({loading: false, executed: true, links});
    };
}

export default withApollo(Search);
