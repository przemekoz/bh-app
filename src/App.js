import React, { Component } from 'react';
import './App.css';

import moment from 'moment';
import axios from 'axios';
import validate from 'bh-validators';
import 'react-datepicker/dist/react-datepicker.css';
import { reduxFieldDispatch, reduxFormSavedDispatch, reduxGetFields } from './AppRedux';
import FormRow from './FormRow';
import FormHeader from './FormHeader';
import FormAlerts from './FormAlerts';

var lang = 'EN';

function getDict(messageKey) {
    var messages = {
        EN: {
            FORM_LEGEND: 'Add event form',
            FORM_SAVE: 'Add event',
            FORM_ADD_NEW_EVENT: 'New event',
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
            saved: null
        };
        // redux: set default date
        reduxFieldDispatch('date', moment(), true);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.setFieldClassName = this.setFieldClassName.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);

        this.validators = {
            firstName: validate.isRequired,
            lastName: validate.isRequired,
            date: validate.date,
            email: validate.email
        };

        this.validate = function (name, value) {
            return this.validators[name] ? this.validators[name](value) : true;
        };

    }

    handleSubmit(event) {
        event.preventDefault();
        var canSubmit = true;

        for (var name in this.validators) {
            if (this.validators.hasOwnProperty(name)) {
                if (this.validate(name, reduxGetFields()[name]) === false) {
                    canSubmit = false;
                    this.setFieldClassName(name, false);
                }
            }
        }

        if (canSubmit) {
            var _this = this;
            axios.post('http://localhost:3001/api/saveEvent', reduxGetFields())
                .then(function (response) {
                    if (response.data.message === 'ok!') {
                        _this.setState({ saved: true });
                        reduxFormSavedDispatch(true);
                    }
                    else {
                        _this.setState({ saved: false });
                        reduxFormSavedDispatch(false, response.data.err);
                    }
                })
                .catch(function (error) {
                    _this.setState({ saved: false });
                    reduxFormSavedDispatch(false, error.data.err);
                });
        }
    }

    handleInputChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        var isValid = this.validate(name, value);
        this.setFieldClassName(name, isValid);
        reduxFieldDispatch(name, value, isValid);
    }

    handleDateChange(date) {
        var isValid = this.validate('date', date);
        this.setFieldClassName('date', isValid);
        reduxFieldDispatch('date', date, isValid);
    }

    setFieldClassName(name, isValid) {
        var state = this.state;
        state.validation[name] = isValid ? '' : 'error';
        this.setState(state);
    }

    handleResetClick() {
        reduxFieldDispatch('firstName', '');
        reduxFieldDispatch('lastName', '');
        reduxFieldDispatch('email', '');
        this.setState({ saved: null });
    }

    render() {
        return (
            <div className="App">
                <FormHeader />

                <FormAlerts
                    saved={this.state.saved}
                    success={getDict('SAVED_SUCCESS')}
                    error={getDict('SAVED_ERROR')}
                />

                <form onSubmit={this.handleSubmit}>
                    <fieldset className="fieldset">
                        <legend>{getDict('FORM_LEGEND')}</legend>

                        <FormRow
                            type="text"
                            name="firstName"
                            label={getDict('LABEL_FIRSTNAME')}
                            className={this.state.validation.firstName}
                            onChange={this.handleInputChange}
                            errorMessage={getDict('LABEL_FIRSTNAME') + ' ' + getDict('IS_REQUIRED')}
                        />

                        <FormRow
                            type="text"
                            name="lastName"
                            label={getDict('LABEL_LASTNAME')}
                            className={this.state.validation.lastName}
                            onChange={this.handleInputChange}
                            errorMessage={getDict('LABEL_LASTNAME') + ' ' + getDict('IS_REQUIRED')}
                        />

                        <FormRow
                            type="email"
                            name="email"
                            label={getDict('LABEL_EMAIL')}
                            className={this.state.validation.email}
                            onChange={this.handleInputChange}
                            errorMessage={getDict('LABEL_EMAIL') + ' ' + getDict('IS_REQUIRED_VALID')}
                        />

                        <FormRow
                            type="datepicker"
                            name="date"
                            label={getDict('LABEL_DATE')}
                            className={this.state.validation.date}
                            selected={reduxGetFields().date}
                            onChange={this.handleDateChange}
                            errorMessage={getDict('LABEL_DATE') + ' ' + getDict('IS_REQUIRED_VALID')}
                        />

                        <FormRow
                            type="submit"
                            saved={this.state.saved}
                            onResetClick={this.handleResetClick}
                            saveLabel={getDict('FORM_SAVE')}
                            resetLabel={getDict('FORM_ADD_NEW_EVENT')}
                        />
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default AddEventForm;