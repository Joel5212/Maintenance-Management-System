import { createContext, useReducer } from 'react'

export const ProceduresContext = createContext()

export const proceduresReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROCEDURES':
            console.log(action.payload)
            return {
                procedures: action.payload
            }
        case 'ADD_PROCEDURE':
            return {
                procedures: [action.payload, ...state.procedures]
            }
        case 'DELETE_PROCEDURE':
            console.log(action.payload)
            return {
                procedures: state.procedures.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_PROCEDURE':
            return {
                procedures: state.procedures.map(u =>
                    u._id === action.payload._id ? action.payload : u
                )
            }
        default:
            return state
    }
}

export const ProceduresContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(proceduresReducer, {
        procedures: null
    })

    return (
        <ProceduresContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProceduresContext.Provider>
    )
}