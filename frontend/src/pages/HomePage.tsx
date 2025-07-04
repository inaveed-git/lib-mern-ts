// src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import { usePageTitle } from '../hook/usePageTitle';

const HomePage = () => {

    usePageTitle("Home")

    return (
        <div className="bg-neutral-950 min-h-screen">
            <HeroSection />

            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Your Personal Digital Library
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Organize, share, and discover books with our powerful library management system.
                        Create collections, manage your digital bookshelf, and connect with other readers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Organize Collections"
                        description="Create custom libraries to organize your books by genre, author, or any category you choose."
                        icon="📚"
                    />
                    <FeatureCard
                        title="Share with Community"
                        description="Make your libraries public to share your collections with other readers and discover new books."
                        icon="🌐"
                    />
                    <FeatureCard
                        title="Cloud Storage"
                        description="Securely store your books in the cloud and access them from any device, anywhere."
                        icon="☁️"
                    />
                </div>
            </section>
        </div>
    );
};

// Feature card component
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-blue-500 transition-all">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

export default HomePage;