'use client';
import { Avatar, Box, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import instance from '../api/api_instance';

const page = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(false)
  // console.log(leaderboardData)



  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const code = await localStorage.getItem("code")
      const response = await instance.get(`/get-leaderboard-data?keyword=${code}`);
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
  const topThreeUsers = leaderboardData
    ?.sort((a, b) => {
      if (b.total_mark !== a.total_mark) {
        return b.total_mark - a.total_mark;
      }
      return a.consume_time - b.consume_time;
    })
    .slice(0, 3);
  return (
    <Box>
      {loading ? <CircularProgress /> : <Box>
        <Typography className='bold' color="initial" textAlign={"center"}>Leader Board</Typography>
        <Stack direction={"row"} justifyContent={"center"} mb={4} mt={2}>

          {topThreeUsers?.map((item, index) => (
            <Avatar
              key={index}
              src={item.user.avatar} // Assuming avatar is the field holding the image URL
              sx={{
                //  mt: index === 0 ? 2 : index === 0 ?  : 7, // Adjust margin top based on position
                width: 50,
                height: 50,
                m: .5
              }}
            />
          ))}



        </Stack>

        <Paper elevation={3}>
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 500, }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Serial</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align='center'>Total Mark</TableCell>
                  <TableCell align='center'>Consume Time</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData?.map((row, index) => (
                  <TableRow
                    key={row.id}

                  >
                    <TableCell >
                      {index + 1}
                    </TableCell>
                    <TableCell >
                      {row?.user?.name}
                    </TableCell>
                    <TableCell align='center'>
                      {row?.total_mark}
                    </TableCell>
                    <TableCell align='center'>
                      {Math.floor(row?.consume_time / 60)}m  {row?.consume_time % 60}s
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>


      </Box>}
    </Box>


  )
}

export default page
