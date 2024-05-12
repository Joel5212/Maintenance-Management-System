import { FailuresContext } from "../context/FailuresContext"
import { useContext } from "react"

export const useFailuresContext = () => {
    const context = useContext(FailuresContext)

    if (!context) {
        throw Error('useFailuresContext must be used inside a FailuresContextProvider')
    }

    return context
}