import React, { useState } from "react";
import { 
  Calendar, Clock, MapPin, CheckCircle2, ChevronRight, ChevronLeft, 
  Map, ShieldCheck, FileText, UserCheck, AlertCircle 
} from "lucide-react";
import { Appointment } from "../types";

export default function AppointmentBooker() {
  const [branch, setBranch] = useState("Toa Payoh Hub (Main HQ)");
  const [service, setService] = useState("Flat Purchase & Key Collection");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"book" | "success">("book");
  const [bookedDetails, setBookedDetails] = useState<Appointment | null>(null);

  const branches = [
    { name: "Toa Payoh Hub (Main HQ)", address: "480 Lorong 6 Toa Payoh, Singapore 310480" },
    { name: "Punggol Branch Office", address: "Blk 301 Punggol Central, Singapore 820301" },
    { name: "Bedok Branch Office", address: "Blk 202 Bedok North Street 1, Singapore 460202" },
    { name: "Jurong Branch Office", address: "Blk 517 Jurong West Street 52, Singapore 640517" },
    { name: "Woodlands Branch Office", address: "Blk 883 Woodlands Street 82, Singapore 730883" }
  ];

  const services = [
    "Flat Purchase & Key Collection",
    "Housing Loan & Financial Consultation",
    "HFE Letter Application Support",
    "Season Parking & Carpark Assistance",
    "HDB Flat Renovation Permit Advice"
  ];

  const timeSlots = [
    { time: "09:00 AM", status: "Available" },
    { time: "10:30 AM", status: "Available" },
    { time: "11:30 AM", status: "Limited" },
    { time: "02:00 PM", status: "Available" },
    { time: "03:30 PM", status: "Available" },
    { time: "04:30 PM", status: "Fully Booked" }
  ];

  // Simulated calendar for current month (July 2026)
  // July 2026 starts on a Wednesday
  const calendarDays = Array.from({ length: 31 }).map((_, i) => {
    const dayNum = i + 1;
    const isWeekend = (dayNum % 7 === 4 || dayNum % 7 === 5); // simple weekend calculation
    return {
      day: dayNum,
      isWeekend,
      status: isWeekend ? "Closed" : (dayNum % 5 === 0 ? "Fully Booked" : "Available")
    };
  });

  const handleBookingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) return;

    const formattedDate = `2026-07-${selectedDay.toString().padStart(2, "0")}`;
    const newAppointment: Appointment = {
      id: `APT-${Math.floor(Math.random() * 90000) + 10000}`,
      branch,
      serviceType: service,
      date: formattedDate,
      time: selectedTime,
      status: "Confirmed",
    };

    setBookedDetails(newAppointment);
    setBookingStep("success");
  };

  const selectedBranchObj = branches.find(b => b.name === branch) || branches[0];

  return (
    <div className="bg-white rounded-2xl border border-[#bdc9c9] shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Calendar className="w-6 h-6 text-[#91f2f7]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans">Book Appointment at HDB Branch</h2>
            <p className="text-xs text-white/80">Schedule your physical visit for personalized consultation and transactions</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {bookingStep === "book" ? (
          <form onSubmit={handleBookingConfirm} className="space-y-6 animate-in fade-in duration-200">
            {/* Step 1: Branch and Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Preferred HDB Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {branches.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-500 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{selectedBranchObj.address}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Assistance Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6fafa] border border-[#bdc9c9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Interactive Custom Calendar Day Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Select Consultation Date (July 2026)
              </label>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-1">
                <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div><div>Mon</div><div>Tue</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayObj) => {
                  const isDaySelected = selectedDay === dayObj.day;
                  const isAvailable = dayObj.status === "Available" || dayObj.status === "Limited";
                  
                  return (
                    <button
                      key={dayObj.day}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => { setSelectedDay(dayObj.day); setSelectedTime(null); }}
                      className={`h-10 rounded-lg flex flex-col items-center justify-center border transition-all text-sm font-bold relative ${
                        isDaySelected
                          ? "bg-primary border-primary text-white"
                          : dayObj.isWeekend
                          ? "bg-gray-100 border-transparent text-gray-300 cursor-not-allowed"
                          : dayObj.status === "Fully Booked"
                          ? "bg-red-50 border-red-100 text-red-300 cursor-not-allowed"
                          : "bg-white border-[#bdc9c9] text-gray-700 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <span>{dayObj.day}</span>
                      {dayObj.status === "Limited" && !isDaySelected && (
                        <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Interactive Time Slot Picker */}
            {selectedDay && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Available Time Slots for July {selectedDay}, 2026
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const isFullyBooked = slot.status === "Fully Booked";
                    
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isFullyBooked}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          isSelected
                            ? "bg-primary border-primary text-white font-bold"
                            : isFullyBooked
                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                            : slot.status === "Limited"
                            ? "bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-400"
                            : "bg-white border-[#bdc9c9] text-gray-700 hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        <span className="text-xs font-bold">{slot.time}</span>
                        <span className={`text-[9px] mt-0.5 font-normal uppercase ${
                          isSelected ? "text-white/80" : isFullyBooked ? "text-gray-300" : slot.status === "Limited" ? "text-amber-600" : "text-green-600"
                        }`}>
                          {slot.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit / Error section */}
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2.5 text-xs text-amber-700 bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Appointments can be modified or rescheduled up to 24 hours prior to the booked time slot.</span>
              </div>
              <button
                type="submit"
                disabled={!selectedDay || !selectedTime}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all ${
                  !selectedDay || !selectedTime
                    ? "bg-gray-200 text-gray-400 border border-gray-100 cursor-not-allowed shadow-none"
                    : "bg-[#bc0001] text-white hover:bg-[#a00001] active:scale-95"
                }`}
              >
                Confirm HDB Appointment
              </button>
            </div>
          </form>
        ) : (
          /* Success Appointment Card */
          <div className="border-2 border-[#e8f7e7] bg-[#e8f7e7]/30 rounded-2xl p-6 md:p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#e8f7e7] text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-800">Your Appointment is Confirmed!</h3>
            <p className="text-sm text-green-700 mt-1 max-w-md mx-auto">
              You are scheduled to visit the **{bookedDetails?.branch}** branch on **{bookedDetails && new Date(bookedDetails.date).toLocaleDateString("en-SG", { day: 'numeric', month: 'long', year: 'numeric' })}** at **{bookedDetails?.time}**.
            </p>

            {/* Appointment Ticket Code */}
            <div className="bg-white border border-[#bdc9c9] rounded-xl p-6 max-w-md mx-auto mt-6 text-left space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-[#00686c] text-white text-[9px] font-bold px-3 py-1 uppercase rounded-bl">
                CONFIRMED PASS
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">HDB BRANCH APPOINTMENT TICKET</h4>
              
              <div className="divide-y divide-gray-100 text-xs">
                <div className="py-2.5 flex justify-between"><span className="text-gray-500">Ticket Ref No:</span> <strong>{bookedDetails?.id}</strong></div>
                <div className="py-2.5 flex justify-between"><span className="text-gray-500">Scheduled Branch:</span> <strong className="text-right max-w-xs">{bookedDetails?.branch}</strong></div>
                <div className="py-2.5 flex justify-between"><span className="text-gray-500">HDB Desk Service:</span> <strong>{bookedDetails?.serviceType}</strong></div>
                <div className="py-2.5 flex justify-between"><span className="text-gray-500">Appointment Date:</span> <strong>{bookedDetails && new Date(bookedDetails.date).toLocaleDateString("en-SG", { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                <div className="py-2.5 flex justify-between"><span className="text-gray-500">Assigned Time Slot:</span> <strong>{bookedDetails?.time}</strong></div>
              </div>

              <div className="pt-2 text-center">
                {/* Simulated Barcode */}
                <div className="bg-gray-100 h-8 w-full flex items-center justify-center gap-[1.5px] px-4 opacity-70">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <div key={i} className="bg-black h-full" style={{ width: i % 4 === 0 ? "3px" : "1px" }} />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-1 block">*{bookedDetails?.id}*</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setBookingStep("book")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Book Another / Reschedule
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                Print Appointment Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
