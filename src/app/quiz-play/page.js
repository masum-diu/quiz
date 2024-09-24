'use client';

import { Button, Paper, Stack, Typography, TextField, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import instance from '../api/api_instance';
import { useUser } from '@clerk/nextjs';

const Page = () => {
  const [inputCode, setInputCode] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [quizDataresults, setQuizDataresults] = useState(null); 
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);  // Track quiz start time
  const [elapsedTime, setElapsedTime] = useState(0); // Track time elapsed in seconds
  const [totalMarks, setTotalMarks] = useState(0);  // Track total marks

  const { user } = useUser();
  const currentQuestion = quizData ? quizData[currentQuestionIndex] : null;

  // Auto login only once when the user is loaded
  useEffect(() => {
    if (user) {
      const autoLogin = async () => {
        try {
          const response = await instance.post('/social/login', {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
            avatar:user?.imageUrl
          });
          await localStorage.setItem('token', response.data.token);
        } catch (error) {
          console.error('Error during login:', error);
        }
      };
      autoLogin();
    }
  }, [user]); // Only triggers once when `user` changes

  // Fetch quiz data based on the code entered
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/get-quiz?code=${inputCode}&taken=10`);
      setQuizData(response?.data);
      setIsQuizStarted(true);
      setQuizStartTime(Date.now()); // Set the quiz start time when the quiz starts
      setElapsedTime(0); // Reset elapsed time
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
    setLoading(false);
  };

  // Handle answer selection and check correctness
  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    setShowNextButton(true);

    const currentAnswer = {
      questionId: currentQuestion.id,
      selectedOption: option,
    };

    setSubmittedAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestionIndex] = currentAnswer;
      return updatedAnswers;
    });

    if (option === currentQuestion.answer) {
      setTotalMarks((prevMarks) => prevMarks + 1);
    }
  };

  // Handle next button click
  const handleNextClick = () => {
    setShowNextButton(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    const token = await localStorage.getItem('token');
    try {
      const totalQuestions = quizData.length;
      const totalMarks = submittedAnswers.reduce((total, answer) => {
        const question = quizData.find(q => q.id === answer.questionId);
        return question && question.answer === answer.selectedOption ? total + parseInt(question.mark) : total;
      }, 0);

      const consumeTime = elapsedTime; // Use elapsed time as consumed time

      const response = await instance.post(
        '/submit-quiz',
        {
          code: inputCode,
          total_question: totalQuestions,
          total_mark: totalMarks,
          consume_time: consumeTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Set quiz results after successful submission
      setQuizDataresults(response?.data?.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Timer to track the quiz time
  useEffect(() => {
    let timerInterval;
  
    if (isQuizStarted && !quizDataresults) {  // Start the timer only if the quiz has started and results are not displayed
      timerInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1); // Increment elapsed time every second
      }, 1000);
    }
  
    // Clear the timer when the quiz ends (either due to submission or reaching the last question) or component unmounts
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isQuizStarted, quizDataresults]);

  return (
    <Paper sx={{ p: 3, width: '100%' }} variant="outlined" elevation={3}>
      {!isQuizStarted && !quizDataresults ? (
        <Stack direction={'column'} spacing={2} textAlign="center">
          <TextField
            id="code-input"
            label="Quiz Code"
            size="small"
            type="number"
            placeholder="Enter Your Code"
            variant="outlined"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Stack>
      ) : currentQuestion && !quizDataresults ? (
        <Stack direction={'column'} spacing={2} textAlign="center">
          <Typography className="Regular" fontSize={12} textAlign={"right"}>
          Time : {Math.floor(elapsedTime / 60)}m  {elapsedTime % 60}s
          </Typography>
          <Typography className="bold" fontSize={16}>
            Question {currentQuestionIndex + 1} of {quizData.length}
          </Typography>

          <Typography className="bold" fontSize={18} dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

          <Button
            variant="outlined"
            size="small"
            onClick={() => handleAnswerClick('A')}
            disabled={!!selectedAnswer}
            sx={{ textTransform: "capitalize" }}
          >
            <span dangerouslySetInnerHTML={{ __html: currentQuestion.option_a }} />
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={() => handleAnswerClick('B')}
            disabled={!!selectedAnswer}
            sx={{ textTransform: "capitalize" }}
          >
            <span dangerouslySetInnerHTML={{ __html: currentQuestion.option_b }} />
          </Button>

          {currentQuestion.option_c && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAnswerClick('C')}
              disabled={!!selectedAnswer}
              sx={{ textTransform: "capitalize" }}
            >
              <span dangerouslySetInnerHTML={{ __html: currentQuestion.option_c }} />
            </Button>
          )}

          {currentQuestion.option_d && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAnswerClick('D')}
              disabled={!!selectedAnswer}
              sx={{ textTransform: "capitalize" }}
            >
              <span dangerouslySetInnerHTML={{ __html: currentQuestion.option_d }} />
            </Button>
          )}

          {showNextButton && (
            <Button
              variant="contained"
              onClick={currentQuestionIndex === quizData.length - 1 ? handleSubmitQuiz : handleNextClick}
            >
              {currentQuestionIndex === quizData.length - 1 ? 'Submit' : 'Next'}
            </Button>
          )}
        </Stack>
      ) : (
        <Paper sx={{ p: 3, width: '100%' }} variant="outlined" elevation={3}>
          <Stack direction={'column'} spacing={2} textAlign="center">
            <Typography className="bold" fontSize={22}>
              Result
            </Typography>
            <Typography className="Regular" fontSize={16}>
              {quizDataresults?.total_mark} of {quizDataresults?.total_question}
            </Typography>
            {quizDataresults?.total_mark === 0 ? (
              <Typography className="Regular" fontSize={14}>
                You must study much harder!
              </Typography>
            ) : quizDataresults?.total_mark === quizData?.length ? (
              <Typography className="Regular" fontSize={14}>
                Congratulations! You answered all questions correctly!
              </Typography>
            ) : (
              <Typography className="Regular" fontSize={14} >
                Good effort! You scored {quizDataresults?.total_mark} out of {quizData?.length}
              </Typography>
            )}
          </Stack>
        </Paper>
      )}
    </Paper>
  );
};

export default Page;
