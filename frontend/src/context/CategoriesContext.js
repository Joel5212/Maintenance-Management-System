import { createContext, useReducer } from 'react'

export const CategoriesContext = createContext()

export const categoriesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return {
                categories: action.payload
            }
        case 'ADD_CATEGORY':
            return {
                categories: [action.payload, ...state.categories]
            }
        case 'DELETE_CATEGORY':
            return {
                categories: state.categories.filter(category => action.payload._id != category._id)
            }
        case 'UPDATE_CATEGORY':
            return {
                categories: state.categories.map(category =>
                    category._id === action.payload._id ? action.payload : category
                )
            }
        default:
            return state
    }
}

//since the assets is inside of an object the return value is state
//dispatch is called to update the state
export const CategoriesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(categoriesReducer, {
        categories: null
    })

    return (
        <CategoriesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CategoriesContext.Provider>
    )
}