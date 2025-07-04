// src/components/HeroSection/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PremiumBadge = () => (
    <span className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full text-sm font-medium mb-6">
        <span className="mr-2">⭐</span>
        Premium Library Experience
    </span>
);

const DomainTitle = () => (
    <h1 className="text-6xl md:text-7xl xl:text-8xl leading-[1.1] tracking-tight font-bold font-primary mt-4">
        <span className="bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Shelf
        </span>
        <span className="text-white">Lib</span>
    </h1>
);

const DomainDescription = () => (
    <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-light mt-6 font-primary">
        The ultimate platform for book lovers to organize, share, and discover new books.
        <span className="block mt-2 text-blue-400/90 font-medium">Join now to start building your digital library!</span>
    </p>
);

const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">

        <Link to={"/login"}>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg font-medium transition-all transform hover:-translate-y-1">
                Get Started
            </button>
        </Link>

    </div>
);

const DecorativeLines = () => (
    <>
        <div className="absolute top-1/2 -right-20 w-60 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0"></div>
        <div className="absolute bottom-20 -left-20 w-60 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0"></div>
    </>
);

const HeroSection = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-white overflow-hidden flex items-center justify-center px-4 relative">
            <div className="flex flex-col items-center text-center space-y-2 max-w-4xl relative z-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-70 animate-float1"></div>
                <PremiumBadge />
                <DomainTitle />
                <DomainDescription />
                <ActionButtons />
            </div>
            <DecorativeLines />
        </div>
    );
};

export default HeroSection;