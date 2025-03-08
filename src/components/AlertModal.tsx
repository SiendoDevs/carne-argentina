import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={24} />
          <h3 className="text-lg font-semibold">Servicio no disponible</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Estamos experimentando inconvenientes técnicos con nuestro servicio de datos. 
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estamos trabajando para resolver este problema lo antes posible.
        </p>
      </div>
    </div>
  );
};

export default AlertModal;