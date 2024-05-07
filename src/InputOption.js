import React from 'react';
import "./InputOption.css";

const InputOption = ({ Icon, title, color,htmlfor }) => {
    return (
        <div className="inputOption" htmlFor={htmlfor}>
            <Icon style={{ color: color }} />
            <h4>{title}</h4>
        </div>
    )
}

export default InputOption;