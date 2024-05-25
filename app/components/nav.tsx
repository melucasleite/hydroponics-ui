"use client"
import React, { useEffect, useState } from 'react';

import { AdjustmentsVerticalIcon, PlayCircleIcon, CalendarDaysIcon } from "@heroicons/react/20/solid";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Nav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        setIsOpen(!isMobile);
    }, []);

    return (
        <>
            <nav className={`md:w-[12rem] md:ml-2 mt-4 border-2 rounded bg-black-200 p-4 md:block md:h-full ${isOpen ? 'block' : 'hidden'}`}>
                <ul>
                    <li><a href="/" className="block py-1">Home</a></li>
                    <li><a href="/settings" className="py-1 flex items-center"><AdjustmentsVerticalIcon className='size-6 mr-2' /> Settings</a></li>
                    <li><a href="/schedules" className="py-1 flex items-center"><CalendarDaysIcon className='size-6 mr-2' /> Feeding Schedule</a></li>
                    <li><a href="/actions" className="py-1 flex items-center"><PlayCircleIcon className='size-6 mr-2' /> Actions</a></li>
                </ul>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <div className='text-white'>
                        <UserButton showName={true} />
                    </div>
                </SignedIn>
            </nav>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden bg-primary text-white p-2 mb-2">
                <AdjustmentsVerticalIcon className='size-6 ml-auto mr-auto' />
            </button>
        </>
    );
};

export default Nav;