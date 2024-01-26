import { AssetsContext } from "../context/AssetsContext"
import { useContext } from "react"

export const useAssetsContext = () => {
    const context = useContext(AssetsContext)

    if (!context) {
        throw Error('useAssetsContext must be used inside an AssetsContextProvider')
    }

    return context
}