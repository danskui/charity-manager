import Header from './components/Header'
import Charities from './components/Charities'
import { useState, useEffect } from 'react'

function App() {
  const [charities, setCharities] = useState([])
  const [startedCharities, setStartedCharities] = useState([])
  const [availableFunds, setAvailableFunds] = useState(0)
  const [totalDonations, setTotalDonations] = useState(0)

  useEffect(() => {
    const getCharities = async () => {
      const charitiesFromServer = await fetchCharities()
      const donationsFromServer = await fetchDonations()
      setCharities(addDonationsToCharities(charitiesFromServer, donationsFromServer))
    }

    const getAvailableFunds = async () => {
      let funds = 0;
      const donationsFromServer = await fetchDonations()
      const donationsWithoutTarget = donationsFromServer.filter((donation) => !donation.target)
      donationsWithoutTarget.forEach((donation) => funds += donation.sum)
      setAvailableFunds(funds)
    }

    const getTotalDonations = async () => {
      let totalDonations = 0;
      const donationsFromServer = await fetchDonations()
      donationsFromServer.forEach((donation) => totalDonations += donation.sum)
      setTotalDonations(totalDonations)
    }

    const addDonationsToCharities = (charities, donations) => {
      const charitiesWithDonations = []
      charities.forEach((charity) => {
        donations.forEach(donation => {
          if (donation.target === charity.id) {
            charity.donationsReceived += donation.sum
          } else if (typeof charity.donationsReceived === 'undefined') {
            charity.donationsReceived = 0;
          }
        })
        charitiesWithDonations.push(setTargetAchievedProperty(charity))
      })
      return charitiesWithDonations
    }

    getCharities()
    getAvailableFunds()
    getTotalDonations()
  }, [])

  const fetchCharities = async () => {
    const res = await fetch('https://d27jptknt5oqao.cloudfront.net/kesatyo_projektit.json')
    const data = await res.json()

    return data
  }

  const fetchDonations = async () => {
    const res = await fetch('https://d27jptknt5oqao.cloudfront.net/kesatyo_lahjoitukset.json')
    const data = await res.json()

    return data
  }

  const setTargetAchievedProperty = (charity) => {
    if (charity.donationsReceived >= charity.target) {
      return { ...charity, targetAchieved: true }
    } else {
      return { ...charity, targetAchieved: false }
    }
  }

  const startCharity = (id) => {
    let charityToStart = charities.find(charity => charity.id === id)
    charityToStart = { ...charityToStart, projectStarted: true }
    setCharities(charities.filter(charity => charity.id !== id))
    setStartedCharities(startedCharities => [...startedCharities, charityToStart]);
  }

  const transferFunds = (id, amount) => {
    if (availableFunds - amount < 0) {
      alert("Not enough funds available")
      return
    }
    if (!charities.find(charity => charity.id === id).hasOwnProperty('transferHistory')) {
      setCharities(
        charities.map(charity => charity.id === id ? 
          setTargetAchievedProperty({
            ...charity, 
            transferHistory: [amount], 
            donationsReceived: charity.donationsReceived + amount 
          })
          : charity
    ))}
    else {  
      setCharities(
        charities.map(charity => charity.id === id ? 
          setTargetAchievedProperty({ 
            ...charity, 
            transferHistory: [...charity.transferHistory, amount], 
            donationsReceived: charity.donationsReceived + amount 
          })
            : charity
      ))}
    setAvailableFunds(availableFunds - amount)
  }

  const undoTransfer = (id, index) => {
    const undoAmount = charities.find(charity => charity.id === id).transferHistory[index]
    setCharities(
      charities.map(charity => charity.id === id ? 
        setTargetAchievedProperty(
          { ...charity, 
            donationsReceived: charity.donationsReceived - undoAmount, 
            transferHistory: charity.transferHistory.filter((transfer, transferIndex) => index !== transferIndex) })
        : charity
    ))
    setAvailableFunds(availableFunds + undoAmount)
  }

  return (
    <div className="container">
      <Header />
      <h2>Total donations: {totalDonations} €</h2>
      <h2>Unallocated donations: {availableFunds} €</h2>
      <Header title={'Planned charity projects for 2021'}/>
      {charities.length > 0 ? <Charities charities={charities} onStart={startCharity} onTransferFunds={transferFunds} onUndoTransfer={undoTransfer} /> : 'No planned charities for this year' }
      <Header title={'Started Charity Projects'} />
      {startedCharities.length > 0 ? <Charities charities={startedCharities} /> : 'No charity projects started'}
    </div>
  );
}

export default App;
