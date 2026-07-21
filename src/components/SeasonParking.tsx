import React, { useState } from "react";
import { 
  ParkingMeter, CreditCard, RefreshCw, CheckCircle2, ArrowLeftRight, 
  Search, ShieldCheck, FileText, Calendar, Car
} from "lucide-react";
import { SeasonParkingPass } from "../types";

export default function SeasonParking() {
  const [activeTab, setActiveTab] = useState<"renew" | "transfer">("renew");
  const [passes, setPasses] = useState<SeasonParkingPass[]>([
    {
      id: "SP-9012A",
      plateNumber: "SGA1234Z",
      iuNumber: "1234567890",
      carparkCode: "PG81",
      vehicleType: "Car",
      startDate: "2026-05-01",
      endDate: "2026-08-31",
      status: "Active",
      monthlyPrice: 110,
    }
  ]);

  // Renewal Form State
  const [selectedPassId, setSelectedPassId] = useState("SP-9012A");
  const [renewMonths, setRenewMonths] = useState(3);
  const [paymentStep, setPaymentStep] = useState<"form" | "checkout" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"nets" | "card">("card");

  // Transfer Form State
  const [transferType, setTransferType] = useState<"carpark" | "vehicle">("carpark");
  const [newCarpark, setNewCarpark] = useState("PG82");
  const [newPlate, setNewPlate] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [carparkAvailability, setCarparkAvailability] = useState<"available" | "full" | "checking">("checking");

  const selectedPass = passes.find(p => p.id === selectedPassId) || passes[0];
  const totalPrice = selectedPass ? selectedPass.monthlyPrice * renewMonths : 0;

  const handleRenewPayment = () => {
    setPaymentStep("checkout");
    setTimeout(() => {
      // Simulate successful payment after 1.5 seconds
      setPaymentStep("success");
      setPasses(prev => prev.map(p => {
        if (p.id === selectedPassId) {
          const currentEnd = new Date(p.endDate);
          currentEnd.setMonth(currentEnd.getMonth() + renewMonths);
          return {
            ...p,
            endDate: currentEnd.toISOString().split('T')[0],
          };
        }
        return p;
      }));
    }, 1500);
  };

  const handleCheckCarpark = () => {
    setCheckingAvailability(true);
    setCarparkAvailability("checking");
    setTimeout(() => {
      setCheckingAvailability(false);
      // Simulate availability based on code
      if (newCarpark.toUpperCase().includes("FULL")) {
        setCarparkAvailability("full");
      } else {
        setCarparkAvailability("available");
      }
    }, 1000);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingAvailability(true);
    setTimeout(() => {
      setCheckingAvailability(false);
      setTransferSuccess(true);
      setPasses(prev => prev.map(p => {
        if (p.id === "SP-9012A") {
          return {
            ...p,
            carparkCode: transferType === "carpark" ? newCarpark.toUpperCase() : p.carparkCode,
            plateNumber: transferType === "vehicle" ? newPlate.toUpperCase() : p.plateNumber,
          };
        }
        return p;
      }));
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#bdc9c9] shadow-sm overflow-hidden">
      {/* Title Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <ParkingMeter className="w-6 h-6 text-[#91f2f7]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans">Season Parking Management</h2>
            <p className="text-xs text-white/80">Renew, transfer, or search for available HDB carparks</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Active Passes Banner List */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Your Active Season Parking Passes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passes.map(pass => (
              <div 
                key={pass.id} 
                className="bg-[#f0f4f4] border border-[#bdc9c9] rounded-xl p-5 flex justify-between items-center relative overflow-hidden"
              >
                {/* Background watermarked car */}
                <Car className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-200/50 pointer-events-none" />
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-lg">{pass.plateNumber}</span>
                    <span className="bg-[#e8f7e7] text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                      {pass.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Carpark Code: <strong>{pass.carparkCode}</strong> | Type: {pass.vehicleType}</p>
                  <p className="text-xs text-gray-500">Valid till: <strong className="text-primary">{new Date(pass.endDate).toLocaleDateString("en-SG", { day: 'numeric', month: 'short', year: 'numeric' })}</strong></p>
                </div>
                <div className="text-right relative z-10">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Standard Price</span>
                  <span className="text-lg font-bold text-primary">S$ {pass.monthlyPrice} <span className="text-xs font-normal text-gray-400">/mo</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => { setActiveTab("renew"); setPaymentStep("form"); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "renew"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Renew Season Parking
          </button>
          <button
            onClick={() => { setActiveTab("transfer"); setTransferSuccess(false); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "transfer"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Transfer Season Parking (Carpark / Vehicle)
          </button>
        </div>

        {/* Content Section */}
        {activeTab === "renew" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {paymentStep === "form" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Select Season Parking to Renew
                    </label>
                    <select
                      value={selectedPassId}
                      onChange={(e) => setSelectedPassId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {passes.map(p => (
                        <option key={p.id} value={p.id}>{p.plateNumber} ({p.carparkCode})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Renewal Duration
                    </label>
                    <select
                      value={renewMonths}
                      onChange={(e) => setRenewMonths(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value={1}>1 Month</option>
                      <option value={3}>3 Months (Quarterly)</option>
                      <option value={6}>6 Months (Half-Yearly)</option>
                      <option value={12}>12 Months (Annual)</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown Banner */}
                <div className="bg-[#f0f4f4] border border-[#bdc9c9] rounded-xl p-5 flex justify-between items-center mt-6">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider">RENEWAL BREAKDOWN</span>
                    <p className="text-sm text-gray-700">
                      S$ {selectedPass?.monthlyPrice} × {renewMonths} Month(s)
                    </p>
                    <p className="text-xs text-gray-400">GST is absorbed by HDB for all residential season passes.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase font-bold block">Total Payable</span>
                    <span className="text-2xl font-bold text-primary">S$ {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex justify-end">
                  <button
                    onClick={handleRenewPayment}
                    className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Secure Payment
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "checkout" && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-in zoom-in-95 duration-200">
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                <h4 className="text-lg font-bold text-gray-800">Processing Secure Transaction</h4>
                <p className="text-sm text-gray-500 max-w-sm">Connecting with NETS Secure Gateway. Please do not close or refresh this page.</p>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="border-2 border-[#e8f7e7] bg-[#e8f7e7]/30 rounded-2xl p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-[#e8f7e7] text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-green-800">Season Parking Renewed Successfully!</h4>
                <p className="text-sm text-green-700 mt-1 max-w-md mx-auto">
                  A receipt has been generated, and your vehicle is now registered as valid under carpark {selectedPass?.carparkCode} till the new extended date.
                </p>

                {/* Digital Receipt */}
                <div className="bg-white border border-[#bdc9c9] rounded-xl p-6 max-w-md mx-auto mt-6 text-left space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-green-600 text-white text-[9px] font-bold px-3 py-1 uppercase rounded-bl">
                    PAID
                  </div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">HDB OFFICIAL RECEIPT</h5>
                  
                  <div className="divide-y divide-gray-100 text-xs">
                    <div className="py-2 flex justify-between"><span className="text-gray-500">Transaction ID:</span> <strong>TXN-2026-90234B</strong></div>
                    <div className="py-2 flex justify-between"><span className="text-gray-500">Vehicle Number:</span> <strong>{selectedPass?.plateNumber}</strong></div>
                    <div className="py-2 flex justify-between"><span className="text-gray-500">HDB Carpark Code:</span> <strong>{selectedPass?.carparkCode}</strong></div>
                    <div className="py-2 flex justify-between"><span className="text-gray-500">Renewal Term:</span> <strong>{renewMonths} Month(s)</strong></div>
                    <div className="py-2 flex justify-between"><span className="text-gray-500">Amount Paid:</span> <strong className="text-green-700">S$ {totalPrice.toLocaleString()}</strong></div>
                  </div>

                  <div className="pt-2 text-center">
                    {/* Simulated Receipt Barcode */}
                    <div className="bg-gray-100 h-8 w-full flex items-center justify-center gap-[1.5px] px-4 opacity-70">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="bg-black h-full" style={{ width: i % 3 === 0 ? "3px" : "1px" }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 mt-1 block">*SP_REC_2026_90234*</span>
                  </div>
                </div>

                <button
                  onClick={() => setPaymentStep("form")}
                  className="mt-6 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {transferSuccess ? (
              <div className="bg-[#e8f7e7] border border-green-200 rounded-2xl p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-[#e8f7e7] text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-green-800">Season Parking Transferred Successfully!</h4>
                <p className="text-sm text-green-700 mt-1 max-w-md mx-auto">
                  Your season parking details have been instantly updated. Any active IU sensor system will update automatically within 15 minutes.
                </p>
                <button
                  onClick={() => setTransferSuccess(false)}
                  className="mt-6 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  Make Another Transfer
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Transfer Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTransferType("carpark")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                          transferType === "carpark"
                            ? "bg-primary/5 border-primary text-primary font-bold"
                            : "bg-[#f6fafa] border-[#bdc9c9] text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        Transfer Carpark
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferType("vehicle")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                          transferType === "vehicle"
                            ? "bg-primary/5 border-primary text-primary font-bold"
                            : "bg-[#f6fafa] border-[#bdc9c9] text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Car className="w-4 h-4" />
                        Transfer Vehicle
                      </button>
                    </div>
                  </div>

                  {transferType === "carpark" ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Enter New HDB Carpark Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCarpark}
                          onChange={(e) => setNewCarpark(e.target.value)}
                          placeholder="e.g. PG82"
                          className="flex-1 px-4 py-2.5 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={handleCheckCarpark}
                          className="bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
                        >
                          <Search className="w-4 h-4" />
                          Check
                        </button>
                      </div>

                      {/* Real-Time Availability results */}
                      <div className="mt-2.5">
                        {checkingAvailability ? (
                          <span className="text-xs text-gray-400 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking official quota availability...
                          </span>
                        ) : carparkAvailability === "available" ? (
                          <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> Available Lots Found! Eligible for instant transfer.
                          </span>
                        ) : carparkAvailability === "full" ? (
                          <span className="text-xs text-red-600 font-bold block">
                            ⚠ Selected carpark has 0 season lots remaining. You can apply to be on the waiting list.
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Enter New Vehicle Plate Number
                      </label>
                      <input
                        type="text"
                        value={newPlate}
                        onChange={(e) => setNewPlate(e.target.value)}
                        placeholder="e.g. SGA8812S"
                        className="w-full px-4 py-2.5 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-xs text-gray-400 mt-1">Requires an active road tax and registered IU on Land Transport Authority (LTA).</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={transferType === "carpark" && carparkAvailability !== "available"}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                      transferType === "carpark" && carparkAvailability !== "available"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-100 shadow-none"
                        : "bg-primary text-on-primary hover:opacity-90 active:scale-95"
                    }`}
                  >
                    Confirm Season Parking Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
