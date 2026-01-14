export interface Bank {
  id: string;
  name: string;
  code: string;
  logo: any;
}

// Logos locais dos bancos - usando require()
const bankLogos = {
  // Bancos principais
  "001": require("../assets/logoBanks/banco-do-brasil-com-fundo.svg"),
  "033": require("../assets/logoBanks/banco-santander-logo.svg"),
  "104": require("../assets/logoBanks/caixa-economica-federal-X.svg"),
  "237": require("../assets/logoBanks/bradesco.svg"),
  "341": require("../assets/logoBanks/itau.svg"),
  "246": require("../assets/logoBanks/Asaas IP S.A.svg"),
  "318": require("../assets/logoBanks/BMG.svg"),
  "633": require("../assets/logoBanks/logo-safra.svg"),
  "654": require("../assets/logoBanks/inter.svg"),
  "260": require("../assets/logoBanks/nubank-logo-fundo-roxo2021.svg"),
  "290": require("../assets/logoBanks/pagseguro.svg"),
  "748": require("../assets/logoBanks/verde.svg"),
  "756": require("../assets/logoBanks/sicoob-vector-logo.svg"),
  "077": require("../assets/logoBanks/banco-mercantil-novo-azul.svg"),
  "707": require("../assets/logoBanks/banco-da-amazonia.svg"),
  "012": require("../assets/logoBanks/banco-original-logo-verde-nome.svg"),
  "422": require("../assets/logoBanks/logo-safra.svg"),
  "136": require("../assets/logoBanks/banco-pine-nome.svg"),
  "743": require("../assets/logoBanks/sicoob-vector-logo.svg"),
  "745": require("../assets/logoBanks/banco-bv-logo.svg"),
  "751": require("../assets/logoBanks/banco-da-amazonia.svg"),
  "752": require("../assets/logoBanks/logo-sofisa.svg"),
  "757": require("../assets/logoBanks/banco-da-amazonia.svg"),
  "761": require("../assets/logoBanks/banco-da-amazonia.svg"),
  "766": require("../assets/logoBanks/BMG.svg"),
  "770": require("../assets/logoBanks/banco-da-amazonia.svg"),
  "929": require("../assets/logoBanks/sicoob-vector-logo.svg"),
  "996": require("../assets/logoBanks/logo-omni.svg"),
  "999": require("../assets/logoBanks/banco-original-logo-verde-nome.svg"),
  // Fintechs
  neon: require("../assets/logoBanks/header-logo-neon.svg"),
  picpay: require("../assets/logoBanks/Logo-PicPay.svg"),
  mercadopago: require("../assets/logoBanks/mercado-pago.svg"),
  stone: require("../assets/logoBanks/stone-nome.svg"),
  c6: require("../assets/logoBanks/c6 bank.svg"),
  btg: require("../assets/logoBanks/btg-pactual.svg"),
  bs2: require("../assets/logoBanks/Banco_BS2.svg"),
  sofisa: require("../assets/logoBanks/logo-sofisa.svg"),
  infinitepay: require("../assets/logoBanks/InfinitePay-Nome.svg"),
  recargapay: require("../assets/logoBanks/RecargaPay.svg"),
  outro: null, // Placeholder para "Outro"
};

export const BANKS: Bank[] = [
  {
    id: "001",
    name: "Banco do Brasil",
    code: "001",
    logo: bankLogos["001"],
  },
  {
    id: "033",
    name: "Santander",
    code: "033",
    logo: bankLogos["033"],
  },
  {
    id: "104",
    name: "Caixa Econômica",
    code: "104",
    logo: bankLogos["104"],
  },
  {
    id: "237",
    name: "Bradesco",
    code: "237",
    logo: bankLogos["237"],
  },
  {
    id: "341",
    name: "Itaú",
    code: "341",
    logo: bankLogos["341"],
  },
  {
    id: "246",
    name: "ABC Brasil",
    code: "246",
    logo: bankLogos["246"],
  },
  {
    id: "318",
    name: "Banco BMG",
    code: "318",
    logo: bankLogos["318"],
  },
  {
    id: "633",
    name: "Banco Safra",
    code: "633",
    logo: bankLogos["633"],
  },
  {
    id: "654",
    name: "Banco Inter",
    code: "654",
    logo: bankLogos["654"],
  },
  {
    id: "260",
    name: "Nubank",
    code: "260",
    logo: bankLogos["260"],
  },
  {
    id: "290",
    name: "PagSeguro",
    code: "290",
    logo: bankLogos["290"],
  },
  {
    id: "748",
    name: "Sicredi",
    code: "748",
    logo: bankLogos["748"],
  },
  {
    id: "756",
    name: "Sicoob",
    code: "756",
    logo: bankLogos["756"],
  },
  {
    id: "077",
    name: "Banco Mercantil",
    code: "077",
    logo: bankLogos["077"],
  },
  {
    id: "707",
    name: "Banco Daycoval",
    code: "707",
    logo: bankLogos["707"],
  },
  {
    id: "012",
    name: "Banco Original",
    code: "012",
    logo: bankLogos["012"],
  },
  {
    id: "422",
    name: "Banco Safra (422)",
    code: "422",
    logo: bankLogos["422"],
  },
  {
    id: "136",
    name: "Banco Pine",
    code: "136",
    logo: bankLogos["136"],
  },
  {
    id: "743",
    name: "Banco Semear",
    code: "743",
    logo: bankLogos["743"],
  },
  {
    id: "745",
    name: "BV Banco",
    code: "745",
    logo: bankLogos["745"],
  },
  {
    id: "751",
    name: "Banco da Amazônia",
    code: "751",
    logo: bankLogos["751"],
  },
  {
    id: "752",
    name: "Banco Sofisa",
    code: "752",
    logo: bankLogos["752"],
  },
  {
    id: "757",
    name: "Banco KEB Hana",
    code: "757",
    logo: bankLogos["757"],
  },
  {
    id: "761",
    name: "Banco ABC",
    code: "761",
    logo: bankLogos["761"],
  },
  {
    id: "766",
    name: "Banco BB Institucional",
    code: "766",
    logo: bankLogos["766"],
  },
  {
    id: "770",
    name: "BRB",
    code: "770",
    logo: bankLogos["770"],
  },
  {
    id: "929",
    name: "Banco Ativo",
    code: "929",
    logo: bankLogos["929"],
  },
  {
    id: "996",
    name: "Banco Omni",
    code: "996",
    logo: bankLogos["996"],
  },
  {
    id: "999",
    name: "Banco Original",
    code: "999",
    logo: bankLogos["999"],
  },
  {
    id: "neon",
    name: "Neon",
    code: "neon",
    logo: bankLogos["neon"],
  },
  {
    id: "picpay",
    name: "PicPay",
    code: "picpay",
    logo: bankLogos["picpay"],
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    code: "mercadopago",
    logo: bankLogos["mercadopago"],
  },
  {
    id: "stone",
    name: "Stone",
    code: "stone",
    logo: bankLogos["stone"],
  },
  {
    id: "c6",
    name: "C6 Bank",
    code: "c6",
    logo: bankLogos["c6"],
  },
  {
    id: "btg",
    name: "BTG Pactual",
    code: "btg",
    logo: bankLogos["btg"],
  },
  {
    id: "bs2",
    name: "Banco BS2",
    code: "bs2",
    logo: bankLogos["bs2"],
  },
  {
    id: "sofisa",
    name: "Banco Sofisa",
    code: "sofisa",
    logo: bankLogos["sofisa"],
  },
  {
    id: "infinitepay",
    name: "InfinitePay",
    code: "infinitepay",
    logo: bankLogos["infinitepay"],
  },
  {
    id: "recargapay",
    name: "RecargaPay",
    code: "recargapay",
    logo: bankLogos["recargapay"],
  },
  {
    id: "outro",
    name: "Outro",
    code: "outro",
    logo: bankLogos["outro"],
  },
];

export const getBankById = (id: string): Bank | undefined => {
  return BANKS.find((bank) => bank.id === id);
};

export const getBankByCode = (code: string): Bank | undefined => {
  return BANKS.find((bank) => bank.code === code);
};

export const getBankByName = (name: string): Bank | undefined => {
  return BANKS.find((bank) => bank.name === name);
};
