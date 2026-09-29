export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <header className="app-header">
        <h1>Privacy Policy</h1>
        <p className="app-subtitle">Last updated: 2026-09-29</p>
      </header>

      <h2>1. Who this policy covers</h2>
      <p>
        This policy applies to anyone who creates an account on 9Band (the "Service"), including
        students practicing independently and students using the Service through a partner
        school or teacher.
      </p>
      <p>
        <strong>A note on age.</strong> Some users of this Service are likely to be under 18,
        since it may be used by students at partner schools as part of their coursework. If you
        are under 18, you should only use this Service with the involvement of a parent,
        guardian, or your school, consistent with section 8 below.
      </p>

      <h2>2. What we collect</h2>
      <p>
        <strong>Account information</strong>: your email address, a hashed password (we never
        store your actual password), and an optional display name. If you sign in with Google,
        we receive your Google account ID and the email/name Google shares with us.
      </p>
      <p>
        <strong>Your practice content and results</strong>: essays you submit for grading, audio
        recordings of your speaking practice, your answers to reading and listening questions,
        and the AI-generated scores and feedback produced for each of these.
      </p>
      <p>
        <strong>Teacher and class data</strong>, if you join a class: which class and teacher
        you're linked to, and — visible only to that teacher — your essays, speaking recordings,
        scores, and any comments or score adjustments your teacher makes.
      </p>
      <p>
        <strong>Payment information</strong>, if you subscribe to a paid plan: we do not store
        your card details ourselves — these are handled entirely by our payment processor,
        Stripe. We store only your subscription status and renewal date.
      </p>
      <p>
        <strong>Basic usage information</strong>: when you created your account, when you
        completed each practice attempt, and standard technical data (like IP address and
        browser type) generated automatically by using a web app.
      </p>

      <h2>3. How we use what we collect</h2>
      <ul>
        <li>To grade your essays and speaking recordings and show you the results.</li>
        <li>To let you sign in and keep your practice history across sessions.</li>
        <li>To let your teacher (if you're in a class) see your progress and add their own feedback.</li>
        <li>To process payments, if you're on a paid plan.</li>
        <li>To fix bugs and improve the Service.</li>
      </ul>
      <p>
        We do not sell your data, and we do not use your essays or recordings to advertise to
        you or anyone else.
      </p>

      <h2>4. Who we share it with</h2>
      <p>
        We use a small number of outside services to run the Service. Each only receives the
        specific data it needs to do its job:
      </p>
      <div className="legal-table-wrap">
        <table className="attempt-history-table">
          <thead>
            <tr>
              <th>Who</th>
              <th>What they receive</th>
              <th>What they do with it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google (Gemini API)</td>
              <td>Your essay text and speaking audio</td>
              <td>Generates your AI band score and feedback</td>
            </tr>
            <tr>
              <td>Groq, Anthropic (Claude)</td>
              <td>Your essay text only (never audio)</td>
              <td>Backup graders, used only if Google's service is briefly unavailable</td>
            </tr>
            <tr>
              <td>Turso</td>
              <td>All of the above, stored in our database</td>
              <td>Hosts our database</td>
            </tr>
            <tr>
              <td>Cloudflare (R2)</td>
              <td>Your speaking audio recordings</td>
              <td>Hosts your audio files</td>
            </tr>
            <tr>
              <td>Render</td>
              <td>Requests to our server</td>
              <td>Hosts our backend</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Requests to our website</td>
              <td>Hosts our frontend</td>
            </tr>
            <tr>
              <td>Stripe</td>
              <td>Your payment details (not us)</td>
              <td>Processes payments</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        None of these companies are allowed to use your data for their own purposes beyond
        providing the service we've hired them for — <strong>with one current exception, which
        we want to be upfront about</strong>: the Service is presently running on Google's
        Gemini API <em>free tier</em>, and Google's free-tier terms permit it to use submitted
        content (including human review) to improve its own models. Google's <em>paid</em> tier
        carries no such permission. We're in the process of moving to Gemini's paid tier, at
        which point this exception goes away — this policy will be updated the moment that
        happens, and until then, this is the one place your essay text or speaking audio could
        be used by a third party beyond simply grading it. Groq and Anthropic (our backup
        graders) do not use submitted content to train their models on any tier. We don't share
        your data with advertisers, data brokers, or anyone outside this list, and we don't
        sell it.
      </p>
      <p>
        <strong>If you're using the Service through a school</strong>: your teacher can see your
        essays, speaking recordings, scores, and progress within their own class. The school does
        not automatically get any data beyond what your teacher can already see through the app —
        we don't provide a separate bulk data export to schools today.
      </p>

      <h2>5. How long we keep it, and your right to delete it</h2>
      <p>
        We keep your account and practice history for as long as your account is active, so you
        can track your progress over time.
      </p>
      <p>
        <strong>Right now, deleting your account is admin-assisted, not self-serve</strong>: to
        delete your account and associated data, contact us at{' '}
        <a href="mailto:okibzyabang@gmail.com">okibzyabang@gmail.com</a> (or, if you're part of a
        school, ask your teacher or school administrator to make the request on your behalf) and
        we'll delete it. We're aware a self-serve deletion option is a better long-term
        experience and it's on our roadmap — this policy will be updated to reflect that once it
        ships.
      </p>

      <h2>6. Security</h2>
      <p>
        Passwords are hashed, not stored in plain text. Connections to the Service are
        encrypted. Access to student data within a class is limited to that class's own
        teacher — a teacher cannot see students outside their own classes, and this is enforced
        by the application itself, not just by policy.
      </p>

      <h2>7. Your choices</h2>
      <p>
        You can review and update your display name at any time from your Profile page. You can
        request a copy of your data or ask us to delete it by contacting{' '}
        <a href="mailto:okibzyabang@gmail.com">okibzyabang@gmail.com</a>.
      </p>

      <h2>8. Children's privacy and school partnerships</h2>
      <p>
        Some students using this Service through a partner school may be under 18, and in some
        cases under 13. Where the Service is provided through a school, we treat the school as
        responsible for obtaining any parental or guardian consent required by law before a
        student under the relevant age creates an account, consistent with how the school
        already handles consent for other classroom tools and software.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        If we make material changes to this policy, we'll update the "Last updated" date above
        and, where required, notify users or partner schools directly.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy or your data can be sent to{' '}
        <a href="mailto:okibzyabang@gmail.com">okibzyabang@gmail.com</a>.
      </p>
    </div>
  );
}
