'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShippingZone {
  _id: string;
  name: string;
  cities: string[];
  deliveryDays: number;
  isActive: boolean;
}

interface Tax {
  _id: string;
  name: string;
  rate: number;
  isActive: boolean;
}

interface Settings {
  key: string;
  payment: {
    razorpay: { keyId: string; keySecret: string; isActive: boolean };
    cod: { isActive: boolean; minimumOrder: number; maximumOrder: number; charges: number };
    upi: { isActive: boolean; upiId: string };
  };
  shipping: {
    freeShippingAbove: number;
    defaultCharge: number;
    expressCharge: number;
    processingDays: number;
    zones: ShippingZone[];
  };
  tax: {
    isActive: boolean;
    defaultRate: number;
    taxes: Tax[];
    hsnCode: string;
  };
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    gstin: string;
    currency: string;
    currencySymbol: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'payment' | 'shipping' | 'tax' | 'general'>('payment');
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Partial<ShippingZone>>({ name: '', cities: [], deliveryDays: 5, isActive: true });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section: string, data: unknown) => {
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'general', [section]: data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
      }
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const addZone = async () => {
    if (!editingZone.name) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/settings/shipping/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone),
      });
      fetchSettings();
      setShowZoneForm(false);
      setEditingZone({ name: '', cities: [], deliveryDays: 5, isActive: true });
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm('Delete this zone?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/settings/shipping/zones/${id}`, { method: 'DELETE' });
      fetchSettings();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  const addTaxRate = async (name: string, rate: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/settings/tax`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rate, isActive: true }),
      });
      fetchSettings();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  const deleteTaxRate = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/settings/tax/${id}`, { method: 'DELETE' });
      fetchSettings();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payment & Shipping</h1>
          <p className="text-sm text-white/40 mt-1">Checkout and delivery settings</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
        {(['payment', 'shipping', 'tax', 'general'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              activeTab === tab ? 'bg-[#c9a96e] text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'payment' && settings && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Razorpay</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase">Key ID</label>
                <input
                  type="text"
                  value={settings.payment?.razorpay?.keyId || ''}
                  onChange={e => setSettings({ ...settings, payment: { ...settings.payment, razorpay: { ...settings.payment.razorpay, keyId: e.target.value } } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Key Secret</label>
                <input
                  type="password"
                  value={settings.payment?.razorpay?.keySecret || ''}
                  onChange={e => setSettings({ ...settings, payment: { ...settings.payment, razorpay: { ...settings.payment.razorpay, keySecret: e.target.value } } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment?.razorpay?.isActive || false}
                onChange={e => setSettings({ ...settings, payment: { ...settings.payment, razorpay: { ...settings.payment.razorpay, isActive: e.target.checked } } })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Enable Razorpay</span>
            </label>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => saveSettings('payment', settings.payment)}
              disabled={saving}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg"
            >
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Cash on Delivery</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase">Min Order (₹)</label>
                <input
                  type="number"
                  value={settings.payment?.cod?.minimumOrder || 0}
                  onChange={e => setSettings({ ...settings, payment: { ...settings.payment, cod: { ...settings.payment.cod, minimumOrder: parseInt(e.target.value) } } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Max Order (₹)</label>
                <input
                  type="number"
                  value={settings.payment?.cod?.maximumOrder || 0}
                  onChange={e => setSettings({ ...settings, payment: { ...settings.payment, cod: { ...settings.payment.cod, maximumOrder: parseInt(e.target.value) } } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">COD Charges (₹)</label>
                <input
                  type="number"
                  value={settings.payment?.cod?.charges || 0}
                  onChange={e => setSettings({ ...settings, payment: { ...settings.payment, cod: { ...settings.payment.cod, charges: parseInt(e.target.value) } } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment?.cod?.isActive || false}
                onChange={e => setSettings({ ...settings, payment: { ...settings.payment, cod: { ...settings.payment.cod, isActive: e.target.checked } } })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Enable COD</span>
            </label>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => saveSettings('payment', settings.payment)}
              disabled={saving}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg"
            >
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>
        </div>
      )}

      {activeTab === 'shipping' && settings && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Shipping Charges</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase">Free Shipping Above (₹)</label>
                <input
                  type="number"
                  value={settings.shipping?.freeShippingAbove || 0}
                  onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, freeShippingAbove: parseInt(e.target.value) } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Default Charge (₹)</label>
                <input
                  type="number"
                  value={settings.shipping?.defaultCharge || 0}
                  onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, defaultCharge: parseInt(e.target.value) } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Express Charge (₹)</label>
                <input
                  type="number"
                  value={settings.shipping?.expressCharge || 0}
                  onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, expressCharge: parseInt(e.target.value) } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Processing Days</label>
              <input
                type="number"
                value={settings.shipping?.processingDays || 0}
                onChange={e => setSettings({ ...settings, shipping: { ...settings.shipping, processingDays: parseInt(e.target.value) } })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => saveSettings('shipping', settings.shipping)}
              disabled={saving}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg"
            >
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">Delivery Zones</h3>
              <button
                onClick={() => setShowZoneForm(true)}
                className="px-3 py-1 bg-[#c9a96e] text-black text-xs rounded-lg"
              >
                Add Zone
              </button>
            </div>

            {showZoneForm && (
              <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                <div>
                  <label className="text-xs text-white/40">Zone Name</label>
                  <input
                    type="text"
                    value={editingZone.name || ''}
                    onChange={e => setEditingZone({ ...editingZone, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="e.g., Mumbai Metro"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40">Cities (comma separated)</label>
                  <input
                    type="text"
                    value={editingZone.cities?.join(', ') || ''}
                    onChange={e => setEditingZone({ ...editingZone, cities: e.target.value.split(',').map(c => c.trim()) })}
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40">Delivery Days</label>
                  <input
                    type="number"
                    value={editingZone.deliveryDays || 5}
                    onChange={e => setEditingZone({ ...editingZone, deliveryDays: parseInt(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addZone} className="px-3 py-1 bg-[#c9a96e] text-black text-xs rounded-lg">Add</button>
                  <button onClick={() => setShowZoneForm(false)} className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {settings.shipping?.zones?.map(zone => (
                <div key={zone._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-white">{zone.name}</p>
                    <p className="text-xs text-white/40">{zone.cities?.join(', ')} • {zone.deliveryDays} days</p>
                  </div>
                  <button onClick={() => deleteZone(zone._id)} className="p-2 text-red-400 hover:text-red-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {(!settings.shipping?.zones || settings.shipping.zones.length === 0) && (
                <p className="text-white/25 text-sm text-center py-4">No zones added</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tax' && settings && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Tax Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase">Default Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.tax?.defaultRate || 0}
                  onChange={e => setSettings({ ...settings, tax: { ...settings.tax, defaultRate: parseFloat(e.target.value) } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">HSN Code</label>
                <input
                  type="text"
                  value={settings.tax?.hsnCode || ''}
                  onChange={e => setSettings({ ...settings, tax: { ...settings.tax, hsnCode: e.target.value } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tax?.isActive || false}
                onChange={e => setSettings({ ...settings, tax: { ...settings.tax, isActive: e.target.checked } })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Include Tax in Price</span>
            </label>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => saveSettings('tax', settings.tax)}
              disabled={saving}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg"
            >
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Tax Rates</h3>
            <div className="flex gap-2">
              <input id="taxName" placeholder="Tax name" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
              <input id="taxRate" type="number" placeholder="Rate %" className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
              <button
                onClick={() => {
                  const name = (document.getElementById('taxName') as HTMLInputElement).value;
                  const rate = parseFloat((document.getElementById('taxRate') as HTMLInputElement).value);
                  if (name && rate) { addTaxRate(name, rate); }
                }}
                className="px-4 py-2 bg-[#c9a96e] text-black text-sm rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {settings.tax?.taxes?.map(tax => (
                <div key={tax._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-white">{tax.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#c9a96e]">{tax.rate}%</span>
                    <button onClick={() => deleteTaxRate(tax._id)} className="p-1 text-red-400 hover:text-red-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'general' && settings && (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-medium text-white">Store Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase">Store Name</label>
              <input
                type="text"
                value={settings.general?.storeName || ''}
                onChange={e => setSettings({ ...settings, general: { ...settings.general, storeName: e.target.value } })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Email</label>
              <input
                type="email"
                value={settings.general?.storeEmail || ''}
                onChange={e => setSettings({ ...settings, general: { ...settings.general, storeEmail: e.target.value } })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Phone</label>
              <input
                type="tel"
                value={settings.general?.storePhone || ''}
                onChange={e => setSettings({ ...settings, general: { ...settings.general, storePhone: e.target.value } })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">GSTIN</label>
              <input
                type="text"
                value={settings.general?.gstin || ''}
                onChange={e => setSettings({ ...settings, general: { ...settings.general, gstin: e.target.value } })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => saveSettings('general', settings.general)}
            disabled={saving}
            className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg"
          >
            {saving ? 'Saving...' : 'Save'}
          </motion.button>
        </div>
      )}
    </div>
  );
}