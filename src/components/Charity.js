import { FaParachuteBox, FaSeedling } from 'react-icons/fa'
import Button from './Button'
import InputForm from './InputForm'
import React, { useState, useEffect } from "react";

const Charity = ({ charity, onStart, onTransferFunds, onUndoTransfer }) => {
    const [showInputField, setShowInputField] = useState(false);

    useEffect(() => {
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('wheel', event => {
                event.preventDefault()
            })
        }
    }, [showInputField])

    const confirmStartProject = (id) => {
        if (window.confirm('Are you sure you want to start the project?')) {
            setShowInputField(false)
            onStart(id)
        }
    }

    return (
        <div className='charity'>
            <h3>
                {charity.name} 
                {charity.projectStarted ? <FaParachuteBox size="2em" /> : ''}
                {!charity.projectStarted && charity.targetAchieved ? <FaSeedling color="black"  size="2em"  /> : ''}
                {!charity.targetAchieved ? <FaSeedling color='silver' size="2em" /> : ''}
            </h3>
            <p>Target: {charity.target} €</p>
            <p>Received: {charity.donationsReceived} €</p>
            {!charity.projectStarted ? <Button color={!showInputField ? 'green' : 'ForestGreen'} text='Allocate Donations' onClick={() => setShowInputField(!showInputField)} /> : ''}
            {(charity.targetAchieved && !charity.projectStarted) ? <Button color='green' text='Start Project' onClick={() => confirmStartProject(charity.id)} /> : ''}
            
            {showInputField ? <InputForm onTransferFunds={onTransferFunds} onUndoTransfer={onUndoTransfer} charity={charity} /> : ''}
        </div>
    )
}

export default Charity