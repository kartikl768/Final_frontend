import React from 'react';

interface ConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4">
          <h5 className="mb-3">{message || "Are you sure?"}</h5>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger" onClick={onConfirm}>Yes</button>
            <button className="btn btn-secondary" onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;