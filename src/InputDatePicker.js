import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

export default class InputDatePicker extends React.Component {
    render() {
        return (
            <DatePicker
                name={this.props.name}
                className={this.props.className}
                onChange={this.props.onChange}
                selected={this.props.selected}
            />
        );
    }
}