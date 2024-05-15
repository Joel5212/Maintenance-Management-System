import React from 'react'

export function DeleteConfirmationModal({ assetToDelete, message, onDelete, onCancel, deleteOption }) {
  return (
    <div className='delete-asset-conf-container'>
      <h1 className='delete-conf-message'>{message}</h1>
      <div className='delete-conf-buttons'>
        <button className='delete-conf-btn' onClick={() => onDelete(deleteOption === "deleteAsset" ? assetToDelete : assetToDelete._id)}>Delete</button>
        <button className='cancel-conf-btn' onClick={() => onCancel()}>Cancel</button>
      </div>
    </div>
  )
}

