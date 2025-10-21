import { db } from '@/data';
import { attendeeRegistrations, AttendeeRegistration } from '@/data/schema';
import { eq, desc, and, or, like } from 'drizzle-orm';

export interface GetRegistrationByIdResult {
  success: boolean;
  data?: AttendeeRegistration;
  error?: string;
}

export interface GetRegistrationsResult {
  success: boolean;
  data?: AttendeeRegistration[];
  error?: string;
}

export interface SearchRegistrationsParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  limit?: number;
  offset?: number;
}

/**
 * Retrieves a registration by its ID
 */
export async function getRegistrationById(
  id: string
): Promise<GetRegistrationByIdResult> {
  try {
    const [attendeeRegistration] = await db
      .select()
        .from(attendeeRegistrations)
      .where(eq(attendeeRegistrations.id, id))
      .limit(1);

    if (!attendeeRegistration) {
      return {
        success: false,
        error: 'Registration not found',
      };
    }

    return {
      success: true,
      data: attendeeRegistration,
    };
  } catch (error) {
    console.error('Failed to get registration by ID:', error);
    return {
      success: false,
      error: 'Failed to retrieve registration',
    };
  }
}

/**
 * Retrieves a registration by email address
 */
export async function getRegistrationByEmail(
  email: string
): Promise<GetRegistrationByIdResult> {
  try {
    const [attendeeRegistration] = await db
      .select()
      .from(attendeeRegistrations)
      .where(eq(attendeeRegistrations.email, email))
      .limit(1);

    if (!attendeeRegistration) {
      return {
        success: false,
        error: 'Registration not found',
      };
    }

    return {
      success: true,
      data: attendeeRegistration,
    };
  } catch (error) {
    console.error('Failed to get registration by email:', error);
    return {
      success: false,
      error: 'Failed to retrieve registration',
    };
  }
}

/**
 * Retrieves all registrations with optional filtering and pagination
 */
export async function getRegistrations(
  params: SearchRegistrationsParams = {}
): Promise<GetRegistrationsResult> {
  try {
    const { email, firstName, lastName, limit = 50, offset = 0 } = params;

    // Build conditions array
    const conditions = [];
    
    if (email) {
      conditions.push(like(attendeeRegistrations.email, `%${email}%`));
    }
    
    if (firstName) {
      conditions.push(like(attendeeRegistrations.firstName, `%${firstName}%`));
    }
    
    if (lastName) {
      conditions.push(like(attendeeRegistrations.lastName, `%${lastName}%`));
    }

    // Execute query with conditions
    let registrationsList;
    
    if (conditions.length > 0) {
      registrationsList = await db
        .select()
            .from(attendeeRegistrations)
        .where(and(...conditions))
        .orderBy(desc(attendeeRegistrations.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      registrationsList = await db
        .select()
        .from(attendeeRegistrations)
        .orderBy(desc(attendeeRegistrations.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return {
      success: true,
      data: registrationsList,
    };
  } catch (error) {
    console.error('Failed to get registrations:', error);
    return {
      success: false,
      error: 'Failed to retrieve registrations',
    };
  }
}

/**
 * Checks if a registration already exists with the same first name, last name, and email
 */
export async function checkExistingRegistration(
  firstName: string,
  lastName: string,
  email: string
): Promise<GetRegistrationByIdResult> {
  try {
    const [attendeeRegistration] = await db
      .select()
      .from(attendeeRegistrations)
      .where(
        and(
          eq(attendeeRegistrations.firstName, firstName),
          eq(attendeeRegistrations.lastName, lastName),
          eq(attendeeRegistrations.email, email)
        )
      )
      .limit(1);

    if (!attendeeRegistration) {
      return {
        success: false,
        error: 'Registration not found',
      };
    }

    return {
      success: true,
      data: attendeeRegistration,
    };
  } catch (error) {
    console.error('Failed to check existing registration:', error);
    return {
      success: false,
      error: 'Failed to check existing registration',
    };
  }
}

/**
 * Gets registration statistics
 */
export async function getRegistrationStats(): Promise<{
  success: boolean;
  data?: {
    total: number;
    today: number;
    thisWeek: number;
  };
  error?: string;
}> {
  try {
    const totalResult = await db
      .select({ count: attendeeRegistrations.id })
      .from(attendeeRegistrations);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayResult = await db
      .select({ count: attendeeRegistrations.id })
        .from(attendeeRegistrations)
      .where(eq(attendeeRegistrations.createdAt, today));

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekResult = await db
      .select({ count: attendeeRegistrations.id })
      .from(attendeeRegistrations)
      .where(and(
        eq(attendeeRegistrations.createdAt, weekAgo),
        eq(attendeeRegistrations.createdAt, today)
      ));

    return {
      success: true,
      data: {
        total: Number(totalResult[0]?.count) || 0,
        today: Number(todayResult[0]?.count) || 0,
        thisWeek: Number(weekResult[0]?.count) || 0,
      },
    };
  } catch (error) {
    console.error('Failed to get registration stats:', error);
    return {
      success: false,
      error: 'Failed to retrieve registration statistics',
    };
  }
}
