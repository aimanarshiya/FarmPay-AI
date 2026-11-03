export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-message" role="alert">
      <span>⚠️ </span>
      {message}
    </div>
  );
}

