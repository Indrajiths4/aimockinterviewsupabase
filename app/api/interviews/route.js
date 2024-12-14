import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { chatSession } from '@/utils/GeminiAiModel';
import { auth, currentUser } from '@clerk/nextjs/server';
import { desc, eq } from "drizzle-orm";

export async function POST(request) {
    try {
        const { jobPosition, jobDescription, yearofexp } = await request.json();
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate AI response
        const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience : ${yearofexp} , Depending on Job Position, Job Description & Years of Experience give us 2 Interview question along with Answer in JSON format, Give us question and answer field on JSON in the format [{'question':'...','answer':'...'{...}}] `;

        const result = await chatSession.sendMessage(inputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');

        if (!result) {
            return Response.json({ error: 'Failed to generate interview questions' }, { status: 500 });
        }

        // Insert into database
        const resp = await db.insert(MockInterview).values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: yearofexp,
            createdBy: user?.emailAddresses?.[0]?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        }).returning({ mockId: MockInterview.mockId });

        return Response.json({ mockId: resp[0]?.mockId });

    } catch (error) {
        console.error('Error creating interview:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();
        console.log("GET userId:", userId);

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // First, check if any records exist at all
        const allRecords = await db
            .select()
            .from(MockInterview);
        console.log("All records in DB:", allRecords);

        // Then check records for this specific user
        const interviews = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.emailAddresses?.[0]?.emailAddress))
            .orderBy(desc(MockInterview.id));
            
        console.log("User-specific records:", interviews);
        return Response.json(interviews);

    } catch (error) {
        console.error('Error fetching interviews:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}