"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setopenDialog] = useState(false);
    const [jobPosition, setjobPosition] = useState('');
    const [jobDescription, setjobDescription] = useState('');
    const [yearofexp, setyearofexp] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobPosition,
                    jobDescription,
                    yearofexp
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setopenDialog(false);
            router.push(`/dashboard/interview/${data.mockId}`);
        } catch (error) {
            console.error('Error creating interview:', error);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
                <h2 className='text-lg text-center' onClick={() => { setopenDialog(true) }}>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell me more about your job interviewing</DialogTitle>
                        <form onSubmit={onSubmit}>
                            <div>
                                <div>
                                    <h2>Add Details about your job position/role, job description and Years of experience</h2>
                                </div>
                                <div className='mt-7 my-3'>
                                    <label>Job Role/Position : </label>
                                    <Input 
                                        placeholder='Ex. Full Stack Developer' 
                                        required 
                                        onChange={(event) => setjobPosition(event.target.value)}
                                    />
                                </div>

                                <div className='my-3'>
                                    <label>Job Description(in short) : </label>
                                    <Textarea 
                                        placeholder='Ex. React,Vue etc..' 
                                        onChange={(event) => setjobDescription(event.target.value)}
                                    />
                                </div>

                                <div className='my-3'>
                                    <label>Years of experience : </label>
                                    <Input 
                                        placeholder='Ex. 5' 
                                        type='number' 
                                        max="50" 
                                        required 
                                        onChange={(event) => setyearofexp(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-5 justify-end'>
                                <Button type='button' variant='ghost' onClick={() => setopenDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type='submit'>
                                    {loading ? 
                                        <><LoaderCircle className='animate-spin'/>Generating from AI</> 
                                        : 'Start Interview'}
                                </Button>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview