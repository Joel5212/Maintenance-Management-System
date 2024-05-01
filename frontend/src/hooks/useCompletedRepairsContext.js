import { CompletedRepairsContext } from "../context/CompletedRepairsContext"
import { useContext } from "react"

export const useCompletedRepairsContext = () => {
    const context = useContext(CompletedRepairsContext)

    if (!context) {
        throw Error('useCompletedRepairsContext must be used inside a CompletedRepairsContextProvider')
    }

    return context
}
