import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import validate from 'bh-validators';
import 'react-datepicker/dist/react-datepicker.css';
import { reduxFieldDispatch, reduxFormSavedDispatch, reduxGetFields } from './AppRedux';

var lang = 'EN';

function getDict(messageKey) {
    var messages = {
        EN: {
            FORM_LEGEND: 'Add event form',
            FORM_SAVE: 'Add event',
            LABEL_EMAIL: 'Email',
            LABEL_DATE: 'Event date',
            LABEL_FIRSTNAME: 'First name',
            LABEL_LASTNAME: 'Last name',
            IS_REQUIRED: 'is required',
            IS_REQUIRED_VALID: 'is required and must be valid',
            SAVED_SUCCESS: 'Event has been saved correctly',
            SAVED_ERROR: 'Event has not been saved'
        }
    };
    return messages[lang] && messages[lang][messageKey] ?
        messages[lang][messageKey] : messageKey;
}

function isRequired(value) {
    return value ? true : false;
}

class AddEventForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validation: {
                firstName: '',
                lastName: '',
                email: '',
                date: ''
            },
            value: {
                firstName: null,
                lastName: null,
                email: null,
                date: moment()
            },
            saved: null
        };
        // redux: set default date
        reduxFieldDispatch('date', moment(), true);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        this.validators = {
            firstName: isRequired,
            lastName: isRequired,
            date: validate.date,
            email: validate.email
        };

        this.validate = function (name, value) {
            var isValid = this.validators[name] ? this.validators[name](value) : true;
            // var state = this.state;
            // state.validation[name] = isValid ? '' : 'error';
            // this.setState(state);
            return isValid;
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        var canSubmit = true;

        // for (var name in this.validators) {
        //     if (this.validators.hasOwnProperty(name)) {
        //         if (this.validate(name, this.state.value[name]) === false) {
        //             canSubmit = false;
        //         }
        //     }
        // }

        if (canSubmit) {
            axios.post('http://localhost:3001/api/saveEvent', reduxGetFields())
                .then(function (response) {
                    console.log(response.data)
                    if (response.data.message === 'ok!') {
                        reduxFormSavedDispatch(true);
                    }
                    else {
                        reduxFormSavedDispatch(false, response.data.err);
                    }
                })
                .catch(function (error) {
                    reduxFormSavedDispatch(false, error.data.err);
                });
        }
    }

    handleInputChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        var isValid = this.validate(name, value);
        // redux: set state of field
        reduxFieldDispatch(name, value, isValid);
    }

    handleDateChange(date) {
        var isValid = this.validate('date', date);
        // redux: set state of field
        reduxFieldDispatch('date', date, isValid);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>

                <div className="callout success" style={{ display: this.state.saved === true ? 'block' : 'none' }}>
                    <p>{getDict('SAVED_SUCCESS')}.</p>
                </div>
                <div className="callout alert" style={{ display: this.state.saved === false ? 'block' : 'none' }}>
                    <p>{getDict('SAVED_ERROR')}.</p>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <fieldset className="fieldset">
                        <legend>{getDict('FORM_LEGEND')}</legend>
                        <div className="row">
                            <div className="small-12 columns">
                                <label>
                                    <span>
                                        {getDict('LABEL_FIRSTNAME')}
                                    </span>
                                    <div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className={this.state.validation.firstName}
                                            onChange={this.handleInputChange} />
                                        <span className={this.state.validation.firstName}>{getDict('LABEL_FIRSTNAME')} {getDict('IS_REQUIRED')}.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="small-12 columns">
                                <label>
                                    <span>{getDict('LABEL_LASTNAME')}</span>
                                    <div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className={this.state.validation.lastName}
                                            onChange={this.handleInputChange} />
                                        <span className={this.state.validation.lastName}>{getDict('LABEL_LASTNAME')} {getDict('IS_REQUIRED')}.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="small-12 columns">
                                <label>
                                    <span>{getDict('LABEL_EMAIL')}</span>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            className={this.state.validation.email}
                                            onChange={this.handleInputChange} />
                                        <span className={this.state.validation.email}>{getDict('LABEL_EMAIL')} {getDict('IS_REQUIRED_VALID')}.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="small-12 columns">
                                <label>
                                    <span>{getDict('LABEL_DATE')}</span>
                                    <div>
                                        <DatePicker
                                            name="date"
                                            className={this.state.validation.date}
                                            selected={reduxGetFields().date}
                                            onChange={this.handleDateChange} />
                                        <span className={this.state.validation.date}>{getDict('LABEL_DATE')} {getDict('IS_REQUIRED_VALID')}.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="small-12 columns">
                                <button className="button" type="submit">{getDict('FORM_SAVE')}</button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default AddEventForm;