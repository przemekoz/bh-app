import React from 'react';

export default class InputSubmit extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="small-12 columns">
                    <button className="button float-left" type="submit" style={{ marginRight: '1rem' }} disabled={this.props.saved !== null ? 'disabled' : ''}>{this.props.saveLabel}</button>
                    <button className="button" type="reset" onClick={this.props.onResetClick} style={{ display: this.props.saved !== null ? 'block' : 'none' }}>{this.props.resetLabel}</button>
                </div>
            </div>
        );
    }
}