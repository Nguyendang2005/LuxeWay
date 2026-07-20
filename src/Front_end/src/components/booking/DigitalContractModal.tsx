import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, X, Shield, Pencil, Key } from 'lucide-react';
import { contractService, DigitalContract } from '@/services/contractService';
import { useToast } from '@/components/ui/Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  vehicleName: string;
  customerName: string;
  isOwner?: boolean;
  onSigned: (contract: DigitalContract) => void;
}

export const DigitalContractModal: React.FC<Props> = ({ isOpen, onClose, bookingId, vehicleName, customerName, isOwner = false, onSigned }) => {
  const [signature, setSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contract, setContract] = useState<DigitalContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  React.useEffect(() => {
    if (isOpen) {
      loadContract();
    }
  }, [isOpen, bookingId]);

  const loadContract = async () => {
    setIsLoading(true);
    try {
      let data = await contractService.getContractByBooking(bookingId);
      // Auto-create for demo purposes if not found
      if (!data) {
        data = await contractService.createContract(bookingId, `https://luxeway.io.vn/contracts/${bookingId}.pdf`);
      }
      setContract(data);
    } catch (error) {
      console.error(error);
      // For demo fallback if backend returns error when not found
      try {
         const newData = await contractService.createContract(bookingId, `https://luxeway.io.vn/contracts/${bookingId}.pdf`);
         setContract(newData);
      } catch (innerError) {
         toast.error('Failed to load digital contract');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    if (!signature.trim()) {
      toast.error('Please enter your signature');
      return;
    }
    if (!contract) return;
    
    setIsSubmitting(true);
    try {
      const signedContract = await contractService.signContract(contract.id, signature);
      toast.success('Contract signed successfully!');
      onSigned(signedContract);
      onClose();
    } catch (error) {
      toast.error('Failed to sign contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const hasSigned = isOwner ? !!contract?.ownerSignature : !!contract?.renterSignature;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 font-medium text-sm tracking-wider uppercase">LuxeWay Secure Gateway</span>
              </div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Digital Rental Agreement
              </h2>
              <p className="text-blue-100 mt-1 opacity-90">Booking ID: #{bookingId.slice(0, 8).toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800 h-64 overflow-y-auto custom-scrollbar">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 text-center">VEHICLE RENTAL AGREEMENT</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    This Vehicle Rental Agreement (the "Agreement") is entered into by and between the Vehicle Owner and the Renter (<strong>{customerName}</strong>) for the rental of the vehicle: <strong>{vehicleName}</strong>.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <strong>1. Rental Terms:</strong> The Renter agrees to rent the vehicle for the specified duration and return it in the same condition as received. Any damages incurred during the rental period will be the Renter's liability.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <strong>2. Payments:</strong> The Renter agrees to pay all fees associated with the rental as displayed at checkout.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <strong>3. Insurance & Liability:</strong> The vehicle is covered by LuxeWay's standard insurance policy. The Renter is responsible for any deductible or damages not covered by insurance.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-6 border-t pt-4">
                    By providing your digital signature below, you legally bind yourself to the terms of this agreement pursuant to the Electronic Transactions Act.
                  </p>
                </div>

                {hasSigned ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Contract Signed Successfully</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400/80 mt-1">
                        Signed by: <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-200">{isOwner ? contract?.ownerSignature : contract?.renterSignature}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-blue-500" />
                        Digital Signature
                      </label>
                      <input
                        type="text"
                        placeholder="Type your full legal name to sign"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-lg font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    
                    <button
                      onClick={handleSign}
                      disabled={isSubmitting || !signature.trim()}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          I Agree and Sign Contract
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
