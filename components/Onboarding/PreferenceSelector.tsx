'use client';

interface PreferenceSelectorProps {
  preferences: string[];
  selectedPreferences: string[];
  onChange: (preference: string) => void;
}

export default function PreferenceSelector({ 
  preferences, 
  selectedPreferences, 
  onChange 
}: PreferenceSelectorProps) {
  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        Select the vibes you're interested in (choose at least 3)
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {preferences.map(preference => (
          <div 
            key={preference}
            onClick={() => onChange(preference)}
            className={`
              p-3 rounded-md cursor-pointer transition-all duration-base
              ${selectedPreferences.includes(preference) 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            {preference}
          </div>
        ))}
      </div>
      
      {selectedPreferences.length < 3 && (
        <p className="mt-4 text-sm text-red-500">
          Please select at least 3 preferences
        </p>
      )}
    </div>
  );
}

