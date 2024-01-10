import { PrevRouteContext } from "../context/PrevRouteContext"
import { useContext } from "react"

export const usePrevRouteContext = () => {
    const context = useContext(PrevRouteContext)

    if (!context) {
        throw Error('usePrevRouteContext must be used inside a PrevRouteContextProvider')
    }

    return context
}