import { React, useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserActionEllipsis } from '../../components/UserActionEllipsis'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { NoItemsAvailable } from '../../components/NoItemsAvailable'

const ProceduresOfCategory = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const { categoryId, procedureType } = location.state
  const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
  const { user } = useAuthContext()

  useEffect(() => {
    if ((user && prevRoute !== '/categories' && prevRoute !== '/categories/procedures/add' && prevRoute !== '/categories/procedures/viewOrUpdate') || (user && !categories)) {
      fetchCategories()
    }
    else {
      setCategory(categories.find((category) => category._id === categoryId))
    }
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [categoriesDispatch, user])

  const onViewUpdate = async (procedureId) => {
    const procedure = procedureType === "repair" ?
      category.repairProcedures.find((repairProcedure) => repairProcedure._id === procedureId)
      : category.preventiveMaintenanceProcedures.find((preventiveMaintenanceProcedure) => preventiveMaintenanceProcedure._id === procedureId)

    console.log("PROCEDURE FOUNDDD", procedure)
    navigate('viewOrUpdate', { state: { category, procedure, procedureType } })
  }

  const onDelete = async (procedureId) => {

    if (!user) {
      return
    }

    const apiPath = procedureType === "repair" ? '/api/categories/deleteRepairProcedure/' + categoryId :
      '/api/categories/deletePreventiveMaintenanceProcedure/' + categoryId

    const response = await fetch(apiPath, {
      method: 'PATCH',
      body: JSON.stringify({ procedureId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {
      categoriesDispatch({ type: 'UPDATE_CATEGORY', payload: json })
      setCategory(json)
    }
    console.log(categories)
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
      setCategory(json.find((category) => category._id === categoryId))
      categoriesDispatch({ type: 'SET_CATEGORIES', payload: json })
    }
  }

  return (
    <div className='procedures'>
      <div className='procedures-header'>
        <Link to='/categories' className='procedures-back-btn-link'><button className='procedures-back-btn'><ArrowBackIcon /></button></Link>
        {procedureType === "repair" ? <h1 className='procedures-title'>Repair Procedures of Category {category ? category.categoryName : ''}</h1> :
          <h1 className='procedures-title'>Preventive Maintenance Procedures of Category {category ? category.categoryName : ''}</h1>}
        <div className="div-empty-space"></div>
        <button className="procedure-add-btn btn-effect" onClick={goToAddProcedure}>{procedureType === "repair" ? '+ New Repair Procedure' : "+ New PM Procedure"}</button>
      </div>
      <hr className='procedures-divider' />
      <div className='procedures-list'>
        {category && ((procedureType === "repair" && category.repairProcedures.length > 0) || (procedureType === "preventiveMaintenance" && category.preventiveMaintenanceProcedures.length > 0)) ?
          (procedureType === "repair" ? category.repairProcedures.map((repairProcedure) => (
            <div className='procedure-container' key={repairProcedure._id}>
              <div className="procedure-top">
                <div className='procedure-title'>
                  {repairProcedure.repairProcedureTitle}
                </div>
                <UserActionEllipsis onDelete={() => onDelete(repairProcedure._id)} onViewUpdate={() => onViewUpdate(repairProcedure._id)} />
              </div>
              <div className='procedure-description'>
                {repairProcedure.repairProcedureDescription}
              </div>
            </div>
          )) : category.preventiveMaintenanceProcedures.map((preventiveMaintenanceProcedure) => (
            <div className='procedure-container' key={preventiveMaintenanceProcedure._id}>
              <div className="procedure-top">
                <div className='procedure-title'>
                  {preventiveMaintenanceProcedure.preventiveMaintenanceProcedureTitle}
                </div>
                <UserActionEllipsis onDelete={() => onDelete(preventiveMaintenanceProcedure._id)} onViewUpdate={() => onViewUpdate(preventiveMaintenanceProcedure._id)} />
              </div>
              <div className='procedure-description'>
                {preventiveMaintenanceProcedure.preventiveMaintenanceProcedureDescription}
              </div>
            </div>
          ))) : <NoItemsAvailable itemName={"Procedures"} />}
      </div>
    </div>
  )
}

export default ProceduresOfCategory