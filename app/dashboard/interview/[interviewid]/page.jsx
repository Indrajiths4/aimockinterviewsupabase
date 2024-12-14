"use client"
import { Button } from '@/components/ui/button';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';

function Interview() {
    const params = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        GetInterviewDetails();
    }, [])

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/${params.interviewid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch interview details');
            }

            const data = await response.json();
            setInterviewData(data);
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

    if (!interviewData) {
        return <div>No interview data found</div>;
    }

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col gap-5 border rounded-lg p-5'>
                        <h2 className='text-lg'><strong>Job Position : </strong>{interviewData.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description : </strong>{interviewData.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience : </strong>{interviewData.jobExperience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-4 text-yellow-500'>Enable Video Web Cam and Microphone to Start your Al Generated Mock
                            Interview, It Has 5 question which you can answer and at the last you will
                            get the report on the basis of your answer. NOTE: We never record your
                            video , Web cam access you can disable at any time if you want</h2>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    {webCamEnabled ? 
                        <Webcam 
                        onUserMedia={() => {setWebCamEnabled(true)}}
                        onUserMediaError={() => {setWebCamEnabled(false)}}
                        mirrored={true}
                        style={{height:400,width:400}}
                        /> : 
                    <>
                        <WebcamIcon className='h-72 w-full p-20 border rounded-lg bg-secondary my-7'/>
                        <Button variant="ghost" onClick={() => {setWebCamEnabled(true)}}>Enable Webcam and Microphone</Button>
                    </>}
                </div>
            </div>
            
            <div className='flex justify-end items-end'>
                <Link href={'/dashboard/interview/'+params.interviewid+'/start'}><Button>Start Interview</Button></Link>
            </div>
        </div>
    )
}

export default Interview