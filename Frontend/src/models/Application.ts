import type { FarmerProduct } from "./FarmerProduct";
import type { User } from "./User";

export type ApplicationStatus = 
    "submitted" 
  | "under_review" 
  | "approved" 
  | "rejected" 
  | "cancelled";

export interface DocumentInfo {
  filename: string;
  path: string;
}

export interface Application {
  id?: number;
  applicationDate: string; // ISO date
  userId: number;
  user?: User;
  businessEmail: string;
  businessPhone: string;
  documentsSubmitted: DocumentInfo[];
  name: string;
  location: string;
  freguesia: string;
  municipio: string;
  supplierComment: string;
  evaluationComment?: string;
  status: ApplicationStatus;
  farmerProducts: FarmerProduct[];
}
