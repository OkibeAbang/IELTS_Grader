import "dotenv/config";
import { getListeningSectionBank, getListeningSectionWithAnswers } from "../src/listeningPassageBank.js";
import { generateListeningAudioBuffer } from "../src/listeningAudio.js";
import { saveListeningAudio } from "../src/audioStorage.js";

/**
 * One-off content-authoring step, not a runtime operation: renders
 * listening section audio once with Gemini TTS and stores it (R2 in
 * production, local disk in dev — see audioStorage.js). Run manually
 * whenever a section is added or its script text changes.
 *
 *   npm run render-listening-audio            # every section in the bank
 *   npm run render-listening-audio -- ls-04 ls-05 ls-06   # only these ids
 */
async function main() {
  const requestedIds = process.argv.slice(2);
  const allSections = getListeningSectionBank();
  const sections = requestedIds.length
    ? allSections.filter((s) => requestedIds.includes(s.id))
    : allSections;
  console.log(`Rendering audio for ${sections.length} listening section(s)...`);

  for (const { id, title } of sections) {
    const { script } = getListeningSectionWithAnswers(id);
    process.stdout.write(`  ${id} (${title})... `);
    const mp3Buffer = await generateListeningAudioBuffer(script);
    await saveListeningAudio(id, mp3Buffer);
    console.log(`done (${(mp3Buffer.length / 1024).toFixed(0)} KB)`);
  }

  console.log("All sections rendered.");
}

main().catch((err) => {
  console.error("Rendering listening audio failed:", err);
  process.exit(1);
});
