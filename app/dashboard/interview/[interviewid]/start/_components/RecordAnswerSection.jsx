"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    const [userAnswer, setUserAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const {user} = useUser();
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=> {
        results.map((result) =>
            setUserAnswer((prevAns) => prevAns + result?.transcript)
        );
      },[results])

      useEffect(()=> {
        if (!isRecording && userAnswer.length > 10) {
          UpdateUserAnswer();
        }
      },[userAnswer])

      const StartStopRecording = async () => {
        if(isRecording) {
          stopSpeechToText()
        }
        else {
          startSpeechToText()
        }
      }

      const UpdateUserAnswer = async() => {
        setLoading(true);
        try {
          const response = await fetch('/api/user-answers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              mockInterviewQuestion,
              activeQuestionIndex,
              interviewData,
              userAnswer,
              userEmail: user?.primaryEmailAddress?.emailAddress
            })
          });

          const result = await response.json();

          if (response.ok) {
            toast("User Answer Recorded Successfully");
            setUserAnswer('');
          } else {
            toast.error(result.error || "Failed to save answer");
          }
        } catch (error) {
          console.error('Error saving answer:', error);
          toast.error("Error saving your answer");
        } finally {
          setResults([]);
          setLoading(false);
        }
      }
      
  return (
    <div className='flex flex-col justify-center items-center'>
    <div className='flex flex-col justify-center items-center p-5 rounded-lg bg-black mt-20'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt='webcam image'></Image>

        <Webcam mirrored={true} style={{height:300,width:'100%',zIndex:10}}/>
    </div>
    <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
    {isRecording ? (
          <h2 className="text-red-600 items-center animate-pulse flex gap-2">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
    </Button>
    </div>
  )
}

export default RecordAnswerSection