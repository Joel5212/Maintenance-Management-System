import { createContext, useReducer } from 'react'

export const LocationsContext = createContext()

export const locationsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOCATIONS':
            return {
                locations: action.payload
            }
        case 'ADD_LOCATION':
            return {
                locations: [action.payload.location, ...state.locations]
            }
        case 'DELETE_LOCATION':
            return {
                locations: state.locations.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_LOCATION':
            return {
                locations: state.locations.map(u =>
                    u._id === action.payload._id ? action.payload : u
                )
            }
        default:
            return state
    }
}

export const LocationsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(locationsReducer, {
        locations: null
    })

    return (
        <LocationsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </LocationsContext.Provider>
    )
}