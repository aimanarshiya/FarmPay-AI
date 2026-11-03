export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="loading-state" role="status">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

