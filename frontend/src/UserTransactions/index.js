import './index.css'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const apiStatus = {
    success:'SUCCESS',
    failure:'FAILURE',
    loading:'LOADING'
}
const UserTransactions =(props)=>
{
    const {match} = props;
    const {params} = match;
    const {id} = params;
    const [activeStatus,setActiveStatus] = useState('');
    const [name,setName] = useState('')
    const [transactionsList,setTransactionsList] = useState([]);
    const [error,setError] = useState('');
    const updateTransactionFunction =(transactionId)=>
    {
        const {history} = props
        history.push(`/user/${id}/transaction/${transactionId}`)
    }
    useEffect(()=>
    {
        const fetchTransactions = async () =>
        {
            setActiveStatus(apiStatus.loading)
            const response = await fetch(`https://sensibletassignment-backend.onrender.com/user/${id}`);
            if(response.ok)
            {
                const data = await response.json()
                setActiveStatus(apiStatus.success);
                setName(data.name)
                setTransactionsList(data.transactionsList)
            }
            else
            {
                const data = await response.json()
                setActiveStatus(apiStatus.failure)
                setError(data.error);
            }
        }
        fetchTransactions()
    },[])
    const successView = () =>
    {
        return (
            <div>
                <nav className='nav-bar'>
                <span className='name'>Name : {name}</span>
                <Link to={`${id}/addtransaction`}><button className='add-transaction-btn'>Add Transaction</button></Link>
            </nav>
            <div className='transactions-container'>
                <h4>Transactions :</h4>
              {transactionsList.length>0 ?(
                        <table>
                            <tr>
                                <th>Transaction Id</th>
                                <th>UserId</th>
                                <th>Amount</th>
                                <th>Transaction Type</th>
                                <th>Date and Time</th>
                                <th>Status</th>
                                <th>Update</th>
                            </tr>
                            {
                                transactionsList.map((item)=>
                                {
                                    return (
                                        <tr>
                                            <td>{item.id}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.amount}</td>
                                            <td>{item.transactionType}</td>
                                            <td>{item.timestamp}</td>
                                            <td>{item.status}</td>
                                            <td><button onClick={()=>{updateTransactionFunction(item.id)}}>update</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    ):(<p>No Transactions</p>)
            }
            </div>
        </div>
        )
    }
    const loadingView =()=>
    {
        return (
            <div>
                <nav className='nav-bar'>
                <span className='name'>Name : {name}</span>
                <Link to={`${id}/addtransaction`}><button className='add-transaction-btn'>Add Transaction</button></Link>
            </nav>
            <div className='loader'>

            </div>
            </div>
            
        )
    }
    const failureView=()=>
    {
        return (
            <div className='failure'>
                <h1>{error}</h1>
            </div>
        )
    }
    const activeView = () =>
    {
        switch (activeStatus)
        {
            case apiStatus.success:
                return successView();
            case apiStatus.loading:
                return loadingView();
            case apiStatus.failure:
                return failureView();
        }
    }
    return (
        <div>
            {
                activeView()
            }
        </div>
    )
}

export default UserTransactions
