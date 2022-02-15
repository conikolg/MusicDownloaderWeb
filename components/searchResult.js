import { Card, Row, Col, Text, Button } from '@nextui-org/react';
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

    getDownloadButtonText = () => {
        if (!this.state.evSource)
            return "Download"

        return "Downloading " + this.state.download.link + "   (" + this.state.download.progress + "%)"
    }

    getDownloadButtonContent = () => {
        if (!this.state.evSource) {
            return <Text span>Download</Text>;
        }

        if (this.state.downloadProgress < 100) {
            return <div>
                <Text span>Downloading</Text>
                <Text span b>{" " + this.state.videoLink + " "}</Text>
                <Text span>({this.state.downloadProgress}%)</Text>
            </div>
        }

        return <div>
            <Text span>Downloaded</Text>
            <Text span b>{" " + this.state.videoLink + " "}</Text>
        </div>
    }

    requestDownload = async () => {
        console.log("Requesting download for " + this.props.track.name);
        // Request download, get download job information back
        let download = await axios.put("http://192.168.1.18:8100/download", this.props.track);
        let { job_id, link, title } = download.data

        // Build server-side-event stream
        let source = new EventSource("http://192.168.1.18:8100/progress/" + job_id);
        source.onmessage = event => {
            console.log(event.data);
            if (event.data == "Done.") {
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