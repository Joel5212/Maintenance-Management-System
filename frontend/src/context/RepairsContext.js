import { createContext, useReducer } from 'react'

export const RepairsContext = createContext()


export const repairsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REPAIRS':
            return {
                repairs: action.payload
            }
        case 'ADD_REPAIR':
            const newRepair = action.payload;
            newRepair.asset = action.asset;
            // newRepair.startDate = action.unformattedStartDate;
            // newRepair.dueDate = action.unformattedDueDate
            // newRepair.failureDate = action.unformattedFailureDate
            if (action.userIdAndName._id && action.userIdAndName.name) {
                newRepair.assignedUser = action.userIdAndName;
            }

            if (action.teamIdAndName._id && action.teamIdAndName.name) {
                newRepair.assignedTeam = action.teamIdAndName;
            }
            return {
                repairs: [newRepair, ...state.repairs]
            }
        case 'DELETE_REPAIR':
            return {
                repairs: state.repairs.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_REPAIR':
            return {
                repairs: state.repairs.map(u =>
                    u._id === action.payload._id ? action.payload : u
                )
            }
        default:
            return state
    }
}

export const RepairsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(repairsReducer, {
        repairs: null
    })

    return (
        <RepairsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RepairsContext.Provider>
    )
}