import _ from 'lodash/object';
import { createStore } from 'redux';

const form = (state = { fields: {}, saved: null, error: '' }, action) => {
    switch (action.type) {
        case 'FIELD_CHANGED':
            let fields = state.fields;
            fields[action.name] = {
                value: action.value,
                valid: action.valid
            };
            return {
                fields: fields,
                saved: state.saved,
                error: state.error
            };
        case 'FORM_SAVED':
            return {
                saved: action.saved,
                error: action.message,
                fields: state.fields
            };
        default:
            return state;
    }
};

const store = createStore(form);

export function reduxFieldDispatch(name, value, valid) {
    store.dispatch({ name: name, value: value, valid: valid, type: 'FIELD_CHANGED' });
}

export function reduxFormSavedDispatch(saved, message = '') {
    store.dispatch({ saved: saved, message: message, type: 'FORM_SAVED' });
}

export function reduxGetFields() {
    return _.mapValues(store.getState().fields, 'value');
};

store.subscribe(function () {
    console.log(store.getState());
});