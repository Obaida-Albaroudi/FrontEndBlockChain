import React, {useEffect, useState}from 'react';
import axios from "axios";
import './App.css';

const App = ()=> {
  const [mine, setMine]=useState({
    id: "",
    proof: 0,
  })
  const [returnedFromMine, setReturnedFromMine] = useState()
  const [transaction, setTransaction]= useState({
    sender: mine.id,
    recipient: "",
    amount: 0, 
  })
  const [Wallet, setWallet] = useState(0)

  useEffect(()=>{
 

  })
  let MinehandleChanges = e => {
    setMine({...mine,
        [e.target.name]: e.target.value
    });
};
let TransactionHandleChanges = e => {
  setTransaction({...transaction,
      [e.target.name]: e.target.value
  });
};
let StartMine= (e) =>{
  e.preventDefault()
  axios.post("http://localhost:5000/chain", mine)
  .then(res=>{
    console.log(res.data)
    setReturnedFromMine(res.data)
    if (returnedFromMine["message"] == 'New Block Forged'){
      console.log("amount", returnedFromMine["new_block"]["transactions"]["amount"])
      setWallet(Wallet+=returnedFromMine["new_block"]["transactions"]["amount"])
    }
  }).catch(err=> console.log(err))
}
let stopMine= (e) =>{
  setMine()
  e.preventDefault()
  axios.post("http://localhost:5000/mine", mine)
  .then(res=>{
    console.log(res.data)
    setReturnedFromMine(res.data)
  }).catch(err=> console.log(err))
}
let SendTransaction= (e) =>{
  e.preventDefault()
  axios.post("http://localhost:5000/transactions/new", transaction)
  .then(res=>{
    console.log(res.data)
    if(res.data["message"]!=="Missing values"){
      if(transaction.recipient){
        setWallet(Wallet-transaction.amount)
      }
    }
  }).catch(err=> console.log(err))
}
  return (
    <div className="App">
      <header className="App-header">
       <input type="text" name="id" value={mine.id} onChange={MinehandleChanges} placeholder="Name" />
       <input type="number" name="proof" value={mine.proof} onChange={MinehandleChanges} placeholder="Proof" />
       <button onClick={StartMine}>Start Mining</button>
       <br>
       </br>
       <input type="text" name="recipient" value={transaction.recipient} onChange={TransactionHandleChanges} placeholder="Recipient" />
       <input type="number" name="amount" value={transaction.amount} onChange={TransactionHandleChanges} placeholder="Amount" />
       <button onClick={SendTransaction}>Commit Transaction</button>

       <button onClick={stopMine}>Stop Mining</button>
        <p>
          {Wallet}
        </p>
      </header>
    </div>
  );
}

export default App;
