import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
// components
import Sidebar from "../../components/Sidebar"
import Assets from '../Assets/Assets'
import Dashboard from '../Dashboard/Dashboard'
import Repairs from '../Repairs/Repairs'
import PreventiveMaintenance from '../PreventiveMaintenance/PreventiveMaintenance'
import Users from '../Users/Users'
import AddUser from '../Users/AddUser'
import ViewOrUpdateUser from '../Users/ViewOrUpdateUser'
import { UsersContextProvider } from '../../context/UsersContext';

const Home = () => {
  return (
    <div className="home">
      <BrowserRouter >
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="pages">
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/assets"
              element={<Assets />}
            />
            <Route
              path="/repairs"
              element={<Repairs />}
            />
            <Route
              path="/preventiveMaintenance"
              element={<PreventiveMaintenance />}
            />
            <Route
              path="/users"
              element=
              {
                <UsersContextProvider>
                  <Users />
                </UsersContextProvider>
              }
            />
            <Route
              path="/users/add"
              element=
              {
                <UsersContextProvider>
                  <AddUser />
                </UsersContextProvider>
              }
            />
            <Route
              path="/users/viewOrUpdate"
              element={
                <UsersContextProvider>
                  <ViewOrUpdateUser />
                </UsersContextProvider>
              }
            />
          </Routes>
        </div>
      </BrowserRouter >
    </div >
  )
}

export default Home