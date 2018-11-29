import React, { Component } from 'react';
const electron = window.require("electron");

class topBar extends Component {

    render() {
        return (
            <div className="topBar">
                <span className="dragbar"></span>
                <span onClick={() => electron.remote.getCurrentWindow().minimize()}>-</span>
                <span onClick={() => electron.remote.getCurrentWindow().close()}>X</span>
            </div>
        );
    }
}

export default topBar;
