import { createContext, useReducer } from 'react'

export const CompletedRepairsContext = createContext()

export const completedRepairsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COMPLETED_REPAIRS':
            return {
                completedRepairs: action.payload
            }
        case 'DELETE_REPAIR':
            return {
                completedRepairs: state.repairs.filter(u => u._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const CompletedRepairsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(completedRepairsReducer, {
        completedRepairs: null
    })

    return (
        <CompletedRepairsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CompletedRepairsContext.Provider>
    )
}
