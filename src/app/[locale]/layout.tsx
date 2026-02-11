import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "../globals.css";  // Adjusted path
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const pressStart2P = Press_Start_2P({
    weight: "400",
    variable: "--font-pixel",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Taste Tree",
    description: "나만의 취향 나무, Taste Tree",
};

export default async function LocaleLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const { children } = props;
    // Provide all messages to the client
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${pressStart2P.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
