"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function routeKeyOf(pathname: string, search: string) {
  const q = search.replace(/^\?/, "");
  return q ? `${pathname}?${q}` : pathname;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = routeKeyOf(pathname, searchParams.toString());
  const originRef = useRef<string | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const showTimer = useRef(0);
  const failTimer = useRef(0);

  const navigating = origin === routeKey;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || !a.href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }
      const current = routeKeyOf(window.location.pathname, window.location.search);
      if (originRef.current === current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      originRef.current = current;
      setOrigin(current);
      setShow(false);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(failTimer.current);
      showTimer.current = window.setTimeout(() => setShow(true), 80);
      failTimer.current = window.setTimeout(() => {
        originRef.current = null;
        setOrigin(null);
        setShow(false);
      }, 8000);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(failTimer.current);
    };
  }, []);

  if (!(navigating && show)) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-brand-soft"
      role="progressbar"
      aria-label="Cargando"
    >
      <div className="nav-progress-bar h-full bg-brand" />
    </div>
  );
}
