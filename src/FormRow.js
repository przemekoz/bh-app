import React from 'react';
import InputChooser from './InputChooser';

export default class FormRow extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="small-12 columns">
                    <label>
                        <span>
                            {this.props.label}
                        </span>
                        <InputChooser
                            type={this.props.type ? this.props.type : 'text'}
                            name={this.props.name}
                            className={this.props.className}
                            onChange={this.props.onChange}
                            selected={this.props.selected}
                            errorMessage={this.props.errorMessage}
                            saved={this.props.saved}
                            onResetClick={this.props.onResetClick}
                            saveLabel={this.props.saveLabel}
                            resetLabel={this.props.resetLabel}
                        />
                    </label>
                </div>
            </div>
        );
    }
}