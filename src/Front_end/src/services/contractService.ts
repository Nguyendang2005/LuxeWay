import { apiClient } from './api';

export interface DigitalContract {
  id: number;
  documentUrl: string;
  ownerSignature: string | null;
  renterSignature: string | null;
  ownerSignedAt: string | null;
  renterSignedAt: string | null;
  isFullySigned: boolean;
  createdAt: string;
}

export const contractService = {
  createContract: async (bookingId: string, documentUrl: string): Promise<DigitalContract> => {
    const response = await apiClient.post<any>('/contracts', { bookingId, documentUrl });
    return response.data || response;
  },

  getContractByBooking: async (bookingId: string): Promise<DigitalContract> => {
    const response = await apiClient.get<any>(`/contracts/booking/${bookingId}`);
    return response.data || response;
  },

  signContract: async (contractId: number, signature: string): Promise<DigitalContract> => {
    const response = await apiClient.post<any>(`/contracts/${contractId}/sign`, { signature });
    return response.data || response;
  }
};
