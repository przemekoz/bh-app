import React, { Component } from 'react';

export default class InputText extends React.Component {
    render() {
        return (
            <input
                type={this.props.type}
                name={this.props.name}
                className={this.props.className}
                onChange={this.props.onChange} 
            />
        );
    }
}