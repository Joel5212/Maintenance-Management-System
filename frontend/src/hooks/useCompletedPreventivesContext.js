import { CompletedPreventivesContext } from "../context/CompletedPreventivesContext"
import { useContext } from "react"

export const useCompletedPreventivesContext = () => {
    const context = useContext(CompletedPreventivesContext)

    if (!context) {
        throw Error('useCompletedPreventivesContext must be used inside a CompletedPreventivesContextProvider')
    }

    return context
}
