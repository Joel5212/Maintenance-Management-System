import { createContext, useReducer } from 'react'

export const RegisterContext = createContext()

export const registrationReducer = (state, action) => {
    switch (action.type) {
        case 'REGISTERED':
            return {
                isRegistered: true
            }
        case 'UNREGISTERED':
            return {
                isRegistered: false
            }
        default:
            return state
    }
}

export const OrgRegisterContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(registrationReducer, {
        isRegistered: false
    })

    return (
        <RegisterContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RegisterContext.Provider>
    )
}