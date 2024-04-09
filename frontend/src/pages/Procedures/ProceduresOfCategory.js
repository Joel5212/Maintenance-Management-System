import { React, useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserActionEllipsis } from '../../components/UserActionEllipsis'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useProceduresContext } from "../../hooks/useProceduresContext";
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { NoItemsAvailable } from '../../components/NoItemsAvailable'

const ProceduresOfCategory = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { category, procedureType } = location.state
  const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
  const { procedures, dispatch: proceduresDispatch } = useProceduresContext()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
  const { user } = useAuthContext()

  useEffect(() => {
    if ((user && prevRoute !== '/categories' && prevRoute !== '/categories/procedures/add' && prevRoute !== '/categories/procedures/viewOrUpdate') || (user && !categories)) {
      fetchCategories()
    }

    if (user && prevRoute !== '/categories/procedures/add' && prevRoute !== '/categories/procedures/viewOrUpdate' || (user && !procedures)) {
      fetchProceduresOfCategory()
    }

    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [proceduresDispatch, user])

  const onViewUpdate = async (procedureId) => {
    const procedure = procedures.find((repairProcedure) => repairProcedure._id === procedureId)
    navigate('viewOrUpdate', { state: { category, procedure, procedureType } })
  }

  const onDelete = async (procedureId) => {

    if (!user) {
      return
    }

    const response = await fetch(procedureType === "repair" ? '/api/repairProcedures/' + procedureId :
      '/api/preventiveMaintenanceProcedures/' + procedureId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {
      proceduresDispatch({ type: 'DELETE_PROCEDURE', payload: json })
    }
  }

  const goToAddProcedure = async () => {
    navigate('/categories/procedures/add', { state: { category, procedureType } })
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/categories', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      categoriesDispatch({ type: 'SET_CATEGORIES', payload: json })
    }
  }

  const fetchProceduresOfCategory = async () => {
    const response = await fetch(procedureType === "repair" ? '/api/repairProcedures/' + category._id : '/api/preventiveMaintenanceProcedures/' + category._id, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      proceduresDispatch({ type: 'SET_PROCEDURES', payload: json })
    }
  }

  return (
    <div className='procedures'>
      <div className='procedures-header'>
        <Link to='/categories' className='procedures-back-btn-link'><button className='procedures-back-btn'><ArrowBackIcon /></button></Link>
        {procedureType === "repair" ? <h1 className='procedures-title'>Repair Procedures of Category {category ? category.name : ''}</h1> :
          <h1 className='procedures-title'>Preventive Maintenance Procedures of Category {category ? category.name : ''}</h1>}
        <div className="div-empty-space"></div>
        <button className="procedure-add-btn btn-effect" onClick={goToAddProcedure}>{procedureType === "repair" ? '+ New Repair Procedure' : "+ New PM Procedure"}</button>
      </div>
      <hr className='procedures-divider' />
      <div className='procedures-list'>
        {(procedures && procedures.length > 0) ?
          procedures.map((procedure) => (
            <div className='procedure-container' key={procedure._id}>
              <div className="procedure-top">
                <div className='procedure-title'>
                  {procedure.title}
                </div>
                <UserActionEllipsis onDelete={() => onDelete(procedure._id)} onViewUpdate={() => onViewUpdate(procedure._id)} />
              </div>
              <div className='procedure-description'>
                {procedure.description}
              </div>
            </div>
          )) : <NoItemsAvailable itemName={"Procedures"} />}
      </div>
    </div>
  )
}

export default ProceduresOfCategory