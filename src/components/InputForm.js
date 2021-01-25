import React, { useState } from "react";
import TransferHistory from './TransferHistory'

const InputForm = ({ onTransferFunds, charity, onUndoTransfer }) => {
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferHistory, setTransferHistory] = useState([]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (transferAmount <= 0 || typeof transferAmount === 'undefined' || transferAmount.isNaN) {
            alert("Please enter valid amount to transfer")
            return;
        }
        onTransferFunds(charity.id, parseInt(transferAmount))
        setTransferHistory([...transferHistory, transferAmount])
        setTransferAmount(0)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Amount to transfer: &nbsp;
                <input
                    type="number"
                    value={transferAmount > 0 ? transferAmount : ''}
                    onChange={e => setTransferAmount(e.target.value)}
                    autoFocus 
                    onFocus={e => e.currentTarget.select()}
                />
            </label>
            <input className='input' type="submit" value="Transfer" />
            {typeof charity.transferHistory !== 'undefined' && charity.transferHistory.length > 0 ? 'Transfer history' : ''}
            {charity.hasOwnProperty('transferHistory') ? charity.transferHistory.map((transfer, index) => (
                <TransferHistory key={index} index={index} charityId={charity.id} transferAmount={transfer} onUndoTransfer={onUndoTransfer} />
            )) : ''}
        </form> 
    )
}

export default InputForm