import { useState } from 'react';
import { listeningAudioUrl } from '../../api/listening';

export default function AudioScriptPlayer({ sectionId }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className="listening-audio-player listening-audio-player-unsupported">
        <p>Audio isn't available for this section yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="listening-audio-player">
      <audio
        controls
        preload="none"
        src={listeningAudioUrl(sectionId)}
        onError={() => setMissing(true)}
        style={{ width: '100%' }}
      >
        Your browser doesn't support audio playback.
      </audio>
    </div>
  );
}
