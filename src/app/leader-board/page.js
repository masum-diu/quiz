'use client';
import { Avatar, Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import instance from '../api/api_instance';

const page = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(false)
  // console.log(leaderboardData)
 

 
  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/get-leaderboard-data');
      setLeaderboardData(response?.data?.data);  // Assuming the data is in response.data
      setLoading(false);
    } catch (err) {
      setError('Error fetching leaderboard data');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaderboardData();
  }, []);
  return (
    <Box>
      <Typography className='bold' color="initial" textAlign={"center"}>Leader Board</Typography>
      <Stack direction={"row"} justifyContent={"center"} mb={4} mt={1}>
         
        {leaderboardData?.map((item, index) => (
          <Avatar
            key={index}
            src={item.user.avatar} // Assuming avatarUrl is the field holding the image URL
            sx={{
              mt: index === 1 || index === 1 ? 0 : 7 , // 2 = 20px, 3 = 30px
              width: 80,
              height: 80
            }}
          />
        ))}



      </Stack>
     
      <Paper elevation={3}>
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 450, }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Total Mark</TableCell>
                <TableCell>Consume Time</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData?.map((row) => (
                <TableRow
                  key={row.id}
                 
                >
                  <TableCell >
                    {row?.user?.name}
                  </TableCell>
                  <TableCell align='center'>
                    {row?.total_mark}
                  </TableCell>
                  <TableCell align='center'>
                    {row?.consume_time}s
                  </TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


    </Box>
  )
}

export default page
