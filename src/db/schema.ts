import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const academicSchema = pgSchema("academic");

export const classStatusEnum = academicSchema.enum("class_status", [
  "planned",
  "open_enrollment",
  "closed_enrollment",
  "in_progress",
  "finished",
  "cancelled",
]);

export const enrollmentStatusEnum = academicSchema.enum("enrollment_status", [
  "waitlist",
  "pending_payment",
  "enrolled",
  "completed",
  "dropped",
  "cancelled",
]);

export const courses = academicSchema.table(
  "courses",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    credits: integer("credits").default(0),
    durationHours: integer("duration_hours").notNull(),
    baseFee: integer("base_fee").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("courses_code_uidx").on(table.code)],
);

export const classes = academicSchema.table(
  "classes",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "restrict" }),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    minStudents: integer("min_students").default(10).notNull(),
    maxStudents: integer("max_students").default(40).notNull(),
    currentEnrollment: integer("current_enrollment").default(0).notNull(),
    status: classStatusEnum("status").default("planned").notNull(),
    lecturerId: text("lecturer_id"),
    scheduleMetadata: jsonb("schedule_metadata"),
    location: text("location"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("classes_code_uidx").on(table.code),
    index("classes_courseId_idx").on(table.courseId),
    index("classes_status_idx").on(table.status),
    index("classes_lecturerId_idx").on(table.lecturerId),
  ],
);

export const enrollments = academicSchema.table(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    classId: integer("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "restrict" }),
    studentId: text("student_id").notNull(),
    status: enrollmentStatusEnum("status").default("waitlist").notNull(),
    enrolledAt: timestamp("enrolled_at"),
    completedAt: timestamp("completed_at"),
    finalGrade: text("final_grade"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("enrollments_classId_idx").on(table.classId),
    index("enrollments_studentId_idx").on(table.studentId),
    index("enrollments_status_idx").on(table.status),
    uniqueIndex("enrollments_class_student_uidx").on(
      table.classId,
      table.studentId,
    ),
  ],
);

export const waitlist = academicSchema.table(
  "waitlist",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    studentId: text("student_id").notNull(),
    priority: integer("priority").default(0).notNull(),
    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    notifiedAt: timestamp("notified_at"),
    expiresAt: timestamp("expires_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("waitlist_courseId_idx").on(table.courseId),
    index("waitlist_studentId_idx").on(table.studentId),
    uniqueIndex("waitlist_course_student_uidx").on(
      table.courseId,
      table.studentId,
    ),
  ],
);

export const lecturers = academicSchema.table(
  "lecturers",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    employeeCode: text("employee_code").unique(),
    department: text("department"),
    title: text("title"),
    specialization: text("specialization"),
    phoneNumber: text("phone_number"),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("lecturers_userId_uidx").on(table.userId),
    uniqueIndex("lecturers_employeeCode_uidx").on(table.employeeCode),
  ],
);

export const students = academicSchema.table(
  "students",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    studentCode: text("student_code").unique(),
    dateOfBirth: date("date_of_birth"),
    placeOfBirth: text("place_of_birth"),
    gender: text("gender"),
    ethnicity: text("ethnicity"),
    nationality: text("nationality").default("Việt Nam"),
    idNumber: text("id_number"),
    phoneNumber: text("phone_number"),
    address: text("address"),
    occupation: text("occupation"),
    workplace: text("workplace"),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("students_userId_uidx").on(table.userId),
    uniqueIndex("students_studentCode_uidx").on(table.studentCode),
  ],
);
