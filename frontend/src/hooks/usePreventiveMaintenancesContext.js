import { PreventiveMaintenancesContext } from "../context/PreventiveMaintenancesContext"
import { useContext } from "react"

export const usePreventiveMaintenancesContext = () => {
    const context = useContext(PreventiveMaintenancesContext)

    if (!context) {
        throw Error('usePreventiveMaintenancesContext must be used inside an PreventiveMaintenancesContextProvider')
    }

    return context
}