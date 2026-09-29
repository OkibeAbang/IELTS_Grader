import { useEffect } from 'react';

// Browser-tab title only — this doesn't help link-preview crawlers (they
// never run JS), just real visitors navigating, bookmarking, or switching
// tabs. See index.html for the static Open Graph tags that cover sharing.
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · 9Band` : '9Band';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
