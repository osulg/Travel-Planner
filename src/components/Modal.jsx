function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">{title}</h3>
        <div className="modal-content">{children}</div>
        <button className="primary-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default Modal