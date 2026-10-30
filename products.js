// ============================================================
// CONFIGURAÇÃO DA ADEGA  (edite só este arquivo para mudar dados)
// ============================================================
const CONFIG = {
  nome: "Sua Adega",
  sigla: "SA",   // letras do círculo quando não há logo
  bairro: "",    // opcional, aparece ao lado de "Delivery pelo WhatsApp"
  // Número do WhatsApp da adega, só dígitos, com 55 + DDD (ex.: "5511912345678").
  // Vazio = modo demonstração: o WhatsApp abre com o pedido pronto e a pessoa escolhe o contato.
  whatsapp: "",
  taxaEntrega: 5.0, // valor de exemplo; 0 para entrega grátis
  pedidoMinimo: 0,
  pagamentos: ["Pix", "Cartão na entrega", "Dinheiro"],
  logo: "assets/logo.png" // coloque a logo da adega nesta pasta; se não existir, aparece o monograma
};

// ============================================================
// PRODUTOS (EXEMPLO)
// Nomes e preços são fictícios, só para demonstrar o layout.
// disponivel: false  ->  mostra "Esgotado" e bloqueia o pedido
// ============================================================
const PRODUTOS = [
  { id: 1,  categoria: "Cervejas", nome: "Cerveja lata 350 ml", detalhe: "Pilsen gelada", preco: 4.5, disponivel: true },
  { id: 2,  categoria: "Cervejas", nome: "Cerveja long neck 330 ml", detalhe: "Pilsen gelada", preco: 7.0, disponivel: true },
  { id: 3,  categoria: "Cervejas", nome: "Caixa de cerveja 12 latas", detalhe: "350 ml cada", preco: 49.9, disponivel: true },
  { id: 4,  categoria: "Cervejas", nome: "Cerveja artesanal IPA 500 ml", detalhe: "Garrafa", preco: 24.9, disponivel: false },

  { id: 5,  categoria: "Destilados", nome: "Vodka 1 L", detalhe: "Garrafa", preco: 39.9, disponivel: true },
  { id: 6,  categoria: "Destilados", nome: "Whisky 1 L", detalhe: "Garrafa", preco: 89.9, disponivel: true },
  { id: 7,  categoria: "Destilados", nome: "Gin 750 ml", detalhe: "Garrafa", preco: 79.9, disponivel: true },
  { id: 8,  categoria: "Destilados", nome: "Cachaça 700 ml", detalhe: "Garrafa", preco: 19.9, disponivel: true },

  { id: 9,  categoria: "Vinhos", nome: "Vinho tinto seco 750 ml", detalhe: "Garrafa", preco: 44.9, disponivel: true },
  { id: 10, categoria: "Vinhos", nome: "Vinho branco 750 ml", detalhe: "Garrafa", preco: 44.9, disponivel: true },
  { id: 11, categoria: "Vinhos", nome: "Espumante 750 ml", detalhe: "Garrafa", preco: 59.9, disponivel: true },

  { id: 12, categoria: "Sem álcool", nome: "Refrigerante 2 L", detalhe: "Vários sabores", preco: 9.9, disponivel: true },
  { id: 13, categoria: "Sem álcool", nome: "Energético 473 ml", detalhe: "Lata", preco: 9.5, disponivel: true },
  { id: 14, categoria: "Sem álcool", nome: "Água com gás 500 ml", detalhe: "Garrafa", preco: 3.5, disponivel: true },

  { id: 15, categoria: "Gelo e carvão", nome: "Gelo em cubos 5 kg", detalhe: "Saco", preco: 12.0, disponivel: true },
  { id: 16, categoria: "Gelo e carvão", nome: "Carvão 3 kg", detalhe: "Saco", preco: 18.0, disponivel: true }
];
