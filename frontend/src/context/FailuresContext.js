import { createContext, useReducer } from 'react'

export const FailuresContext = createContext()

export const failuresReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FAILURES':
            return {
                failures: action.payload
            }
        case 'ADD_FAILURE':
            return {
                failures: [action.payload, ...state.failures]
            }
        case 'DELETE_FAILURE':
            console.log(action.payload)
            return {
                failures: state.failures.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_FAILURE':
            return {
                failures: state.failures.map(u =>
                    u._id === action.payload._id ? action.payload : u
                )
            }
        default:
            return state
    }
}

export const FailuresContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(failuresReducer, {
        failures: null
    })

    return (
        <FailuresContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FailuresContext.Provider>
    )
}