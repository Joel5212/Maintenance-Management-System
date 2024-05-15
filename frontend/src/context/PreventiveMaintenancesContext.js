import { createContext, useReducer } from 'react'

export const PreventiveMaintenancesContext = createContext()

export const preventiveMaintenancesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PREVENTIVE':
            return {
                preventiveMaintenances: action.payload
            }
        case 'ADD_LOCATION':
            return {
                preventiveMaintenances: [action.payload.preventiveMaintenance, ...state.preventiveMaintenances]
            }
        case 'DELETE_PREVENTIVE':
            return {
                preventiveMaintenances: state.preventiveMaintenances.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_PREVENTIVE':
            return {
                preventiveMaintenances: state.preventiveMaintenances.map(u =>
                    u._id === action.payload._id ? action.payload : u
                )
            }
        default:
            return state
    }
}

export const PreventiveMaintenancesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(preventiveMaintenancesReducer, {
        preventiveMaintenances: null
    })

    return (
        <PreventiveMaintenancesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PreventiveMaintenancesContext.Provider>
    )
}