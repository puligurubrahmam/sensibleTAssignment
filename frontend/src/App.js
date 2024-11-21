import './App.css';
import Users from './Users';
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import CreateUser from './CreateUser';
import UserTransactions from './UserTransactions';
import AddTransaction from './AddTransaction';
import AllTransactions from './AllTransactions';
import UpdateTransaction from './UpdateTransaction';
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Users}/>
        <Route exact path='/adduser' component={CreateUser}/>
        <Route exact path='/alltransactions' component={AllTransactions}/>
        <Route exact path='/user/:id' component={UserTransactions}/>
        <Route exact path='/user/:id/addtransaction' component={AddTransaction}/>
        <Route exact path='/user/:userId/transaction/:id' component={UpdateTransaction}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
