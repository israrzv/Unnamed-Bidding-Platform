"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export interface Feature {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  image?: string;
  visual?: React.ReactNode;
}

interface FeaturesProps {
  features: Feature[];
  eyebrow?: string;
  heading?: string;
}

/** Auto-advancing feature showcase: feature list with progress bars on the left,
 *  synced image on the right. Themed dark + emerald for BidFair. */
export function Features({ features, eyebrow, heading }: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [progress, features.length]);

  useEffect(() => {
    const activeEl = featureRefs.current[currentFeature];
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeEl.getBoundingClientRect();
      container.scrollTo({
        left: activeEl.offsetLeft - (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  function handleFeatureClick(index: number) {
    setCurrentFeature(index);
    setProgress(0);
  }

  return (
    <div className="py-6">
      {(eyebrow || heading) && (
        <div className="mb-10 text-center">
          {eyebrow && (
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {heading}
            </h2>
          )}
        </div>
      )}

      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Left — feature list */}
        <div
          ref={containerRef}
          className="no-scrollbar order-1 flex flex-row overflow-x-auto overflow-y-hidden scroll-smooth pb-4 md:space-x-6 lg:flex-col lg:space-x-0 lg:space-y-4 lg:overflow-visible"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = currentFeature === index;
            return (
              <div
                key={feature.id}
                ref={(el) => {
                  featureRefs.current[index] = el;
                }}
                className="relative flex-shrink-0 cursor-pointer"
                onClick={() => handleFeatureClick(index)}
              >
                <div
                  className={`flex max-w-sm flex-col items-start space-x-4 p-4 transition-all duration-300 lg:max-w-2xl lg:flex-row ${
                    isActive
                      ? "rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md"
                      : ""
                  }`}
                >
                  <div
                    className={`hidden rounded-full p-3 transition-all duration-300 md:block ${
                      isActive
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`mb-2 text-lg font-semibold transition-colors duration-300 lg:mt-0 md:mt-4 ${
                        isActive ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isActive ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {feature.description}
                    </p>
                    <div className="mt-4 h-1 overflow-hidden rounded-sm bg-zinc-800">
                      {isActive && (
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right — visual / image */}
        <div className="relative order-2 mx-auto w-full max-w-lg">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            {features[currentFeature].visual ? (
              features[currentFeature].visual
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-auto w-full rounded-2xl border border-zinc-800 shadow-2xl"
                src={features[currentFeature].image ?? ""}
                alt={features[currentFeature].title}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
