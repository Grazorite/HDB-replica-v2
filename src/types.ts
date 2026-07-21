export interface CitizenProfile {
  name: string;
  nric: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  citizenStatus: "Singapore Citizen" | "Permanent Resident" | "Non-Citizen";
  monthlyHouseholdIncome: number;
  ownedFlat: {
    address: string;
    flatType: string;
    purchaseYear: number;
    outstandingLoan: number;
    remainingLease: number;
    monthlyInstallment: number;
  } | null;
  hasAppliedHfe: boolean;
  hfeStatus: "Eligible" | "Pending" | "Not Applied";
}

export interface SeasonParkingPass {
  id: string;
  plateNumber: string;
  iuNumber: string;
  carparkCode: string;
  vehicleType: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Pending Payment";
  monthlyPrice: number;
}

export interface Appointment {
  id: string;
  branch: string;
  serviceType: string;
  date: string;
  time: string;
  status: "Confirmed" | "Cancelled" | "Completed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface HfeFormState {
  citizenship: string;
  firstTimer: boolean;
  householdIncome: number;
  existingDebts: number;
  maritalStatus: "Single" | "Married" | "Divorced";
  preferredFlatType: string;
  employmentType: "Salaried" | "Self-Employed" | "Unemployed";
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: "Buying a Flat" | "Managing My Home" | "Parking" | "General";
}
