import { Card, Row, Col, Text, Spacer } from '@nextui-org/react';
import React from 'react';


class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    formatRuntime = (ms) => {
        let minutes = Math.floor(ms / 1000 / 60);
        let seconds = Math.round(ms / 1000 % 60);
        let displayText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        return displayText;
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Row >
                        <img src={this.props.track.album.image} width="128px" height="128px" style={{ "margin-right": "0.5em" }} />
                        <Col>
                            <Text>{`Track #${this.props.track.track_number} in ${this.props.track.album.name}`}</Text>
                            <Text h3>{this.props.track.name}</Text>
                            <Text>{`by ${this.props.track.artists.join(", ")}`}</Text>
                            <Text>{this.formatRuntime(this.props.track.duration_ms)}</Text>
                            {
                                this.props.track.explicit &&
                                <Text>Explicit</Text>
                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}

export default SearchResult;