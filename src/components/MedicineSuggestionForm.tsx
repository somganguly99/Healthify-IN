import React, { useState, useEffect } from 'react';
import { X, Pill, AlertTriangle } from 'lucide-react';

interface MedicineSuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestMedicine: (suggestions: string) => void;
}

const MedicineSuggestionForm: React.FC<MedicineSuggestionFormProps> = ({ isOpen, onClose, onSuggestMedicine }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    issues: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        age: '',
        height: '',
        weight: '',
        issues: ''
      });
    }
  }, [isOpen]);

  const getMedicineSuggestions = (issues: string): string => {
    if (!issues) return 'Please describe your symptoms.';

    const lowerCaseIssues = issues.toLowerCase();

    if (lowerCaseIssues.includes('fever')) 
      return `1. **Paracetamol 500mg** - 1 tablet every 6 hours (Max: 4/day)\n2. **Ibuprofen 400mg** - 1 tablet every 8 hours (Max: 3/day)\n3. **Acetaminophen 500mg** - 1 tablet every 6 hours (Max: 4/day)`;

    if (lowerCaseIssues.includes('cold')) 
      return `1. **Cetirizine 10mg** - 1 tablet daily (Max: 1/day)\n2. **Vitamin C 500mg** - 1 tablet daily\n3. **Dextromethorphan Syrup** - 10ml every 6 hours`;

    if (lowerCaseIssues.includes('cough')) 
      return `1. **Dextromethorphan Syrup** - 10ml every 6 hours\n2. **Honey & Lemon Syrup** - 1 tablespoon every 4 hours\n3. **Guaifenesin (Expectorant)** - 10ml every 8 hours`;

    if (lowerCaseIssues.includes('headache')) 
      return `1. **Ibuprofen 400mg** - 1 tablet every 8 hours (Max: 3/day)\n2. **Paracetamol 500mg** - 1 tablet every 6 hours (Max: 4/day)`;

    if (lowerCaseIssues.includes('body pain')) 
      return `1. **Ibuprofen 400mg** - 1 tablet every 8 hours\n2. **Aspirin 325mg** - 1 tablet every 6 hours\n3. **Diclofenac Gel** - Apply to affected area twice daily`;

    if (lowerCaseIssues.includes('sore throat')) 
      return `1. **Salt Water Gargle** - 2-3 times a day\n2. **Lozenges (Strepsils, Vicks)** - 1 every 2 hours\n3. **Paracetamol 500mg** - 1 tablet every 6 hours if pain persists`;

    if (lowerCaseIssues.includes('stomach pain') || lowerCaseIssues.includes('indigestion')) 
      return `1. **Antacid (Gelusil, Digene)** - 2 teaspoons after meals\n2. **Omeprazole 20mg** - 1 tablet daily before breakfast\n3. **Activated Charcoal** - 1 tablet if bloating occurs`;

    return 'Please consult a doctor for a proper diagnosis.';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const suggestions = getMedicineSuggestions(formData.issues);
    onSuggestMedicine(suggestions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center mb-6">
          <Pill className="w-12 h-12 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Seek Medicine</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full px-3 py-2 border rounded-md"
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          
          <input type="number" placeholder="Age" required className="w-full px-3 py-2 border rounded-md"
            value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          
          <input type="text" placeholder="Height (cm)" required className="w-full px-3 py-2 border rounded-md"
            value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
          
          <input type="text" placeholder="Weight (kg)" required className="w-full px-3 py-2 border rounded-md"
            value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
          
          <textarea placeholder="Describe your issues" required className="w-full px-3 py-2 border rounded-md" rows={3}
            value={formData.issues} onChange={(e) => setFormData({ ...formData, issues: e.target.value })}></textarea>

          <div className="mt-2 flex items-center bg-yellow-100 p-3 rounded-md">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              This is an AI-based suggestion. Please consult a doctor before taking any medication.
            </p>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Get Medicine Suggestion
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicineSuggestionForm;
