import React from 'react';

const Settings = () => (
  <div className="min-h-screen pt-24 px-6 text-white">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">Settings</h1>
      <p className="text-gray-300 mb-4">Basic account settings. Future: email preferences, privacy controls.</p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Display Name</label>
          <input defaultValue={localStorage.getItem('username')||''} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm" onBlur={(e)=>localStorage.setItem('username', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input disabled value={localStorage.getItem('userEmail')||''} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm opacity-70" />
        </div>
      </form>
    </div>
  </div>
);

export default Settings;