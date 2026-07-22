import apiClient from './api';

export interface OwnerApplicationDocumentResponse {
  id: string;
  documentType: string;
  fileReference: string;
  verificationStatus: string;
  rejectionReason: string;
  createdAt: string;
}

export interface OwnerApplicationResponse {
  id: string;
  userId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  currentStep: number;
  rejectionReason?: string;
  fullName?: string;
  dob?: string;
  phone?: string;
  address?: string;
  city?: string;
  displayName?: string;
  bio?: string;
  serviceArea?: string;
  bankName?: string;
  accountHolderName?: string;
  maskedAccountNumber?: string;
  termsAccepted?: boolean;
  termsVersion?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  documents?: OwnerApplicationDocumentResponse[];
}

type ApiEnvelope<T> = T | { data?: T | { data?: T } };

const unwrapApplication = (response: ApiEnvelope<OwnerApplicationResponse>): OwnerApplicationResponse => {
  const first = (response as any)?.data ?? response;
  return ((first as any)?.data ?? first) as OwnerApplicationResponse;
};

export const ownerApplicationService = {
  getMyApplication: async (): Promise<OwnerApplicationResponse | null> => {
    try {
      const response = await apiClient.get<ApiEnvelope<OwnerApplicationResponse>>('/owner-applications/me');
      return unwrapApplication(response);
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        return null; // Not found means no application
      }
      throw error;
    }
  },

  createDraft: async (): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.post<ApiEnvelope<OwnerApplicationResponse>>('/owner-applications', {});
    return unwrapApplication(response);
  },

  updatePersonalInfo: async (id: string, data: any): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.put<ApiEnvelope<OwnerApplicationResponse>>(`/owner-applications/${id}/personal-info`, data);
    return unwrapApplication(response);
  },

  updateOwnerProfile: async (id: string, data: any): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.put<ApiEnvelope<OwnerApplicationResponse>>(`/owner-applications/${id}/owner-profile`, data);
    return unwrapApplication(response);
  },

  updatePayout: async (id: string, data: any): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.put<ApiEnvelope<OwnerApplicationResponse>>(`/owner-applications/${id}/payout`, data);
    return unwrapApplication(response);
  },

  addDocument: async (id: string, documentType: string, fileReference: string): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.post<ApiEnvelope<OwnerApplicationResponse>>(`/owner-applications/${id}/documents`, {
      documentType,
      fileReference
    });
    return unwrapApplication(response);
  },

  submitApplication: async (id: string, accepted: boolean, version: string = '1.0'): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.post<ApiEnvelope<OwnerApplicationResponse>>(`/owner-applications/${id}/submit`, {
      accepted,
      version
    });
    return unwrapApplication(response);
  }
};
