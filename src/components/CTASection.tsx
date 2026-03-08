"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import basePath from "@/lib/basePath";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-8 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden py-24 md:py-32 px-8 md:px-16 text-center"
          style={{
            background: "linear-gradient(145deg, #0EA5A0 0%, #0A7B77 40%, #086D69 100%)",
          }}
        >
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: GRAIN, opacity: 0.04 }}
          />

          {/* Warm radial glow from center-bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(46,158,143,.15) 0%, transparent 60%)",
            }}
          />

          {/* Light radial glow from top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(255,255,255,.08) 0%, transparent 60%)",
            }}
          />

          {/* Decorative side lines */}
          <div
            className="absolute left-8 top-[15%] bottom-[15%] w-px hidden md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,.15), transparent)",
            }}
          />
          <div
            className="absolute right-8 top-[15%] bottom-[15%] w-px hidden md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,.15), transparent)",
            }}
          />

          {/* Ghost text decoration */}
          <p
            className="absolute font-fraunces italic whitespace-nowrap select-none pointer-events-none"
            style={{
              bottom: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(40px,8vw,100px)",
              color: "rgba(255,255,255,.04)",
              letterSpacing: "-0.03em",
            }}
            aria-hidden
          >
            &ldquo;legado&rdquo;
          </p>

          <div className="relative z-10">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.12,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-fraunces font-bold text-white mb-5 leading-tight"
              style={{ fontSize: "clamp(28px,5vw,56px)" }}
            >
              Conheça nossos{" "}
              <span className="italic" style={{ color: "#FDE8D8" }}>
                projetos
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-dm max-w-[460px] mx-auto leading-relaxed mb-10"
              style={{
                color: "rgba(255,255,255,.7)",
                fontSize: "clamp(15px,1.7vw,17px)",
              }}
            >
              Iniciativas clínicas e institucionais que promovem saúde mental,
              formação profissional e impacto social duradouro.
            </motion.p>

            {/* CTA button — terracotta */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.a
                href={`${basePath}/projetos`}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 10px 36px rgba(46,158,143,.4)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#2E9E8F] rounded-full hover:bg-[#1A7A6D] transition-colors"
                style={{ padding: "15px 44px", fontSize: "15px" }}
              >
                Ver projetos
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8H13M9 4L13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
