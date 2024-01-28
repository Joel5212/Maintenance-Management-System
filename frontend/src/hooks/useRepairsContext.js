import { RepairsContext } from "../context/RepairsContext"
import { useContext } from "react"

export const useRepairsContext = () => {
    const context = useContext(RepairsContext)

    if (!context) {
        throw Error('useRepairsContext must be used inside a RepairsContextProvider')
    }

    return context
}