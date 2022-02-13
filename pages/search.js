import styles from '../styles/Search.module.css'
import Head from 'next/head'
import React from 'react';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import axios from 'axios';

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
        console.log('Updating state...')
        this.setState((state, props) => ({
            query: event.target.value
        }));
        // Debounce the API call
        this.debounce(this.getSearchResults, 1000, false)();
    }

    debounce = (func, wait, immediate) => {
        console.log(`Debouncing with wait=${wait} and immediate=${immediate}`)
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
        let newResults = await axios.get(`http://localhost:8100/search/sp/${this.state.query}`);
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
                    {this.state.results != null && <Button.Group size="xl" vertical bordered>
                        {
                            this.state.results.map((result, idx) => (
                                <Button>Button #{idx}</Button>
                            ))
                        }
                    </Button.Group>}
                    <pre>
                        {JSON.stringify(this.state.results, null, 2)}
                    </pre>
                </div>

            </div>
        )
    }
}

export default Search;