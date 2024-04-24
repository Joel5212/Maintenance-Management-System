import { createContext, useReducer } from 'react'

export const TeamsContext = createContext()

export const teamsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEAMS':
            return {
                teams: action.payload
            }
        case 'ADD_TEAM':
            const newTeam = { _id: action.payload._id, name: action.payload.name, users: action.userIdsAndNames, description: action.payload.description }
            return {
                teams: [newTeam, ...state.teams]
            }
        case 'DELETE_TEAM':
            return {
                teams: state.teams.filter(team => team._id !== action.payload._id)
            }
        case 'UPDATE_TEAM':
            const updatedTeam = { _id: action.payload._id, name: action.payload.name, users: action.userIdsAndNames, description: action.payload.description }
            return {
                teams: state.teams.map(team =>
                    team._id === action.payload._id ? updatedTeam : team
                )
            }
        default:
            return state
    }
}

export const TeamsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teamsReducer, {
        teams: null
    })

    return (
        <TeamsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TeamsContext.Provider>
    )
}