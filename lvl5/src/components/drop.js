import React, { Component } from 'react';
import axios from 'axios';

import Loader from 'react-loader-spinner'
import Dropzone from 'react-dropzone';

// const electron = window.require("electron");
const fs = window.require('fs');
const chokidar = window.require('chokidar');

var watcher = chokidar.watch('FHIR', {
    ignored: /(^|[/\\])\../,
    persistent: true
});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accepted: [],
            rejected: [],
            loading: false,
            done: false,
            uploaded: 0
        };

        this.sendData = this.sendData.bind(this);
    }

    componentWillMount() {
        axios.get(`https://fhirtest.uhn.ca/baseDstu3/Binary`)
            .then(res => {
                console.log(res)
                this.setState({
                    uploaded: res.data.total ? res.data.total : res.data.entry.length
                });
            })

        var log = console.log.bind(console);
        var vue = this;
        watcher
            .on('add', path => {
              let file = [{
                path: path
              }]
                vue.setState({
                    loading: true,
                    accepted: file

                });
                this.sendData();
            })
            .on('change', path => log(`File ${path} has been changed`))
            .on('unlink', path => log(`File ${path} has been removed`));
    }

    sendData() {
        let vue = this;
        if (this.state.accepted[0]) {
            this.setState({
                loading: true
            });
            for (let i = 0; i < vue.state.accepted.length; i++) {
              //check de la lecture
                fs.readFile(vue.state.accepted[i].path, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                    vue.state.accepted[i].data = data;
                });
            };
            fetch('https://fhirtest.uhn.ca/baseDstu3/Binary', { method: 'POST', body: this.state.accepted }).then(response => {
                console.log('done');
                this.setState({
                    loading: false,
                    done: true
                });
                axios.get(`https://fhirtest.uhn.ca/baseDstu3/Binary`)
                    .then(res => {
                        this.setState({
                            uploaded: res.data.total ? res.data.total : res.data.entry.length
                        });
                    })
            });
        }
    }

    render() {

        let sendBut = <div onClick={() => this.sendData()} className="sendButton">
            SEND
        </div>;

        let totalDisplay = <div className="totalDisplay">
            { this.state.uploaded } files uploaded
        </div>;

        if (this.state.loading) {
            return (
                <div>
                    <h2>Loading</h2>
                    <Loader type="Oval" color="#282c34" height={200} width={200}/>
                </div>
            );
        }

        if (this.state.done) {
            return (
                <div>
                    { totalDisplay }
                    <aside>
                        { this.state.accepted[0] ? <h2>uploaded :</h2> : null }
                        <ul>
                            {
                                this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                        { this.state.rejected[0] ? <h2>not uploaded :</h2> : null }
                        <ul style={{color: 'red'}}>
                            {
                                this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                    </aside>
                    <div onClick={() => this.setState({accepted: [], rejected: [], done: false})} className="sendButton">
                        Again
                    </div>
                </div>
            );
        }

        return (
            <div>
                { totalDisplay }
                <section className="dropPage">
                    <div className="dropzone">
                        <Dropzone
                            accept=".pdf"
                            maxSize="2000000"
                            onDrop={(accepted, rejected) => { this.setState({ accepted, rejected, loading: false }); }}
                        >
                            <p>Try dropping some files here, or click to select files to upload.</p>
                            <p>Only *.pdf and 2Mo max sized files will be accepted</p>
                        </Dropzone>
                    </div>
                    <aside>
                        <ul>
                            {
                                this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                        <ul style={{color: 'red'}}>
                            {
                                this.state.rejected.map(f => <li key={f.name}>Error : {f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                    </aside>
                </section>
                { this.state.accepted[0] ? sendBut : null }
            </div>
        );
    }
}

export default App;
