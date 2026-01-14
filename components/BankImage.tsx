import React from "react";
import { View, Text, Image } from "react-native";
import { BANKS } from "../utils/banks";

// Importando TODOS os SVGs como componentes (baseado na lista completa do banks.ts)
import BancoDoBrasil from "../assets/logoBanks/banco-do-brasil-com-fundo.svg";
import Santander from "../assets/logoBanks/banco-santander-logo.svg";
import Caixa from "../assets/logoBanks/caixa-economica-federal-X.svg";
import Bradesco from "../assets/logoBanks/bradesco.svg";
import Itau from "../assets/logoBanks/itau.svg";
import Nubank from "../assets/logoBanks/nubank-logo-fundo-roxo2021.svg";
import PagSeguro from "../assets/logoBanks/pagseguro.svg";
import Inter from "../assets/logoBanks/inter.svg";
import BMG from "../assets/logoBanks/BMG.svg";
import Safra from "../assets/logoBanks/logo-safra.svg";
import C6Bank from "../assets/logoBanks/c6 bank.svg";
import Stone from "../assets/logoBanks/stone-nome.svg";
import PicPay from "../assets/logoBanks/Logo-PicPay.svg";
import Neon from "../assets/logoBanks/header-logo-neon.svg";
import BTGPactual from "../assets/logoBanks/btg-pactual.svg";
import MercadoPago from "../assets/logoBanks/mercado-pago.svg";
import Sicoob from "../assets/logoBanks/sicoob-vector-logo.svg";
import Original from "../assets/logoBanks/banco-original-logo-verde-nome.svg";
import AsaasIP from "../assets/logoBanks/Asaas IP S.A.svg";
import BancoBS2 from "../assets/logoBanks/Banco_BS2.svg";
import Verde from "../assets/logoBanks/verde.svg";
import BancoMercantil from "../assets/logoBanks/banco-mercantil-novo-azul.svg";
import BancoAmazonia from "../assets/logoBanks/banco-da-amazonia.svg";
import BancoPine from "../assets/logoBanks/banco-pine-nome.svg";
import BancoBV from "../assets/logoBanks/banco-bv-logo.svg";
import Sofisa from "../assets/logoBanks/logo-sofisa.svg";
import Omni from "../assets/logoBanks/logo-omni.svg";
import InfinitePay from "../assets/logoBanks/InfinitePay-Nome.svg";
import RecargaPay from "../assets/logoBanks/RecargaPay.svg";

// Componente placeholder para "Outro"
const OutroBank: React.FC<any> = ({ width, height }) => (
  <View
    style={{
      width,
      height,
      backgroundColor: "#6c757d",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
    }}
  >
    <Text
      style={{
        fontSize: Math.min(width / 6, 12),
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      OUTRO
    </Text>
  </View>
);

// Mapeamento baseado EXATAMENTE no banks.ts
const bankSvgComponents: { [key: string]: React.FC<any> } = {
  "001": BancoDoBrasil,
  "033": Santander,
  "104": Caixa,
  "237": Bradesco,
  "341": Itau,
  "246": AsaasIP,
  "318": BMG,
  "633": Safra,
  "654": Inter,
  "260": Nubank,
  "290": PagSeguro,
  "748": Verde,
  "756": Sicoob,
  "077": BancoMercantil,
  "707": BancoAmazonia,
  "012": Original,
  "422": Safra,
  "136": BancoPine,
  "743": Sicoob,
  "745": BancoBV,
  "751": BancoAmazonia,
  "752": Sofisa,
  "757": BancoAmazonia,
  "761": BancoAmazonia,
  "766": BMG,
  "770": BancoAmazonia,
  "929": Sicoob,
  "996": Omni,
  "999": Original,
  neon: Neon,
  picpay: PicPay,
  mercadopago: MercadoPago,
  stone: Stone,
  c6: C6Bank,
  btg: BTGPactual,
  bs2: BancoBS2,
  sofisa: Sofisa,
  infinitepay: InfinitePay,
  recargapay: RecargaPay,
  outro: OutroBank,
};

interface BankImageProps {
  bankId?: string;
  source?: any;
  width: number;
  height: number;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

export const BankImage: React.FC<BankImageProps> = ({
  bankId,
  source,
  width,
  height,
  resizeMode = "contain",
}) => {

  // Se temos um bankId e componente SVG, renderizar diretamente
  if (bankId && bankSvgComponents[bankId]) {
    const SvgComponent = bankSvgComponents[bankId];
    return <SvgComponent width={width} height={height} />;
  }

  // Se for um require() e for número, tentar renderizar como Image (PNG/JPG)
  if (typeof source === "number" && !bankId) {
    return (
      <Image
        source={source}
        style={{ width, height }}
        resizeMode={resizeMode}
      />
    );
  }

  // Fallback - placeholder com nome do banco ou ID
  if (typeof source === "number" && !bankId) {
    return (
      <Image
        source={source}
        style={{ width, height }}
        resizeMode={resizeMode}
      />
    );
  }

  // Fallback - placeholder com nome do banco ou ID
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#e9ecef",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#dee2e6",
      }}
    >
      <Text
        style={{
          fontSize: Math.min(width / 8, 10),
          color: "#6c757d",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {bankId || "?"}
      </Text>
    </View>
  );
};
