import { createContext, useReducer } from 'react'

export const AssetsContext = createContext()

const generateAssetPaths = (assets, parentAsset, pathHistory) => {

    const paths = {};

    //finding assets in each level
    const assetsWithParent = assets && assets.filter((asset) => asset.parentAsset === parentAsset);

    assetsWithParent.forEach((asset) => {
        const newPath = [...pathHistory, asset._id]
        //creating key value pair key: id and value: path
        paths[asset._id] = newPath;
        console.log("pathHistory", pathHistory)

        const childPaths = generateAssetPaths(assets, asset._id, newPath);
        //Object.assign is used to copy the values of all enumerable properties from one or more source objects to a target object.
        //we need to copy all the paths from the recursive calls into the top most paths
        //merging the current paths with childPaths as we recurse through so we can end up with an object that holds the lists to each path
        Object.assign(paths, childPaths);
    });

    return paths;
};

const setAssets = function (assets) {

    const assetPaths = generateAssetPaths(assets, null, [])
    //iterates through asset paths and destructures the assetId and value for each asset pats
    for (const [assetId, value] of Object.entries(assetPaths)) {
        // some() is used to iterate through an array of objects
        for (const asset of assets) {
            if (asset._id === assetId) {
                asset.assetPaths = value
            }
        }
    }
    return assets
}

const addAsset = function (assets, assetToAdd) {
    if (assets !== null && assets.length !== 0 && assetToAdd.parentAsset != null) {
        for (const asset of assets) {
            if (asset._id === assetToAdd.parentAsset) {
                //creating new path using parent's for asset to be added
                const newPaths = [...asset.assetPaths, assetToAdd._id]
                assetToAdd.assetPaths = newPaths
                break;
            }
        }
    }
    else {
        assetToAdd.assetPaths = [assetToAdd._id]
    }
    return assets != null ? [...assets, assetToAdd] : [assetToAdd]
}

const updateAsset = function (updatedAsset, assetPath) {
    console.log(assetPath)
    updatedAsset.assetPaths = assetPath
    return updatedAsset;
}

export const assetsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ASSETS':
            return {
                assets: setAssets(action.payload)
            }
        case 'ADD_ASSET':
            return {
                assets: addAsset(state.assets, action.payload)
            }
        case 'DELETE_ASSET':
            return {
                assets: state.assets.filter(asset => !action.payload.includes(asset._id))
            }
        case 'UPDATE_ASSET':
            return {
                assets: state.assets.map(asset =>
                    asset._id === action.payload._id ? updateAsset(action.payload, action.assetPaths) : asset
                )
            }
        default:
            return state
    }
}

//since the assets is inside of an object the return value is state
//dispatch is called to update the state
export const AssetsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(assetsReducer, {
        assets: null
    })

    return (
        <AssetsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AssetsContext.Provider>
    )
}