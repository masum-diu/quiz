// Add this at the top of the file
'use client';

import { Button, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';
import demos from '../../assets/iconspic.svg';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Update import

const Page = () => {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  if (!userId) {
    return null; // Optionally show a loader or placeholder
  }

  return (
    <Button aria-label="" sx={{ width: "100%", textTransform: "capitalize" }} >
      <Paper sx={{ p: 3, width: "100%" }} variant="outlined" elevation={3} >
        <Image src={demos} alt=""
          style={{
            opacity: 0.9,
            animation: 'bounce 6s infinite'
          }} />

        <Stack direction={"column"} spacing={1}>
          <Typography className="bold" fontSize={18} textAlign={"center"}>
            Quiz Zone
          </Typography>
          <Typography className="Regular" fontSize={14}>
            Select your favorite Zone to play
          </Typography>
        </Stack>
      </Paper>
    </Button>
  )
}

export default Page;
