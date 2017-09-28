import React from 'react';
import InputText from './InputText';
import InputSubmit from './InputSubmit';
import InputDatePicker from './InputDatePicker';
import _ from 'lodash/collection';

export default class InputChooser extends React.Component {
    render() {
        return (
            <div>
                {_.includes([undefined, 'text', 'email', 'password'], this.props.type) ?
                    <InputText
                        type={this.props.type ? this.props.type : 'text'}
                        name={this.props.name}
                        className={this.props.className}
                        onChange={this.props.onChange}
                    /> : null}

                {this.props.type === 'datepicker' ?
                    <InputDatePicker
                        name={this.props.name}
                        className={this.props.className}
                        onChange={this.props.onChange}
                        selected={this.props.selected}
                    /> : null}

                {this.props.type === 'submit' ?
                    <InputSubmit
                        saved={this.props.saved}
                        onResetClick={this.props.onResetClick}
                        saveLabel={this.props.saveLabel}
                        resetLabel={this.props.resetLabel}
                    /> : null}

                <span className={this.props.className}>{this.props.errorMessage}.</span>
            </div>
        );
    }
}