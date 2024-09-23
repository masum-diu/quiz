"use client"
import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import { Stack, Typography } from '@mui/material'
import Image from 'next/image'
import demo from "../assets/1668511774.png"
import Link from 'next/link'

function page() {
 
  return (
    <Stack direction={"column"} spacing={2} py={2}>
      <Typography className="bold" fontSize={30} color={"#090029"} textAlign={"center"}>
        Winners Train Losers Complain
      </Typography>
      <Typography className="bold" fontSize={18} textAlign={"center"}>
        Train yourself and become a quiz master
      </Typography>
      <Link href="/quiz-play" passHref style={{ width: "100%" }}>
        <Button variant="contained" color="primary" fullWidth>
          Let's play
        </Button>
      </Link>
      <Image src={demo} alt=""
        style={{
          width: "100%",
          opacity: 0.9,
          animation: 'bounce 6s infinite',
          height: "100%"
        }} />



    </Stack>
  )
}

export default page