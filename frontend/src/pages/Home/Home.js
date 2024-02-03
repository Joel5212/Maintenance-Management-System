import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
// components
import Sidebar from "../../components/Sidebar"
import Assets from '../Assets/Assets'
import AddAsset from '../Assets/AddAsset'
import AssetType from '../Assets/AssetType'
import Dashboard from '../Dashboard/Dashboard'
import Repairs from '../Repairs/Repairs'
import PreventiveMaintenance from '../PreventiveMaintenance/PreventiveMaintenance'
import Users from '../Users/Users'
import AddUser from '../Users/AddUser'
import ViewOrUpdateUser from '../Users/ViewOrUpdateUser'
import ViewOrUpdateAsset from '../Assets/ViewOrUpdateAsset'
import { UsersContextProvider } from '../../context/UsersContext';
import { AssetsContextProvider } from '../../context/AssetsContext';

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
              element={
                <AssetsContextProvider>
                  <Assets />
                </AssetsContextProvider>
              }
            />
            <Route
              path="/assets/assetType"
              element={
                <AssetsContextProvider>
                  <AssetType />
                </AssetsContextProvider>
              }
            />
            <Route
              path="/assets/viewOrUpdate"
              element={
                <AssetsContextProvider>
                  <ViewOrUpdateAsset />
                </AssetsContextProvider>
              }
            />
            <Route
              path="/assets/add"
              element={
                <AssetsContextProvider>
                  <AddAsset />
                </AssetsContextProvider>
              }
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