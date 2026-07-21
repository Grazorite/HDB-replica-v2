import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Search, Lock, Menu, ChevronRight, ChevronLeft, X, ExternalLink, 
  CalendarDays, Mail, Map, AlertCircle, ArrowUp, Key, FileText, Layers, 
  DollarSign, Check, BookOpen, Info, ShieldCheck, Heart, Newspaper, CheckCircle, User,
  HelpCircle, Sparkles
} from "lucide-react";
import { DiscussionEmbed, CommentCount } from "disqus-react";
import { CitizenProfile } from "./types";

// Import custom sub-components
import SingpassLogin from "./components/SingpassLogin";
import Dashboard from "./components/Dashboard";
import HfeCalculator from "./components/HfeCalculator";
import SeasonParking from "./components/SeasonParking";
import AppointmentBooker from "./components/AppointmentBooker";
import HdbChatbot from "./components/HdbChatbot";
import HdbPortalsGrid from "./components/HdbPortalsGrid";
import FlatJourneyCompanion from "./components/FlatJourneyCompanion";

const feedbackArticle = {
  url: "https://hdb-citizen-portal.gov.sg/feedback",
  id: "hdb-citizen-portal-feedback",
  title: "HDB Citizen Portal Feedback Forum",
};

export default function App() {
  // Navigation & View States
  // views: "home" | "hfe" | "parking" | "appointment" | "dashboard" | "feedback"
  const [currentView, setCurrentView] = useState<"home" | "hfe" | "parking" | "appointment" | "dashboard" | "feedback">("home");
  const [targetPendingView, setTargetPendingView] = useState<"home" | "hfe" | "parking" | "appointment" | "dashboard" | "feedback" | null>(null);
  const [showSingpassModal, setShowSingpassModal] = useState(false);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>({
    name: "",
    nric: "",
    email: "",
    phone: "",
    isLoggedIn: false,
    citizenStatus: "Singapore Citizen",
    monthlyHouseholdIncome: 0,
    ownedFlat: null,
    hasAppliedHfe: false,
    hfeStatus: "Not Applied",
  });

  // Advisory slider state
  const advisories = [
    "HDB will never request money transfers or bank log-in details from you over the phone. If in doubt, please call the ScamShield Helpline at 1799 or visit the ScamShield website.",
    "BTO Launch Updates: The upcoming August 2026 Build-To-Order launch will feature brand new flats in Punggol, Bedok, and Woodlands. Apply for your HFE Letter early!",
    "Lift Upgrading Scheme: Subsidies of up to 90% are provided for Singapore Citizens under the HDB Lift Upgrading Programme to ensure step-free access for everyone.",
    "Home Improvement Programme: Ensure your contact details are updated on MyHDB to receive the latest structural inspection and spalling concrete maintenance notices.",
    "HDB Smart Parking Criteria: Selected multi-storey car parks are being upgraded with barrier-free parking. Check lot allocations instantly on your Season Parking dashboard."
  ];
  const [advisoryIdx, setAdvisoryIdx] = useState(0);
  const [showAdvisory, setShowAdvisory] = useState(true);

  // Singapore Govt Masthead expand state
  const [showIdentifyDropdown, setShowIdentifyDropdown] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- FIRST-TIME BUYER HOME PORTAL STATES ---
  const [selectedJourney, setSelectedJourney] = useState<"bto" | "resale" | "unsure" | "seller" | null>(null);
  const [companionTab, setCompanionTab] = useState<"first_timer" | "second_timer" | "seller">("first_timer");
  const [simulatedProfile, setSimulatedProfile] = useState<"sarah" | "draft" | "submitted" | "approved" | "action_required">("sarah");
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4>(1);
  const [quizAnswers, setQuizAnswers] = useState({
    timeline: "", // "immediate" | "wait_3_5"
    renovation: "", // "diy_custom" | "move_in_ready"
    locationType: "", // "anywhere" | "near_parents"
  });
  const [checklistProgress, setChecklistProgress] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  
  const [activeJourneyTab, setActiveJourneyTab] = useState<"first_time" | "second_time" | "seller">("first_time");
  
  const [secondTimerProgress, setSecondTimerProgress] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [sellerProgress, setSellerProgress] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  useEffect(() => {
    if (activeJourneyTab === "first_time") {
      if (simulatedProfile === "sarah") {
        setChecklistProgress({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "draft") {
        setChecklistProgress({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "submitted") {
        setChecklistProgress({ 1: true, 2: true, 3: false, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "approved") {
        setChecklistProgress({ 1: true, 2: true, 3: true, 4: false, 5: false, 6: false });
      } else if (simulatedProfile === "action_required") {
        setChecklistProgress({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
      }
    }
  }, [simulatedProfile, activeJourneyTab]);
  // ---------------------------------------------

  // Hero Carousel Banners (Split Layout)
  const carouselSlides = [
    {
      title: "Affordable homes for everyone.",
      desc: "Be it for one family or one person, we have a home for your needs.",
      btnText: "Begin your HDB journey",
      action: () => triggerLoginOrAction("hfe")
    },
    {
      title: "Your housing criteria, simplified.",
      desc: "Apply for HDB Flat Eligibility (HFE) letters, estimate grants, and request HDB loans in a few clicks.",
      btnText: "Check Grant Eligibility",
      action: () => triggerLoginOrAction("hfe")
    },
    {
      title: "Manage your estate parking instantly.",
      desc: "Renew your vehicle season parking, check carpark lots, or request instant carpark transfers.",
      btnText: "Manage Season Parking",
      action: () => triggerLoginOrAction("parking")
    }
  ];
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Auto scroll top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  // Back to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Singpass Authentications
  const handleLoginSuccess = (profile: CitizenProfile) => {
    setCitizenProfile(profile);
    setShowSingpassModal(false);
    if (targetPendingView) {
      setCurrentView(targetPendingView);
      setTargetPendingView(null);
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleLogout = () => {
    setCitizenProfile({
      name: "",
      nric: "",
      email: "",
      phone: "",
      isLoggedIn: false,
      citizenStatus: "Singapore Citizen",
      monthlyHouseholdIncome: 0,
      ownedFlat: null,
      hasAppliedHfe: false,
      hfeStatus: "Not Applied",
    });
    setTargetPendingView(null);
    setCurrentView("home");
  };

  // Safe login wrapper
  const triggerLoginOrAction = (targetView: "dashboard" | "hfe" | "parking" | "appointment" | "feedback") => {
    if (targetView === "feedback") {
      setCurrentView("feedback");
    } else if (!citizenProfile.isLoggedIn) {
      setTargetPendingView(targetView);
      setShowSingpassModal(true);
    } else {
      setCurrentView(targetView);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafa] font-sans antialiased text-[#181c1d] flex flex-col selection:bg-primary/10 selection:text-primary">
      
      {/* 1. Top Advisory Banner */}
      {showAdvisory && (
        <div className="bg-[#F3F5FA] py-3 border-b border-[#bdc9c9] animate-in slide-in-from-top duration-200">
          <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#00686c] mt-0.5 shrink-0" style={{ fontSize: "20px" }}>
                notifications
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#181c1d] tracking-wider uppercase">Advisory Notice</span>
                <p className="text-xs text-[#3e4949] leading-relaxed max-w-4xl mt-0.5">
                  {advisories[advisoryIdx]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-white border border-[#bdc9c9]/50 px-2 py-1 rounded-md shadow-sm">
                <button 
                  onClick={() => setAdvisoryIdx(prev => (prev === 0 ? advisories.length - 1 : prev - 1))}
                  className="p-0.5 hover:bg-gray-100 rounded text-gray-500"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-gray-600 font-mono">
                  {advisoryIdx + 1} of {advisories.length}
                </span>
                <button 
                  onClick={() => setAdvisoryIdx(prev => (prev === advisories.length - 1 ? 0 : prev + 1))}
                  className="p-0.5 hover:bg-gray-100 rounded text-gray-500"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button 
                onClick={() => setShowAdvisory(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Singapore Govt Masthead */}
      <div className="bg-[#ebefee] py-1 border-b border-[#bdc9c9]/20 relative z-[51]">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-col">
          <div className="flex items-center justify-between text-xs text-[#3e4949]">
            <div className="flex items-center gap-2">
              <img 
                className="w-4 h-4 object-contain" 
                alt="Singapore Government Crest" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfcr53R2wPf_eZXP3vwOIJ5H6RvffwPAWTpt4RzF4yZJF7JZ2I0YgD4_Be6kdyNojr5L1CgyqArpzwo537-cZtXPhuLKCSgbARGxa7wnazeyVpFiglerO7DkcAwrvH0W_2_XtEjEubu2Scj6bX-lkndez53X5V2oQ6GqKQZdmpkeYrwaR0ipuVZfbuLAj81o5m397Aleo-KSqMVjmfw0azLd9INIPbRcSCNSueGLKqiOvV8S1O52CwUw"
              />
              <span className="font-medium text-[11px]">A Singapore Government Agency Website</span>
              <button 
                onClick={() => setShowIdentifyDropdown(!showIdentifyDropdown)}
                className="flex items-center text-[#00686c] font-semibold hover:underline gap-0.5 ml-1.5 focus:outline-none"
              >
                How to identify <ChevronRight className={`w-3 h-3 transition-transform ${showIdentifyDropdown ? "rotate-90" : ""}`} />
              </button>
            </div>
          </div>

          {/* Expanded dropdown detailing gov.sg security check */}
          {showIdentifyDropdown && (
            <div className="mt-2.5 p-4 bg-white rounded-xl border border-[#bdc9c9] shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#3e4949] animate-in slide-in-from-top-2 duration-200">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800">Secure .gov.sg websites</h4>
                  <p className="mt-1">
                    The <strong>.gov.sg</strong> website belongs to an official government organization in Singapore. Always check the URL domain ending before entering passwords or sharing personal details.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800">Verified HTTPS Connection</h4>
                  <p className="mt-1">
                    Look for the lock icon in your browser address bar. This ensures a secure, encrypted connection to prevent unauthorized access or interceptors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Navigation Header Sticky */}
      <header className="sticky top-0 z-[50] bg-[#f6fafa]/95 backdrop-blur-md border-b border-[#bdc9c9]/60 shadow-sm transition-all">
        <div className="max-w-[1320px] mx-auto px-6">
          
          {/* Top Row: Quick Contacts & Singpass Login */}
          <div className="flex justify-end gap-6 py-2.5 border-b border-[#bdc9c9]/20 text-xs">
            <a href="#" className="text-[#3e4949] hover:text-[#00686c] transition-colors">About Us</a>
            <a href="#" className="text-[#3e4949] hover:text-[#00686c] transition-colors">HDB Pulse</a>
            
            <div className="flex items-center gap-4 border-l border-[#bdc9c9] pl-6">
              <button 
                onClick={() => triggerLoginOrAction("dashboard")} 
                className="text-[#3e4949] hover:text-[#00686c] relative"
              >
                <Bell className="w-4 h-4" />
                {citizenProfile.isLoggedIn && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#bc0001] rounded-full" />
                )}
              </button>
              <div className="bg-gray-200 w-[1px] h-3" />
              
              {citizenProfile.isLoggedIn ? (
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="font-bold text-[#00686c] hover:underline flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  {citizenProfile.name}
                </button>
              ) : (
                <button 
                  onClick={() => setShowSingpassModal(true)}
                  className="bg-[#bc0001] text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:bg-[#a00001] transition-all active:scale-95 shadow-sm text-xs"
                >
                  <Lock className="w-3 h-3 fill-current" />
                  Singpass Login
                </button>
              )}
            </div>
          </div>

          {/* Primary Navigation Row */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              {/* Official HDB Logo */}
              <button onClick={() => setCurrentView("home")} className="focus:outline-none">
                <img 
                  className="h-10 object-contain" 
                  alt="HDB Singapore Logo" 
                  src="https://www.hdb.gov.sg/-/media/hdbinfoweb/data/media/img/site-logo-small.png"
                />
              </button>

              {/* Main Desktop Navigation Tabs */}
              <nav className="hidden lg:flex items-center gap-6">
                <button 
                  onClick={() => triggerLoginOrAction("hfe")}
                  className={`text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 transition-all ${currentView === "hfe" ? "border-[#00686c] text-[#00686c]" : "border-transparent text-[#3e4949] hover:text-[#00686c]"}`}
                >
                  Buying a Flat
                </button>
                <button 
                  onClick={() => triggerLoginOrAction("dashboard")}
                  className={`text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 transition-all ${currentView === "dashboard" ? "border-[#00686c] text-[#00686c]" : "border-transparent text-[#3e4949] hover:text-[#00686c]"}`}
                >
                  Managing My Home
                </button>
                <button 
                  onClick={() => {
                    setSelectedJourney("bto");
                    setCompanionTab("first_timer");
                    setCurrentView("home");
                    setTimeout(() => {
                      const el = document.getElementById("flat-journey-dashboard");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 border-transparent text-[#3e4949] hover:text-[#00686c] cursor-pointer"
                >
                  Renting a Flat
                </button>
                <button 
                  onClick={() => triggerLoginOrAction("parking")}
                  className={`text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 transition-all ${currentView === "parking" ? "border-[#00686c] text-[#00686c]" : "border-transparent text-[#3e4949] hover:text-[#00686c]"}`}
                >
                  Parking
                </button>
                <button 
                  onClick={() => alert("Redirecting to HDB Place2Lease commercial bidding platform.")}
                  className="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 border-transparent text-[#3e4949] hover:text-[#00686c] cursor-pointer"
                >
                  Shops and Offices
                </button>
                <button 
                  onClick={() => alert("Launching HDB Business Partner Network digital sign-in.")}
                  className="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 border-transparent text-[#3e4949] hover:text-[#00686c] cursor-pointer"
                >
                  Business Partners
                </button>
                <button 
                  onClick={() => triggerLoginOrAction("feedback")}
                  className={`text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2 transition-all ${currentView === "feedback" ? "border-[#00686c] text-[#00686c]" : "border-transparent text-[#3e4949] hover:text-[#00686c]"}`}
                >
                  Feedback
                </button>
              </nav>
            </div>

            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* 4. MAIN BODY CONTAINER */}
      <main className="flex-1">
        {currentView === "home" ? (
          /* CORE HOME PORTAL VIEW */
          <div className="space-y-16 pb-24 animate-in fade-in duration-300">
            
            {/* Section 1: Hero / Start Here */}
            <section className="relative bg-[#003B3E] bg-gradient-to-br from-[#002628] via-[#004D51] to-[#015C60] py-20 text-white overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-[0.04]">
                <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative z-10 max-w-[1320px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#91f2f7]/20 border border-[#91f2f7]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#91f2f7] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> SINGAPORE PUBLIC HOUSING PORTAL
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Start your HDB flat buying journey
                  </h1>
                  <p className="text-base md:text-lg text-white/90 font-medium max-w-xl leading-relaxed">
                    Check your eligibility, understand your grants and loan options, and find the right next step for BTO or resale.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => triggerLoginOrAction("hfe")}
                      className="bg-[#bc0001] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#a00001] transition-all active:scale-95 shadow-md text-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      Start eligibility check
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedJourney("unsure");
                        const el = document.getElementById("choose-journey-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-4 rounded-xl font-bold transition-all active:scale-95 text-sm cursor-pointer"
                    >
                      Compare BTO and resale
                    </button>
                  </div>
                </div>

                {/* Right side skyline card */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                    <img
                      src="https://www.hdb.gov.sg/-/media/homepage/Affordability_1200x960_webp.webp?h=960&iar=0&w=1200&hash=A0FB4547171BB9CDCF607052E523E68B"
                      alt="Modern HDB Skyline Housing in Singapore"
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-white leading-relaxed">
                      "Building quality, affordable homes to support dynamic multi-generational Singaporean families."
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Choose Your Journey */}
            <section id="choose-journey-section" className="max-w-[1320px] mx-auto px-6 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Choose Your Flat-Buying Path
                </h2>
                <p className="text-sm text-gray-600">
                  Compare housing choices based on your immediate timeline, lifestyle, and financial plans.
                </p>
              </div>

              {/* Grid of Journey Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Option 1: BTO */}
                <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${selectedJourney === "bto" ? "bg-white border-[#00686c] ring-2 ring-[#00686c]/20 shadow-md" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-[#e0f4f5] text-[#00686c] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Build-To-Order
                      </span>
                      <span className="text-xs text-gray-400 font-bold">New Flat</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">I want to buy a BTO</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Apply for a brand new HDB flat during quarterly sales launches. Highly subsidized but requires patience.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Wait Time:</span>
                        <span className="font-bold text-gray-800">3 to 5 Years</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Lease Term:</span>
                        <span className="font-bold text-gray-800">Fresh 99 Years</span>
                      </div>
                      <div className="flex justify-between text-[11px] items-start">
                        <span className="text-gray-500">Key Requirement:</span>
                        <span className="font-bold text-[#bc0001] text-right">Valid HFE Letter before launch</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (selectedJourney === "bto") {
                        setSelectedJourney(null);
                      } else {
                        setSelectedJourney("bto");
                        setCompanionTab("first_timer");
                        setTimeout(() => {
                          const el = document.getElementById("flat-journey-dashboard");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }
                    }}
                    className="w-full mt-6 bg-[#00686c] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#004f52] transition-colors cursor-pointer"
                  >
                    {selectedJourney === "bto" ? "Hide BTO Details" : "View BTO steps"}
                  </button>
                </div>

                {/* Option 2: Resale */}
                <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${selectedJourney === "resale" ? "bg-white border-[#00686c] ring-2 ring-[#00686c]/20 shadow-md" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-[#fdf2f2] text-[#bc0001] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Open Market
                      </span>
                      <span className="text-xs text-gray-400 font-bold">Existing Flat</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">I want to buy a resale flat</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Purchase an existing flat from current owners. Immediate move-in and flexibility in locations, but higher market cost.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Wait Time:</span>
                        <span className="font-bold text-gray-800">Immediate (3-4 months)</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Location Choices:</span>
                        <span className="font-bold text-gray-800">Anywhere in Singapore</span>
                      </div>
                      <div className="flex justify-between text-[11px] items-start">
                        <span className="text-gray-500">Critical Rule:</span>
                        <span className="font-bold text-[#bc0001] text-right">Valid HFE before signing OTP</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (selectedJourney === "resale") {
                        setSelectedJourney(null);
                      } else {
                        setSelectedJourney("resale");
                        setCompanionTab("first_timer");
                        setTimeout(() => {
                          const el = document.getElementById("flat-journey-dashboard");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }
                    }}
                    className="w-full mt-6 bg-[#00686c] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#004f52] transition-colors cursor-pointer"
                  >
                    {selectedJourney === "resale" ? "Hide Resale Details" : "View resale steps"}
                  </button>
                </div>

                {/* Option 3: Unsure */}
                <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${selectedJourney === "unsure" ? "bg-white border-[#00686c] ring-2 ring-[#00686c]/20 shadow-md" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-[#f0f4f8] text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Decision Tool
                      </span>
                      <span className="text-xs text-gray-400 font-bold">Unsure?</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">I am not sure yet</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Not sure if BTO or Resale matches your timeline and budget better? Answer 3 quick questions for a personalized plan.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Tool Type:</span>
                        <span className="font-bold text-gray-800">Interactive Diagnosis</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Comparison:</span>
                        <span className="font-bold text-gray-800">Side-by-side specs</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Time to Complete:</span>
                        <span className="font-bold text-[#00686c]">1 Minute</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedJourney(selectedJourney === "unsure" ? null : "unsure");
                      setQuizStep(1);
                    }}
                    className="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    {selectedJourney === "unsure" ? "Close helper" : "Help me decide"}
                  </button>
                </div>

              </div>

              {/* Note for second-timers and sellers */}
              {!selectedJourney && (
                <div className="mt-8 text-center bg-gray-50/50 p-4 rounded-2xl border border-gray-200/50 max-w-xl mx-auto text-xs text-gray-500 font-medium">
                  Are you a second-time buyer, upgrader, or flat seller?{" "}
                  <button
                    onClick={() => {
                      setSelectedJourney("seller");
                      setCompanionTab("seller");
                      setTimeout(() => {
                        const el = document.getElementById("flat-journey-dashboard");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-[#00686c] font-bold hover:underline cursor-pointer"
                  >
                    View Seller Milestones
                  </button>
                  {" "}or{" "}
                  <button
                    onClick={() => {
                      setSelectedJourney("resale");
                      setCompanionTab("second_timer");
                      setTimeout(() => {
                        const el = document.getElementById("flat-journey-dashboard");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-[#00686c] font-bold hover:underline cursor-pointer"
                  >
                    View Upgrader Checklists
                  </button>.
                </div>
              )}

              {/* Scroll Anchor */}
              <div id="flat-journey-dashboard" className="scroll-mt-24" />

              {/* Progressive Disclosure Content Panels */}
              {selectedJourney === "bto" && (
                <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl border border-[#00686c]/20 shadow-md animate-in slide-in-from-top-4 duration-300 space-y-6">
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-[#e0f4f5] text-[#00686c] rounded-xl font-bold text-sm">BTO</span>
                    <div>
                      <h4 className="font-black text-lg text-gray-900">Build-To-Order (BTO) Journey Milestones</h4>
                      <p className="text-xs text-gray-500 mt-1">Below are the concrete steps for buying a brand new HDB BTO flat.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                    {[
                      { step: "1", title: "Apply HFE Letter", desc: "Obtain your approved HFE letter at least 1 month prior to launch." },
                      { step: "2", title: "Launch Application", desc: "Apply online during the Feb, June, or Oct sales launches." },
                      { step: "3", title: "Ballot Results", desc: "Receive queue number assessment approx. 2 months post-launch." },
                      { step: "4", title: "Book Flat & Sign", desc: "Select your layout unit, sign agreement, and pay 5%-10% downpayment." },
                      { step: "5", title: "Collect Keys", desc: "Wait for construction completion (3-5 years) and move in!" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                        <span className="absolute top-3 right-3 text-xs font-black text-[#00686c]/20">#{item.step}</span>
                        <h5 className="font-extrabold text-xs text-gray-900 pr-4">{item.title}</h5>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#fff9e6] border-l-4 border-amber-500 p-4 rounded-r-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-900">Critical Error Prevention Warning:</span>
                      <p className="text-amber-800 mt-0.5">
                        You **cannot** submit an application during a sales launch without an active HFE Letter application or draft. Apply for HFE early!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedJourney === "resale" && (
                <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl border border-[#bc0001]/20 shadow-md animate-in slide-in-from-top-4 duration-300 space-y-6">
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-[#fdf2f2] text-[#bc0001] rounded-xl font-bold text-sm">Resale</span>
                    <div>
                      <h4 className="font-black text-lg text-gray-900">Resale Flat Buying Journey Milestones</h4>
                      <p className="text-xs text-gray-500 mt-1">Below is the exact flow for purchasing an existing flat from the open market.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                    {[
                      { step: "1", title: "Get HFE Approved", desc: "You must have a fully valid HFE Letter in hand first." },
                      { step: "2", title: "Search & Negotiate", desc: "Search HDB resale portals and view units. Agree on a price." },
                      { step: "3", title: "Obtain OTP", desc: "Pay Option Fee ($1-$1,000) to seller. Get Option to Purchase (OTP)." },
                      { step: "4", title: "Value & Exercise", desc: "Request HDB valuation, exercise OTP within 21 days ($1-$4,000)." },
                      { step: "5", title: "HDB Approval", desc: "Submit resale application. Complete sale in 8 weeks, collect keys." }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                        <span className="absolute top-3 right-3 text-xs font-black text-[#bc0001]/20">#{item.step}</span>
                        <h5 className="font-extrabold text-xs text-gray-900 pr-4">{item.title}</h5>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#fff3f3] border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-red-900">Critical Error Prevention Warning:</span>
                      <p className="text-red-800 mt-0.5 font-medium">
                        NEVER sign or pay for an Option to Purchase (OTP) before receiving your approved HFE letter. If you do, HDB will reject your resale transaction, and you may lose your entire option fee to the seller!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedJourney === "unsure" && (
                <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-300/60 shadow-lg animate-in slide-in-from-top-4 duration-300 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span className="font-black text-sm text-gray-800">Interactive Flat Decider Quiz</span>
                    </div>
                    <span className="text-[11px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold">
                      Step {quizStep} of 4
                    </span>
                  </div>

                  {quizStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <h4 className="font-extrabold text-sm text-gray-800">Question 1: When are you planning to move into your new home?</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, timeline: "immediate" }));
                            setQuizStep(2);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">As soon as possible</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I want to move in within 3 to 6 months (ideal for immediate wedding or relocation).</span>
                        </button>
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, timeline: "wait_3_5" }));
                            setQuizStep(2);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">I can wait 3 to 5 years</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I am planning ahead with my partner and don't mind the wait for a brand new flat.</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {quizStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <h4 className="font-extrabold text-sm text-gray-800">Question 2: What is your preferred styling or renovation approach?</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, renovation: "diy_custom" }));
                            setQuizStep(3);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">Fresh Empty Canvas</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I want brand new walls, fittings, and tiling built completely fresh by HDB.</span>
                        </button>
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, renovation: "move_in_ready" }));
                            setQuizStep(3);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">Move-in Ready / DIY Renovation</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I prefer existing interior setups or don't mind overhauling an older mature layout.</span>
                        </button>
                      </div>
                      <button onClick={() => setQuizStep(1)} className="text-xs text-gray-500 font-bold hover:underline">← Back</button>
                    </div>
                  )}

                  {quizStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <h4 className="font-extrabold text-sm text-gray-800">Question 3: Is living in a highly specific mature town (e.g. within 4km of your parents) vital?</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, locationType: "parents" }));
                            setQuizStep(4);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">Extremely Vital</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I want to live near parents to enjoy proximity grants (up to $30,000 extra) or mature transport hubs.</span>
                        </button>
                        <button 
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, locationType: "anywhere" }));
                            setQuizStep(4);
                          }}
                          className="p-5 text-left rounded-xl border border-gray-200 hover:border-[#00686c] hover:bg-gray-50 transition-all group"
                        >
                          <span className="block font-black text-xs text-gray-900 group-hover:text-[#00686c]">Flexible Location</span>
                          <span className="block text-[11px] text-gray-500 mt-1">I am open to newly developing estates like Tengah, Punggol, or Woodlands.</span>
                        </button>
                      </div>
                      <button onClick={() => setQuizStep(2)} className="text-xs text-gray-500 font-bold hover:underline">← Back</button>
                    </div>
                  )}

                  {quizStep === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="bg-[#f0f9f9] p-5 rounded-xl border border-[#00686c]/20">
                        <h5 className="font-extrabold text-sm text-[#00686c]">Your Personalized Recommendation:</h5>
                        <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                          Based on your timeline ({quizAnswers.timeline === "immediate" ? "Immediate move-in" : "Can wait 3-5 years"}) and priorities:
                          {quizAnswers.timeline === "immediate" || quizAnswers.locationType === "parents" ? (
                            <span> We recommend searching for a <strong className="text-[#bc0001]">Resale Flat</strong>. This gives you immediate move-in potential and guarantees your preferred mature neighborhood near your family, maximizing your Proximity Housing Grant.</span>
                          ) : (
                            <span> We strongly recommend a <strong className="text-[#00686c]">BTO (Build-To-Order) Flat</strong>. It fits your flexible timeline, gives you a fresh 99-year lease empty canvas, and is the most cost-effective path for first-timers!</span>
                          )}
                        </p>
                      </div>

                      {/* Side-by-side comparison matrix */}
                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-xs text-left text-gray-500">
                          <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 border-b border-gray-200 font-bold">
                            <tr>
                              <th className="px-4 py-3">Feature</th>
                              <th className="px-4 py-3 text-[#00686c]">Build-To-Order (BTO)</th>
                              <th className="px-4 py-3 text-[#bc0001]">Resale Flat</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            <tr>
                              <td className="px-4 py-3 font-bold bg-gray-50/50">Purchase Price</td>
                              <td className="px-4 py-3 text-green-600">Subsidized (Lower base price)</td>
                              <td className="px-4 py-3">Market price (Higher base price)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-bold bg-gray-50/50">Wait Time</td>
                              <td className="px-4 py-3">3 to 5 years (Construction)</td>
                              <td className="px-4 py-3 text-green-600">Immediate (3 to 4 months)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-bold bg-gray-50/50">Housing Grants</td>
                              <td className="px-4 py-3">Up to $120,000 (Enhanced Grant)</td>
                              <td className="px-4 py-3 text-green-600">Up to $190,000 (Enhanced + Family + Proximity)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-bold bg-gray-50/50">Lease Left</td>
                              <td className="px-4 py-3">Full 99 Years</td>
                              <td className="px-4 py-3">Variable (99 years minus age of flat)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2 items-center">
                        <button 
                          onClick={() => {
                            setSelectedJourney(null);
                            triggerLoginOrAction("hfe");
                          }}
                          className="bg-[#00686c] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#004f52] transition-colors cursor-pointer"
                        >
                          Estimate my grants now
                        </button>
                        <button 
                          onClick={() => {
                            const rec = quizAnswers.timeline === "immediate" || quizAnswers.locationType === "parents" ? "resale" : "bto";
                            setSelectedJourney(rec);
                            setCompanionTab("first_timer");
                            setTimeout(() => {
                              const el = document.getElementById("flat-journey-dashboard");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                          }}
                          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          Explore Step-by-Step Milestones <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setQuizStep(1);
                            setQuizAnswers({ timeline: "", renovation: "", locationType: "" });
                          }}
                          className="text-xs text-gray-500 font-bold hover:underline cursor-pointer"
                        >
                          Retake Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Flat Journey Companion (Consolidated Steps/Checklist/Tracker) */}
            <AnimatePresence>
              {selectedJourney && selectedJourney !== "unsure" && (
                <motion.div
                  key="flat-journey-companion-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden scroll-mt-24"
                >
                  <FlatJourneyCompanion
                    onNavigateToHfe={() => triggerLoginOrAction("hfe")}
                    onNavigateToDashboard={() => triggerLoginOrAction("dashboard")}
                    onNavigateToParking={() => triggerLoginOrAction("parking")}
                    onOpenSingpassModal={() => setShowSingpassModal(true)}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={setSelectedJourney}
                    activeTab={companionTab}
                    setActiveTab={setCompanionTab}
                    simulatedProfile={simulatedProfile}
                    setSimulatedProfile={setSimulatedProfile}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section 6: Help with Common Confusing Terms */}
            <section className="max-w-[1320px] mx-auto px-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00686c]" /> Plain English Glossary
                  </h3>
                  <p className="text-xs text-gray-500">
                    We demystify housing acronyms and legal terms. Click a card below to reveal its simple plain-English explanation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: "hfe",
                      term: "HFE Letter",
                      full: "HDB Flat Eligibility Letter",
                      desc: "The essential starting document. A single comprehensive letter verifying if you can purchase a flat, the maximum government CPF grants you are eligible for, and the approved HDB loan amount. You MUST have this before booking a BTO or signing any resale OTP."
                    },
                    {
                      id: "bto",
                      term: "BTO",
                      full: "Build-To-Order Flats",
                      desc: "Brand new HDB flats built directly by the government. They are sold at subsidized rates with a fresh 99-year lease, but require a construction wait of 3 to 5 years."
                    },
                    {
                      id: "resale",
                      term: "Resale Flat",
                      full: "Open Market Purchase",
                      desc: "Existing flats sold by their current private owners. You can move in almost immediately (3-4 months) and choose any location in Singapore, but they are generally more expensive and have less than 99 years of remaining lease."
                    },
                    {
                      id: "otp",
                      term: "OTP",
                      full: "Option to Purchase",
                      desc: "A formal contract between a buyer and a seller. The buyer pays an Option Fee ($1 - $1,000) to 'reserve' the flat. Crucial: Do NOT pay for or sign an OTP on a resale flat until you have a valid HFE approved, or HDB will invalidate your contract."
                    },
                    {
                      id: "ipa",
                      term: "IPA",
                      full: "In-Principle Approval",
                      desc: "A preliminary guarantee from a private commercial bank stating how much loan they are willing to provide you. Required if you choose to finance your flat with a bank loan instead of an HDB housing loan."
                    },
                    {
                      id: "grants",
                      term: "CPF Housing Grant",
                      full: "Government Subsidies",
                      desc: "Financial assistance (up to $190,000 for resale first-timers) based on household income, citizenship, and flat size. Credited directly to your CPF Ordinary Account to offset the flat's purchase price."
                    },
                    {
                      id: "mop",
                      term: "MOP",
                      full: "Minimum Occupation Period",
                      desc: "The minimum timeframe (typically 5 years) that you are legally required to reside in your HDB flat before you can sell it on the open resale market, or lease out the entire flat to other tenants."
                    },
                    {
                      id: "sbf",
                      term: "SBF / ROF",
                      full: "Sale of Balance Flats",
                      desc: "Unsold units from previous BTO launches or repurchased units. They are near completion or already completed, offering a shorter wait time compared to BTOs, but with fewer unit choices."
                    }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveGlossaryTerm(activeGlossaryTerm === item.id ? null : item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveGlossaryTerm(activeGlossaryTerm === item.id ? null : item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer space-y-3 ${
                        activeGlossaryTerm === item.id 
                          ? `bg-[#00686c] text-white border-[#00686c] shadow-md ring-2 ring-[#00686c]/20 ${item.id === "grants" ? "sm:col-span-2 lg:col-span-2" : ""}` 
                          : "bg-gray-50 border-gray-200/60 hover:bg-white"
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${activeGlossaryTerm === item.id ? "text-[#91f2f7]" : "text-[#00686c]"}`}>
                          {item.full}
                        </span>
                        <h4 className={`text-base font-black ${activeGlossaryTerm === item.id ? "text-white" : "text-gray-900"}`}>
                          {item.term}
                        </h4>
                      </div>
                      
                      {activeGlossaryTerm === item.id ? (
                        item.id === "grants" ? (
                          <div className="space-y-3 mt-1 text-white animate-in fade-in duration-150">
                            <p className="text-[11px] leading-relaxed text-white/95">
                              {item.desc}
                            </p>
                            <div className="border border-white/20 rounded-xl overflow-hidden bg-black/10 text-[10px] text-left">
                              <div className="grid grid-cols-3 bg-black/25 px-3 py-1.5 font-bold border-b border-white/10 uppercase tracking-wider text-[#91f2f7]">
                                <span>Applicant</span>
                                <span>New Flat (BTO)</span>
                                <span>Resale Flat</span>
                              </div>
                              <div className="divide-y divide-white/10">
                                <div className="grid grid-cols-3 px-3 py-1.5 items-center">
                                  <span className="font-bold">First-Timer Couple</span>
                                  <span>Up to <strong>$120k</strong> <span className="text-[9px] text-white/60">(EHG)</span></span>
                                  <span className="text-green-300 font-bold">Up to <strong>$230k</strong> <span className="text-[9px] text-white/80">(All Grants)</span></span>
                                </div>
                                <div className="grid grid-cols-3 px-3 py-1.5 items-center">
                                  <span className="font-bold">First-Timer Single</span>
                                  <span>Up to <strong>$60k</strong> <span className="text-[9px] text-white/60">(EHG)</span></span>
                                  <span>Up to <strong>$115k</strong> <span className="text-[9px] text-white/60">(All Grants)</span></span>
                                </div>
                                <div className="grid grid-cols-3 px-3 py-1.5 items-center">
                                  <span className="font-bold">Second-Timer / Upgrader</span>
                                  <span>Up to <strong>$15k</strong> <span className="text-[9px] text-white/60">(Step-Up)</span></span>
                                  <span>Up to <strong>$15k</strong> <span className="text-[9px] text-white/60">(Step-Up)</span></span>
                                </div>
                              </div>
                            </div>
                            <div className="text-[9px] text-white/60 leading-tight">
                              *Grants are income-tested. Use the HFE calculator to estimate your exact entitlement.
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] leading-relaxed text-white/90 animate-in fade-in duration-150">
                            {item.desc}
                          </p>
                        )
                      ) : (
                        <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                          Click to expand <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Section 7: Alerts, Reminders & Error Prevention */}
            <section className="max-w-[1320px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Critical Warnings */}
                <div className="lg:col-span-7 bg-[#fff3f3] border-l-4 border-red-600 p-6 rounded-r-3xl border border-red-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-red-700 font-black text-sm uppercase tracking-wider">
                    <AlertCircle className="w-5 h-5" /> Critical Reminders for First-Time Buyers
                  </div>
                  
                  <ul className="space-y-3.5 text-xs text-red-950 font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <p>
                        <strong>Never sign a resale OTP</strong> or pay any booking deposits before your official HFE Letter is approved. Doing so violates HDB administrative procedures, voids your purchase contract, and may result in the forfeiture of your deposit.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <p>
                        <strong>Submit your HFE at least 30 days</strong> prior to an upcoming BTO sales launch. Applications peak during launches, which can lead to delayed approvals, causing you to miss booking windows.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <p>
                        <strong>Matching household details:</strong> Ensure your declared household roster (spouse, parents, siblings) is fully consistent across both your Singpass digital profile and your official flat application.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Document Readiness Checklist */}
                <div className="lg:col-span-5 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="text-gray-900 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" /> Document Readiness Checklist
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Speed up your HFE review! Ensure you have these verified items ready before applying:
                  </p>
                  
                  <div className="space-y-2.5">
                    {[
                      "Active Singpass account login details",
                      "Past 12 months CPF contribution statements (PDF)",
                      "Latest 3 months computerized payslips (if salaried)",
                      "Latest 12 months IRAS Notice of Assessment (if self-employed)",
                      "Proof of active spousal relationship / marriage certificate"
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                        <input type="checkbox" className="w-4 h-4 text-[#00686c] border-gray-300 rounded focus:ring-0" defaultChecked={idx <= 1} />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* HDB Portals & Citizen Services section (moved to prioritize buying/selling paths) */}
            <HdbPortalsGrid 
              onNavigate={(view) => {
                if (view === "home") setCurrentView("home");
                else triggerLoginOrAction(view);
              }}
              onTriggerLoginOrAction={triggerLoginOrAction}
              onScrollToJourney={() => {
                setSelectedJourney("bto");
                setCompanionTab("first_timer");
                setTimeout(() => {
                  const el = document.getElementById("flat-journey-dashboard");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            />

          </div>
        ) : (
          /* ACTIVE MODULE SUB-SCREENS WRAPPERS */
          <div className="max-w-[1320px] mx-auto px-6 py-12">
            
            {/* Modular back navigation bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-xs text-[#00686c] font-bold hover:underline uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" /> Back to HDB Home Portal
              </button>
              
              <div className="text-xs text-gray-400 font-bold">
                You are viewing: <span className="text-gray-700 uppercase tracking-wider font-extrabold">{currentView}</span>
              </div>
            </div>

            {/* Render selected view */}
            {currentView === "hfe" && <HfeCalculator />}
            {currentView === "parking" && <SeasonParking />}
            {currentView === "appointment" && <AppointmentBooker />}
            {currentView === "feedback" && (
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-[#00686c]/20 shadow-xl max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                {/* Header Section */}
                <div className="border-b border-gray-100 pb-6 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#00686c] font-extrabold uppercase tracking-widest bg-[#00686c]/5 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#00686c] rounded-full animate-pulse" /> Social Feedback
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
                    Citizen Feedback & Discussion Forum
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Welcome to the HDB community portal feedback thread. Participate in open discussions, share your suggestions regarding public housing criteria, or read other citizens' feedback on recent policies.
                  </p>
                </div>

                {/* Live Stats with Disqus CommentCount */}
                <div className="bg-[#f6fafa] rounded-2xl p-5 border border-[#bdc9c9]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Forum Stats</span>
                    <div className="flex items-center gap-2 text-sm text-gray-800 font-bold">
                      <span className="material-symbols-outlined text-[#00686c]" style={{ fontSize: "18px" }}>forum</span>
                      <CommentCount
                        shortname="lms-replica"
                        config={feedbackArticle}
                      >
                        Comments
                      </CommentCount>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium sm:text-right max-w-sm">
                    All discussions are governed by Singapore community standard guidelines. To protect your privacy, please never post personal details such as NRIC numbers, phone numbers, or exact residential addresses.
                  </div>
                </div>

                {/* Disqus DiscussionEmbed Thread */}
                <div className="bg-white rounded-2xl border border-gray-100 p-2 min-h-[400px]">
                  <DiscussionEmbed
                    shortname="lms-replica"
                    config={feedbackArticle}
                  />
                </div>
              </div>
            )}
            {currentView === "dashboard" && (
              <Dashboard 
                profile={citizenProfile} 
                onLogout={handleLogout} 
                onNavigateToTab={(tab) => setCurrentView(tab)}
              />
            )}

          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-[#2c3131] text-[#f6fafa] py-16 border-t border-gray-700/50 mt-auto">
        <div className="max-w-[1320px] mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase">Housing & Development Board</h2>
              <p className="text-xs text-[#bdc9c9] mt-1">Official citizen portal of the Republic of Singapore public housing authority.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase tracking-wider">
              <a href="#" className="hover:underline">Contact Us</a>
              <a href="#" className="hover:underline">Write to Us</a>
              
              {/* Verified Social Handles (Crest/Icons) */}
              <div className="flex gap-4 border-l border-gray-600 pl-8 shrink-0">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img 
                    className="w-5 h-5 object-contain" 
                    alt="Facebook" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6YyaRYYW0yjj-2n3h45LRa8yKnD3Owq6nX7LgF-Wo2KqjfCpbNqqOALnxlYU8r_kPk7RlcXFxIwYNQyaJQ4_K-ccRvS-Jr9wLDX1bBEf0Tc199YV2rg_JWII98H7ej-647Ax8PFVtpU1R90YI4pflRqw9d_3_qqbh_VEBPKn9lzDG1Z3RFCSx-5g41Big6oD2SHM3pWRnCTgCXdj1U0EqmMWktj_jrFJ6GcVe9bJHbK2VIgahAAxoZA"
                  />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img 
                    className="w-5 h-5 object-contain" 
                    alt="Instagram" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDViVlq4Tyr8RJaWEFe1xtsDFfJoyPgNSpFiO9a4RARzdantZJ-pqnx4783UDY_4nmLu-u54FiJwG4KYeq6ha1152oFyXImDsMWeLjHm-AT2FFfHqd-3sd7jqDsnWYplpLuP3KEpX_MaPh2QRfd3r17Ipt6gVRGlHrgSq8eTAxSCA6VTq7HS3tlWmifCvxUJWPXbzOZhkU4sbdxlGvhdt1S0Gh2zXp5v_C7Df9Z80klekOhZXYR5vm3sA"
                  />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img 
                    className="w-5 h-5 object-contain" 
                    alt="LinkedIn" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4Esyg0Ya6RWbErwGSYFZ6ksOtkSrrZircnZ0Ky2UC8hJW9YDl4rycUNISE8nmiBGqAzuTThglozAR4qNfoyN4KEzDWSJSjth3DV9M5rtHw05HNbrOAdzQbMBVMMcjLhsOYcwXpacT80tdZ_9jH4gjfuX10DJ_MtDTbHZS4XxjDEWqC4mmHlGohnBpskP2689idHMF2--pR_SaGcfplGr7VELfPGq_cZOLbAz2t7jFXFJBSJUu5-7z8A"
                  />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img 
                    className="w-5 h-5 object-contain" 
                    alt="YouTube" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCm91qv35QSMXptwuMMRo81-8_avjVJns4QpM6EyFmU7OTPNxWMeh8IU_HzsTJwnVbEOIaIq0UpEcqCnRhPKu-JfKks96ExPCZK3Y8uZKlx3LjAPXGYSkFu0BsTWfKzaIx6_wbQrCVs_Dq_f2fPoE76cqKdgie4TJ0H5RowXUGnuBMymDO9Nr1BGOgFFN1WryRWj6hXTRuqnuP9PIGAbz8gNzpjWmagfbQtU8bJG_7Z2hL070YAgCzBQ"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600/40 py-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#bdc9c9]">
            <a href="#" className="hover:text-white">Report Vulnerability</a>
            <a href="#" className="hover:text-white">Privacy Statement</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Sitemap</a>
            <a href="#" className="hover:text-white">Site Requirements</a>
            <a href="#" className="hover:text-white">Useful Links</a>
          </div>

          <div className="pt-6 border-t border-gray-600/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[#bdc9c9]/70">
            <p>© 2026 Government of Singapore. Last updated 23 May 2026</p>
            
            <div className="flex items-center gap-4">
              {/* Live Assistant Contact Details */}
              <div className="flex items-center gap-2 bg-gray-600/20 px-3 py-1.5 rounded-full border border-gray-600/30">
                <img 
                  className="w-5 h-5 rounded-full object-contain" 
                  alt="Ask HDB AI Assistant avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWV_emDrMFgb2mKoofZYNNHZ8Mhs7tKwEHqbGHl7CsW6eZ8h-WlkHoiGF0fqHTMKd1CdlQszpwH6Dvjwu-RAHcNnkOajh99p-QVvBbS6cah_HKth0zUX77GYMXocIPvXGodpgNCxRdD4iSdMur9T-k-5iSpbpU6pEJmBQmniF6Xk4981nly-KgZUwrJWLeT128UMKH926Ebp6U3I9ogyiFZ6cBmtn0kXFueZtl4Q584fVinkeZ8C6WCA"
                />
                <span className="font-bold text-[10px] text-white">Ask HDB Active</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* 6. SINGPASS MODAL */}
      {showSingpassModal && (
        <SingpassLogin 
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowSingpassModal(false)}
        />
      )}

      {/* 7. INTELLIGENT ASK HDB AI CHATBOT */}
      <HdbChatbot />

      {/* 8. FLOATING BACK TO TOP BUTTON (Avoids overlapping with the AI chat button) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-8 z-[98] w-10 h-10 bg-[#00686c] hover:bg-[#004f52] text-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
