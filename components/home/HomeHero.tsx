"use client";

import { useEffect, useState } from "react";
import { HOME_PROMPTS } from "@/lib/constants";
import { greetingForLocalTime } from "@/lib/greeting";
import { cn } from "@/lib/utils";

function pickPrompt(except?: string) {
  const pool = except
    ? HOME_PROMPTS.filter((prompt) => prompt !== except)
    : HOME_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)] ?? HOME_PROMPTS[0];
}

export function HomeHero() {
  const [hello, setHello] = useState("Buen día");
  const [prompt, setPrompt] = useState<string>(HOME_PROMPTS[0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setHello(greetingForLocalTime());
    setPrompt(pickPrompt());
    const greet = setInterval(() => setHello(greetingForLocalTime()), 60_000);
    return () => clearInterval(greet);
  }, []);

  useEffect(() => {
    const rotate = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setPrompt((current) => pickPrompt(current));
        setVisible(true);
      }, 280);
    }, 5500);
    return () => clearInterval(rotate);
  }, []);

  return (
    <h1 className="font-serif text-[28px] font-semibold leading-tight text-carbon">
      {hello} 👋
      <span
        className={cn(
          "mt-1 block min-h-[2.6em] text-[22px] font-medium text-carbon/80 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        {prompt}
      </span>
    </h1>
  );
}
