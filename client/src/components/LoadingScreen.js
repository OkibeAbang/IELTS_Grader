import useDelayedNotice from '../hooks/useDelayedNotice';

export default function LoadingScreen({ message = 'Loading…' }) {
  const showColdStartNotice = useDelayedNotice(true);

  return (
    <div className="loading-screen">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
      {showColdStartNotice && (
        <p className="loading-screen-note">
          Still working on it — if the server's been idle for a while, waking it back up can
          take up to a minute. Thanks for your patience.
        </p>
      )}
    </div>
  );
}
