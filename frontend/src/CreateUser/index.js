import './index.css'
import {useState} from 'react'
const CreateUser = (props) =>
{
    const [name,setName] = useState('')
    const [aadhar,setAadhar] = useState('')
    const [msg,setMsg] = useState('')
    const [errorOccured,setErrorOccured] = useState(false);
    const addUser = (event) =>
    {
        event.preventDefault();
        const fetchFucntion = async ()=>
        {
            const option = {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name,aadhar
                })
            }
            const response = await fetch('https://sensibletassignment-backend.onrender.com',option);
            if(response.ok)
            {
                const data = await response.json();
                setMsg(data.success)
                setErrorOccured(false)
                setName('');
                setAadhar('');
                setTimeout(()=>
                {
                    const {history} = props
                    history.replace('/');
                },2000)
            }
            else
            {
                const data = await response.json();
                setMsg(data.error);
                setErrorOccured(true);
            }
        }
        fetchFucntion();
    }
    return (
        <div className='create-user-container'>
                <h1>Create User</h1>
                <form className='form-container' onSubmit={addUser}>
                    <label htmlFor='name'>Name of the User</label>
                    <input value={name} id='name' placeholder='Enter User Name' className='input-item' onChange={(event)=>{setName(event.target.value)}}/>
                    <label htmlFor='aadhar'>Aadhar Number</label>
                    <input value={aadhar} id='aadhar' placeholder='Enter Aadhar Number' className='input-item' onChange={(event)=>{setAadhar(event.target.value)}}/>
                    <p className={errorOccured?'error':'success'}>{msg}</p>
                    <button className='create-btn' onClick={addUser}>Create</button>
                </form>
        </div>
    )
}

export default CreateUser
