import { AppBar, Box, Stack, Toolbar, Typography, Button, List, ListItem, ListItemText, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, UserButton, useClerk, useUser } from "@clerk/nextjs";

const Layout = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // console.log(user.primaryEmailAddress.emailAddress
    // )

   
    const { userId } = useAuth();
    const { signOut } = useClerk();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            // Optionally redirect the user after signing out
            // For example:
            // window.location.href = '/';
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };
   // Dependency array, call whenever `user` changes
    
    const drawerContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem>
                    <ListItemText primary={
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Typography className="SemiBold" fontSize={40}>
                                Logo
                            </Typography>
                            <IconButton size="small" aria-label="" onClick={toggleDrawer(false)} sx={{ border: "1px solid gray" }}>
                                <CloseIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                        </Stack>} />
                </ListItem>

                {['Home', 'Quiz Play', 'Instruction', 'Privacy Policy', 'Terms and Conditions'].map((text) => (
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={text === 'Home' ? '/' : `/${text.toLowerCase().replace(/\s+/g, '-')}`} passHref key={text}>
                        <ListItem button key={text} >
                            <ListItemText primary={text} />
                        </ListItem>
                    </Link>
                ))}

                {userId ? (
                    <>
                        <Link href={"/"} passHref>
                            <ListItem button>
                                <UserButton />
                            </ListItem>
                        </Link>
                        <ListItem button onClick={handleSignOut}>
                            <ListItemText primary="Sign Out" />
                        </ListItem>
                    </>
                ) : (
                    <Link href="/sign-in" passHref style={{ textDecoration: "none", color: "inherit" }}>
                        <ListItem button>
                            <ListItemText primary="Sign In" />
                        </ListItem>
                    </Link>
                )}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar position="sticky" sx={{ padding: "0px", color: "#222222", bgcolor: "#ffff", boxShadow: "none", borderBottom: "1px solid rgb(0 0 0 / 15%)", }}>
                <Toolbar sx={{
                    width: "90%", maxWidth: "1500px", margin: "0 auto", padding: "0px", '@media (min-width: 600px)': {
                        paddingLeft: '0px',
                        paddingRight: '0px',
                    },
                    height: 94
                }}>
                    <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                        <Stack direction={"row"} spacing={3} alignItems={"center"}>
                            <Typography className="SemiBold" fontSize={40}>
                                Logo
                            </Typography>
                        </Stack>

                        {/* Hamburger menu for mobile */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ display: { xs: 'flex' } }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Drawer for mobile menu */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>

            <Box sx={{ width: "90%", maxWidth: "1500px", margin: "0 auto", py: 2 }}>
                {children}
            </Box>

            <Box sx={{ backgroundColor: "#073064", height: 584, }}>
                <Stack direction={"column"} spacing={2} py={3} sx={{ width: "90%", maxWidth: "1500px", margin: "0 auto", }} >
                    <Typography className="SemiBold" fontSize={40} color={"#fff"}>
                        Logo
                    </Typography>
                    <Typography className="bold" fontSize={16} textAlign={"justify"} color={"#fff"}>
                        Quiz made with key principles of a beautiful, effective, simple to use and better code quality with use of functional based component.
                    </Typography>
                </Stack>
                <Stack direction={"column"} spacing={2} sx={{ pb: 3, width: "90%", maxWidth: "1500px", margin: "0 auto", }} >
                    <Typography className="bold" fontSize={16} color={"#fff"}>
                        Menu
                    </Typography>
                    <Typography className="bold" fontSize={16} color={"rgba(255, 255, 255, 0.5)"}>
                        Quiz Play
                    </Typography>
                    <Typography className="bold" fontSize={16} color={"rgba(255, 255, 255, 0.5)"}>
                        Instruction
                    </Typography>
                </Stack>
                <Stack direction={"column"} spacing={2} sx={{ pb: 5, width: "90%", maxWidth: "1500px", margin: "0 auto", borderBottom: "1px solid rgb(0 0 0 / 15%)", }} >
                    <Typography className="bold" fontSize={16} color={"#fff"}>
                        Policy
                    </Typography>
                    <Typography className="bold" fontSize={16} color={"rgba(255, 255, 255, 0.5)"}>
                        Privacy Policy
                    </Typography>
                    <Typography className="bold" fontSize={16} color={"rgba(255, 255, 255, 0.5)"}>
                        Terms and Conditions
                    </Typography>
                </Stack>
                <Typography className="bold" fontSize={16} pt={3} textAlign={"center"} color={"rgba(255, 255, 255, 0.5)"}>
                    Copyright © 2024 Made By EtherTech
                </Typography>
            </Box>
        </Box>
    );
};

export default Layout;
