import React from "react";
import { ChevronRight } from "lucide-react";

interface HdbPortalsGridProps {
  onNavigate: (view: "home" | "hfe" | "parking" | "appointment" | "dashboard") => void;
  onTriggerLoginOrAction: (targetView: "dashboard" | "hfe" | "parking" | "appointment") => void;
  onScrollToJourney: () => void;
}

export default function HdbPortalsGrid({
  onNavigate,
  onTriggerLoginOrAction,
  onScrollToJourney,
}: HdbPortalsGridProps) {
  const portals = [
    {
      id: "buy",
      title: "Buying a Flat",
      subtitle: "FOR BUYERS",
      desc: "Check eligibility, estimate CPF housing grants, apply for your official HFE Letter, or browse upcoming BTO and resale listings.",
      img: "https://www.hdb.gov.sg/-/media/buying-a-flat/buying-a-flat_webp.webp?h=370&iar=0&w=370&hash=B0E3CC7308403ED543F94AA4C8111DF3",
      btnText: "Explore Buying Journey",
      action: onScrollToJourney,
    },
    {
      id: "sell",
      title: "Managing & Selling My Flat",
      subtitle: "FOR HOMEOWNERS & SELLERS",
      desc: "Fulfill your Minimum Occupation Period (MOP), register your Intent to Sell, obtain resale valuation, or apply for structural improvements.",
      img: "https://www.hdb.gov.sg/-/media/managing-my-home/managing-my-home_webp.webp?h=370&iar=0&w=370&hash=E9CDD96E4E13C8D1429B05977BC76743",
      btnText: "Seller Portal Dashboard",
      action: () => onTriggerLoginOrAction("dashboard"),
    },
    {
      id: "rent",
      title: "Renting a Flat",
      subtitle: "FOR TENANTS & LANDLORDS",
      desc: "Find public subsidized rental flats, check rental application eligibility criteria, or register to rent out bedrooms of your existing flat.",
      img: "https://www.hdb.gov.sg/-/media/renting-a-flat/renting-a-flat_webp.webp?h=370&iar=0&w=370&hash=2EF6A74F12B966C5655F2E2BC83952BD",
      btnText: "View Rental Schemes",
      action: onScrollToJourney,
    },
    {
      id: "parking",
      title: "Season Parking & Motoring",
      subtitle: "FOR MOTORISTS",
      desc: "Apply for new season parking, instantly renew parking passes, search carpark lot availability, or request immediate car park transfers.",
      img: "https://www.hdb.gov.sg/-/media/parking/parking_webp.webp?h=370&iar=0&w=370&hash=491437891BDC2697037628523273B31A",
      btnText: "Manage Season Parking",
      action: () => onNavigate("parking"),
    },
    {
      id: "shops",
      title: "Shops & Commercial Premises",
      subtitle: "FOR BUSINESS PARTNERS",
      desc: "Tender for commercial spaces, view retail rental guidelines, bid for industrial offices, or manage business tenancy renewals with HDB.",
      img: "https://www.hdb.gov.sg/-/media/shops-and-offices/shopsoffices_webp.webp?h=370&iar=0&w=370&hash=314E8B6900D58C58C6AEB434D902E9B0",
      btnText: "Explore Commercial Leases",
      action: () => alert("Redirecting to HDB Place2Lease commercial bidding platform."),
    },
    {
      id: "partners",
      title: "Housing Agency & Partners",
      subtitle: "FOR CONTRACTORS & AGENTS",
      desc: "Access digital services for estate agents, submit flat resale transactions, inspect estate safety standards, or bid for HDB construction tenders.",
      img: "https://www.hdb.gov.sg/-/media/business-partners/business-partners_webp.webp?h=370&iar=0&w=370&hash=74FDFFDA8381C6134CE2DE7DE10DF6E0",
      btnText: "Partner Portal Services",
      action: () => alert("Launching HDB Business Partner Network digital sign-in."),
    },
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-6 py-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
          HDB Portals & Citizen Services
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Comprehensive, intuitive public housing portals catering directly to first-time buyers, seasoned upgraders, sellers, tenants, and motorists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portals.map((portal) => (
          <div
            key={portal.id}
            id={`portal-card-${portal.id}`}
            className="bg-white rounded-3xl border border-gray-200/80 hover:border-[#00686c]/40 hover:shadow-lg transition-all flex flex-col overflow-hidden group"
          >
            {/* Image banner with referrerPolicy for safety */}
            <div className="relative h-48 overflow-hidden shrink-0">
              <img
                src={portal.img}
                alt={portal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider text-[#00686c] shadow-sm uppercase">
                {portal.subtitle}
              </div>
            </div>

            {/* Content card */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug group-hover:text-[#00686c] transition-colors">
                  {portal.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {portal.desc}
                </p>
              </div>

              <button
                onClick={portal.action}
                className="w-full bg-[#f3f9f9] text-[#00686c] hover:bg-[#00686c] hover:text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
              >
                {portal.btnText} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
