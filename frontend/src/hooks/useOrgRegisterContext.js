import { RegisterContext } from "../context/OrgRegisterContext"
import { useContext } from "react"

export const useOrgRegisterContext = () => {
    const context = useContext(RegisterContext)

    if (!context) {
        throw Error('useOrgRegisterContext must be used inside a AuthContextProvider')
    }

    return context
}