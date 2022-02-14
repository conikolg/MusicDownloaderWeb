import { Card, Row, Col, Text, Button } from '@nextui-org/react';
import React from 'react';
import axios from 'axios';


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

    requestDownload = async () => {
        let download = await axios.put("http://192.168.1.18:8100/download", this.props.track);
        console.log(download.data);
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Col>
                        <Row >
                            <img src={this.props.track.album.image} width="150px" height="150px" style={{ marginRight: "0.5em" }} />
                            <Col>
                                <Text span>{`Track #${this.props.track.track_number} in`}</Text>
                                <Text span b style={{ margin: "0 0.1em" }}>{this.props.track.album.name}</Text>
                                <Text h3>{this.props.track.name}</Text>
                                <Text span>by</Text>
                                <Text span b style={{ margin: "0 0.1em" }}>{this.props.track.artists.join(", ")}</Text>
                                <Text>{this.formatRuntime(this.props.track.duration_ms)}</Text>
                                {
                                    this.props.track.explicit &&
                                    <Text>Explicit</Text>
                                }
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Button auto flat onClick={this.requestDownload} style={{
                                lineHeight: "24px",
                                height: "auto",
                                marginTop: "4px",
                                marginBottom: "-8px",
                                width: "100%"
                            }} >Download</Button>
                        </Row>
                    </Col>
                </Card.Body>
            </Card>
        )
    }
}

export default SearchResult;