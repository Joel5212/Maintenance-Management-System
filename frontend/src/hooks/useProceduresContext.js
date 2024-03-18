import { ProceduresContext } from "../context/ProceduresContext"
import { useContext } from "react"

export const useProceduresContext = () => {
    const context = useContext(ProceduresContext)

    if (!context) {
        throw Error('useProceduresContext must be used inside an ProceduresContextProvider')
    }

    return context
}