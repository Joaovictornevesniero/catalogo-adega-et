(function () {
  "use strict";

  var STORAGE_KEY = "carrinho-" + CONFIG.nome.toLowerCase().replace(/\s+/g, "-");
  var fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  var money = function (v) { return fmt.format(v); };

  var carrinho = {};      // { idProduto: quantidade }
  var categoriaAtual = "Todos";
  var termo = "";

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- armazenamento (opcional, pode falhar) ---------- */
  function carregar() {
    try {
      var salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      Object.keys(salvo).forEach(function (id) {
        var p = produtoPorId(Number(id));
        if (p && p.disponivel && salvo[id] > 0) carrinho[id] = salvo[id];
      });
    } catch (e) { /* ignora */ }
  }
  function salvar() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho)); } catch (e) { /* ignora */ }
  }

  /* ---------- helpers ---------- */
  function produtoPorId(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i];
    return null;
  }
  function normaliza(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function subtotal() {
    return Object.keys(carrinho).reduce(function (soma, id) {
      var p = produtoPorId(Number(id));
      return soma + (p ? p.preco * carrinho[id] : 0);
    }, 0);
  }
  function qtdTotal() {
    return Object.keys(carrinho).reduce(function (s, id) { return s + carrinho[id]; }, 0);
  }
  function taxa() { return qtdTotal() > 0 ? CONFIG.taxaEntrega : 0; }

  function el(tag, cls, texto) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  }

  /* ---------- cabeçalho / logo ---------- */
  function iniciarTopo() {
    $("nome-adega").textContent = CONFIG.nome;
    $("sub-adega").textContent = "Delivery pelo WhatsApp" + (CONFIG.bairro ? " · " + CONFIG.bairro : "");
    $("monograma").textContent = CONFIG.sigla || CONFIG.nome.trim().slice(0, 2).toUpperCase();
    $("logo").alt = "Logo da " + CONFIG.nome;
    document.title = CONFIG.nome + " | Peça pelo WhatsApp";

    var logo = $("logo");
    logo.onload = function () { logo.hidden = false; $("monograma").hidden = true; };
    logo.onerror = function () { logo.hidden = true; $("monograma").hidden = false; };
    logo.src = CONFIG.logo;
  }

  /* ---------- abas ---------- */
  function categorias() {
    var vistas = ["Todos"];
    PRODUTOS.forEach(function (p) { if (vistas.indexOf(p.categoria) < 0) vistas.push(p.categoria); });
    return vistas;
  }
  function desenharAbas() {
    var nav = $("abas");
    nav.textContent = "";
    categorias().forEach(function (c) {
      var b = el("button", "aba" + (c === categoriaAtual ? " ativa" : ""), c);
      b.type = "button";
      b.onclick = function () { categoriaAtual = c; desenharAbas(); desenharLista(); };
      nav.appendChild(b);
    });
  }

  /* ---------- lista de produtos ---------- */
  function desenharLista() {
    var lista = $("lista");
    lista.textContent = "";
    var t = normaliza(termo);
    var achou = 0;
    var ultimaCat = null;

    PRODUTOS.forEach(function (p) {
      if (categoriaAtual !== "Todos" && p.categoria !== categoriaAtual) return;
      if (t && normaliza(p.nome + " " + p.detalhe).indexOf(t) < 0) return;
      achou++;

      if (categoriaAtual === "Todos" && p.categoria !== ultimaCat) {
        lista.appendChild(el("h2", "titulo-cat", p.categoria));
        ultimaCat = p.categoria;
      }

      var card = el("article", "produto" + (p.disponivel ? "" : " esgotado"));
      card.appendChild(el("h3", null, p.nome));
      card.appendChild(el("p", "det", p.detalhe));

      var linha = el("div", "linha");
      linha.appendChild(el("span", "preco", money(p.preco)));

      if (!p.disponivel) {
        linha.appendChild(el("span", "etiqueta", "Esgotado"));
      } else if (carrinho[p.id]) {
        linha.appendChild(stepper(p.id));
      } else {
        var add = el("button", "btn-add", "Adicionar");
        add.type = "button";
        add.onclick = function () { mudar(p.id, 1); };
        linha.appendChild(add);
      }
      card.appendChild(linha);
      lista.appendChild(card);
    });

    $("vazio").hidden = achou > 0;
  }

  function stepper(id) {
    var box = el("div", "stepper");
    var menos = el("button", null, "−"); menos.type = "button"; menos.setAttribute("aria-label", "Diminuir");
    var mais = el("button", null, "+"); mais.type = "button"; mais.setAttribute("aria-label", "Aumentar");
    menos.onclick = function () { mudar(id, -1); };
    mais.onclick = function () { mudar(id, 1); };
    box.appendChild(menos);
    box.appendChild(el("span", null, String(carrinho[id])));
    box.appendChild(mais);
    return box;
  }

  function mudar(id, delta) {
    var atual = carrinho[id] || 0;
    var novo = Math.max(0, Math.min(99, atual + delta));
    if (novo === 0) delete carrinho[id]; else carrinho[id] = novo;
    salvar();
    atualizarTudo();
  }

  /* ---------- carrinho ---------- */
  function desenharItens() {
    var box = $("itens");
    box.textContent = "";
    var ids = Object.keys(carrinho);
    if (!ids.length) {
      box.appendChild(el("p", "item-vazio", "Seu pedido está vazio."));
      return;
    }
    ids.forEach(function (id) {
      var p = produtoPorId(Number(id));
      if (!p) return;
      var linha = el("div", "item");
      var info = el("div");
      info.appendChild(el("div", "nome", p.nome));
      info.appendChild(el("div", "sub-preco", money(p.preco) + " cada · " + money(p.preco * carrinho[id])));
      linha.appendChild(info);
      linha.appendChild(stepper(Number(id)));
      box.appendChild(linha);
    });
  }

  function atualizarTotais() {
    var sub = subtotal(), tx = taxa();
    $("t-sub").textContent = money(sub);
    $("t-taxa").textContent = tx > 0 ? money(tx) : "Grátis";
    $("t-total").textContent = money(sub + tx);

    var q = qtdTotal();
    $("barra-qtd").textContent = q + (q === 1 ? " item" : " itens");
    $("barra-total").textContent = money(sub + tx);
    $("abrir-carrinho").hidden = q === 0 || !$("carrinho").hidden;
  }

  function atualizarTudo() {
    desenharLista();
    desenharItens();
    atualizarTotais();
    if (qtdTotal() === 0 && !$("carrinho").hidden) fecharCarrinho();
  }

  function abrirCarrinho() {
    $("carrinho").hidden = false;
    $("fundo").hidden = false;
    $("abrir-carrinho").hidden = true;
    document.body.style.overflow = "hidden";
  }
  function fecharCarrinho() {
    $("carrinho").hidden = true;
    $("fundo").hidden = true;
    document.body.style.overflow = "";
    atualizarTotais();
  }

  /* ---------- mensagem do WhatsApp ---------- */
  function montarMensagem(dados) {
    var linhas = [];
    linhas.push("*Novo pedido - " + CONFIG.nome + "*");
    linhas.push("");
    Object.keys(carrinho).forEach(function (id) {
      var p = produtoPorId(Number(id));
      if (!p) return;
      linhas.push(carrinho[id] + "x " + p.nome + " - " + money(p.preco * carrinho[id]));
    });
    linhas.push("");
    linhas.push("Subtotal: " + money(subtotal()));
    linhas.push("Entrega: " + (taxa() > 0 ? money(taxa()) : "Grátis"));
    linhas.push("*Total: " + money(subtotal() + taxa()) + "*");
    linhas.push("");
    linhas.push("Nome: " + dados.nome);
    linhas.push("Endereço: " + dados.endereco);
    linhas.push("Pagamento: " + dados.pagamento);
    if (dados.pagamento === "Dinheiro" && dados.troco) linhas.push("Troco para: R$ " + dados.troco);
    if (dados.obs) linhas.push("Obs.: " + dados.obs);
    linhas.push("Confirmo ter 18 anos ou mais.");
    return linhas.join("\n");
  }

  function mostrarErro(msg) {
    var e = $("erro");
    e.textContent = msg;
    e.hidden = !msg;
  }

  function enviar(ev) {
    ev.preventDefault();
    mostrarErro("");
    var f = ev.target.elements;

    if (qtdTotal() === 0) return mostrarErro("Adicione pelo menos um produto.");
    if (subtotal() < CONFIG.pedidoMinimo) {
      return mostrarErro("Pedido mínimo: " + money(CONFIG.pedidoMinimo) + ".");
    }
    var nome = f.nome.value.trim();
    var endereco = f.endereco.value.trim();
    if (!nome) return mostrarErro("Informe seu nome.");
    if (!endereco) return mostrarErro("Informe o endereço de entrega.");
    if (!f.maior.checked) return mostrarErro("É preciso confirmar que você tem 18 anos ou mais.");

    var texto = montarMensagem({
      nome: nome,
      endereco: endereco,
      pagamento: f.pagamento.value,
      troco: f.troco.value.trim(),
      obs: f.obs.value.trim()
    });
    var numero = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    var url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener");
  }

  /* ---------- início ---------- */
  function iniciar() {
    iniciarTopo();
    carregar();

    var sel = $("pagamento");
    CONFIG.pagamentos.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p; o.textContent = p;
      sel.appendChild(o);
    });
    sel.onchange = function () { $("troco-box").hidden = sel.value !== "Dinheiro"; };

    $("busca").addEventListener("input", function (e) { termo = e.target.value; desenharLista(); });
    $("abrir-carrinho").onclick = abrirCarrinho;
    $("fechar-carrinho").onclick = fecharCarrinho;
    $("fundo").onclick = fecharCarrinho;
    $("limpar").onclick = function () { carrinho = {}; salvar(); atualizarTudo(); };
    $("form").addEventListener("submit", enviar);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("carrinho").hidden) fecharCarrinho(); });

    desenharAbas();
    atualizarTudo();
  }

  iniciar();
})();
