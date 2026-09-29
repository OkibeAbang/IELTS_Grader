// Maps a protected route path to a short phrase describing what logging in
// unlocks there, so the login/signup pages can say "Log in to grade your
// essay" instead of a generic heading, and know where to send the user back
// to afterwards.
const TOOL_REDIRECT_LABELS = {
  '/essay-grader': 'grade your essay',
  '/reading': 'start reading practice',
  '/listening': 'start listening practice',
  '/speaking': 'start speaking practice',
  '/learn': 'see your personalized study plan',
  '/practice': 'start practicing',
};

export function toolRedirectLabel(path) {
  return TOOL_REDIRECT_LABELS[path] ?? null;
}
