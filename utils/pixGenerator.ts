/**
 * Gerador de Pix Estático (BR Code) com CRC16 CCITT-FALSE
 * Segue o padrão EMV Co para QR Codes válidos em todos os bancos brasileiros
 */

interface PixData {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txid?: string;
}

/**
 * Calcula o CRC16 CCITT-FALSE conforme especificação EMV
 */
function calculateCRC16(str: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Formata um campo EMV conforme padrão: ID(2) + LENGTH(2) + VALUE
 */
function formatEMVField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

/**
 * Gera o código Pix Estático (BR Code) completo
 */
export function generatePixCode(data: PixData): string {
  const { pixKey, merchantName, merchantCity, amount, txid } = data;

  // Payload Format Indicator (obrigatório - fixo "01")
  let payload = formatEMVField("00", "01");

  // Merchant Account Information (campo 26 para Pix)
  let merchantAccount = formatEMVField("00", "BR.GOV.BCB.PIX"); // GUI do Pix
  merchantAccount += formatEMVField("01", pixKey); // Chave Pix
  if (txid) {
    merchantAccount += formatEMVField("02", txid); // Transaction ID (opcional)
  }
  payload += formatEMVField("26", merchantAccount);

  // Merchant Category Code (obrigatório - "0000" para pessoa física)
  payload += formatEMVField("52", "0000");

  // Transaction Currency (obrigatório - "986" para BRL)
  payload += formatEMVField("53", "986");

  // Transaction Amount (opcional - só se houver valor)
  if (amount && amount > 0) {
    payload += formatEMVField("54", amount.toFixed(2));
  }

  // Country Code (obrigatório - "BR" para Brasil)
  payload += formatEMVField("58", "BR");

  // Merchant Name (obrigatório)
  payload += formatEMVField("59", merchantName.toUpperCase().substring(0, 25));

  // Merchant City (obrigatório)
  payload += formatEMVField("60", merchantCity.toUpperCase().substring(0, 15));

  // Additional Data Field Template (campo 62 - opcional)
  if (txid) {
    const additionalData = formatEMVField("05", txid); // Reference Label
    payload += formatEMVField("62", additionalData);
  }

  // CRC16 (obrigatório - campo 63)
  // Adiciona placeholder para calcular o CRC
  payload += "6304";
  const crc = calculateCRC16(payload);
  payload += crc;

  return payload;
}

/**
 * Valida se uma chave Pix tem formato válido
 */
export function isValidPixKey(key: string): boolean {
  if (!key || key.trim().length === 0) return false;

  // Remove espaços
  key = key.trim();

  // CPF (11 dígitos)
  if (/^\d{11}$/.test(key)) return true;

  // CNPJ (14 dígitos)
  if (/^\d{14}$/.test(key)) return true;

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return true;

  // Telefone (+5511999999999)
  if (/^\+55\d{10,11}$/.test(key)) return true;

  // Chave aleatória (UUID)
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)
  )
    return true;

  return false;
}

/**
 * Formata CPF/CNPJ para exibição
 */
export function formatDocument(doc: string): string {
  doc = doc.replace(/\D/g, "");

  if (doc.length === 11) {
    // CPF: 000.000.000-00
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (doc.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  return doc;
}

/**
 * Formata telefone para exibição
 */
export function formatPhone(phone: string): string {
  phone = phone.replace(/\D/g, "");

  if (phone.startsWith("55")) {
    phone = phone.substring(2);
  }

  if (phone.length === 11) {
    // Celular: (00) 90000-0000
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (phone.length === 10) {
    // Fixo: (00) 0000-0000
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}
