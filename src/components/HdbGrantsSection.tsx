import React from "react";
import { Sparkles, DollarSign, Heart, ChevronRight } from "lucide-react";

interface HdbGrantsSectionProps {
  onNavigateToHfe: () => void;
}

export default function HdbGrantsSection({ onNavigateToHfe }: HdbGrantsSectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#f2faf9] to-[#ebf7f6] py-16 border-y border-gray-200/60 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Happy Family dining image cropped elegantly */}
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3N0TeWwIudmg1WCo1O6oueqZWDL91Vr5vLCsFxU0orkmT7-6aTl2WdKafU-Ovwo4ROyc5jLX5Lwq-9D4UbVVSUfzQrJzT-X-ia9WZn9IuPlZM4fez8UB82iPXhh22HX7nirw0vf8amhR7MeMzwDr2MlxM8tTIIs53SbpoT8IBTAk9TkxCksBQOLFvgifyb4yrPwIrP8nh5mqbfdLYC4CXWdTSA0VrKEWC5r5NQ1NChMda5WOvhCEQRA"
              alt="Happy Singaporean Family Dining together in HDB Flat"
              referrerPolicy="no-referrer"
              className="w-full h-[380px] object-cover hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-semibold drop-shadow-md">
              "Keeping public housing affordable, inclusive, and multi-generational for Singaporeans."
            </div>
          </div>
          
          {/* Ambient background decoration */}
          <div className="absolute -top-6 -left-6 w-36 h-36 bg-[#00686c]/5 rounded-full blur-2xl z-0" />
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-teal-600/5 rounded-full blur-3xl z-0" />
        </div>

        {/* Right Column: High-readability Grants Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#e0f4f5] text-[#00686c] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> CPF Housing Subsidies
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Up to $190,000 in Government Housing Grants
          </h2>
          
          <p className="text-base text-gray-600 leading-relaxed font-medium">
            Housing grants are credited directly into your CPF Ordinary Account to offset your flat's purchase price and reduce your mortgage loan amount. Both first-time and selected second-time buyers are supported.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[#00686c] font-black text-sm">
                <DollarSign className="w-4 h-4" /> Enhanced Grant (EHG)
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Up to <strong className="text-gray-900 font-extrabold">$120,000</strong> based on the average gross monthly household income. Valid for both BTO and Resale.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-teal-600 font-black text-sm">
                <Heart className="w-4 h-4" /> CPF Housing Grant (Family)
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Up to <strong className="text-gray-900 font-extrabold">$80,000</strong> for first-timer married couples or families purchasing resale flats (2-room to 4-room).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[#bc0001] font-black text-sm">
                <Sparkles className="w-4 h-4" /> Proximity Grant (PHG)
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Up to <strong className="text-gray-900 font-extrabold">$30,000</strong> for those buying resale flats to live with or near parents or married children.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-gray-700 font-black text-sm">
                <Sparkles className="w-4 h-4" /> Second-Timer Subsidies
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Up to <strong className="text-gray-900 font-extrabold">$15,000</strong> for citizen-PR couples or half-grant seekers when upgrading housing options.
              </p>
            </div>

          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={onNavigateToHfe}
              className="bg-[#00686c] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#004f52] transition-all active:scale-95 shadow-md text-sm cursor-pointer"
            >
              Estimate My Eligible Grants
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium">
              Checks take 2 minutes and do not affect your credit rating. Singpass log-in is not required for a preliminary calculation.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
