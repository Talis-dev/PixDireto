/**
 * Exemplos de Uso das Funções Utilitárias do Pix Direto
 *
 * Este arquivo demonstra como usar as funções de geração de Pix
 */

import {
  generatePixCode,
  isValidPixKey,
  formatDocument,
  formatPhone,
} from "./pixGenerator";

// ========================================
// EXEMPLO 1: Gerar Pix com CPF
// ========================================
const example1 = () => {
  const pixCode = generatePixCode({
    pixKey: "12345678900",
    merchantName: "João da Silva",
    merchantCity: "São Paulo",
    amount: 100.5,
  });

  console.log("Código Pix gerado:", pixCode);
  // Saída: 00020126580014BR.GOV.BCB.PIX011312345678900...
};

// ========================================
// EXEMPLO 2: Gerar Pix com Email
// ========================================
const example2 = () => {
  const pixCode = generatePixCode({
    pixKey: "joao@email.com",
    merchantName: "João da Silva",
    merchantCity: "São Paulo",
    amount: 50.0,
  });

  console.log("Código Pix gerado:", pixCode);
};

// ========================================
// EXEMPLO 3: Gerar Pix sem Valor (QR Code Aberto)
// ========================================
const example3 = () => {
  const pixCode = generatePixCode({
    pixKey: "joao@email.com",
    merchantName: "João da Silva",
    merchantCity: "São Paulo",
    // amount: undefined - sem valor
  });

  console.log("Código Pix sem valor:", pixCode);
  // O cliente poderá digitar o valor ao escanear
};

// ========================================
// EXEMPLO 4: Gerar Pix com Telefone
// ========================================
const example4 = () => {
  const pixCode = generatePixCode({
    pixKey: "+5511987654321",
    merchantName: "João da Silva",
    merchantCity: "Rio de Janeiro",
    amount: 25.9,
  });

  console.log("Código Pix com telefone:", pixCode);
};

// ========================================
// EXEMPLO 5: Gerar Pix com Chave Aleatória
// ========================================
const example5 = () => {
  const pixCode = generatePixCode({
    pixKey: "123e4567-e89b-12d3-a456-426614174000",
    merchantName: "Maria Santos",
    merchantCity: "Brasília",
    amount: 150.0,
  });

  console.log("Código Pix com chave aleatória:", pixCode);
};

// ========================================
// EXEMPLO 6: Gerar Pix com TxID (Identificador)
// ========================================
const example6 = () => {
  const pixCode = generatePixCode({
    pixKey: "maria@email.com",
    merchantName: "Maria Santos",
    merchantCity: "Brasília",
    amount: 200.0,
    txid: "VENDA123",
  });

  console.log("Código Pix com TxID:", pixCode);
};

// ========================================
// EXEMPLO 7: Validar Chaves Pix
// ========================================
const example7 = () => {
  console.log("CPF válido:", isValidPixKey("12345678900")); // true
  console.log("CNPJ válido:", isValidPixKey("12345678000190")); // true
  console.log("Email válido:", isValidPixKey("teste@email.com")); // true
  console.log("Telefone válido:", isValidPixKey("+5511987654321")); // true
  console.log(
    "UUID válido:",
    isValidPixKey("123e4567-e89b-12d3-a456-426614174000")
  ); // true
  console.log("Chave inválida:", isValidPixKey("abc123")); // false
};

// ========================================
// EXEMPLO 8: Formatar CPF/CNPJ
// ========================================
const example8 = () => {
  console.log("CPF formatado:", formatDocument("12345678900"));
  // Saída: 123.456.789-00

  console.log("CNPJ formatado:", formatDocument("12345678000190"));
  // Saída: 12.345.678/0001-90
};

// ========================================
// EXEMPLO 9: Formatar Telefone
// ========================================
const example9 = () => {
  console.log("Celular formatado:", formatPhone("5511987654321"));
  // Saída: (11) 98765-4321

  console.log("Fixo formatado:", formatPhone("1133334444"));
  // Saída: (11) 3333-4444
};

// ========================================
// EXEMPLO 10: Integração Completa
// ========================================
const example10 = async () => {
  // Simular dados vindos de um formulário
  const formData = {
    pixKey: "12345678900",
    name: "João da Silva",
    city: "São Paulo",
  };

  // Validar chave Pix
  if (!isValidPixKey(formData.pixKey)) {
    console.error("Chave Pix inválida!");
    return;
  }

  // Valor informado pelo usuário
  const amount = 99.9;

  // Gerar código Pix
  const pixCode = generatePixCode({
    pixKey: formData.pixKey,
    merchantName: formData.name,
    merchantCity: formData.city,
    amount: amount,
  });

  console.log("=".repeat(50));
  console.log("RESUMO DA TRANSAÇÃO");
  console.log("=".repeat(50));
  console.log("Beneficiário:", formData.name);
  console.log("Cidade:", formData.city);
  console.log("Chave Pix:", formatDocument(formData.pixKey));
  console.log("Valor:", `R$ ${amount.toFixed(2)}`);
  console.log("=".repeat(50));
  console.log("Código Pix:", pixCode);
  console.log("=".repeat(50));
};

// ========================================
// EXECUTAR EXEMPLOS
// ========================================
export const runExamples = () => {
  console.log("📱 EXEMPLOS DE USO - PIX DIRETO\n");

  console.log("EXEMPLO 1: Gerar Pix com CPF");
  example1();

  console.log("\nEXEMPLO 2: Gerar Pix com Email");
  example2();

  console.log("\nEXEMPLO 3: Gerar Pix sem Valor");
  example3();

  console.log("\nEXEMPLO 4: Gerar Pix com Telefone");
  example4();

  console.log("\nEXEMPLO 5: Gerar Pix com Chave Aleatória");
  example5();

  console.log("\nEXEMPLO 6: Gerar Pix com TxID");
  example6();

  console.log("\nEXEMPLO 7: Validar Chaves Pix");
  example7();

  console.log("\nEXEMPLO 8: Formatar CPF/CNPJ");
  example8();

  console.log("\nEXEMPLO 9: Formatar Telefone");
  example9();

  console.log("\nEXEMPLO 10: Integração Completa");
  example10();
};

// Descomente a linha abaixo para executar os exemplos
// runExamples();
