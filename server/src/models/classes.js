import crypto from "node:crypto";
import { run, queryOne, queryAll } from "../db.js";

// Excludes 0/O and 1/I so a code read aloud in a classroom isn't ambiguous.
const JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const JOIN_CODE_LENGTH = 7;

function randomJoinCode() {
  let code = "";
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    code += JOIN_CODE_ALPHABET[crypto.randomInt(JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

function toClass(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    teacherId: row.teacher_id,
    name: row.name,
    joinCode: row.join_code,
    createdAt: row.created_at,
  };
}

async function createClass({ teacherId, name }) {
  // Collisions are astronomically unlikely at this alphabet/length, but the
  // UNIQUE constraint makes a retry loop cheap insurance rather than a crash.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const joinCode = randomJoinCode();
      const id = await run(`INSERT INTO classes (teacher_id, name, join_code) VALUES (?, ?, ?)`, [
        teacherId,
        name,
        joinCode,
      ]);
      return findClassById(id);
    } catch (err) {
      if (!String(err?.message).includes("UNIQUE") || attempt === 4) throw err;
    }
  }
}

async function findClassById(id) {
  return toClass(await queryOne(`SELECT * FROM classes WHERE id = ?`, [id]));
}

async function findClassByJoinCode(joinCode) {
  return toClass(await queryOne(`SELECT * FROM classes WHERE join_code = ?`, [joinCode]));
}

async function listClassesForTeacher(teacherId) {
  const rows = await queryAll(
    `SELECT c.*, COUNT(cs.id) AS student_count
     FROM classes c
     LEFT JOIN class_students cs ON cs.class_id = c.id
     WHERE c.teacher_id = ?
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [teacherId]
  );
  return rows.map((row) => ({ ...toClass(row), studentCount: row.student_count }));
}

async function deleteClass(id) {
  await run(`DELETE FROM class_students WHERE class_id = ?`, [id]);
  await run(`DELETE FROM classes WHERE id = ?`, [id]);
}

async function deleteClassesForTeacher(teacherId) {
  const rows = await queryAll(`SELECT id FROM classes WHERE teacher_id = ?`, [teacherId]);
  for (const row of rows) {
    await deleteClass(row.id);
  }
}

export {
  createClass,
  findClassById,
  findClassByJoinCode,
  listClassesForTeacher,
  deleteClass,
  deleteClassesForTeacher,
};
