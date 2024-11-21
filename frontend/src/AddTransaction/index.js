import './index.css'
import { useState } from 'react';

const AddTransaction =(props)=>
{
    const [amount,setAmount] = useState(0);
    const [transactionType,setTransactionsType] = useState('WITHDRAWAL');
    const [status,setStatus] = useState('PENDING');
    const [msg,setMsg] = useState('')
    const [errorOccured,setError] = useState(false)
    const {match} = props;
    const {params} = match;
    const {id} = params;
    const userId = parseInt(id);
    const AddTransactionClicked = (event)=>
    {
        event.preventDefault();
        const fetchFunction = async ()=>
        {
            const option = {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    userId,
                    amount,
                    transactionType,
                    status
                })
            }
            console.log(option.body)
            const response = await fetch(`http://localhost:5000/transaction`,option)
            if(response.ok)
            {
                
                const data = await response.json()
                console.log(data)
                setError(false)
                setMsg(data.success)
                setAmount(0)
                const {history} = props
                history.replace(`/user/${id}`)
            }
            else
            {
                const data = await response.json();
                setMsg(data.error)
                setError(true)
            }
        }
        fetchFunction();
    }
    return (
        <div className='transaction-container'>
            <h1>Add Transaction</h1>
            <form className='form-container' onSubmit={AddTransactionClicked}>
                <label htmlFor='amount'>Amount</label>
                <input value={amount} id='amount' className='input-items' placeholder='Enter Amount' onChange={(event)=>{setAmount(event.target.value)}}/>
                <label htmlFor='type'>Transaction Type</label>
                <select value={transactionType} id='type' className='input-items' onChange={(event)=>{setTransactionsType(event.target.value)}}>
                    <option value='WITHDRAWAL'>WITHDRAWAL</option>
                    <option value='DEPOSIT'>DEPOSIT</option>
                </select>
                <label htmlFor='status'>Status</label>
                <select value={status} id='status' className='input-items' onChange={(event)=>{setStatus(event.target.value)}}>
                    <option value='PENDING'>PENDING</option>
                    <option value='COMPLETED'>COMPLETED</option>
                    <option value='FAILED'>FAILED</option>
                </select>
                <button className='add-transaction' onClick={AddTransactionClicked}>AddTransaction</button>
                <p className={errorOccured?'error':'success'}>{msg}</p>
            </form>
        </div>
    )
}
export default AddTransaction