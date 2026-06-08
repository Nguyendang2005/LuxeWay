import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Quick prefix checks
    if (id.startsWith('VC-') || id.startsWith('CAR-')) {
      navigate(`/cars/${id}`, { replace: true });
      return;
    }
    if (id.startsWith('VM-') || id.startsWith('BIKE-') || id.startsWith('MB-')) {
      navigate(`/motorbikes/${id}`, { replace: true });
      return;
    }

    // Query database
    vehicleService.getById(id).then(v => {
      if (v) {
        if (v.vehicleType === 'motorbike') {
          navigate(`/motorbikes/${id}`, { replace: true });
        } else {
          navigate(`/cars/${id}`, { replace: true });
        }
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">Redirecting to showcase portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-6xl mb-4">🚗</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle Not Found</h2>
        <p className="text-slate-500 mb-4">We couldn't find the requested vehicle.</p>
        <button onClick={() => navigate('/marketplace')} className="btn-primary">
          Back to Marketplace
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
