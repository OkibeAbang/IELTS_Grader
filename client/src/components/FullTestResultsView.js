import ReadingResultsView from './ReadingResultsView';
import ListeningResultsView from './ListeningResultsView';
import ResultsView from './ResultsView';
import SpeakingResultsView from './SpeakingResultsView';

export default function FullTestResultsView({ finalized, listeningDetail, readingDetail, task1Detail, task2Detail, speakingDetail }) {
  return (
    <div className="results-view">
      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{finalized.overallBand}</span>
      </div>

      <div className="full-test-skill-summary">
        <span className="full-test-skill-summary-item">Listening <span className="band-badge">{finalized.listeningBand}</span></span>
        <span className="full-test-skill-summary-item">Reading <span className="band-badge">{finalized.readingBand}</span></span>
        <span className="full-test-skill-summary-item">Writing <span className="band-badge">{finalized.writingBand}</span></span>
        <span className="full-test-skill-summary-item">Speaking <span className="band-badge">{finalized.speakingBand}</span></span>
      </div>

      <p className="disclaimer">
        This is an AI/heuristic-generated estimate across all four skills, not a certified
        score. Overall and Writing bands follow the official IELTS rounding rule (average of
        the skill bands, rounded up to the nearest half band).
      </p>

      <section>
        <h2>Listening</h2>
        <ListeningResultsView result={listeningDetail} />
      </section>

      <section>
        <h2>Reading</h2>
        <ReadingResultsView result={readingDetail} />
      </section>

      <section>
        <h2>Writing — Task 1</h2>
        <ResultsView result={task1Detail} />
      </section>

      <section>
        <h2>Writing — Task 2</h2>
        <ResultsView result={task2Detail} />
      </section>

      <section>
        <h2>Speaking</h2>
        <SpeakingResultsView result={speakingDetail} />
      </section>
    </div>
  );
}
