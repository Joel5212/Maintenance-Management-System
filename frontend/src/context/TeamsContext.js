import { createContext, useReducer } from 'react'

export const TeamsContext = createContext()

export const teamsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEAM':
            return {
                users: action.payload
            }
        case 'ADD_TEAM':
            return {
                users: [action.payload, ...state.teams]
            }
        case 'DELETE_TEAM':
            return {
                users: state.teams.filter(team => team._id !== action.payload._id)
            }
        case 'UPDATE_TEAM':
            return {
                teams: state.teams.map(team =>
                    team._id === action.payload._id ? action.payload : team
                )
            }
        default:
            return state
    }
}

export const UsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teamsReducer, {
        teams: null
    })

    return (
        <TeamsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TeamsContext.Provider>
    )
}