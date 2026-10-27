"use client";

import clsx from "clsx";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { button } from "@/components/ui/button";
import { PRINT_URL } from "@/lib/links";
import { useReduce } from "@/lib/motion";
import { BrandedCarousel } from "./BrandedCarousel";

/** Three hand-set lines, sized to the width of the left column and capped by height. */
const LINES = ["Small business,", "big brand", "energy."];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * For business — the landing. Artist's Corner's treatment on white: the line
 * in the condensed face, black, with crumpled paper showing through the
 * letters, the pitch and the way in under it; beside it, the cards of what we
 * brand drifting past.
 */
export function BusinessLanding() {
  const reduce = useReduce();

  return (
    <section
      data-ground="white"
      className="relative overflow-x-clip bg-white pt-[68px]"
    >
      <Container className="grid min-h-[calc(100svh-68px)] items-center gap-10 py-[5vh] md:grid-cols-[1fr_auto] md:gap-12">
        <div className="flex flex-col items-start gap-8">
          <h1 className="flex flex-col items-start font-display text-[min(15vw,19svh)] leading-[0.84] font-extrabold tracking-[0.005em] text-ink uppercase font-condensed md:text-[min(7.6vw,17svh)]">
            {LINES.map((line, i) => (
              <motion.span
                key={line}
                className="relative block whitespace-nowrap"
                initial={reduce ? false : { opacity: 0, y: "0.3em" }}
                animate={{ opacity: 1, y: "0em" }}
                transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.12 }}
              >
                {line}
                {/* Crumpled paper through the letters, as on Artist's Corner: the sheet
                  inverted and screened on, so only the creases lighten the black. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[url('/assets/paper-crumpled.jpg')] bg-[length:140%_auto] bg-center bg-clip-text text-transparent opacity-80 mix-blend-screen invert"
                >
                  {line}
                </span>
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="flex min-w-0 flex-col items-start gap-6"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          >
            <div className="max-w-[24rem] text-balance">
              <p className="text-[clamp(1.25rem,1.8vw,1.6rem)] leading-tight font-semibold tracking-[-0.02em] text-ink">
                Print that makes you look the part.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-on-light">
                Business cards, stickers, flyers, labels and brand packs,
                printed to a premium standard and delivered to your door in
                Nigeria and Ghana.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={PRINT_URL}
                className={clsx(
                  button.ink,
                  "px-5 py-3 text-[15px] whitespace-nowrap",
                )}
              >
                Start printing
                <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full border border-ink/25 px-5 py-3 whitespace-nowrap text-[15px] font-semibold text-ink transition duration-150 hover:bg-ink/5"
              >
                See what we print
              </a>
            </div>
          </motion.div>
        </div>

        <BrandedCarousel className="h-[28rem] md:h-[calc(100svh-68px-10vh)] md:max-h-[44rem]" />
      </Container>
    </section>
  );
}
