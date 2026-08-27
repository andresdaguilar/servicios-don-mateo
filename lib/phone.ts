export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let n = digits;
  if (n.startsWith("540")) n = `54${n.slice(3)}`;
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = n.slice(1);

  if (!n.startsWith("54")) {
    n = `54${n}`;
  }

  // Argentina mobiles need 9 after country code: +54 9 ...
  if (n.startsWith("54") && !n.startsWith("549") && n.length >= 12) {
    n = `549${n.slice(2)}`;
  }

  return n;
}

/** Celular argentino: +549 + 10 dígitos (ej. 54911XXXXXXXX). */
export function isArgentineMobile(input: string) {
  return /^549\d{10}$/.test(normalizePhone(input));
}

export function parseUserPhone(input: string) {
  const phone = normalizePhone(input);
  if (!isArgentineMobile(phone)) return null;
  return phone;
}

export function formatPhone(phone: string) {
  const n = normalizePhone(phone);
  if (n.startsWith("549") && n.length >= 13) {
    const rest = n.slice(3);
    const area = rest.slice(0, rest.length - 8);
    const local = rest.slice(-8);
    return `+54 9 ${area} ${local.slice(0, 4)}-${local.slice(4)}`;
  }
  return `+${n}`;
}

export function whatsappLink(phone: string) {
  const n = normalizePhone(phone);
  return `https://wa.me/${n}`;
}

export function telLink(phone: string) {
  return `tel:+${normalizePhone(phone)}`;
}
