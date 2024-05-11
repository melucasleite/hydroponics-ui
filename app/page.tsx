// page.tsx
import React from 'react';
import Head from 'next/head';
import Nav from './components/nav';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <Head>
                <title>My App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Nav />
            <main className="md:w-3/4 p-4 overflow-auto">
                <h1 className="text-2xl mb-4">Welcome to My App</h1>
                <p>This is the main content area.</p>
            </main>
        </div>
    );
};

export default Home;