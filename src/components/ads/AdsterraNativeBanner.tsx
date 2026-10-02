"use client";

import { useEffect, useRef } from "react";
import { ADSTERRA_NATIVE } from "./adsterra";
import { useAdsterraAllowed } from "./AdsterraBanner";

/**
 * Adsterra Native Banner: invoke.js fills the element with the fixed id
 * `ADSTERRA_NATIVE.containerId`, so render this AT MOST ONCE per page.
 * Loaded only after consent (see useAdsterraAllowed). The script is
 * injected on every mount (not via next/script, which runs a script once
 * per document) so the unit also fills after client-side navigations.
 */
export function AdsterraNativeBanner() {
  const allowed = useAdsterraAllowed();
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!allowed || !slot) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = ADSTERRA_NATIVE.scriptSrc;
    script.setAttribute("data-cfasync", "false");
    slot.appendChild(script);
    return () => script.remove();
  }, [allowed]);

  if (!allowed) return null;

  return (
    <aside aria-label="Publicidad" className="border border-rule bg-card p-3">
      <span className="mb-2 block font-mono text-[10px] text-ink-muted">Publicidad</span>
      <div ref={slotRef}>
        <div id={ADSTERRA_NATIVE.containerId} />
      </div>
    </aside>
  );
}
