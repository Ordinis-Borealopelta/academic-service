import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  courses: {
    classes: r.many.classes(),
    waitlist: r.many.waitlist(),
  },

  classes: {
    course: r.one.courses({
      from: r.classes.courseId,
      to: r.courses.id,
    }),
    enrollments: r.many.enrollments(),
    lecturer: r.one.lecturers({
      from: r.classes.lecturerId,
      to: r.lecturers.userId,
    }),
  },

  enrollments: {
    class: r.one.classes({
      from: r.enrollments.classId,
      to: r.classes.id,
    }),
    student: r.one.students({
      from: r.enrollments.studentId,
      to: r.students.userId,
    }),
  },

  waitlist: {
    course: r.one.courses({
      from: r.waitlist.courseId,
      to: r.courses.id,
    }),
    student: r.one.students({
      from: r.waitlist.studentId,
      to: r.students.userId,
    }),
  },

  lecturers: {
    classes: r.many.classes(),
  },

  students: {
    enrollments: r.many.enrollments(),
    waitlistEntries: r.many.waitlist(),
  },
}));
