import './index.css'
import { useState,useEffect } from 'react'

const AllTransactions = ()=>
{
    const [transactionsList,updateList] = useState([]);
    useEffect(()=>
    {
      const fetchFucntion= async()=>
      {
        const response = await fetch('https://sensibletassignment-backend.onrender.com/alltransactions');
        if(response.ok)
        {
            const AllTransactions =await response.json();
            updateList(AllTransactions)
            console.log(AllTransactions)
        }
      }
      fetchFucntion();
    },[])
    return (
        <div className='transactions-container'>
                <h4>All Transactions :</h4>
              {transactionsList.length>0 ?(
                        <table>
                            <tr>
                                <th>Transaction Id</th>
                                <th>UserId</th>
                                <th>Amount</th>
                                <th>Transaction Type</th>
                                <th>Date and Time</th>
                                <th>Status</th>
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
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    ):(<p>No Transactions</p>)
            }
            </div>
    )
}
export default AllTransactions
