"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { MapPin, Heart, Music, Camera, UtensilsCrossed, Church, Shirt } from "lucide-react";

// CountdownItem component for displaying each time unit
const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-[#687764] text-white text-3xl md:text-5xl font-bold rounded-lg w-20 md:w-28 h-24 md:h-28 flex items-center justify-center mb-2">
      {value.toString().padStart(2, '0')}
    </div>
    <span className="text-[#7E8F9F] text-lg">{label}</span>
  </div>
);

// Photo gallery component
const PhotoGallery = () => {
  // Sample image URLs - replace with your actual photos
  const images = [
    "/nosotros.jpg?height=600&width=400",
    "/nosotros2.jpg?height=600&width=400",
    "/nosotros3.jpg?height=600&width=400",
    "/nosotros4.jpg?height=600&width=400",
    "/nosotros5.jpg?height=600&width=400",
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Handle drag end event
  const handleDragEnd = (info: PanInfo) => {
    if (info.offset.x < -100 && currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > 100 && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Generate random rotation for stacked effect
  const generateRandomRotation = () => {
    return Math.random() * 10 - 5; // between -5 and 5 degrees
  };

  // Stack effect - each card has a slight offset and rotation
  const getStackStyles = (index: number, active: boolean) => {
    const position = index - currentIndex;
    
    // Active card
    if (active) {
      return {
        rotate: 0,
        scale: 0.8,
        zIndex: 5,
      };
    }
    
    // Cards in the stack
    if (position > 0 && position < 4) {
      return {
        rotate: generateRandomRotation(),
        scale: 0.9 - position * 0.05,
        zIndex: 5 - position,
        filter: `brightness(${1 - position * 0.15})`,
      };
    }
    
    // Hidden cards
    return {
      rotate: 0,
      scale: 0.7,
      zIndex: 0,
      filter: "brightness(0.5)",
    };
  };

  return (
    <div className="relative h-[600px] md:h-[70vh] w-full overflow-hidden">
      {/* Photo stack */}
      <div className="absolute inset-0 flex items-center justify-center">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const styles = getStackStyles(index, isActive);
          
          return (
            <motion.div
              key={image}
              className="absolute w-[80vw] md:w-[60vw] max-w-2xl bg-white rounded-lg shadow-xl cursor-grab"
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => isActive && handleDragEnd(info)}
              style={{
                zIndex: styles.zIndex,
              }}
              animate={{
                rotate: styles.rotate,
                scale: styles.scale,
                filter: styles.filter,
                y: isActive ? 0 : -index * 4,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Polaroid frame effect */}
              <div className="bg-white p-3 pb-12 rounded-lg shadow-lg">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src={image}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <p className="font-handwriting text-[#687764] text-sm">Yoalli & Miguel</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Gallery navigation controls - moved up for visibility */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border border-[#687764] ${
              currentIndex === index ? "bg-[#687764]" : "bg-white"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ver foto ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Swipe indicator - moved up and increased z-index */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center py-4 bg-white/80 rounded-t-xl z-10">
        <motion.svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          className="text-[#687764]"
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <path d="m18.89 14.75-4.09-2.04c-.28-.14-.58-.21-.89-.21H13v-6c0-.83-.67-1.5-1.5-1.5S10 5.67 10 6.5v10.74l-3.25-.74c-.33-.07-.68.03-.92.28l-.83.84 4.54 4.79c.38.38 1.14.59 1.67.59h6.16c1 0 1.84-.73 1.98-1.72l.63-4.46c.12-.85-.32-1.68-1.09-2.07z" fill="currentColor" />
          <path d="M20.13 3.87C18.69 2.17 15.6 1 12 1S5.31 2.17 3.87 3.87L2 2v5h5L4.93 4.93c1-1.29 3.7-2.43 7.07-2.43s6.07 1.14 7.07 2.43L17 7h5V2l-1.87 1.87z" fill="currentColor" />
        </motion.svg>
        <p className="text-[#687764] font-medium mt-2">Desliza para ver más fotos</p>
      </div>
    </div>
  );
};

export default function Home() {
  const detailsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Use real scroll position instead of virtual scroll
  const scrollY = useMotionValue(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Update viewport height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  
  // Track actual scroll position
  useEffect(() => {
    const updateScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    // Initial update
    updateScroll();
    
    // Listen for scroll events (works with both wheel and touch)
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [scrollY]);
  
  // Map scroll position to parallax progress (0-1)
  const progress = useTransform(scrollY, [0, viewportHeight], [0, 1]);
  
  // Map progress to visual elements
  const leftImageX = useTransform(progress, [0, 1], ["0%", "-120%"]);
  const rightImageX = useTransform(progress, [0, 1], ["0%", "120%"]);
  const textOpacity = useTransform(progress, [0.6, 0.8], [0, 1]);
  const textY = useTransform(progress, [0.6, 0.8], ["30px", "0px"]);
  const deslizaOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  
  // Progress bar width
  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  useEffect(() => {
    const unsubscribe = progress.onChange(value => {
      setProgressBarWidth(`${Math.min(100, Math.max(0, value * 100))}%`);
    });
    return unsubscribe;
  }, [progress]);

  // Countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Calculate countdown to wedding date
  useEffect(() => {
    const weddingDate = new Date('2025-12-27T12:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F1EC] font-serif">
      {/* Hero Section with double height to allow scrolling */}
      <section className="relative h-[200vh]">
        {/* Fixed parallax container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Left Flower Image */}
          <motion.div
            className="absolute top-0 left-0 h-full w-[100vw] overflow-hidden"
            style={{ x: leftImageX }}
          >
            <motion.div
              className="h-full w-full relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Image
                src="/flowers-left2.png"
                alt="Flowers Left"
                fill
                className="object-cover object-right"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Right Flower Image */}
          <motion.div
            className="absolute top-0 right-0 h-full w-[100vw] overflow-hidden"
            style={{ x: rightImageX }}
          >
            <motion.div
              className="h-full w-full relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Image
                src="/flowers-right2.png"
                alt="Flowers Right"
                fill
                className="object-cover object-left"
                priority
              />
            </motion.div>
          </motion.div>

          {/* "Desliza para abrir" Message */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
            style={{ opacity: deslizaOpacity }}
          >
            <p className="text-black text-2xl md:text-4xl font-semibold animate-bounce mb-6">
              Desliza para abrir
            </p>
            {/* Swipe icon */}
            <motion.svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-black"
            >
              <path 
                d="M3.8 12.18c-.2-.86-.3-1.76-.3-2.68 0-2.84.99-5.45 2.63-7.5L7.2 3.07a10.457 10.457 0 00-1.88 8.99l1.62-1.62L8 11.5 4.5 15 1 11.5l1.06-1.06 1.74 1.74zm10.05-.56l-2.68-5.37a1.498 1.498 0 00-2.01-.67c-.75.38-1.05 1.28-.68 2.02l4.81 9.6-3.24.8c-.33.09-.59.33-.7.66L9 19.78l6.19 2.25c.5.17 1.28.02 1.75-.22l5.51-2.75c.89-.45 1.32-1.48 1-2.42l-1.43-4.27a2 2 0 00-1.9-1.37h-4.56c-.31 0-.62.07-.89.21l-.82.41"
                fill="currentColor"
              />
            </motion.svg>
          </motion.div>

          {/* Main Text */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none"
            style={{ opacity: textOpacity, y: textY }}
          >
            <p className="text-[#7E8F9F] text-lg md:text-xl mb-4">Nos casamos</p>
            <h1 className="text-4xl md:text-7xl font-bold text-[#687764]">
              Yoalli <span className="text-[#92A18E]">&</span> Miguel
            </h1>
            <p className="text-xl md:text-2xl text-[#7E8F9F] mt-4">
              27 de Diciembre de 2025
            </p>
          </motion.div>

          {/* Visual scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 flex justify-center items-center pointer-events-none"
            style={{ opacity: deslizaOpacity }}
          >
            <motion.div 
              className="h-1 w-64 bg-[#BBCCDC] rounded-full overflow-hidden"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="h-full bg-[#687764]" 
                style={{ width: progressBarWidth }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mensaje Section */}
      <section ref={detailsRef} className="py-20 px-4 bg-[#BBCCDC]/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-8">
            Con la bendición de nuestras familias
          </h2>
          <p className="text-lg md:text-xl text-[#7E8F9F] leading-relaxed mb-6">
            Con gran alegría y amor en nuestros corazones, nos complace invitarte a celebrar nuestra unión en
            matrimonio. Después de nuestro camino juntos, estamos emocionados de comenzar este nuevo capítulo de
            nuestras vidas y queremos compartir este momento especial contigo.
          </p>
          <div className="flex justify-center">
            <Heart className="text-[#92A18E] w-12 h-12" />
          </div>
        </div>
      </section>

      {/* Detalles Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] text-center mb-16">Detalles</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Church className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Sellamiento</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">12:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Templo de la Ciudad de México</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Recepción</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">15:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Hermoso Jardín</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Fiesta</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">18:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Hasta que el cuerpo aguante</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Vestimenta</h3>
              <p className="text-[#7E8F9F]">Código de vestimenta</p>
              <p className="text-[#7E8F9F] bold">Fromal</p>
              <p className="text-[#7E8F9F] mt-2">Queremos verte guapo(a) ese día</p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 bg-[#BBCCDC]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-12">Cuenta Regresiva</h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-10">
            <CountdownItem value={countdown.days} label="Días" />
            <CountdownItem value={countdown.hours} label="Horas" />
            <CountdownItem value={countdown.minutes} label="Minutos" />
            <CountdownItem value={countdown.seconds} label="Segundos" />
          </div>
          
          <p className="mt-10 text-lg text-[#7E8F9F]">
            para nuestro gran día
          </p>
        </div>
      </section>

      {/* Ubicación Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] text-center mb-8">Ubicación</h2>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
              {/* Google Maps iframe - Replace with actual location */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.220211222598!2d-99.17908762303247!3d19.532157181768596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f7f0c5969ee1%3A0xb4679e31e9c4b82!2sHermoso%20Jard%C3%ADn!5e0!3m2!1ses-419!2smx!4v1746415302745!5m2!1ses-419!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Hermoso Jardín</h3>
              <p className="text-[#7E8F9F] mb-4">Av. Tlalnepantla-Tenayuca 300, Hab Valle Ceylan, 54150 Tlalnepantla, Méx.</p>
              <a
                href="https://www.google.com/maps/place/Hermoso+Jard%C3%ADn/@19.5321572,-99.1790876,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f7f0c5969ee1:0xb4679e31e9c4b82!8m2!3d19.5321572!4d-99.1765127!16s%2Fg%2F11b6gpyvvc?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#687764] hover:bg-[#92A18E] text-white py-2 px-6 rounded-full transition duration-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-[#BBCCDC]/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-8">Confirma tu Asistencia</h2>
          <p className="text-lg text-[#7E8F9F] mb-8">
            Nos encantaría contar con tu presencia en nuestro día especial. Por favor confirma tu asistencia antes del
            15 de noviembre de 2025.
          </p>

          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-3 border border-[#BBCCDC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#92A18E]"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 border border-[#BBCCDC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#92A18E]"
              />
            </div>
            <div className="mb-6">
              <select className="w-full px-4 py-3 border border-[#BBCCDC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#92A18E] bg-white">
                <option value="">Número de invitados</option>
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#92A18E] hover:bg-[#687764] text-white py-3 px-6 rounded-full transition duration-300 text-lg"
            >
              Confirmar
            </button>
          </form>
        </div>
      </section>

      {/* Galería Section - replace with new PhotoGallery component */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-12">Nuestra Historia</h2>
          
          <PhotoGallery />
          
          <p className="text-lg text-[#7E8F9F] mt-8">
            Cada historia de amor es especial, pero la nuestra es nuestra favorita.
          </p>
        </div>
      </section>

      {/* Mesa de Regalos Section */}
      <section className="py-20 px-4 bg-[#BBCCDC]/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-8">Mesa de Regalos</h2>
          <p className="text-lg text-[#7E8F9F] mb-8">
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas obsequiarnos algo, hemos creado una mesa de
            regalos para tu conveniencia.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a
              href="#"
              className="bg-white border border-[#BBCCDC] hover:border-[#92A18E] py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <span className="text-[#687764]">Liverpool</span>
            </a>
            <a
              href="#"
              className="bg-white border border-[#BBCCDC] hover:border-[#92A18E] py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <span className="text-[#687764]">Amazon</span>
            </a>
            <a
              href="#"
              className="bg-white border border-[#BBCCDC] hover:border-[#92A18E] py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <span className="text-[#687764]">Transferencia</span>
            </a>
          </div>
        </div>
      </section>

      {/* Hashtag Section */}
      <section className="py-16 px-4 bg-[#687764]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">Comparte tus fotos</h2>
          <p className="text-xl text-white/90 mb-4">Usa nuestro hashtag</p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-8">#Yoalli&Miguel2025</p>
          <div className="flex justify-center gap-6">
            <Camera className="text-white w-8 h-8" />
            <Heart className="text-white w-8 h-8" />
            <Camera className="text-white w-8 h-8" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#F2F1EC] border-t border-[#BBCCDC]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#687764] mb-4">Yoalli & Miguel</h2>
          <p className="text-[#7E8F9F]">¡Gracias por ser parte de nuestra historia!</p>
          <p className="text-[#7E8F9F] mt-6">27 · 12 · 5</p>
        </div>
      </footer>
    </main>
  );
}
