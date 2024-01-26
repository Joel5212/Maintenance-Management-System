import React from 'react'

export function DeleteConfirmationModal({ assetToDelete, message, onDelete, onCancel }) {
  return (
    <div className='delete-asset-conf-container'>
      <h1 className='delete-conf-message'>{message}</h1>
      <div className='delete-conf-buttons'>
        <button className='delete-conf-btn' onClick={() => onDelete(assetToDelete._id)}>Delete</button>
        <button className='cancel-conf-btn' onClick={() => onCancel()}>Cancel</button>
      </div>
    </div>
  )
}

