import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

interface BuyMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyMedicineForm: React.FC<BuyMedicineFormProps> = ({ isOpen, onClose }) => {
  const [medicine, setMedicine] = useState('');
  const [customMedicine, setCustomMedicine] = useState('');
  const [prices, setPrices] = useState<{ site: string; price: string; url: string }[]>([]);
  const [showPrices, setShowPrices] = useState(false);

  const medicinePrices: { [key: string]: { site: string; price: string; url: string }[] } = {
    'Paracetamol': [
      { site: 'Amazon', price: '₹250', url: 'https://www.amazon.in/s?k=Paracetamol' },
      { site: 'PharmEasy', price: '₹230', url: 'https://pharmeasy.in/search/all?name=Paracetamol' },
      { site: 'NetMeds', price: '₹240', url: 'https://www.netmeds.com/catalogsearch/result?q=Paracetamol' },
      { site: 'Medplus', price: '₹245', url: 'https://www.medplusmart.com/search?q=Paracetamol' },
      { site: 'Tata 1mg', price: '₹225', url: 'https://www.1mg.com/search/all?name=Paracetamol' }
    ],
    'Ibuprofen': [
      { site: 'Amazon', price: '₹200', url: 'https://www.amazon.in/s?k=Ibuprofen' },
      { site: 'PharmEasy', price: '₹190', url: 'https://pharmeasy.in/search/all?name=Ibuprofen' },
      { site: 'NetMeds', price: '₹195', url: 'https://www.netmeds.com/catalogsearch/result?q=Ibuprofen' },
      { site: 'Medplus', price: '₹198', url: 'https://www.medplusmart.com/search?q=Ibuprofen' },
      { site: 'Tata 1mg', price: '₹185', url: 'https://www.1mg.com/search/all?name=Ibuprofen' }
    ],
    'Cetirizine': [
      { site: 'Amazon', price: '₹150', url: 'https://www.amazon.in/s?k=Cetirizine' },
      { site: 'PharmEasy', price: '₹140', url: 'https://pharmeasy.in/search/all?name=Cetirizine' },
      { site: 'NetMeds', price: '₹145', url: 'https://www.netmeds.com/catalogsearch/result?q=Cetirizine' },
      { site: 'Medplus', price: '₹148', url: 'https://www.medplusmart.com/search?q=Cetirizine' },
      { site: 'Tata 1mg', price: '₹135', url: 'https://www.1mg.com/search/all?name=Cetirizine' }
    ],
    'Vitamin C': [
      { site: 'Amazon', price: '₹300', url: 'https://www.amazon.in/s?k=Vitamin+C' },
      { site: 'PharmEasy', price: '₹280', url: 'https://pharmeasy.in/search/all?name=Vitamin+C' },
      { site: 'NetMeds', price: '₹290', url: 'https://www.netmeds.com/catalogsearch/result?q=Vitamin+C' },
      { site: 'Medplus', price: '₹295', url: 'https://www.medplusmart.com/search?q=Vitamin+C' },
      { site: 'Tata 1mg', price: '₹275', url: 'https://www.1mg.com/search/all?name=Vitamin+C' }
    ],
    'Dextromethorphan': [
      { site: 'Amazon', price: '₹180', url: 'https://www.amazon.in/s?k=Dextromethorphan' },
      { site: 'PharmEasy', price: '₹170', url: 'https://pharmeasy.in/search/all?name=Dextromethorphan' },
      { site: 'NetMeds', price: '₹175', url: 'https://www.netmeds.com/catalogsearch/result?q=Dextromethorphan' },
      { site: 'Medplus', price: '₹178', url: 'https://www.medplusmart.com/search?q=Dextromethorphan' },
      { site: 'Tata 1mg', price: '₹165', url: 'https://www.1mg.com/search/all?name=Dextromethorphan' }
    ]
  };

  const medicinesList = Object.keys(medicinePrices);

  const selectedMedicine = customMedicine || medicine;

  const fetchMedicinePrices = () => {
    if (!selectedMedicine || !(selectedMedicine in medicinePrices)) {
      setPrices([]);
      setShowPrices(false);
      return;
    }
    setPrices(medicinePrices[selectedMedicine]);
    setShowPrices(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Buy Medicine</h2>
        </div>

        {/* Medicine Selection */}
        <div className="space-y-4">
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={medicine}
            onChange={(e) => {
              setMedicine(e.target.value);
              setCustomMedicine('');
              setShowPrices(false);
            }}
          >
            <option value="">Select Medicine</option>
            {medicinesList.map((med) => (
              <option key={med} value={med}>
                {med}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or enter medicine name"
            className="w-full px-3 py-2 border rounded-md"
            value={customMedicine}
            onChange={(e) => {
              setCustomMedicine(e.target.value);
              setMedicine('');
              setShowPrices(false);
            }}
          />
        </div>

        {/* Compare Prices Button */}
        <button
          onClick={fetchMedicinePrices}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Compare Prices
        </button>

        {/* Price Comparison Section */}
        {showPrices && prices.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold">Price Comparison:</h3>
            <ul className="list-disc list-inside">
              {prices.map((item, index) => (
                <li key={index} className="text-gray-800">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    {item.site}
                  </a>: <span className="font-semibold">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close Button */}
        <button onClick={onClose} className="mt-4 w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default BuyMedicineForm;
