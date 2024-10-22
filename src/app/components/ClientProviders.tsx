"use client"
import { ThemeProvider } from "@emotion/react";

import { CssBaseline } from "@mui/material";

import { ClerkProvider } from "@clerk/nextjs";
import theme from "./theme";
import Layout from "./Layout";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <ClerkProvider afterSignUpUrl={"/quiz-play"}>
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
