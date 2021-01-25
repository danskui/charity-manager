import Charity from './Charity'

const Charities = ({ charities, onStart, onTransferFunds, onUndoTransfer }) => {
    return (
        <>
            {charities.map((charity, index) => (
                <Charity key={index} charity={charity} onStart={onStart} onTransferFunds={onTransferFunds} onUndoTransfer={onUndoTransfer} />
            ))}
        </>
    )
}

export default Charities
