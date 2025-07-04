// src/pages/AboutPage.tsx
import React from 'react';
import { usePageTitle } from '../hook/usePageTitle';


const AboutPage = () => {

    usePageTitle("About Us");
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1a2f] to-[#1a2a3a] text-white pt-16">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    About ShelfLib
                </h1>

                <div className="prose prose-invert max-w-none">
                    <section className="mb-12 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Our Mission</h2>
                        <p className="text-lg mb-4 text-slate-200">
                            ShelfLib was created to help book lovers organize, share, and discover new books.
                            We believe that a well-organized digital library should be accessible to everyone.
                        </p>
                        <p className="text-lg text-slate-200">
                            Our platform allows you to create virtual bookshelves, categorize your collection,
                            and share your favorite reads with the community.
                        </p>
                    </section>

                    <section className="mb-12 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Features</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-200">
                            <li>Create unlimited virtual libraries</li>
                            <li>Organize books by genre, author, or custom categories</li>
                            <li>Share your libraries publicly or keep them private</li>
                            <li>Discover books from other users</li>
                            <li>Cloud storage for your book collection</li>
                            <li>Mobile-friendly interface</li>
                        </ul>
                    </section>

                    <section className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-400">The Team</h2>
                        <p className="text-lg mb-4 text-slate-200">
                            ShelfLib is developed by a team of book enthusiasts and software developers
                            who wanted to create a better way to manage digital book collections.
                        </p>
                        <p className="text-lg text-slate-200">
                            We're constantly working to improve the platform and add new features
                            based on user feedback.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;