import React, { useState } from 'react';
import { Menu, X, Heart, Phone, Users, Pill, ShoppingBag, AlertTriangle } from 'lucide-react';
import EmergencyForm from './EmergencyForm';
import MedicineSuggestionForm from './MedicineSuggestionForm';
import BuyMedicineForm from './BuyMedicineForm';
import { marked } from 'marked';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showBuyMedicineForm, setShowBuyMedicineForm] = useState(false);
  const [medicineSuggestions, setMedicineSuggestions] = useState<string | null>(null);

  const handleMedicineSuggestion = (suggestions: string) => {
    setMedicineSuggestions(marked(suggestions));
    setShowMedicineForm(false);
  };

  const navItems = [
    { name: 'Emergency', icon: Phone, onClick: () => { setShowEmergencyForm(true); setIsOpen(false); }},
    { name: 'About Us', icon: Users },
    { name: 'Seek Medicine', icon: Pill, onClick: () => { setShowMedicineForm(true); setIsOpen(false); }},
    { name: 'Buy Medicine', icon: ShoppingBag, onClick: () => { setShowBuyMedicineForm(true); setIsOpen(false); }}
  ];

  return (
    <>
      <nav className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-400" />
            <span className="text-xl font-bold tracking-wide">Healthify</span>
          </div>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button key={item.name} onClick={item.onClick} className="flex items-center px-4 py-2 rounded-md hover:bg-[#2563eb]">
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-[#2563eb]">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* ✅ Emergency Popup */}
      {showEmergencyForm && (
        <EmergencyForm isOpen={showEmergencyForm} onClose={() => setShowEmergencyForm(false)} />
      )}

      {/* ✅ Medicine Suggestion Popup */}
      <MedicineSuggestionForm isOpen={showMedicineForm} onClose={() => setShowMedicineForm(false)} onSuggestMedicine={handleMedicineSuggestion} />

      {/* ✅ Medicine Suggestions Display */}
      {medicineSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Suggested Medicines</h2>
            <p dangerouslySetInnerHTML={{ __html: medicineSuggestions }} className="mb-4" />

            <div className="flex items-center bg-yellow-100 p-3 rounded-md mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                This is an AI-based suggestion. Please consult a doctor before taking any medication.
              </p>
            </div>

            <button onClick={() => setMedicineSuggestions(null)} className="mt-2 bg-blue-600 text-white py-2 rounded-md w-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Buy Medicine Popup (THIS WAS MISSING) */}
      {showBuyMedicineForm && (
        <BuyMedicineForm isOpen={showBuyMedicineForm} onClose={() => setShowBuyMedicineForm(false)} />
      )}
    </>
  );
};

export default Navbar;
