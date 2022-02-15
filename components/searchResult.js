import { Card, Row, Col, Text, Button, Loading } from '@nextui-org/react';
import React from 'react';
import axios from 'axios';


class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            evSource: null,
            videoLink: null,
            videoTitle: null,
            downloadProgress: null,
        }
    }

    formatRuntime = (ms) => {
        let minutes = Math.floor(ms / 1000 / 60);
        let seconds = Math.round(ms / 1000 % 60);
        let displayText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        return displayText;
    }

    getDownloadButtonContent = () => {
        // No download has been requested yet
        if (this.state.downloadProgress === null) {
            return <Text span>Download</Text>;
        }

        // Download requested, but no server-side-events yet
        if (this.state.downloadProgress === 0 && !this.state.evSource) {
            return <Loading size="xl" type="points-opacity" style={{ margin: "7px 0" }} />
        }

        // Download requested, progress is being streamed
        if (this.state.downloadProgress < 100) {
            return <div>
                <Text span>Downloading</Text>
                <Text span b>{" " + this.state.videoLink + " "}</Text>
                <Text span>({this.state.downloadProgress}%)</Text>
            </div>
        }

        // Download requested and completed.
        return <div>
            <Text span>Downloaded</Text>
            <Text span b>{" " + this.state.videoLink + " "}</Text>
        </div>
    }

    requestDownload = async () => {
        this.setState({ downloadProgress: 0 });

        // Request download, get download job information back
        let download = await axios.put("http://192.168.1.18:8100/download", this.props.track);
        let { job_id, link, title } = download.data

        // Build server-side-event stream
        let source = new EventSource("http://192.168.1.18:8100/progress/" + job_id);
        source.onmessage = event => {
            this.setState({ downloadProgress: event.data });
            if (event.data == "100") {
                source.close();
            }
        }

        this.setState((state, props) => ({
            evSource: source,
            videoLink: link,
            videoTitle: title,
            downloadProgress: 0,
        }))
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
                            <Button auto flat onClick={this.requestDownload} disabled={this.state.downloadProgress !== null} style={{
                                lineHeight: "24px",
                                height: "auto",
                                marginTop: "4px",
                                marginBottom: "-8px",
                                width: "100%"
                            }} >{this.getDownloadButtonContent()}</Button>
                        </Row>
                    </Col>
                </Card.Body>
            </Card>
        )
    }
}

export default SearchResult;