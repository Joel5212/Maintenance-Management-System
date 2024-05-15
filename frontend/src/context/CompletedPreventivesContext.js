import { createContext, useReducer } from 'react'

export const CompletedPreventivesContext = createContext()

export const completedPreventivesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COMPLETED_PREVENTIVES':
            return {
                completedPreventives: action.payload
            }
        case 'DELETE_COMPLETED_PREVENTIVE':
            return {
                completedPreventives: state.completedPreventives.filter(u => u._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const CompletedPreventivesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(completedPreventivesReducer, {
        completedPreventives: null
    })

    return (
        <CompletedPreventivesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CompletedPreventivesContext.Provider>
    )
}
