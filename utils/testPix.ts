/**
 * Testes para validar a geração de Pix e CRC16
 *
 * Para executar: node utils/testPix.js
 */

import { generatePixCode } from "./pixGenerator";

// Cores para terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

/**
 * Valida se um código Pix tem estrutura correta
 */
function validatePixStructure(pixCode: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Verificar se começa com Payload Format Indicator
  if (!pixCode.startsWith("00020")) {
    errors.push("Payload Format Indicator inválido");
  }

  // Verificar se contém BR.GOV.BCB.PIX
  if (!pixCode.includes("BR.GOV.BCB.PIX")) {
    errors.push("Identificador do Pix não encontrado");
  }

  // Verificar se contém Currency Code (986 = BRL)
  if (!pixCode.includes("5303986")) {
    errors.push("Currency Code (BRL) não encontrado");
  }

  // Verificar se contém Country Code (BR)
  if (!pixCode.includes("5802BR")) {
    errors.push("Country Code (BR) não encontrado");
  }

  // Verificar se termina com CRC (6304 + 4 caracteres)
  const crcMatch = pixCode.match(/6304[0-9A-F]{4}$/);
  if (!crcMatch) {
    errors.push("CRC16 não encontrado ou mal formatado");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Teste 1: Gerar Pix com CPF
 */
function test1() {
  console.log(`\n${colors.blue}[TEST 1]${colors.reset} Gerar Pix com CPF`);

  const pixCode = generatePixCode({
    pixKey: "12345678900",
    merchantName: "João Silva",
    merchantCity: "Sao Paulo",
    amount: 100.0,
  });

  const validation = validatePixStructure(pixCode);

  if (validation.valid) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`Código: ${pixCode.substring(0, 50)}...`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  }

  return validation.valid;
}

/**
 * Teste 2: Gerar Pix com Email
 */
function test2() {
  console.log(`\n${colors.blue}[TEST 2]${colors.reset} Gerar Pix com Email`);

  const pixCode = generatePixCode({
    pixKey: "teste@example.com",
    merchantName: "Maria Santos",
    merchantCity: "Rio de Janeiro",
    amount: 50.0,
  });

  const validation = validatePixStructure(pixCode);

  if (validation.valid) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`Código: ${pixCode.substring(0, 50)}...`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  }

  return validation.valid;
}

/**
 * Teste 3: Gerar Pix sem valor
 */
function test3() {
  console.log(
    `\n${colors.blue}[TEST 3]${colors.reset} Gerar Pix sem valor (QR Code aberto)`
  );

  const pixCode = generatePixCode({
    pixKey: "+5511987654321",
    merchantName: "Pedro Costa",
    merchantCity: "Brasilia",
  });

  const validation = validatePixStructure(pixCode);

  // Verificar se NÃO contém campo 54 (Transaction Amount)
  const hasAmount = pixCode.includes("54");

  if (validation.valid && !hasAmount) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`Código: ${pixCode.substring(0, 50)}...`);
    console.log(`  Campo de valor ausente (correto para QR aberto)`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    if (hasAmount) {
      console.log(`  - Código contém valor quando não deveria`);
    }
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  }

  return validation.valid && !hasAmount;
}

/**
 * Teste 4: Gerar Pix com TxID
 */
function test4() {
  console.log(
    `\n${colors.blue}[TEST 4]${colors.reset} Gerar Pix com Transaction ID`
  );

  const pixCode = generatePixCode({
    pixKey: "12345678900",
    merchantName: "Loja ABC",
    merchantCity: "Curitiba",
    amount: 199.9,
    txid: "VENDA001",
  });

  const validation = validatePixStructure(pixCode);

  // Verificar se contém campo 62 (Additional Data)
  const hasTxId = pixCode.includes("62");

  if (validation.valid && hasTxId) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`Código: ${pixCode.substring(0, 50)}...`);
    console.log(`  Campo de TxID presente`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    if (!hasTxId) {
      console.log(`  - TxID não encontrado no código`);
    }
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  }

  return validation.valid && hasTxId;
}

/**
 * Teste 5: Validar CRC16 específico
 */
function test5() {
  console.log(
    `\n${colors.blue}[TEST 5]${colors.reset} Validar cálculo do CRC16`
  );

  // Gerar dois códigos idênticos e verificar se o CRC é o mesmo
  const config = {
    pixKey: "teste@test.com",
    merchantName: "Test User",
    merchantCity: "Test City",
    amount: 10.0,
  };

  const pixCode1 = generatePixCode(config);
  const pixCode2 = generatePixCode(config);

  const crc1 = pixCode1.substring(pixCode1.length - 4);
  const crc2 = pixCode2.substring(pixCode2.length - 4);

  if (pixCode1 === pixCode2 && crc1 === crc2) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`  CRC16 consistente: ${crc1}`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    console.log(`  CRC1: ${crc1}, CRC2: ${crc2}`);
  }

  return pixCode1 === pixCode2;
}

/**
 * Teste 6: Tamanho máximo de campos
 */
function test6() {
  console.log(
    `\n${colors.blue}[TEST 6]${colors.reset} Validar limites de caracteres`
  );

  const pixCode = generatePixCode({
    pixKey: "chave@muito-grande-para-teste.com",
    merchantName:
      "Nome Muito Grande Que Deveria Ser Truncado Para 25 Caracteres",
    merchantCity: "Cidade Com Nome Muito Grande Que Deveria Ser Truncado",
    amount: 999999.99,
  });

  const validation = validatePixStructure(pixCode);

  // Extrair nome (campo 59)
  const nameMatch = pixCode.match(/59(\d{2})(.+?)(?=60|$)/);
  const nameLength = nameMatch ? parseInt(nameMatch[1]) : 0;

  // Extrair cidade (campo 60)
  const cityMatch = pixCode.match(/60(\d{2})(.+?)(?=61|62|63|$)/);
  const cityLength = cityMatch ? parseInt(cityMatch[1]) : 0;

  if (validation.valid && nameLength <= 25 && cityLength <= 15) {
    console.log(`${colors.green}✓ PASSOU${colors.reset}`);
    console.log(`  Nome truncado: ${nameLength} caracteres (máx: 25)`);
    console.log(`  Cidade truncada: ${cityLength} caracteres (máx: 15)`);
  } else {
    console.log(`${colors.red}✗ FALHOU${colors.reset}`);
    console.log(`  Nome: ${nameLength} caracteres`);
    console.log(`  Cidade: ${cityLength} caracteres`);
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  }

  return validation.valid && nameLength <= 25 && cityLength <= 15;
}

/**
 * Executar todos os testes
 */
function runAllTests() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${colors.yellow}🧪 TESTES DE GERAÇÃO DE PIX${colors.reset}`);
  console.log(`${"=".repeat(60)}`);

  const results = [test1(), test2(), test3(), test4(), test5(), test6()];

  const passed = results.filter((r) => r).length;
  const total = results.length;

  console.log(`\n${"=".repeat(60)}`);
  if (passed === total) {
    console.log(
      `${colors.green}✓ TODOS OS TESTES PASSARAM (${passed}/${total})${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}✗ ALGUNS TESTES FALHARAM (${passed}/${total})${colors.reset}`
    );
  }
  console.log(`${"=".repeat(60)}\n`);
}

// Executar testes
runAllTests();

export { runAllTests, validatePixStructure };
