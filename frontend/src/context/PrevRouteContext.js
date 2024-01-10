import { createContext, useReducer } from 'react'

export const PrevRouteContext = createContext()

export const prevRouteReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PREV_ROUTE':
            return { prevRoute: action.location }
        default:
            return state
    }
}

export const PrevRouteContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(prevRouteReducer, {
        prevRoute: null
    })

    return (
        <PrevRouteContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PrevRouteContext.Provider>
    )
}


