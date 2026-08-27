/** Saludo según la hora local del dispositivo. */
export function greetingForLocalTime(now = new Date()) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  // 5:00–12:59 → Buen día; 13:00–19:29 → Buenas tardes; 19:30–4:59 → Buenas noches
  if (minutes >= 5 * 60 && minutes < 13 * 60) return "Buen día";
  if (minutes >= 13 * 60 && minutes < 19 * 60 + 30) return "Buenas tardes";
  return "Buenas noches";
}
