import React, { Component } from 'react';

export default class FormAlerts extends React.Component {
    render() {
        return (
            <div>
                <div className="callout success" style={{ display: this.props.saved === true ? 'block' : 'none' }}>
                    <p>{this.props.success}.</p>
                </div>
                <div className="callout alert" style={{ display: this.props.saved === false ? 'block' : 'none' }}>
                    <p>{this.props.error}.</p>
                </div>
            </div>
        );
    }
}