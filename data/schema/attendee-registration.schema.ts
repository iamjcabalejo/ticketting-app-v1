import { pgTable, varchar, timestamp, text, uuid } from 'drizzle-orm/pg-core';

export const attendeeRegistrations = pgTable('attendee_registrations', {
  id: uuid('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  qrCode: text('qr_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type AttendeeRegistration = typeof attendeeRegistrations.$inferSelect;
export type NewAttendeeRegistration = typeof attendeeRegistrations.$inferInsert;
