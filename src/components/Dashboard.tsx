import React, { useState } from "react";
import { 
  User, Home, Calendar, Mail, FileText, CreditCard, Percent, ArrowUpRight, 
  Trash2, ChevronRight, CheckCircle2, AlertCircle, Sparkles, LogOut, MessageSquare, MapPin
} from "lucide-react";
import { CitizenProfile, SeasonParkingPass, Appointment } from "../types";

interface DashboardProps {
  profile: CitizenProfile;
  onLogout: () => void;
  onNavigateToTab: (tabName: "hfe" | "parking" | "appointment") => void;
}

export default function Dashboard({ profile, onLogout, onNavigateToTab }: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "appointments" | "loans" | "mail">("overview");
  
  // Outstanding loan modeling state
  const [prepayAmount, setPrepayAmount] = useState(10000);
  const [isPrepaid, setIsPrepaid] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-20349",
      branch: "Punggol Branch Office",
      serviceType: "HDB Flat Key Collection & Inspection",
      date: "2026-07-25",
      time: "10:30 AM",
      status: "Confirmed",
    }
  ]);

  // Letters Inbox State
  const [letters, setLetters] = useState([
    {
      id: "LTR-001",
      sender: "HDB Housing Grants Division",
      subject: "Application for HDB Flat Eligibility (HFE) - Approved",
      date: "2026-07-15",
      content: "Dear Applicant,\n\nWe are pleased to inform you that your application for HDB Flat Eligibility (HFE) has been APPROVED. Your HFE Letter reference is HFE-2026-07923C.\n\nYou are eligible for up to S$ 30,000 in Enhanced CPF Housing Grants (EHG) and an HDB housing loan up to S$ 420,000.",
      read: false,
    },
    {
      id: "LTR-002",
      sender: "HDB Carpark Administration",
      subject: "Season Parking Renewal Notification (SGA1234Z)",
      date: "2026-07-10",
      content: "Dear Sir/Madam,\n\nThis is a friendly reminder that your season parking pass (SP-9012A) for vehicle SGA1234Z at Punggol Breeze PG81 will expire on 31 August 2026.\n\nPlease renew your season parking pass online to ensure uninterrupted parking lot availability.",
      read: true,
    }
  ]);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const handleReadLetter = (id: string) => {
    setSelectedLetterId(id);
    setLetters(prev => prev.map(l => l.id === id ? { ...l, read: true } : l));
  };

  // Prepayment math modeling
  // Loan balance: 245000, 2.6% interest, 15 years left
  const currentLoan = profile.ownedFlat?.outstandingLoan || 245000;
  const currentInstallment = profile.ownedFlat?.monthlyInstallment || 1150;
  
  // Estimations
  const estimatedInterestSavings = Math.round(prepayAmount * 0.42); // estimated compounded interest saved
  const estimatedTenureReduction = Math.round((prepayAmount / currentInstallment) * 1.5); // estimated months shaved off

  return (
    <div className="bg-white rounded-2xl border border-[#bdc9c9] shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Dashboard Top Banner */}
      <div className="bg-[#00686c] p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#91f2f7]">
            <User className="w-7 h-7 text-[#91f2f7]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-sans">Welcome back, {profile.name}</h2>
              <span className="bg-white/20 text-[#91f2f7] text-[10px] font-bold px-2 py-0.5 rounded border border-[#91f2f7]/30">
                {profile.citizenStatus}
              </span>
            </div>
            <p className="text-xs text-white/80">Logged in via Singpass Secure | NRIC: {profile.nric}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-[#bc0001] text-white hover:bg-opacity-95 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout Singpass
        </button>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-[#f6fafa] px-6">
        {[
          { id: "overview", label: "My Flat Overview" },
          { id: "appointments", label: `Appointments (${appointments.length})` },
          { id: "loans", label: "Mortgage Simulator" },
          { id: "mail", label: `Correspondence (${letters.filter(l => !l.read).length} Unread)` }
        ].map(subTab => (
          <button
            key={subTab.id}
            onClick={() => { setActiveSubTab(subTab.id as any); setSelectedLetterId(null); }}
            className={`py-4 px-3 text-xs font-bold transition-all border-b-2 uppercase tracking-wider ${
              activeSubTab === subTab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {subTab.label}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div className="p-8">
        {activeSubTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Flat Property Summary Card */}
            {profile.ownedFlat && (
              <div className="bg-[#f0f4f4] border border-[#bdc9c9] rounded-2xl p-6 relative overflow-hidden">
                <Home className="absolute -right-6 -bottom-6 w-32 h-32 text-gray-200/50 pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">MY REGISTERED HDB PROPERTY</span>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{profile.ownedFlat.address}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Flat Model Type</span>
                      <strong className="text-gray-800 text-sm">{profile.ownedFlat.flatType}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Purchase Year</span>
                      <strong className="text-gray-800 text-sm">{profile.ownedFlat.purchaseYear}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Outstanding Mortgage</span>
                      <strong className="text-gray-800 text-sm">S$ {profile.ownedFlat.outstandingLoan.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Remaining Lease</span>
                      <strong className="text-gray-800 text-sm">{profile.ownedFlat.remainingLease} Years</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions / Recommendations Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">HDB Citizen Quick Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => onNavigateToTab("hfe")}
                  className="bg-white border border-gray-100 hover:border-primary/20 hover:bg-gray-50 text-left p-5 rounded-xl shadow-sm transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-gray-800 text-sm group-hover:text-primary">Apply / Renew HFE Letter</span>
                    <p className="text-xs text-gray-500">Calculate grants and check BTO resale buying eligibility limits.</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                </button>

                <button
                  onClick={() => onNavigateToTab("parking")}
                  className="bg-white border border-gray-100 hover:border-primary/20 hover:bg-gray-50 text-left p-5 rounded-xl shadow-sm transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-gray-800 text-sm group-hover:text-primary">Renew Season Parking</span>
                    <p className="text-xs text-gray-500">Pay your upcoming season parking fee instantly via Nets/Credit Card.</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                </button>

                <button
                  onClick={() => onNavigateToTab("appointment")}
                  className="bg-white border border-gray-100 hover:border-primary/20 hover:bg-gray-50 text-left p-5 rounded-xl shadow-sm transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-gray-800 text-sm group-hover:text-primary">Book Appointment</span>
                    <p className="text-xs text-gray-500">Schedule physical consultation or inspection at any HDB branch.</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "appointments" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-bold text-gray-800 text-base">No Scheduled Visits</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">You do not have any active booked appointments currently.</p>
                <button
                  onClick={() => onNavigateToTab("appointment")}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Book Appointment Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="border border-[#bdc9c9] bg-[#f6fafa] p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#00686c] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {apt.status}
                        </span>
                        <span className="text-xs font-mono text-gray-400">Ref: {apt.id}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm">{apt.serviceType}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {apt.branch}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Scheduled Date: <strong>{new Date(apt.date).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}</strong> at <strong>{apt.time}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="border border-red-200 text-[#ba1a1a] hover:bg-red-50 p-2 rounded-lg flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "loans" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-[#f0f4f4] rounded-xl p-5 border border-[#bdc9c9]">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" /> Dynamic HDB Prepayment modeling
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Have extra CPF OA savings or liquid funds? Simulate an extra lump-sum prepayment on your principal loan balance to model how much interest and tenure you shave off!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Simulate Lump-sum Prepayment: <span className="text-primary font-bold">S$ {prepayAmount.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={5000}
                    max={100000}
                    step={5000}
                    value={prepayAmount}
                    onChange={(e) => {
                      setPrepayAmount(parseInt(e.target.value));
                      setIsPrepaid(false);
                    }}
                    className="w-full accent-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                    <span>S$ 5,000</span>
                    <span>S$ 50,000</span>
                    <span>S$ 100,000</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrepaid(true)}
                  className="bg-primary text-white w-full py-2.5 rounded-lg font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Apply Mock Prepayment Model
                </button>
              </div>

              {/* Graphical simulation results */}
              <div className="bg-[#f6fafa] border border-[#bdc9c9] rounded-xl p-6 relative overflow-hidden">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prepayment Assessment Results</h4>
                
                {isPrepaid ? (
                  <div className="space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2.5 text-green-700 bg-[#e8f7e7] p-3 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-bold">Prepayment Simulation Active</span>
                    </div>

                    <div className="divide-y divide-gray-100 text-xs space-y-2">
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-500">Compounded Interest Saved:</span>
                        <strong className="text-green-700 text-sm">S$ {estimatedInterestSavings.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-500">Loan Tenure Reduced by:</span>
                        <strong className="text-green-700 text-sm">~{estimatedTenureReduction} Months</strong>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-500">New Outstanding Principal:</span>
                        <strong className="text-primary text-sm">S$ {(currentLoan - prepayAmount).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 flex flex-col items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-300 mb-2 animate-bounce" />
                    <p className="text-xs">Adjust the slider and click "Apply" to calculate dynamic compound savings.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "mail" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {selectedLetterId ? (
              /* Letter Details Panel */
              (() => {
                const letterObj = letters.find(l => l.id === selectedLetterId)!;
                return (
                  <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-primary block">{letterObj.sender}</span>
                        <h4 className="text-base font-bold text-gray-800">{letterObj.subject}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400">{letterObj.date}</span>
                    </div>
                    <div className="text-xs leading-relaxed text-gray-600 whitespace-pre-line">
                      {letterObj.content}
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => setSelectedLetterId(null)}
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-xs"
                      >
                        Back to Inbox
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Letters Log List */
              <div className="divide-y divide-gray-100">
                {letters.map(letter => (
                  <button
                    key={letter.id}
                    onClick={() => handleReadLetter(letter.id)}
                    className="w-full text-left py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Mail className={`w-5 h-5 mt-0.5 shrink-0 ${letter.read ? "text-gray-300" : "text-primary animate-pulse"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${letter.read ? "text-gray-400" : "font-extrabold text-gray-800"}`}>
                            {letter.sender}
                          </span>
                          {!letter.read && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <h4 className={`text-sm ${letter.read ? "text-gray-600 font-normal" : "font-bold text-gray-800"}`}>
                          {letter.subject}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-gray-400">{letter.date}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
