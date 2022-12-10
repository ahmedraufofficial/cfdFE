import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { RequireAuth } from './components/RequireAuth';
import AddEvaluation from './pages/AddEvaluation';
import EditVehicle from './pages/EditVehicle'
import AddAuction from './pages/AddAuction';
import AddImages from './pages/AddImages';
import Auctions from './pages/Auctions';
import Negotiations from './pages/Negotiations';
import Invoices from './pages/Invoices';
import { useEffect, useState } from 'react';
import Appbar from './components/Appbar';
import EditAuction from './pages/EditAuction';
import Accounts from './pages/Accounts';
import Evaluations from './pages/Evaluations';

const AdminRoutes = () => {

    const [negotiations, setNegotiations] = useState([])
    const [auctions, setAuctions] = useState([])
    const [negotiationsCount, setNegotiationsCount] = useState()

    const fetchNegotiations = () => {
        fetch(`${process.env.REACT_APP_API}/prenegotiations`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setNegotiations(data.data)
          var count = 0;
          data.data.map((item)=>(
            item.Buy_Now_Price ? null : count = count + 1
          ));
          setNegotiationsCount(count);
        })
    }
    
    const fetchAuctions = () => {
        fetch(`${process.env.REACT_APP_API}/auctions`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setAuctions(data.data)
          })
    }

    useEffect(()=>{
        setInterval(fetchNegotiations, 4000)
        setInterval(fetchAuctions, 4000)
    },[])

    return (
      <>
        <Appbar data={negotiationsCount} />
        <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route exact path='/evaluation/add' element={<RequireAuth><AddEvaluation/></RequireAuth>} />
            <Route exact path='/vehicle/edit/:id' element={<RequireAuth><EditVehicle/></RequireAuth>} />
            <Route exact path='/auction/add' element={<RequireAuth><AddAuction/></RequireAuth>} />
            <Route exact path='/auctions' element={<RequireAuth><Auctions auctions={auctions}/></RequireAuth>} />
            <Route exact path='/auction/edit/:id' element={<RequireAuth><EditAuction/></RequireAuth>} />
            <Route exact path='/negotiations' element={<RequireAuth><Negotiations negotiations={negotiations}/></RequireAuth>} />
            <Route exact path='/images/add' element={<RequireAuth><AddImages/></RequireAuth>} />
            <Route exact path='/invoices' element={<RequireAuth><Invoices/></RequireAuth>} />
            <Route exact path='/accounts' element={<RequireAuth><Accounts/></RequireAuth>} />
            <Route exact path='/evaluations' element={<RequireAuth><Evaluations/></RequireAuth>} />
        </Routes>
        </>
    )
};

export default AdminRoutes;