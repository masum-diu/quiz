"use client"
import { ThemeProvider } from "@emotion/react";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import theme from './components/theme'
import Layout from './components/Layout'
import { ClerkProvider } from "@clerk/nextjs";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <ClerkProvider>
            <html lang="en">

                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <body >
                        <Layout>
                            {children}
                        </Layout>

                    </body>
                </ThemeProvider>


            </html>
        </ClerkProvider>
    );
}
