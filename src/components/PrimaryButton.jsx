function PrimaryButton({ text, onClick, type = 'button' }) {
  return (
    <button
      className="primary-button"
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default PrimaryButton