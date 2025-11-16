import React from 'react';

const Personalization = () => (
  <div className="min-h-screen pt-24 px-6 text-white">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">Personalization</h1>
      <p className="text-gray-300 mb-6">Tune your experience. These preferences are stored locally for now.</p>
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4" onChange={(e)=>localStorage.setItem('pref_recommendations', e.target.checked? 'true':'false')} defaultChecked={localStorage.getItem('pref_recommendations')==='true'} />
          <span className="text-sm">Show AI recommendations first</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4" onChange={(e)=>localStorage.setItem('pref_compact_cards', e.target.checked? 'true':'false')} defaultChecked={localStorage.getItem('pref_compact_cards')==='true'} />
          <span className="text-sm">Compact tool cards</span>
        </label>
      </div>
    </div>
  </div>
);

export default Personalization;