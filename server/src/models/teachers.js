import { run, queryOne, queryAll } from "../db.js";

const PUBLIC_FIELDS = "id, teacher_number, username, display_name, created_at";

function formatUsername(teacherNumber) {
  return `teacher.${String(teacherNumber).padStart(3, "0")}`;
}

function toTeacher(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    teacherNumber: row.teacher_number,
    username: row.username,
    displayName: row.display_name,
    createdAt: row.created_at,
  };
}

async function createTeacher({ teacherNumber, passwordHash, displayName = null }) {
  const username = formatUsername(teacherNumber);
  const id = await run(
    `INSERT INTO teachers (teacher_number, username, password_hash, display_name) VALUES (?, ?, ?, ?)`,
    [teacherNumber, username, passwordHash, displayName]
  );
  return findById(id);
}

async function findByUsername(username) {
  return queryOne(`SELECT * FROM teachers WHERE username = ?`, [username]);
}

async function findById(id) {
  return toTeacher(await queryOne(`SELECT ${PUBLIC_FIELDS} FROM teachers WHERE id = ?`, [id]));
}

async function listAllTeachers() {
  const rows = await queryAll(`SELECT ${PUBLIC_FIELDS} FROM teachers ORDER BY teacher_number ASC`);
  return rows.map(toTeacher);
}

async function deleteTeacher(id) {
  await run(`DELETE FROM teachers WHERE id = ?`, [id]);
}

export { formatUsername, createTeacher, findByUsername, findById, listAllTeachers, deleteTeacher };
