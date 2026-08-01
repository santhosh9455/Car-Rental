import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { IconKey, IconShieldLock, IconDeviceFloppy } from "@tabler/icons-react";

const Settings = () => {
  const [keyId, setKeyId] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setKeyId(data.razorpayKeyId || "");
        setSecret(data.razorpaySecret || "");
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpayKeyId: keyId, razorpaySecret: secret }),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mt-14 sm:mt-0">
      <Toaster position="top-center" richColors />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">System Settings</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <IconShieldLock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Payment Gateway</h2>
              <p className="text-sm text-slate-500">Configure your Razorpay API keys securely</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razorpay Key ID</label>
              <div className="relative">
                <IconKey size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-slate-50"
                  placeholder="rzp_test_..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razorpay Secret Key</label>
              <div className="relative">
                <IconShieldLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-slate-50"
                  placeholder="Secret key..."
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/30 disabled:opacity-50"
              >
                <IconDeviceFloppy size={20} />
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
