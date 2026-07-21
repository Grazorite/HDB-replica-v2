import React, { useState } from "react";
import { Lock, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import { CitizenProfile } from "../types";

interface SingpassLoginProps {
  onLoginSuccess: (profile: CitizenProfile) => void;
  onCancel: () => void;
}

export default function SingpassLogin({ onLoginSuccess, onCancel }: SingpassLoginProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "password">("qr");
  const [nric, setNric] = useState("S8812345D");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nric.trim()) {
      setError("NRIC is required.");
      return;
    }
    setError("");

    // Simulate login
    const mockProfile: CitizenProfile = {
      name: "Tan Wei Jie",
      nric: nric.toUpperCase(),
      email: "tan.weijie@gmail.com",
      phone: "+65 9123 4567",
      isLoggedIn: true,
      citizenStatus: "Singapore Citizen",
      monthlyHouseholdIncome: 7500,
      ownedFlat: {
        address: "Blk 231A Punggol Breeze, #12-304, Singapore 821231",
        flatType: "4-Room Premium Apartment",
        purchaseYear: 2021,
        outstandingLoan: 245000,
        remainingLease: 94,
        monthlyInstallment: 1150,
      },
      hasAppliedHfe: true,
      hfeStatus: "Eligible",
    };
    onLoginSuccess(mockProfile);
  };

  const simulateQrScan = () => {
    setIsScanning(true);
    setError("");
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        const mockProfile: CitizenProfile = {
          name: "Tan Wei Jie",
          nric: "S8812345D",
          email: "tan.weijie@gmail.com",
          phone: "+65 9123 4567",
          isLoggedIn: true,
          citizenStatus: "Singapore Citizen",
          monthlyHouseholdIncome: 7500,
          ownedFlat: {
            address: "Blk 231A Punggol Breeze, #12-304, Singapore 821231",
            flatType: "4-Room Premium Apartment",
            purchaseYear: 2021,
            outstandingLoan: 245000,
            remainingLease: 94,
            monthlyInstallment: 1150,
          },
          hasAppliedHfe: true,
          hfeStatus: "Eligible",
        };
        onLoginSuccess(mockProfile);
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Singpass Red Header Banner */}
        <div className="bg-[#bc0001] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-xl font-sans">
              sing<span className="text-white/85font-medium text-lg">pass</span>
            </span>
            <div className="bg-white/20 h-4 w-[1px] mx-1"></div>
            <span className="text-xs font-light text-white/90">Singapore Government</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors text-sm font-medium bg-white/10 px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Log In to HDB Services</h2>
            <p className="text-sm text-gray-500 mt-1">Select your preferred login method below</p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => { setActiveTab("qr"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "qr"
                  ? "border-[#bc0001] text-[#bc0001]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Singpass App (QR)
            </button>
            <button
              onClick={() => { setActiveTab("password"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "password"
                  ? "border-[#bc0001] text-[#bc0001]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Password Login
            </button>
          </div>

          {activeTab === "qr" ? (
            <div className="flex flex-col items-center py-4">
              {/* Simulated QR Code Scan Box */}
              <div className="relative w-48 h-48 border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner">
                {isScanning ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50">
                    <RefreshCw className="w-10 h-10 text-[#bc0001] animate-spin mb-2" />
                    <span className="text-xs text-gray-600 font-medium animate-pulse">Scanning Secure Code...</span>
                    <div className="absolute left-0 right-0 h-[2px] bg-[#bc0001] top-1/2 animate-bounce"></div>
                  </div>
                ) : scanComplete ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#e8f7e7]">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mb-2 animate-bounce" />
                    <span className="text-xs text-green-800 font-bold">Authenticated!</span>
                  </div>
                ) : (
                  <>
                    {/* Simulated elegant QR code visual */}
                    <div className="grid grid-cols-5 gap-1.5 p-4 opacity-80">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-sm ${
                            (i % 3 === 0 || i < 5 || i > 20 || i % 7 === 1) ? "bg-gray-800" : "bg-gray-100"
                          } ${
                            (i === 0 || i === 4 || i === 20 || i === 24) ? "border-2 border-gray-800 bg-white" : ""
                          }`}
                        />
                      ))}
                    </div>
                    {/* Outer scanner target corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#bc0001]"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#bc0001]"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#bc0001]"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#bc0001]"></div>
                  </>
                )}
              </div>

              <p className="text-xs text-center text-gray-500 mt-4 px-4 leading-relaxed">
                Scan the QR code with your <strong className="text-gray-700">Singpass App</strong> on your mobile device to complete login instantly.
              </p>

              <button
                onClick={simulateQrScan}
                disabled={isScanning || scanComplete}
                className="mt-6 bg-[#bc0001] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#a00001] active:scale-95 transition-all flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Simulate App Scan
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  NRIC / FIN
                </label>
                <input
                  type="text"
                  value={nric}
                  onChange={(e) => setNric(e.target.value)}
                  placeholder="e.g. S1234567A"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0001]/20 focus:border-[#bc0001]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Singpass Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0001]/20 focus:border-[#bc0001]"
                  />
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

              <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                Note: For security reasons, please do not use your actual credentials. You can use the mock NRIC shown above to log in instantly.
              </p>

              <button
                type="submit"
                className="w-full bg-[#bc0001] text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#a00001] active:scale-95 transition-all mt-4"
              >
                Log In
              </button>
            </form>
          )}

          <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between items-center text-[11px] text-gray-400">
            <a href="#" className="hover:underline">Forgot password?</a>
            <a href="#" className="hover:underline font-bold text-gray-500">Need help?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
