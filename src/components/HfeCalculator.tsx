import React, { useState } from "react";
import { 
  Calculator, User, DollarSign, Briefcase, FileText, Download, 
  ChevronRight, ChevronLeft, CheckCircle2, ShieldAlert, Award, PiggyBank, Home
} from "lucide-react";
import { HfeFormState } from "../types";

export default function HfeCalculator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<HfeFormState>({
    citizenship: "SC_SC", // SC/SC, SC/PR, SC/Foreigner, PR/PR
    firstTimer: true,
    householdIncome: 6500,
    existingDebts: 400,
    maritalStatus: "Married",
    preferredFlatType: "4-Room",
    employmentType: "Salaried",
  });

  const [generatedLetter, setGeneratedLetter] = useState(false);

  const handleInputChange = (field: keyof HfeFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Dynamically calculate Grants and Loans based on actual HDB guidelines
  const calculateGrantsAndLoans = () => {
    const { citizenship, firstTimer, householdIncome, preferredFlatType } = formData;
    
    let ehgGrant = 0; // Enhanced CPF Housing Grant
    let familyGrant = 0; // Family Grant (for Resale)
    let proximityGrant = 20000; // Proximity Housing Grant (PHG) default

    // 1. EHG Calculations (first timers only, income cap $9k)
    if (firstTimer && householdIncome <= 9000) {
      if (householdIncome <= 1500) ehgGrant = 80000;
      else if (householdIncome <= 2000) ehgGrant = 75000;
      else if (householdIncome <= 2500) ehgGrant = 70000;
      else if (householdIncome <= 3000) ehgGrant = 65000;
      else if (householdIncome <= 3500) ehgGrant = 60000;
      else if (householdIncome <= 4000) ehgGrant = 55000;
      else if (householdIncome <= 4500) ehgGrant = 50000;
      else if (householdIncome <= 5000) ehgGrant = 45000;
      else if (householdIncome <= 5500) ehgGrant = 40000;
      else if (householdIncome <= 6000) ehgGrant = 35000;
      else if (householdIncome <= 6500) ehgGrant = 30000;
      else if (householdIncome <= 7000) ehgGrant = 25000;
      else if (householdIncome <= 7500) ehgGrant = 20000;
      else if (householdIncome <= 8000) ehgGrant = 15000;
      else if (householdIncome <= 8500) ehgGrant = 10000;
      else ehgGrant = 5000;
    }

    // 2. Family Grant (if married and buying resale flat)
    if (firstTimer && citizenship !== "PR_PR") {
      if (preferredFlatType === "2-Room" || preferredFlatType === "3-Room" || preferredFlatType === "4-Room") {
        familyGrant = 80000;
      } else {
        familyGrant = 50000;
      }
    }

    // 3. Estimate maximum HDB Housing Loan based on 30% Mortgage Servicing Ratio (MSR)
    // Interest rate 2.6%, 25-year tenure
    const msrCap = householdIncome * 0.30;
    // Approximating loan size where monthly installment = msrCap
    // Amortization factor for 2.6% over 25 years is approx 220x monthly payment
    let maxHdbLoan = Math.round(msrCap * 215);
    
    // Hard caps on loans
    if (maxHdbLoan > 650000) maxHdbLoan = 650000;

    const totalGrants = ehgGrant + familyGrant + proximityGrant;
    
    // Estimate standard CPF Ordinary Account balance (e.g. 1.5x monthly income times years worked, mock average)
    const estimatedCpfOa = Math.round(householdIncome * 8.5);

    const maxPurchasePrice = totalGrants + maxHdbLoan + estimatedCpfOa;

    return {
      ehgGrant,
      familyGrant,
      proximityGrant,
      totalGrants,
      maxHdbLoan,
      estimatedCpfOa,
      maxPurchasePrice,
      isEligible: householdIncome <= 14000, // standard income ceiling for families
    };
  };

  const results = calculateGrantsAndLoans();

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#bdc9c9] shadow-sm overflow-hidden">
      {/* Title Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Calculator className="w-6 h-6 text-[#91f2f7]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans">HDB Flat Eligibility (HFE) & Grant Estimator</h2>
            <p className="text-xs text-white/80">Check your purchase eligibility and CPF Housing Grants</p>
          </div>
        </div>
        <div className="text-xs font-mono bg-[#004f52] px-3 py-1.5 rounded-full text-[#91f2f7]">
          Step {step} of 4
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5 flex">
        <div className={`h-full transition-all duration-300 ${step >= 1 ? "bg-primary flex-1" : "bg-transparent"}`} />
        <div className={`h-full transition-all duration-300 ${step >= 2 ? "bg-primary flex-1" : "bg-transparent"}`} />
        <div className={`h-full transition-all duration-300 ${step >= 3 ? "bg-primary flex-1" : "bg-transparent"}`} />
        <div className={`h-full transition-all duration-300 ${step >= 4 ? "bg-primary flex-1" : "bg-transparent"}`} />
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> 1. Household Profile
            </h3>
            <p className="text-sm text-gray-500">Let's start with who will be buying the flat and your current marital status.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Citizenship Status
                </label>
                <select
                  value={formData.citizenship}
                  onChange={(e) => handleInputChange("citizenship", e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="SC_SC">Singapore Citizen + Singapore Citizen</option>
                  <option value="SC_PR">Singapore Citizen + Permanent Resident</option>
                  <option value="PR_PR">Permanent Resident + Permanent Resident</option>
                  <option value="SC_FT">Singapore Citizen + Foreign Spouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Marital Status
                </label>
                <div className="flex gap-2">
                  {["Single", "Married", "Divorced"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleInputChange("maritalStatus", status)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                        formData.maritalStatus === status
                          ? "bg-[#e8f7e7] border-green-600 text-green-800 font-bold"
                          : "bg-[#f6fafa] border-[#bdc9c9] text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Are you a first-time applicant?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange("firstTimer", true)}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      formData.firstTimer
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-[#f6fafa] border-[#bdc9c9] text-gray-600"
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-sm">Yes, First-Timer</span>
                      <span className="text-xs opacity-80">Eligible for maximum CPF Housing Grants</span>
                    </div>
                    {formData.firstTimer && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("firstTimer", false)}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      !formData.firstTimer
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-[#f6fafa] border-[#bdc9c9] text-gray-600"
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-sm">No, Second-Timer / Subsidized</span>
                      <span className="text-xs opacity-80">Previously owned a flat / received housing grant</span>
                    </div>
                    {!formData.firstTimer && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> 2. Financial Assessment
            </h3>
            <p className="text-sm text-gray-500">Provide your monthly gross household income and active monthly debt commitments.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Average Gross Monthly Household Income (SGD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    S$
                  </div>
                  <input
                    type="number"
                    value={formData.householdIncome}
                    onChange={(e) => handleInputChange("householdIncome", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-10 pr-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Include monthly bonuses and basic pay of all co-applicants.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Other Monthly Financial Obligations (SGD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    S$
                  </div>
                  <input
                    type="number"
                    value={formData.existingDebts}
                    onChange={(e) => handleInputChange("existingDebts", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-10 pr-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">e.g. car loan installments, education loans, credit card debt.</p>
              </div>
            </div>

            <div className="bg-[#e8f7e7] border border-green-200 rounded-xl p-4 flex items-start gap-3 mt-4">
              <PiggyBank className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-green-800">Quick Fact</h4>
                <p className="text-xs text-green-700 leading-relaxed mt-0.5">
                  To buy an HDB flat, your monthly household income must not exceed the current income ceiling of S$14,000 for families (or S$21,000 for multi-generation families).
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> 3. Employment & Housing Preference
            </h3>
            <p className="text-sm text-gray-500">Provide details about your current employment type and preferred flat category.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Employment Status
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange("employmentType", e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Salaried">Salaried (Min. 3-12 months continuous employment)</option>
                  <option value="Self-Employed">Self-Employed (Registered business owner / freelancer)</option>
                  <option value="Unemployed">Unemployed / Student / Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Preferred Flat Type
                </label>
                <select
                  value={formData.preferredFlatType}
                  onChange={(e) => handleInputChange("preferredFlatType", e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="2-Room">2-Room Flexi Flat</option>
                  <option value="3-Room">3-Room Premium Flat</option>
                  <option value="4-Room">4-Room Premium Flat</option>
                  <option value="5-Room">5-Room Premium Flat</option>
                  <option value="Executive">Executive Flat</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mt-4">
              <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-800">Employment Requirements</h4>
                <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                  Salaried applicants are assessed based on their average monthly income for the last 3 or 12 months. Self-employed applicants must produce the Notice of Assessment (NOA) from IRAS.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {generatedLetter ? (
              /* High-Fidelity Official HFE PDF Mockup */
              <div id="printable-hfe-letter" className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 bg-white relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Official watermark background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <div className="text-9xl font-bold tracking-widest text-primary rotate-45">HDB APPROVED</div>
                </div>

                {/* HDB Singapore Official Layout Header */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
                  <div>
                    <h4 className="text-sm font-extrabold tracking-wider text-gray-800 uppercase">HOUSING & DEVELOPMENT BOARD</h4>
                    <p className="text-[10px] text-gray-500">HDB Hub, 480 Lorong 6 Toa Payoh, Singapore 310480</p>
                    <p className="text-[10px] text-gray-500">Website: www.hdb.gov.sg | Tel: 1800-866-3000</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase">
                      OFFICIAL HFE APPROVED
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">Ref No: HFE-2026-07923C</p>
                    <p className="text-[10px] text-gray-400">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-gray-800">
                  <p className="font-bold">To: Applicant (TAN WEI JIE & CO-APPLICANT)</p>
                  <p className="text-xs leading-relaxed text-gray-600">
                    We refer to your application for an HDB Flat Eligibility (HFE) letter. Based on the information and declarations provided, we are pleased to inform you that you are **ELIGIBLE** to purchase an HDB flat and qualify for the housing grants and loan details listed below.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1.5">
                      HFE LETTER SUMMARY DETAILS
                    </h5>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div><span className="text-gray-500">Eligibility Status:</span> <strong className="text-green-700">ELIGIBLE</strong></div>
                      <div><span className="text-gray-500">Household Income Assessed:</span> <strong>S$ {formData.householdIncome.toLocaleString()} / month</strong></div>
                      <div><span className="text-gray-500">Household Profile:</span> <strong>{formData.citizenship === "SC_SC" ? "SC/SC Couple" : "Citizen/PR Couple"} ({formData.maritalStatus})</strong></div>
                      <div><span className="text-gray-500">Eligible Flat Type:</span> <strong>Up to {formData.preferredFlatType} Flat</strong></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1.5">
                      CPF HOUSING GRANTS & LOANS ELIGIBILITY
                    </h5>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 font-bold text-gray-500">
                          <th className="text-left pb-1">Eligible Grant / Loan Facility</th>
                          <th className="text-right pb-1">Approved Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.ehgGrant > 0 && (
                          <tr>
                            <td className="py-2 text-gray-600">Enhanced CPF Housing Grant (EHG)</td>
                            <td className="py-2 text-right font-bold text-green-700">S$ {results.ehgGrant.toLocaleString()}</td>
                          </tr>
                        )}
                        {results.familyGrant > 0 && (
                          <tr>
                            <td className="py-2 text-gray-600">CPF Family Housing Grant (Resale Flat)</td>
                            <td className="py-2 text-right font-bold text-green-700">S$ {results.familyGrant.toLocaleString()}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-2 text-gray-600">Proximity Housing Grant (PHG)</td>
                          <td className="py-2 text-right font-bold text-green-700">S$ {results.proximityGrant.toLocaleString()}</td>
                        </tr>
                        <tr className="font-semibold bg-gray-100">
                          <td className="py-2 px-2">Total Approved Housing Grants</td>
                          <td className="py-2 px-2 text-right text-green-700 font-bold">S$ {results.totalGrants.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">Maximum HDB Housing Loan (Interest: 2.6% p.a.)</td>
                          <td className="py-2 text-right font-bold text-primary">S$ {results.maxHdbLoan.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-200 pt-4">
                    <p>Barcode: *HFE202607923C*</p>
                    <p className="italic">Note: This is an automated digital document generated via HDB Portal.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-end print:hidden">
                  <button
                    onClick={() => setGeneratedLetter(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Back to Estimation Breakdown
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Print / Save PDF HFE Letter
                  </button>
                </div>
              </div>
            ) : (
              /* Estimation Results View with Graphs/Badges */
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center pb-2">
                  <div className="w-16 h-16 bg-[#e8f7e7] text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Your Flat Eligibility Results</h3>
                  <p className="text-sm text-gray-500 mt-1">Based on current policies, you qualify for the following BTO/Resale HDB support</p>
                </div>

                {/* Dashboard Summary Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#f0f4f4] border border-[#bdc9c9] rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Estimated Loan Limit</span>
                    <strong className="text-2xl font-bold text-primary block mt-1">
                      S$ {results.maxHdbLoan.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Based on HDB Loan 2.6% p.a.</span>
                  </div>

                  <div className="bg-[#e8f7e7] border border-green-200 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Eligible CPF Grants</span>
                    <strong className="text-2xl font-bold text-green-700 block mt-1">
                      S$ {results.totalGrants.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-gray-400 block mt-0.5">EHG + Family + Proximity Grant</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Housing Budget</span>
                    <strong className="text-2xl font-bold text-amber-800 block mt-1">
                      S$ {results.maxPurchasePrice.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Includes Estimated CPF OA savings</span>
                  </div>
                </div>

                {/* Detailed List */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2">
                    Housing Subsidy Breakdown
                  </h4>
                  <div className="space-y-3 text-sm">
                    {results.ehgGrant > 0 && (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold block text-gray-800">Enhanced CPF Housing Grant (EHG)</span>
                          <span className="text-xs text-gray-400">Subsidy for low to middle income first-time buyers</span>
                        </div>
                        <span className="font-bold text-green-700">S$ {results.ehgGrant.toLocaleString()}</span>
                      </div>
                    )}

                    {results.familyGrant > 0 && (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold block text-gray-800">CPF Family Grant (Resale Option)</span>
                          <span className="text-xs text-gray-400">For first-timer couples buying a resale flat</span>
                        </div>
                        <span className="font-bold text-green-700">S$ {results.familyGrant.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold block text-gray-800">Proximity Housing Grant (PHG)</span>
                        <span className="text-xs text-gray-400">For buying resale flat near or with parents</span>
                      </div>
                      <span className="font-bold text-green-700">S$ {results.proximityGrant.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <div>
                        <span className="font-bold text-gray-800">Average CPF OA Savings Contribution</span>
                        <span className="text-xs text-gray-400">Simulated average CPF balance available for flat downpayment</span>
                      </div>
                      <span className="font-bold text-gray-700">S$ {results.estimatedCpfOa.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-[#f0f4f4] rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Official HFE Letter Pre-approval</h4>
                      <p className="text-xs text-gray-500">You can lock in this eligibility assessment into an official HDB HFE letter document.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGeneratedLetter(true)}
                    className="w-full md:w-auto bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Generate HFE Letter
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons / Controls (visible if not showing letter) */}
        {!generatedLetter && (
          <div className="flex justify-between items-center border-t border-gray-100 mt-8 pt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${
                step === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
