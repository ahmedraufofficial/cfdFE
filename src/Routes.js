import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { RequireAuth } from './components/RequireAuth';
import AddVehicle from './pages/AddVehicle';
import Vehicles from './pages/Vehicles';
import EditVehicle from './pages/EditVehicle'
import AddAuction from './pages/AddAuction';
import AddImages from './pages/AddImages';
import Auctions from './pages/Auctions';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route exact path='/vehicle/add' element={<RequireAuth><AddVehicle/></RequireAuth>} />
            <Route exact path='/vehicle/edit/:id' element={<RequireAuth><EditVehicle/></RequireAuth>} />
            <Route exact path='/vehicles' element={<RequireAuth><Vehicles/></RequireAuth>} />
            <Route exact path='/auction/add' element={<RequireAuth><AddAuction/></RequireAuth>} />
            <Route exact path='/auctions' element={<RequireAuth><Auctions/></RequireAuth>} />
            <Route exact path='/images/add' element={<RequireAuth><AddImages/></RequireAuth>} />
        </Routes>
    )
};

export default AdminRoutes;