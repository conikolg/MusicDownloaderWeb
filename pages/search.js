import styles from '../styles/Search.module.css'
import Head from 'next/head'
import React from 'react';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = { results: null };
    }

    // Auto-binding functions
    handleClick = (ev) => {
        console.log('??? - ' + this.state.results)
        this.setState((state, props) => ({
            results: [1, 2, 3, 4]
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

                {/* Center content horizontally/vertically on the screen */}
                <div className={styles.main}>
                    {/* Main box where the search query will be entered */}
                    <Input size="xl" labelPlaceholder="Search for a song..."
                        shadow={false} type="search" bordered color="primary"
                        onChange={this.handleClick} />
                    {/* Only show if results are present */}
                    {this.state.results != null && <Button.Group size="xl" vertical bordered>
                        {
                            // Create a button for each result
                            this.state.results.map((result, idx) => (
                                <Button>Button #{idx}</Button>
                            ))
                        }
                    </Button.Group>}
                </div>

            </div>
        )
    }
}
export default Search;