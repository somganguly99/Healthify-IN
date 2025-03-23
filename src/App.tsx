import React from 'react';
import Navbar from './components/Navbar';
import Map from './components/Map';
import { MapPin, Clock, Languages as Language, Database } from 'lucide-react';

function App() {
  const features = [
    {
      icon: MapPin,
      title: 'Hospital Accessibility',
      description: 'Find nearby hospitals with available seats to reduce treatment delays.'
    },
    {
      icon: Clock,
      title: 'Emergency Response',
      description: 'Quick ambulance booking during emergencies for faster response times.'
    },
    {
      icon: Language,
      title: 'Language Support',
      description: 'Multilingual support to make healthcare more inclusive and accessible.'
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Centralized healthcare information for better decision-making.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#1e3a8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Find Healthcare Services Near You
            </h1>
            <p className="text-xl mb-8">
              Locate hospitals, check availability, and get emergency assistance quickly
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Map />
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <feature.icon className="w-12 h-12 text-[#1e3a8a] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Healthify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;