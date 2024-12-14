"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview() {
    const params = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        GetInterviewDetails();
    }, [])

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/interviews/${params.interviewid}/start`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch interview details');
            }

            const data = await response.json();
            setInterviewData(data.interviewData);
            setMockInterviewQuestion(data.mockInterviewQuestions);
        } catch (error) {
            console.error('Error fetching interview details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading interview details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!interviewData || !mockInterviewQuestion) {
        return <div>No interview data found</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionsSection 
                    mockInterviewQuestion={mockInterviewQuestion} 
                    activeQuestionIndex={activeQuestionIndex}
                />

                <RecordAnswerSection 
                    mockInterviewQuestion={mockInterviewQuestion} 
                    activeQuestionIndex={activeQuestionIndex} 
                    interviewData={interviewData}
                />
            </div>

            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                        Previous Question
                    </Button>
                )}
                {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                        Next Question
                    </Button>
                )}
                {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default StartInterview