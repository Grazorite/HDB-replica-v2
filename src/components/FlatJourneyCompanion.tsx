import React, { useState, useEffect } from "react";
import { Check, AlertCircle, Sparkles, HelpCircle, FileText, ArrowRight, ShieldCheck } from "lucide-react";

interface FlatJourneyCompanionProps {
  onNavigateToHfe: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToParking: () => void;
  onOpenSingpassModal: () => void;
  selectedJourney: "bto" | "resale" | "unsure" | "seller" | null;
  setSelectedJourney: (journey: "bto" | "resale" | "unsure" | "seller" | null) => void;
  activeTab: "first_timer" | "second_timer" | "seller";
  setActiveTab: (tab: "first_timer" | "second_timer" | "seller") => void;
  simulatedProfile: "sarah" | "draft" | "submitted" | "approved" | "action_required";
  setSimulatedProfile: (profile: "sarah" | "draft" | "submitted" | "approved" | "action_required") => void;
}

export default function FlatJourneyCompanion({
  onNavigateToHfe,
  onNavigateToDashboard,
  onNavigateToParking,
  onOpenSingpassModal,
  selectedJourney,
  setSelectedJourney,
  activeTab,
  setActiveTab,
  simulatedProfile,
  setSimulatedProfile,
}: FlatJourneyCompanionProps) {
  // Checklists states
  const [firstTimerChecklist, setFirstTimerChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [secondTimerChecklist, setSecondTimerChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [sellerChecklist, setSellerChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  // Keep first timer checklist in sync with simulated sandbox profiles
  useEffect(() => {
    if (activeTab === "first_timer") {
      if (simulatedProfile === "sarah") {
        setFirstTimerChecklist({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "draft") {
        setFirstTimerChecklist({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "submitted") {
        setFirstTimerChecklist({ 1: true, 2: true, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "approved") {
        setFirstTimerChecklist({ 1: true, 2: true, 3: true, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "action_required") {
        setFirstTimerChecklist({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      }
    }
  }, [simulatedProfile, activeTab]);

  // Handle checking checklist progress dynamically
  const getProgressPercent = () => {
    if (activeTab === "first_timer") {
      const activeCount = Object.values(firstTimerChecklist).filter(Boolean).length;
      return Math.round((activeCount / 6) * 100);
    } else if (activeTab === "second_timer") {
      const activeCount = Object.values(secondTimerChecklist).filter(Boolean).length;
      return Math.round((activeCount / 5) * 100);
    } else {
      const activeCount = Object.values(sellerChecklist).filter(Boolean).length;
      return Math.round((activeCount / 6) * 100);
    }
  };

  const getCompletedCount = () => {
    if (activeTab === "first_timer") return Object.values(firstTimerChecklist).filter(Boolean).length;
    if (activeTab === "second_timer") return Object.values(secondTimerChecklist).filter(Boolean).length;
    return Object.values(sellerChecklist).filter(Boolean).length;
  };

  const getTotalCount = () => {
    if (activeTab === "first_timer") return 6;
    if (activeTab === "second_timer") return 5;
    return 6;
  };

  // Profiles labels & details
  const profileLabels = [
    { id: "sarah", label: "Sarah (New Buyer)" },
    { id: "draft", label: "Draft Saved" },
    { id: "submitted", label: "HFE Reviewing" },
    { id: "approved", label: "Approved HFE" },
    { id: "action_required", label: "Missing Docs (Error)" },
  ];

  // Steps configurations
  const firstTimerSteps = [
    {
      id: 1,
      title: "1. Check preliminary eligibility & estimate grants",
      desc: "Complete a quick self-assessment of your household income, citizenship criteria, and estimated CPF Housing Grants using the HFE calculator.",
      btnText: "Launch Estimator",
      action: onNavigateToHfe,
    },
    {
      id: 2,
      title: "2. Apply for your official HFE Letter",
      desc: "Log into MyHDB with Singpass and submit your official HFE application. This consolidates eligibility checks, grant calculations, and loan approvals.",
      btnText: "Apply via Singpass",
      action: onOpenSingpassModal,
    },
    {
      id: 3,
      title: "3. Review grants and housing loan options",
      desc: "Determine if you qualify for the concessional HDB Housing Loan (currently at 2.6%) or commercial bank co-lending with an In-Principle Approval (IPA).",
      btnText: "Compare Loan Tiers",
      action: onNavigateToHfe,
    },
    {
      id: 4,
      title: "4. Search for BTO or Resale Flats",
      desc: "Browse newly launched BTO projects on our interactive map or search resale portal listings. Ensure flats fit your approved HFE eligibility limit.",
      btnText: "Browse Listings",
      action: () => setSelectedJourney("bto"),
    },
    {
      id: 5,
      title: "5. Submit flat application or pay option fee (OTP)",
      desc: "Apply for a BTO flat during our sales launch, or obtain an Option to Purchase (OTP) from a resale seller (requires valid HFE letter first!).",
      btnText: "View Application Rules",
      action: () => setSelectedJourney("resale"),
    },
    {
      id: 6,
      title: "6. Track ballot outcomes or submit resale application",
      desc: "Track your BTO ballot queue number or submit your formal resale application to HDB for administrative transaction approval.",
      btnText: "Track My Progress",
      action: onNavigateToDashboard,
    }
  ];

  const secondTimerSteps = [
    {
      id: 1,
      title: "1. Check Minimum Occupation Period (MOP)",
      desc: "Verify that you have occupied your current flat for at least 5 years (calculated from key collection date) before buying your next flat.",
      btnText: "Check MOP Online",
      action: onOpenSingpassModal,
    },
    {
      id: 2,
      title: "2. Calculate estimated resale net cash proceeds",
      desc: "Determine your current flat's estimated market valuation, calculate outstanding loan balances, and estimate the mandatory refund to your CPF Ordinary Account.",
      btnText: "Estimate Proceeds",
      action: onNavigateToHfe,
    },
    {
      id: 3,
      title: "3. Apply for fresh HDB Flat Eligibility (HFE) Letter",
      desc: "Yes! Second-timers and upgraders also require a valid, approved HFE Letter in hand before booking a second BTO flat or signing a resale OTP.",
      btnText: "Launch HFE Portal",
      action: onNavigateToHfe,
    },
    {
      id: 4,
      title: "4. Register Intent to Sell current property",
      desc: "Submit your Intent to Sell on MyHDB. This starts a mandatory 7-day cooling-off period before you can grant an Option to Purchase (OTP) to any buyer.",
      btnText: "Register Intent",
      action: onOpenSingpassModal,
    },
    {
      id: 5,
      title: "5. Coordinate transaction timelines (Contra Scheme)",
      desc: "Consult our administrative contra financing options to coordinate the sale of your current flat and the purchase of your next flat simultaneously.",
      btnText: "Compare Financing Schemes",
      action: onNavigateToHfe,
    }
  ];

  const sellerSteps = [
    {
      id: 1,
      title: "1. Meet 5-Year MOP Fulfillment",
      desc: "Ensure you meet the standard Minimum Occupation Period (5 years for standard flats, 10 years for Prime Location Housing) before selling.",
      btnText: "Check MOP Status",
      action: onOpenSingpassModal,
    },
    {
      id: 2,
      title: "2. Register your Intent to Sell on HDB Flat Portal",
      desc: "Your intent must be registered at least 7 days before issuing an Option to Purchase (OTP). HDB will confirm your selling eligibility instantly.",
      btnText: "Register Intent",
      action: onOpenSingpassModal,
    },
    {
      id: 3,
      title: "3. Value and List your flat on the resale market",
      desc: "Obtain a certified resale valuation or list your flat online. Ensure your asking price aligns with median town transactional guidelines.",
      btnText: "Search Median Prices",
      action: () => setSelectedJourney("resale"),
    },
    {
      id: 4,
      title: "4. Grant Option to Purchase (OTP) to Buyer",
      desc: "Negotiate price, receive the Option Fee (typically $1 to $1,000), and sign the official HDB resale OTP contract.",
      btnText: "View OTP Guide",
      action: () => setSelectedJourney("resale"),
    },
    {
      id: 5,
      title: "5. Buyer Exercises OTP & resale application is submitted",
      desc: "Buyer pays exercise fee (max $4,000). Both seller and buyer must submit separate resale applications to HDB within the agreed timeframe.",
      btnText: "Submit Resale Application",
      action: onOpenSingpassModal,
    },
    {
      id: 6,
      title: "6. Resale Completion Appointment at HDB Hub",
      desc: "HDB issues transaction approvals. Attend the physical meeting at Toa Payoh HDB Hub, receive your net sale proceeds, and handover keys to the buyer.",
      btnText: "Book Appointment",
      action: onNavigateToDashboard,
    }
  ];

  return (
    <section id="flat-journey-dashboard" className="max-w-[1320px] mx-auto px-6 scroll-mt-24">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm space-y-10">
        
        {/* Main Section Heading */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Interactive Flat Journey Companion
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Consolidating steps, checklist items, and simulated application trackers into a single intuitive view. Follow the exact procedures from plan to key handover.
            </p>
          </div>

          {/* Tab selector for buyers / upgraders / sellers */}
          <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1 border border-gray-200/60 shadow-inner w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("first_timer")}
              className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${activeTab === "first_timer" ? "bg-white text-[#00686c] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              First-Time Buyer
            </button>
            <button
              onClick={() => setActiveTab("second_timer")}
              className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${activeTab === "second_timer" ? "bg-white text-[#00686c] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Second-Timer / Upgrader
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${activeTab === "seller" ? "bg-white text-[#00686c] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Flat Seller
            </button>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 space-y-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Active Journey Progress</span>
            <h4 className="text-lg font-black text-gray-900">
              {activeTab === "first_timer" && "First-Time Flat Buyer Timeline"}
              {activeTab === "second_timer" && "Second-Timer Flat Upgrader Timeline"}
              {activeTab === "seller" && "Flat Resale Seller Milestones"}
            </h4>
          </div>

          <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-6 w-full">
            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Completed Tasks:</span>
                <span className="text-[#00686c] font-mono">
                  {getCompletedCount()} of {getTotalCount()} steps ({getProgressPercent()}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-[#00686c] h-full transition-all duration-500"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sandbox Controller for First-Timer Profiles */}
        {activeTab === "first_timer" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-amber-200/60 p-6 md:p-8 space-y-4 shadow-sm bg-gradient-to-r from-amber-50/20 to-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-xs text-amber-800 uppercase tracking-wider">Interactive Application Sandbox</span>
                  </div>
                  <h4 className="font-black text-sm text-gray-800">
                    Simulate and track active flat application stages:
                  </h4>
                </div>

                {/* Profile Toggle Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {profileLabels.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSimulatedProfile(profile.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        simulatedProfile === profile.id
                          ? "bg-[#00686c] text-white border-[#00686c] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {profile.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Status Card Area */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${simulatedProfile === "approved" ? "bg-green-500 animate-pulse" : simulatedProfile === "action_required" ? "bg-red-500" : "bg-amber-500 animate-pulse"}`} />
                    <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">System Live Status Update:</span>
                  </div>
                  <h5 className="font-black text-base text-gray-900 leading-snug">
                    {simulatedProfile === "sarah" && "Welcome to HDB! Start by checking preliminary eligibility criteria."}
                    {simulatedProfile === "draft" && "HFE Application Draft Saved. Resume to complete and submit before upcoming launch."}
                    {simulatedProfile === "submitted" && "Pending Income Verification. HDB is actively retrieving CPF data statements."}
                    {simulatedProfile === "approved" && "HFE Letter fully approved! Eligible for $80,000 CPF housing grant."}
                    {simulatedProfile === "action_required" && "Action Required: Computerized Payslips missing from household details."}
                  </h5>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {simulatedProfile === "sarah" && "Estimated grants: up to $120,000. Get a preliminary calculation within 2 minutes."}
                    {simulatedProfile === "draft" && "Your draft application is 60% complete. Access the portal to finalize spousal details."}
                    {simulatedProfile === "submitted" && "Submitted: 18 July 2026. Standard evaluation takes up to 30 days. We will notify you."}
                    {simulatedProfile === "approved" && "Approved HFE letter code is active for 9 months. Valid for August 2026 BTO or Resale market."}
                    {simulatedProfile === "action_required" && "PAUSED: Your employer's CPF statements indicate variable overtime. Please upload latest 3 months payslips."}
                  </p>
                </div>

                <div className="md:col-span-4 justify-self-end w-full md:w-auto">
                  <button
                    onClick={() => {
                      if (simulatedProfile === "sarah" || simulatedProfile === "draft") onNavigateToHfe();
                      else if (simulatedProfile === "approved") setSelectedJourney("bto");
                      else if (simulatedProfile === "action_required") onNavigateToDashboard();
                      else onNavigateToDashboard();
                    }}
                    className="w-full md:w-auto bg-[#00686c] hover:bg-[#004f52] text-white font-extrabold text-xs px-5 py-3.5 rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    {simulatedProfile === "sarah" && "Launch Estimator"}
                    {simulatedProfile === "draft" && "Complete Application"}
                    {simulatedProfile === "submitted" && "Open Document Logs"}
                    {simulatedProfile === "approved" && "Browse BTO Projects"}
                    {simulatedProfile === "action_required" && "Upload Payslips Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Vertical Checklist Layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-gray-700 uppercase tracking-wider">
              Step-By-Step Milestones Checklist:
            </h4>
            <span className="text-xs text-gray-400 font-bold">
              Toggle boxes to manually override and track items
            </span>
          </div>

          <div className="space-y-4">
            {/* First-Timer steps checklist */}
            {activeTab === "first_timer" &&
              firstTimerSteps.map((step) => {
                const isChecked = firstTimerChecklist[step.id];
                const isHighlight =
                  (simulatedProfile === "draft" && step.id === 2) ||
                  (simulatedProfile === "submitted" && step.id === 3) ||
                  (simulatedProfile === "action_required" && step.id === 2);

                return (
                  <div
                    key={step.id}
                    className={`p-6 md:p-8 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                      isChecked
                        ? "bg-white border-gray-200"
                        : isHighlight && simulatedProfile === "action_required"
                        ? "bg-red-50/40 border-red-300 ring-2 ring-red-100"
                        : isHighlight
                        ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-100"
                        : "bg-gray-50/40 border-dashed border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() =>
                          setFirstTimerChecklist((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                        }
                        className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all bg-white shrink-0 ${
                          isChecked
                            ? "border-[#00686c] bg-[#00686c]/5 text-[#00686c]"
                            : "border-gray-300 hover:border-[#00686c]"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>

                      <div className="space-y-1.5">
                        <h5
                          className={`text-base font-black tracking-tight ${
                            isChecked ? "text-gray-800 line-through opacity-65" : "text-gray-900"
                          }`}
                        >
                          {step.title}
                          {isHighlight && simulatedProfile === "action_required" && (
                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              ACTION REQUIRED
                            </span>
                          )}
                          {isHighlight && simulatedProfile === "draft" && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              IN PROGRESS
                            </span>
                          )}
                        </h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={step.action}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all self-end md:self-auto uppercase tracking-wider shrink-0"
                    >
                      {step.btnText}
                    </button>
                  </div>
                );
              })}

            {/* Second-Timer upgrader checklist */}
            {activeTab === "second_timer" &&
              secondTimerSteps.map((step) => {
                const isChecked = secondTimerChecklist[step.id];
                return (
                  <div
                    key={step.id}
                    className={`p-6 md:p-8 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                      isChecked
                        ? "bg-white border-gray-200"
                        : "bg-gray-50/40 border-dashed border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() =>
                          setSecondTimerChecklist((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                        }
                        className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all bg-white shrink-0 ${
                          isChecked
                            ? "border-[#00686c] bg-[#00686c]/5 text-[#00686c]"
                            : "border-gray-300 hover:border-[#00686c]"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>

                      <div className="space-y-1.5">
                        <h5
                          className={`text-base font-black tracking-tight ${
                            isChecked ? "text-gray-800 line-through opacity-65" : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={step.action}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all self-end md:self-auto uppercase tracking-wider shrink-0"
                    >
                      {step.btnText}
                    </button>
                  </div>
                );
              })}

            {/* Flat Resale Seller Checklist */}
            {activeTab === "seller" &&
              sellerSteps.map((step) => {
                const isChecked = sellerChecklist[step.id];
                return (
                  <div
                    key={step.id}
                    className={`p-6 md:p-8 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                      isChecked
                        ? "bg-white border-gray-200"
                        : "bg-gray-50/40 border-dashed border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() =>
                          setSellerChecklist((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                        }
                        className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all bg-white shrink-0 ${
                          isChecked
                            ? "border-[#00686c] bg-[#00686c]/5 text-[#00686c]"
                            : "border-gray-300 hover:border-[#00686c]"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>

                      <div className="space-y-1.5">
                        <h5
                          className={`text-base font-black tracking-tight ${
                            isChecked ? "text-gray-800 line-through opacity-65" : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={step.action}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all self-end md:self-auto uppercase tracking-wider shrink-0"
                    >
                      {step.btnText}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Proactive Help Tips */}
        <div className="bg-[#fff9e6] border-l-4 border-amber-500 p-5 rounded-r-2xl flex gap-3.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-extrabold text-amber-900 block mb-0.5">Critical Singapore Resale Regulation:</span>
            <p className="text-amber-800 leading-relaxed font-medium">
              Whether you are a First-Time Buyer, Second-Timer, or Upgrader, HDB mandates a fully approved <strong className="font-black text-amber-950">HDB Flat Eligibility (HFE) Letter</strong> BEFORE you sign any Option to Purchase (OTP) or book a unit. Signing contracts without an HFE Letter voids transaction eligibility and forfeits deposit fees.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
