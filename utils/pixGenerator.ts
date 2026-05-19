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
 * Valida CPF com dígitos verificadores
 */
function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
}

/**
 * Valida CNPJ com dígitos verificadores
 */
function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDigit = (str: string, length: number): number => {
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(str[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };

  if (calcDigit(cnpj, 12) !== parseInt(cnpj[12])) return false;
  if (calcDigit(cnpj, 13) !== parseInt(cnpj[13])) return false;
  return true;
}

/**
 * Normaliza a chave Pix removendo formatação de CPF/CNPJ
 * Ex: "123.456.789-09" → "12345678909", "12.345.678/0001-95" → "12345678000195"
 */
export function normalizePixKey(key: string): string {
  key = key.trim();
  const stripped = key.replace(/[\.\-\/\s]/g, "");

  // Remove formatação de CPF (XXX.XXX.XXX-XX)
  if (/^\d{11}$/.test(stripped)) return stripped;

  // Remove formatação de CNPJ (XX.XXX.XXX/XXXX-XX)
  if (/^\d{14}$/.test(stripped)) return stripped;

  // Normaliza telefone sem +55: adiciona prefixo se for DDD + número
  if (/^\+?55\d{10,11}$/.test(stripped)) {
    return "+" + stripped.replace(/^\+/, "");
  }

  return key;
}

/**
 * Gera o código Pix Estático (BR Code) usando pix-utils
 */
export function generatePixCode(data: PixData): string {
  const { merchantName, merchantCity, amount, txid } = data;
  const pixKey = normalizePixKey(data.pixKey);

  try {
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
 * Aceita CPF/CNPJ com ou sem formatação e valida os dígitos verificadores
 */
export function isValidPixKey(key: string): boolean {
  if (!key || key.trim().length === 0) return false;
  key = key.trim();

  // CPF (com ou sem formatação: 000.000.000-00 ou 00000000000)
  const cpfClean = key.replace(/[\.\-]/g, "");
  if (/^\d{11}$/.test(cpfClean)) return validateCPF(cpfClean);

  // CNPJ (com ou sem formatação: 00.000.000/0000-00 ou 00000000000000)
  const cnpjClean = key.replace(/[\.\-\/]/g, "");
  if (/^\d{14}$/.test(cnpjClean)) return validateCNPJ(cnpjClean);

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return true;

  // Telefone (obrigatório com +55, ex: +5511999999999)
  if (/^\+55\d{10,11}$/.test(key)) return true;

  // Chave aleatória (UUID)
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      key
    )
  )
    return true;

  return false;
}

/**
 * Retorna mensagem de erro específica para o tipo de chave inválida
 */
export function getPixKeyErrorMessage(key: string): string {
  key = key.trim();
  if (!key) return "Chave Pix é obrigatória";

  const onlyDigits = key.replace(/\D/g, "");

  if (onlyDigits.length === 11) {
    return "CPF inválido. Verifique os dígitos verificadores.";
  }
  if (onlyDigits.length === 14) {
    return "CNPJ inválido. Verifique os dígitos verificadores.";
  }
  if (key.startsWith("+55")) {
    return "Telefone inválido. Use o formato +55 DD NÚMERO (ex: +5511999999999).";
  }
  if (/^\d{10,11}$/.test(key)) {
    return "Para telefone use o formato +5511999999999 (com +55 e DDD).";
  }
  return "Chave Pix inválida. Formatos aceitos: CPF, CNPJ, e-mail, telefone (+5511999999999) ou chave aleatória.";
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
