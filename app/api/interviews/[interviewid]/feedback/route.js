import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user answers for the specific mock interview
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewid))
            .orderBy(UserAnswer.id);

        if (result.length === 0) {
            return Response.json({ 
                message: 'No feedback found',
                feedbackList: []
            }, { status: 200 });
        }

        return Response.json({
            message: 'Feedback retrieved successfully',
            feedbackList: result
        });

    } catch (error) {
        console.error('Error fetching feedback:', error);
        return Response.json({ 
            error: 'Internal server error', 
            details: error.message 
        }, { status: 500 });
    }
}