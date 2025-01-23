import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { WhatsAppNumbers } from '@/types/business';

const WhatsAppSettings = () => {
  const { user } = useAuth();
  const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumbers>([]);
  const [selectedNumber, setSelectedNumber] = useState<WhatsAppNumbers[0] | null>(null);

  useEffect(() => {
    const fetchWhatsappNumbers = async () => {
      try {
        const response = await fetch(`/api/whatsapp-numbers`);
        const data = await response.json();
        setWhatsappNumbers(data);
      } catch (error) {
        console.error('Failed to fetch WhatsApp numbers:', error);
        toast.error('Failed to fetch WhatsApp numbers');
      }
    };

    fetchWhatsappNumbers();
  }, []);

  const handleServiceChange = (service: string) => {
    const serviceNumber = whatsappNumbers.find(n => n.name === service);
    if (serviceNumber) {
      setSelectedNumber(serviceNumber);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">WhatsApp Settings</h1>
      <div>
        <label htmlFor="whatsappNumbers">Select Number:</label>
        <select
          id="whatsappNumbers"
          onChange={(e) => handleServiceChange(e.target.value)}
          className="mt-2 block w-full"
        >
          <option value="">Select a number</option>
          {whatsappNumbers.map((number) => (
            <option key={number.id} value={number.name}>
              {number.number} - {number.name}
            </option>
          ))}
        </select>
      </div>
      {selectedNumber && (
        <div className="mt-4">
          <h2 className="text-lg">Selected Number:</h2>
          <p>{selectedNumber.number}</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSettings;