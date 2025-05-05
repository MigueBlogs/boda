"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Heart, Music, Camera, UtensilsCrossed } from "lucide-react";

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
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ opacity: deslizaOpacity }}
          >
            <p className="text-black text-2xl md:text-4xl font-semibold animate-bounce">
              Desliza para abrir
            </p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Ceremonia</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">16:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Parroquia Santa María</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Recepción</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">18:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Hacienda Los Olivos</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-[#BBCCDC]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="text-[#687764] w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Fiesta</h3>
              <p className="text-[#7E8F9F]">27 de Diciembre, 2025</p>
              <p className="text-[#7E8F9F]">20:00 hrs</p>
              <p className="text-[#7E8F9F] mt-2">Hasta que el cuerpo aguante</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación Section */}
      <section className="py-20 px-4 bg-[#92A18E]/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] text-center mb-8">Ubicación</h2>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
              {/* Google Maps iframe - Replace with actual location */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.661913905969!2d-99.16978492526856!3d19.427023841887487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sEl%20%C3%81ngel%20de%20la%20Independencia!5e0!3m2!1ses-419!2smx!4v1714675671566!5m2!1ses-419!2smx"
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
              <h3 className="text-xl font-semibold text-[#687764] mb-2">Hacienda Los Olivos</h3>
              <p className="text-[#7E8F9F] mb-4">Av. Paseo de la Reforma, Ciudad de México, CDMX</p>
              <a
                href="https://maps.google.com/?q=Angel+de+la+Independencia"
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
      <section className="py-20 px-4">
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

      {/* Galería Section */}
      <section className="py-20 px-4 bg-[#BBCCDC]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#687764] mb-8">Nuestra Historia</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Yoalli y Miguel"
                width={300}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Yoalli y Miguel"
                width={300}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Yoalli y Miguel"
                width={300}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Yoalli y Miguel"
                width={300}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mesa de Regalos Section */}
      <section className="py-20 px-4">
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
          <p className="text-2xl md:text-3xl font-bold text-white mb-8">#YoalliYMiguel2025</p>
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
