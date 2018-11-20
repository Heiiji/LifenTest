import React, { Component } from 'react';
const electron = window.require("electron");

class topBar extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="topBar">
                <span onClick={() => electron.remote.getCurrentWindow().minimize()}>-</span>
                <span onClick={() => electron.remote.getCurrentWindow().close()}>X</span>
            </div>
        );
    }
}

export default topBar;
