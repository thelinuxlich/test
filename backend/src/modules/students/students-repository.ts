import { assertHTTP } from "../../utils/assertHTTP";
import { getDatabase, getPool } from "../../db/database";
import { goTryRaw } from "go-go-try";

export interface StudentPayload {
  page?: number;
  limit?: number;
  name?: string;
  className?: string;
  class?: string; // Alias for className (used by stored procedure)
  section?: string;
  roll?: string | number;
  email?: string;
  [key: string]: any;
}

export interface StudentStatusPayload {
  userId: number;
  reviewerId: number;
  status: boolean;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  lastLogin: Date | null;
  systemAccess: boolean;
}

export interface StudentDetailResponse {
  id: number;
  name: string;
  email: string;
  systemAccess: boolean;
  phone: string | null;
  gender: string | null;
  dob: Date | string | null;
  class: string | null;
  section: string | null;
  roll: number | null;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  motherPhone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  relationOfGuardian: string | null;
  currentAddress: string | null;
  permanentAddress: string | null;
  admissionDate: Date | string | null;
  reporterName: string | null;
}

export const getRoleId = async (roleName: string) => {
  const db = getDatabase();
  const result = await db
    .selectFrom("roles")
    .select("id")
    .where("name", "ilike", roleName)
    .executeTakeFirst();
  assertHTTP(result, `Role '${roleName}' not found`, '404');
  return result.id;
};

export const findAllStudents = async (payload: StudentPayload) => {
  const { page = 1, limit = 10, name, className, section, roll, email } = payload;
  const db = getDatabase();

  let query = db
    .selectFrom("users as t1")
    .leftJoin("userProfiles as t3", "t1.id", "t3.userId")
    .select([
      "t1.id",
      "t1.name",
      "t1.email",
      "t1.lastLogin",
      "t1.isActive as systemAccess",
    ])
    .where("t1.roleId", "=", 3);

  if (name) {
    query = query.where("t1.name", "=", name);
  }
  if (email) {
    query = query.where("t1.email", "=", email);
  }
  if (className) {
    query = query.where("t3.className", "=", className);
  }
  if (section) {
    query = query.where("t3.sectionName", "=", section);
  }
  if (roll) {
    query = query.where("t3.roll", "=", Number(roll));
  }

  const offset = (page - 1) * limit;
  const rows = await query
    .orderBy("t1.id")
    .limit(limit)
    .offset(offset)
    .execute();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    lastLogin: row.lastLogin,
    systemAccess: row.systemAccess,
  }));
};

export const addOrUpdateStudent = async (payload: StudentPayload) => {
  // Note: This function calls a stored procedure
  // For stored procedures, we use the pool directly
  const pool = getPool();

  const [error, result] = await goTryRaw(async () => {
    const query = "SELECT * FROM student_add_update($1)";
    const queryResult = await pool.query(query, [JSON.stringify(payload)]);
    return queryResult.rows?.[0];
  });

  if (error) {
    console.error("Error calling stored procedure:", error);
    throw error;
  }

  return result;
};

export const findStudentDetail = async (id: number) => {
  const db = getDatabase();

  return await db
    .selectFrom("users as u")
    .leftJoin("userProfiles as p", "u.id", "p.userId")
    .leftJoin("users as r", "u.reporterId", "r.id")
    .select([
      "u.id",
      "u.name",
      "u.email",
      "u.isActive as systemAccess",
      "p.phone",
      "p.gender",
      "p.dob",
      "p.className as class",
      "p.sectionName as section",
      "p.roll",
      "p.fatherName",
      "p.fatherPhone",
      "p.motherName",
      "p.motherPhone",
      "p.guardianName",
      "p.guardianPhone",
      "p.relationOfGuardian",
      "p.currentAddress",
      "p.permanentAddress",
      "p.admissionDt as admissionDate",
      "r.name as reporterName",
    ])
    .where("u.id", "=", id)
    .executeTakeFirst();
};

export const findStudentToSetStatus = async (
  payload: StudentStatusPayload
) => {
  const { userId, status } = payload;
  const db = getDatabase();

  const result = await db
    .updateTable("users")
    .set({
      isActive: status,
    })
    .where("id", "=", userId)
    .executeTakeFirst();

  return Number(result.numUpdatedRows);
};

export const findStudentToUpdate = async (payload: StudentPayload) => {
  const { basicDetails: { name, email }, id } = payload;
  const currentDate = new Date();
  const db = getDatabase();

  return await db
    .updateTable("users")
    .set({
      name,
      email,
      updatedDt: currentDate,
    })
    .where("id", "=", id)
    .returningAll()
    .execute();
};

export const deleteStudent = async (id: number) => {
  const db = getDatabase();

  const result = await db.transaction().execute(async (trx) => {
    // First delete user_profiles (due to foreign key constraint)
    await trx
      .deleteFrom("userProfiles")
      .where("userId", "=", id)
      .execute();

    // Then delete the user
    return await trx
      .deleteFrom("users")
      .where("id", "=", id)
      .executeTakeFirst();
  });

  const numDeleted = (result as any)?.numDeletedRows;
  return numDeleted ? Number(numDeleted) : 0;
};

