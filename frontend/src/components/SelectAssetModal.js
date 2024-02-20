import React, { useMemo, useState, useRef } from 'react';
import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { useLocation } from 'react-router-dom';
import { useAssetsContext } from "../hooks/useAssetsContext";
import { usePrevRouteContext } from "../hooks/usePrevRouteContext";
import { useAuthContext } from '../hooks/useAuthContext'

export const SelectAssetModal = ({ title, selectAsset, goBack }) => {
  const { assets, dispatch: assetsDispatch } = useAssetsContext()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
  const gridApiRef = useRef(null);
  const { user } = useAuthContext()
  const location = useLocation()
  const [error, setError] = useState(null)



  const fetchAssets = async () => {
    const response = await fetch('/api/assets', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      console.log('Fetched Assets', json)
      assetsDispatch({ type: 'SET_ASSETS', payload: json })
    }
  }

  useEffect(() => {
    if (prevRoute !== '/assets') {
      fetchAssets()
      console.log(prevRoute, assets)
    }
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [assetsDispatch, user])

  const columnDefs = [
    {
      headerName: 'Category',
      field: 'name',
      width: 130,
    },
  ]

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Name',
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

  const defaultColDef = {
    flex: 1 // or 'autoWidth'
  };

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  }

  const selectedAsset = () => {
    const gridApi = gridApiRef.current;
    if (gridApi) {
      const selectedAsset = gridApi.getSelectedRows()
      if (selectedAsset[0]) {
        selectAsset(selectedAsset[0])
      }
      else {
        setError('Select Asset')
      }
    }
  }

  return (
    <div className='select-asset-modal'>
      <div className='select-asset-modal-container'>
        <div className="ag-theme-alpine users">
          <div className="select-asset-modal-top">
            <button className='back-button' onClick={goBack}><ArrowBackIcon /></button>
            <h1>{title}</h1>
            <div className='invisible-back-button'></div>
          </div>
          <AgGridReact
            onGridReady={onGridReady}
            rowData={assets}
            treeData={true}
            columnDefs={columnDefs}
            getDataPath={getDataPath}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowSelection={'single'}
          />
        </div>

        <div className='bottom'>
          <button className='btn btn-effect select-asset-save-btn' onClick={selectedAsset}>Save</button>
          <div className="error-div">
            {error && <div className='error'>{error}</div>}
          </div>
        </div>

      </div>
    </div>
  )
}