import React from 'react';
import './radiobutton.styles.css';

const RadioButton = props => {
    return (
        <label className="RadioButton">
            {props.label}
            <input onChange={props.onChange} type="radio" name={props.name} value={props.value} />
            <span className="Checkmark"></span>
        </label>
    );

}

export default RadioButton;