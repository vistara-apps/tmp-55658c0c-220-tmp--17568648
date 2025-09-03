'use client';

import { useState } from 'react';
import { SubscriptionTier } from '@/lib/subscription/manager';

interface PaymentFormProps {
  tier: SubscriptionTier;
  onSubmit: (paymentMethod: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function PaymentForm({ tier, onSubmit, onCancel }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill in all fields');
      return;
    }
    
    // In a real app, we would validate the card details more thoroughly
    if (cardNumber.length < 16) {
      setError('Invalid card number');
      return;
    }
    
    if (cvv.length < 3) {
      setError('Invalid CVV');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would use a payment processor like Stripe
      // For now, we'll just simulate a successful payment
      const success = await onSubmit('mock-payment-method');
      
      if (!success) {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-card">
      <h3 className="text-xl font-bold mb-4">Payment Details</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardName" className="block text-sm font-medium mb-1">
            Name on Card
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              className="w-full p-2 border rounded-md"
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay $${tier === SubscriptionTier.PREMIUM ? '5.00' : '0.00'}`}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This is a demo application. No actual payment will be processed.</p>
        <p>You can use any valid-looking card details for testing.</p>
      </div>
    </div>
  );
}

