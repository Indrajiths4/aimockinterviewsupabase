"use client";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { useUser } from "@clerk/nextjs";

const InterviewList = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getInterviewList();
    }
  }, [isLoaded, isSignedIn]);
  
  const getInterviewList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interviews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
  
      const interviews = await response.json();
      console.log("Fetched interviews:", interviews); // Add this line
      setInterviewList(interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading interviews: {error}</div>;
  }

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {isLoading ? (
          <div>Loading interviews...</div>
        ) : (
          interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={interview.id || index} />
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewList;