import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the specific interview by its mockId
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewid))
            .limit(1);

        if (result.length === 0) {
            return Response.json({ error: 'Interview not found' }, { status: 404 });
        }

        // Parse the JSON mock response
        const interviewData = result[0];
        let mockInterviewQuestions;
        
        try {
            mockInterviewQuestions = JSON.parse(interviewData.jsonMockResp);
        } catch (parseError) {
            console.error('Error parsing interview questions:', parseError);
            return Response.json({ error: 'Invalid interview data format' }, { status: 500 });
        }

        return Response.json({
            interviewData: interviewData,
            mockInterviewQuestions: mockInterviewQuestions
        });

    } catch (error) {
        console.error('Error fetching interview details:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}