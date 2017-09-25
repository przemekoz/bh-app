'use strict'

var moment  = require('moment');

var validators = {
    email: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    date: function (date) {
        if (!date) {
            return false;
        }
        return moment(date).isValid();
    },
    isRequired: function (value) {
        return value ? true : false;
    }
} 

module.exports = validators;