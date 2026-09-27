import { run, queryOne, queryAll } from "../db.js";

async function addStudentToClass({ classId, userId }) {
  // Idempotent: a student re-entering a code they already used shouldn't error.
  const existing = await queryOne(`SELECT id FROM class_students WHERE class_id = ? AND user_id = ?`, [
    classId,
    userId,
  ]);
  if (existing) return existing.id;
  return run(`INSERT INTO class_students (class_id, user_id) VALUES (?, ?)`, [classId, userId]);
}

async function listStudentsForClass(classId) {
  const rows = await queryAll(
    `SELECT u.id, u.email, u.display_name, cs.joined_at,
            (SELECT COUNT(*) FROM essay_attempts WHERE user_id = u.id) AS essay_count,
            (SELECT COUNT(*) FROM speaking_attempts WHERE user_id = u.id) AS speaking_count,
            (SELECT COUNT(*) FROM speaking_drill_attempts WHERE user_id = u.id) AS speaking_drill_count
     FROM class_students cs
     JOIN users u ON u.id = cs.user_id
     WHERE cs.class_id = ?
     ORDER BY cs.joined_at ASC`,
    [classId]
  );
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    joinedAt: row.joined_at,
    attemptCount: row.essay_count + row.speaking_count + row.speaking_drill_count,
  }));
}

async function listClassesForStudent(userId) {
  const rows = await queryAll(
    `SELECT c.id, c.name, c.created_at, t.display_name AS teacher_display_name, t.username AS teacher_username
     FROM class_students cs
     JOIN classes c ON c.id = cs.class_id
     JOIN teachers t ON t.id = c.teacher_id
     WHERE cs.user_id = ?
     ORDER BY cs.joined_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    teacherName: row.teacher_display_name || row.teacher_username,
    createdAt: row.created_at,
  }));
}

async function removeStudentFromClass(classId, userId) {
  await run(`DELETE FROM class_students WHERE class_id = ? AND user_id = ?`, [classId, userId]);
}

async function isStudentInTeachersClasses(teacherId, userId) {
  const row = await queryOne(
    `SELECT 1 AS found FROM class_students cs
     JOIN classes c ON c.id = cs.class_id
     WHERE c.teacher_id = ? AND cs.user_id = ? LIMIT 1`,
    [teacherId, userId]
  );
  return !!row;
}

export {
  addStudentToClass,
  listStudentsForClass,
  listClassesForStudent,
  removeStudentFromClass,
  isStudentInTeachersClasses,
};
