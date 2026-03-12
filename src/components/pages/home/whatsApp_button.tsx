
"use client";

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Halo, saya tertarik dengan produk/layanan Anda",
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Format nomor telepon (hapus karakter non-digit)
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  // Buat URL WhatsApp
  const createWhatsAppUrl = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsPulsing(false);
    }
  };

  // Handle klik WhatsApp
  const handleWhatsAppClick = () => {
    window.open(createWhatsAppUrl(), '_blank');
    setIsOpen(false);
  };

  // Handle klik telepon
  // const handlePhoneClick = () => {
  //   window.open(`tel:${formatPhoneNumber(phoneNumber)}`, '_blank');
  //   setIsOpen(false);
  // };

  // Handle klik chat langsung
  const handleMessageClick = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
    setIsOpen(false);
  };

  // Efek pulsing setiap 5 detik
  useEffect(() => {
    if (!isPulsing) return;

    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPulsing]);

  // Posisi berdasarkan prop
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  return (
    <div className={`fixed z-50 ${positionClasses}`}>
      {/* Menu Opsi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 flex flex-col items-end gap-3"
          >
      

            {/* Opsi Chat Langsung */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMessageClick}
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg"
            >
              <span className="text-sm font-medium">Chat Langsung</span>
              <FaComments className="text-lg" />
            </motion.button>

            {/* Opsi WhatsApp dengan Pesan */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lg"
            >
              <span className="text-sm font-medium">WhatsApp</span>
              <FaWhatsapp className="text-lg" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Utama */}
      <motion.button
        initial={false}
        animate={{ 
          scale: isPulsing && !isOpen ? [1, 1.1, 1] : 1,
          rotate: isOpen ? 45 : 0
        }}
        transition={{ 
          scale: isPulsing && !isOpen ? { repeat: Infinity, duration: 1.5 } : { duration: 0.2 },
          rotate: { duration: 0.2 }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#25D366] hover:bg-[#128C7E]'
        } text-white transition-colors duration-200`}
      >
        {/* Efek ripple/pulsing */}
        {isPulsing && !isOpen && (
          <motion.div
            className="absolute inset-0 border-2 border-[#25D366] rounded-full"
            animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Ikon */}
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaWhatsapp className="text-3xl" />
        )}

        {/* Badge notifikasi */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-bold">1</span>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;