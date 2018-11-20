import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class App extends Component {

    constructor() {
        super()
        this.state = {
            accepted: [],
            rejected: []
        }
    }

    render() {
        return (
            <div>
                <section className="dropPage">
                    <div className="dropzone">
                        <Dropzone
                            accept=".pdf, image/png"
                            onDrop={(accepted, rejected) => { this.setState({ accepted, rejected }); }}
                        >
                            <p>Try dropping some files here, or click to select files to upload.</p>
                            <p>Only *.pdf and *.png images will be accepted</p>
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
            </div>
        );
    }
}

export default App;
