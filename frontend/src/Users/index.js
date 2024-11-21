import './index.css'
import { useState } from 'react'
import {Link} from 'react-router-dom'
const Users = (props) =>
{
    const [userId,setUserid] = useState(0);
    const getUser = (event) =>
    {
        event.preventDefault();
        const {history} = props;
        history.push(`/user/${userId}`);
    }
    return (
        <div className='container'>
            <nav className='nav-bar'>
                <span>SensibleT</span>
                <div>
                    <Link to='adduser' className='link'><span className='span-item'>CreateUser</span></Link>
                    <Link to='alltransactions' className='link'><span>AllTransactions</span></Link>
                </div>
            </nav>
            <div className='main-container'>
                <h1 className='user-transactions-head'>User Transactions</h1>
                <form className='form-container' onSubmit={getUser}>
                    <label htmlFor='userId' className='label-item'>UserId</label>
                    <input id='userId' placeholder='Enter UserId' className='input-item' onChange={(event)=>{setUserid(event.target.value)}}/>
                    <button className='get-btn' onClick={getUser}>get</button>
                </form>
            </div>
        </div>
    )
}

export default Users