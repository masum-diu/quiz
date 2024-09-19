"use client";

import {
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import instance from "../api/api_instance";

const Page = () => {
  const [inputCode, setInputCode] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const currentQuestion = quizData ? quizData[currentQuestionIndex] : null;

  // Fetch quiz data based on the code entered
  const handleSubmit = async () => {
    setLoading(true); // Set loading state to true when submit is clicked
    try {
      const response = await instance.get(
        `/get-quiz?code=${inputCode}&taken=10`
      );
      setQuizData(response?.data); // Assuming response.data is the array of questions
      setIsQuizStarted(true); // Start the quiz after fetching data
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
    setLoading(false); // Set loading state to false after data is fetched
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    setShowNextButton(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <Paper sx={{ p: 3, width: "100%" }} variant="outlined" elevation={3}>
      {!isQuizStarted ? (
        // Show input form for the code
        <Stack direction={"column"} spacing={2} textAlign="center">
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
          {/* Show loading spinner or submit button based on loading state */}
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Stack>
      ) : currentQuestion ? (
        // Show quiz questions
        <Stack direction={"column"} spacing={2} textAlign="center">
          <Typography className="bold" fontSize={16}>
            Question {currentQuestionIndex + 1} of {quizData.length}
          </Typography>
          {/* Display the current question */}
          <Typography
            className="bold"
            fontSize={18}
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />

          {/* Display options, handling different question types */}
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAnswerClick("A")}
              disabled={!!selectedAnswer}
            >
              <span
                dangerouslySetInnerHTML={{ __html: currentQuestion.option_a }}
              />
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAnswerClick("B")}
              disabled={!!selectedAnswer}
            >
              <span
                dangerouslySetInnerHTML={{ __html: currentQuestion.option_b }}
              />
            </Button>
            {currentQuestion.option_c && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleAnswerClick("C")}
                disabled={!!selectedAnswer}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: currentQuestion.option_c }}
                />
              </Button>
            )}
            {currentQuestion.option_d && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleAnswerClick("D")}
                disabled={!!selectedAnswer}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: currentQuestion.option_d }}
                />
              </Button>
            )}
          </>

          {showNextButton && (
            <Button variant="contained" onClick={handleNextClick}>
              Next
            </Button>
          )}
        </Stack>
      ) : (
        <Paper sx={{ p: 3, width: "100%" }} variant="outlined" elevation={3}>
          <Stack direction={"column"} spacing={2} textAlign="center">
            <Typography className="bold" fontSize={18}>
              Quiz Completed!
            </Typography>
            <Typography className="Regular" fontSize={14}>
              Thank you for participating in the quiz.
            </Typography>
          </Stack>
        </Paper>
      )}
    </Paper>
  );
};

export default Page;
