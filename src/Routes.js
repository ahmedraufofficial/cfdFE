import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { RequireAuth } from './components/RequireAuth';
import AddEvaluation from './pages/AddEvaluation';
import EditEvaluation from './pages/EditEvaluation'
import AddAuction from './pages/AddAuction';
import { useEffect, useState } from 'react';
import Appbar from './components/Appbar';
import EditAuction from './pages/EditAuction';
import Accounts from './pages/Accounts';
import Evaluations from './pages/Evaluations';
import Sidebar from './components/slidenavbar';
import Appointments from './pages/Appointment';
import Inspections from './pages/Inspections';
import Auctions from './pages/Auctions';
import EditInspection from './pages/EditInspection';
import AddImages from './pages/AddImages';
import AddUser from './pages/AddUser';
import Users from './pages/Users';
import EditUser from './pages/EditUser';

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
/*     
    const fetchAuctions = () => {
        fetch(`${process.env.REACT_APP_API}/auctions`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            console.log(data.data)
            setAuctions(data.data)
          })
    }

    useEffect(()=>{
        setInterval(fetchNegotiations, 4000)
        setInterval(fetchAuctions, 4000) 
    },[])
 */
    return (
      <>
      
        <Sidebar>
        <Appbar/>
        
        <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route exact path='/appointments' element={<RequireAuth><Appointments/></RequireAuth>} />
            <Route exact path='/inspections' element={<RequireAuth><Inspections/></RequireAuth>} />
            <Route exact path='/Auctions' element={<RequireAuth><Auctions/></RequireAuth>} />
            <Route exact path='/evaluation/add' element={<RequireAuth><AddEvaluation/></RequireAuth>} />
            <Route exact path='/evaluation/edit/:id' element={<RequireAuth><EditEvaluation/></RequireAuth>} />
            <Route exact path='/appointment/add/:id' element={<RequireAuth><EditEvaluation/></RequireAuth>} />
            <Route exact path='/appointment/add' element={<RequireAuth><AddEvaluation/></RequireAuth>} />
            <Route exact path='/appointment/edit/:id' element={<RequireAuth><EditEvaluation/></RequireAuth>} />
            <Route exact path='/inspection/add/:id' element={<RequireAuth><EditInspection/></RequireAuth>} />
            <Route exact path='/inspection/edit/:id' element={<RequireAuth><EditInspection/></RequireAuth>} />
            <Route exact path='/auction/add' element={<RequireAuth><AddAuction/></RequireAuth>} />
            <Route exact path='/auctions' element={<RequireAuth><Auctions auctions={auctions}/></RequireAuth>} />
            <Route exact path='/auction/edit/:id' element={<RequireAuth><EditAuction/></RequireAuth>} />
            <Route exact path='/accounts' element={<RequireAuth><Accounts/></RequireAuth>} />
            <Route exact path='/evaluations' element={<RequireAuth><Evaluations/></RequireAuth>} />
            <Route exact path='/add/images' element={<RequireAuth><AddImages/></RequireAuth>} />
            <Route exact path='/add/user' element={<RequireAuth><AddUser/></RequireAuth>} />
            <Route exact path='/edit/user/:id' element={<RequireAuth><EditUser/></RequireAuth>} />
            <Route exact path='/users' element={<RequireAuth><Users/></RequireAuth>} />
        </Routes>
        </Sidebar>
        </>
    )
};

export default AdminRoutes;