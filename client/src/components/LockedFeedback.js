import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LockedFeedback() {
  return (
    <div className="locked-feedback">
      <Lock size={22} aria-hidden="true" />
      <h3>Detailed feedback is a Pro feature</h3>
      <p>See your per-criterion band scores, strengths, weaknesses, and specific corrections by upgrading to Pro.</p>
      <Link to="/pricing" className="submit-btn">Upgrade to Pro</Link>
    </div>
  );
}
