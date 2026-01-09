/**
 * Gerador de Pix usando a biblioteca pix-utils
 * Implementação correta conforme padrão EMV Co
 */

import { createStaticPix } from "pix-utils";

interface PixData {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txid?: string;
}

/**
 * Gera o código Pix Estático (BR Code) usando pix-utils
 */
export function generatePixCode(data: PixData): string {
  const { pixKey, merchantName, merchantCity, amount, txid } = data;

  try {
    // Usar pix-utils para gerar o código Pix corretamente
    const pixData = createStaticPix({
      merchantName: merchantName,
      merchantCity: merchantCity,
      pixKey: pixKey,
      infoAdicional: txid || "",
      transactionAmount: amount || 0,
    });

    // @ts-ignore - Ignorar erro de tipo, pix-utils retorna objeto com toBRCode
    return pixData.toBRCode();
  } catch (error) {
    console.error("Erro ao gerar Pix:", error);
    throw error;
  }
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
