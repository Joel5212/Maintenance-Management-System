import { React, useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FailureActionEllipsis } from '../../components/FailureActionEllipsis'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useFailuresContext } from "../../hooks/useFailuresContext";
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { NoItemsAvailable } from '../../components/NoItemsAvailable'

const FailuresOfCategory = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { category } = location.state
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
    const { failures, dispatch: failuresDispatch } = useFailuresContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const { user } = useAuthContext()

    useEffect(() => {
        console.log(prevRoute)
        if ((user && prevRoute !== '/categories' && prevRoute !== '/categories/failures/add' && prevRoute !== '/categories/failures/viewOrUpdate') || (user && !categories)) {
            fetchCategories()
        }

        if ((user && prevRoute !== '/categories/failures/add' && prevRoute !== '/categories/failures/viewOrUpdate') || (user && !failures)) {
            fetchFailuresOfCategory()
        }

        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [failuresDispatch, user])

    const onViewUpdate = async (failure) => {
        navigate('viewOrUpdate', { state: { category, failure } })
    }

    const onDelete = async (failureId) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/failures/' + failureId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            failuresDispatch({ type: 'DELETE_FAILURE', payload: json })
        }
    }

    const goToAddFailure = async () => {
        navigate('/categories/failures/add', { state: { category } })
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

    const fetchFailuresOfCategory = async () => {
        console.log(category)
        const response = await fetch('/api/failures/' + category._id, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        console.log(json)

        if (response.ok) {
            failuresDispatch({ type: 'SET_FAILURES', payload: json })
        }
    }

    return (
        <div className='failures'>
            <div className='failures-header'>
                <Link to='/categories' className='failures-back-btn-link'><button className='failures-back-btn'><ArrowBackIcon /></button></Link>
                <h1 className='failures-title'>Failures of Category {category ? category.name : ''}</h1>
                <div className="div-empty-space"></div>
                <button className="failures-add-btn btn-effect" onClick={goToAddFailure}>+ Add Failure</button>
            </div>
            <hr className='failures-divider' />
            <div className='failures-list'>
                {(failures && failures.length > 0) ?
                    failures.map((failure) => (
                        <div className='failures-container' key={failure._id}>
                            <div className="failures-top">
                                <div className='failures-container-title'>
                                    {failure.title}
                                </div>
                                <FailureActionEllipsis onDelete={() => onDelete(failure._id)} onViewUpdate={() => onViewUpdate(failure)} />
                            </div>
                            <div className='failure-field-container'>
                                <div className='failure-field-title'>Observation</div>
                                <div className='failure-field-description'> {failure.observation}</div>
                            </div>
                            <div className='failure-field-container'>
                                <div className='failure-field-title'>Cause</div>
                                <div className='failure-field-description'> {failure.cause}</div>
                            </div>
                            {failure.procedure || (failure.procedureTitle && failure.procedureDescription) ?
                                <div className='failure-field-container'>
                                    <div className='failure-field-title'> Procedure </div>
                                    <div className='failure-field-description'>{failure.procedure ? failure.procedure.description : failure.procedureDescription}</div>
                                    <div />
                                </div> : ""}
                            <div />
                        </div>
                    )) : <NoItemsAvailable itemName={"Failures"} />}
            </div>
        </div>
    )
}

export default FailuresOfCategory