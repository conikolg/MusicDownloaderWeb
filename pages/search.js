import styles from '../styles/Search.module.css'
import Head from 'next/head'
import React from 'react';
import { Input, Spacer } from '@nextui-org/react';
import axios from 'axios';
import SearchResult from '../components/searchResult';

var timeout = null;
class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: null,
            results: null,
            timeout: null,
        };
    }

    textTyped = (event) => {
        // Update component state
        this.setState((state, props) => ({
            query: event.target.value
        }));
        // Debounce the API call
        this.debounce(this.getSearchResults, 500, false)();
    }

    debounce = (func, wait, immediate) => {
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    getSearchResults = async () => {
        let newResults = await axios.get(`http://192.168.1.18:8100/search/sp/${this.state.query}`);
        this.setState((state, props) => ({
            results: newResults.data
        }));
    }

    render() {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Search for a Song</title>
                    <meta name="Search for a Song" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={styles.main}>
                    <Input size="xl" labelPlaceholder="Search for a song..."
                        shadow={false} type="search" bordered color="primary"
                        onChange={this.textTyped} />

                    {this.state.results != null && <div>
                        <Spacer y={0.5} />
                        {
                            this.state.results.map((result, idx) => (
                                <div key={`result${idx}`}>
                                    <SearchResult track={result} />
                                    <Spacer y={0.2} />
                                </div>
                            ))
                        }
                    </div>}

                    {/* <pre>
                        {JSON.stringify(this.state.results, null, 2)}
                    </pre> */}
                </div>

            </div>
        )
    }
}

export default Search;