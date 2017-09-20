import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import validate from 'bh-validators';
import axios from 'axios';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

it('validate email', () => {
    expect(validate.email('jan.kowalski@tlen.pl')).toBeTruthy();
    expect(validate.email('kowalski@o2.pl')).toBeTruthy();
    expect(validate.email('a@b.cd')).toBeTruthy();

    expect(validate.email('')).toBeFalsy();
    expect(validate.email([])).toBeFalsy();
    expect(validate.email({})).toBeFalsy();
    expect(validate.email(null)).toBeFalsy();
    expect(validate.email(undefined)).toBeFalsy();
    expect(validate.email('jan.kowalski@@tlen.pl')).toBeFalsy();
    expect(validate.email('jan..kowalski@tlen.pl')).toBeFalsy();
    expect(validate.email('@jan.kowalski')).toBeFalsy();
    expect(validate.email('http://example.com')).toBeFalsy();
});

it('validate date', () => {
    expect(validate.date([])).toBeTruthy();
    expect(validate.date({})).toBeTruthy();
    expect(validate.date('2017-09-09')).toBeTruthy();

    expect(validate.date('')).toBeFalsy();
    expect(validate.date(null)).toBeFalsy();
    expect(validate.date(undefined)).toBeFalsy();
    expect(validate.date('jan.kowalski@tlen.pl')).toBeFalsy();
    expect(validate.date('http://example.com')).toBeFalsy();
});

it('can connect to BE', () => {
    return axios.get('http://localhost:3001/api/test')
        .then(function (response) {
            expect(response.data.message).toBe('ok!');
        });
});

it('can connect to database', () => {
    return axios.get('http://localhost:3001/api/dbtest')
        .then(function (response) {
            expect(response.data.message).toBe('ok!');
        });
});
