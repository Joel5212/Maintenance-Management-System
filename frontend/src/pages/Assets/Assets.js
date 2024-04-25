import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useAssetsContext } from "../../hooks/useAssetsContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { AssetsActionEllipsis } from '../../components/AssetsActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal'

const Assets = () => {
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
  const { assets, dispatch: assetsDispatch } = useAssetsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDeleteAssetModal, setShowDeleteAssetModal] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState()
  const [deleteOption, setDeleteOption] = useState('')
  const [message, setMessage] = useState('')

  const onCancel = function () {
    setShowDeleteAssetModal(false)
  }

  const deleteAsset = function (asset) {
    if (!user) {
      return
    }

    setDeleteOption("deleteAsset")
    setMessage(`Are you sure you want to delete ${asset.name} along with its descending assets (if any)?`)
    setShowDeleteAssetModal(true)
    setAssetToDelete(asset)
  }

  const deleteAssetAndChildren = function (asset) {
    if (!user) {
      return
    }

    setDeleteOption("deleteAssetAndChildren")
    setMessage(`Are you sure you want to delete ${asset.name} along with its work orders (if any))?`)
    setShowDeleteAssetModal(true)
    setAssetToDelete(asset)
  }

  const onDelete = async (id) => {

    if (!user) {
      return
    }

    const response = await fetch('/api/assets/delete-asset' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {
      assetsDispatch({ type: 'DELETE_ASSET', payload: json })
    }

    setMessage('')
    setShowDeleteAssetModal(false)
    setAssetToDelete()
  }

  const onDeleteAssetAndChildren = async (id) => {

    if (!user) {
      return
    }

    const response = await fetch('/api/assets/delete-asset-and-children' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {
      assetsDispatch({ type: 'DELETE_ASSET_AND_CHILDREN', payload: json })
    }

    setShowDeleteAssetModal(false)
    setAssetToDelete()
  }

  const onViewUpdate = async (asset) => {
    navigate('viewOrUpdate', { state: { asset } })
  }

  const fetchAssets = async () => {
    const response = await fetch('/api/assets', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    console.log(json)
    if (response.ok) {
      assetsDispatch({ type: 'SET_ASSETS', payload: json })
    }
  }


  useEffect(() => {
    console.log("prevRoute", prevRoute)
    if (prevRoute !== '/assets/viewOrUpdate' && prevRoute !== '/assets/add' || !assets) {
      fetchAssets()
      console.log(prevRoute, assets)
    }
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [assetsDispatch, user])

  const defaultColDef = {
    flex: 1
  };

  const columnDefs = [
    {
      headerName: 'Category',
      field: 'category.name',
      width: 130,
    },
    {
      headerName: 'Location',
      field: 'location.name',
      width: 130,
    },
    {
      headerName: 'Actions',
      width: 130,
      cellRenderer: AssetsActionEllipsis,
      cellRendererParams: (params) => ({
        onDelete: () => deleteAsset(params.data),
        onDeleteAssetAndChildren: () => deleteAssetAndChildren(params.data),
        onViewUpdate: () => onViewUpdate(params.data)
      }),
    },
  ]

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Asset Name',
      cellRendererParams: {
        suppressCount: true
      },
      valueGetter: function (params) {
        return params.data.name
      },
    };
  }, []);

  const getDataPath = useMemo(() => {
    return (data) => {
      return data.assetPaths;
    };
  }, []);

  return (


    <div className="assets">
      {showDeleteAssetModal === false ?
        <div className="assets-container">
          <div className="assets-header">
            <h1 className="assets-title">Assets</h1>
            <div className="div-empty-space"></div>
            <Link to="/assets/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Asset</button></Link>
          </div>
          <div className="ag-theme-alpine users">
            <AgGridReact
              rowData={assets}
              treeData={true}
              columnDefs={columnDefs}
              getDataPath={getDataPath}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef}
            />
          </div>
        </div> :
        <div className='delete-asset-conf-div'>
          {console.log(assetToDelete.name)}
          <DeleteConfirmationModal assetToDelete={assetToDelete} message={`Are you sure you want to delete ${assetToDelete.name} along with its descending assets (if any)?`} onDelete={deleteOption == "deleteAsset" ? onDelete : onDeleteAssetAndChildren} onCancel={onCancel} />
        </div>}
    </div>

  )
}

export default Assets