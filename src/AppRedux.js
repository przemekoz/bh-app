import _ from 'lodash/collection';
import { createStore } from 'redux';

const field = (state = {}, action) => {

    switch (action.type) {
        case 'FIELD_CHANGED':
            return {
                name: action.name,
                value: action.value
            }

        default:
            return state;
    }
};

const fields = (state = {}, action) => {

    switch (action.type) {
        case 'FIELD_CHANGED':
            let result = _.reject(state.fields, ['name', action.name]);
            return {
                fields: result.concat( [ field(undefined, action) ] )
            }
        default:
            return state;
    }
};

const store = createStore(fields);


export function reduxFieldDispatch(name, value) {
    store.dispatch({ name: name, value: value, type: 'FIELD_CHANGED' });
}

store.subscribe(function () {
    console.log(store.getState());
});