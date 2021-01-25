import { FaUndo } from 'react-icons/fa'

const TransferHistory = ({ charityId, index, transferAmount, onUndoTransfer }) => {

    return (
        <p className="transfer-history" onClick={() => onUndoTransfer(charityId, index)}>
            {transferAmount} €  <FaUndo color='orangered' size="1em" />
        </p>
    )
}

export default TransferHistory