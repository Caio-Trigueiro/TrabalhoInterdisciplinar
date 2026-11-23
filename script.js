//BOLINHA DO CARRINHO
function atualizarBadgeCarrinho() {
  const sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  const totalItens = sacola.length;
  const btnCarrinho = document.querySelector('.btn-carrinho');

  if (!btnCarrinho) return;

  let badge = btnCarrinho.querySelector('.badge-carrinho');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'badge-carrinho';
    btnCarrinho.appendChild(badge);
  }

  badge.textContent = totalItens;
  badge.style.display = 'flex';
}

// Roda assim que o script carrega
atualizarBadgeCarrinho();

document.addEventListener('DOMContentLoaded', () => {
  atualizarBadgeCarrinho();

  // Clique no botão Carrinho do cabeçalho
  const btnCarrinho = document.querySelector('.btn-carrinho');
  if (btnCarrinho) {
    btnCarrinho.addEventListener('click', () => {
      window.location.href = 'carrinho.html';
    });
  }

  // CARROSSEL
  const slidesContainer = document.querySelector('.carrocel');
  if (slidesContainer) {
    let slideAtual = 0;
    const totalSlides = document.querySelectorAll('.slide').length;
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    function mudarSlide(index) {
      if (index < 0) {
        slideAtual = totalSlides - 1;
      } else if (index >= totalSlides) {
        slideAtual = 0;
      } else {
        slideAtual = index;
      }
      slidesContainer.style.transform = `translateX(-${slideAtual * 100}%)`;
    }

    let tempoAuto = setInterval(() => {
      mudarSlide(slideAtual + 1);
    }, 5000);

    function resetarTempo() {
      clearInterval(tempoAuto);
      tempoAuto = setInterval(() => {
        mudarSlide(slideAtual + 1);
      }, 5000);
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        mudarSlide(slideAtual - 1);
        resetarTempo();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        mudarSlide(slideAtual + 1);
        resetarTempo();
      });
    }
  }

  renderizarCarrinho();
});

let ultimoScroll = 0;
const header = document.querySelector('header');

if (header) {
  window.addEventListener('scroll', () => {
    const scrollAtual = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollAtual > ultimoScroll && scrollAtual > 60) {
      header.classList.add('header-oculto');
    } else {
      header.classList.remove('header-oculto');
    }
    ultimoScroll = scrollAtual <= 0 ? 0 : scrollAtual;
  });
}

// 4. MODAL DE DETALHES INDIVIDUAL (LÊ OS PREÇOS MANUAIS DE CADA POP-UP)
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function atualizarTotalDoModal(modal) {
  if (!modal) return;
  const btnAtivo = modal.querySelector('.btn-tamanho.ativo');
  const precoUnitario = btnAtivo ? parseFloat(btnAtivo.getAttribute('data-preco')) : 0;
  const qtdElem = modal.querySelector('#qtd-numero');
  const qtd = qtdElem ? parseInt(qtdElem.textContent) : 1;
  const modalPreco = modal.querySelector('.modal-preco');

  if (modalPreco) {
    modalPreco.textContent = formatarMoeda(precoUnitario * qtd);
  }
}

document.addEventListener('click', (e) => {
  // A) ABRIR O POP-UP DO PRODUTO CLICADO
  const card = e.target.closest('.caixa-produto');
  if (card) {
    // Pega o pop-up logo abaixo do card clicado (ou pelo mesmo índice na vitrine)
    let modal = card.nextElementSibling;
    if (!modal || !modal.classList.contains('modal-overlay')) {
      const todosCards = Array.from(document.querySelectorAll('.caixa-produto'));
      const todosModais = Array.from(document.querySelectorAll('.modal-overlay'));
      modal = todosModais[todosCards.indexOf(card)];
    }

    if (modal) {
      // Reseta quantidade para 1 dentro desse pop-up
      const qtdElem = modal.querySelector('#qtd-numero');
      if (qtdElem) qtdElem.textContent = '1';

      // Marca o tamanho P como ativo por padrão dentro desse pop-up
      const botoes = modal.querySelectorAll('.btn-tamanho');
      botoes.forEach(b => b.classList.remove('ativo'));
      if (botoes[0]) botoes[0].classList.add('ativo');

      atualizarTotalDoModal(modal);
      modal.style.display = 'flex';
    }
    return;
  }

  // B) TROCAR TAMANHO (P, M, G) DENTRO DO POP-UP ABERTO
  const btnTamanho = e.target.closest('.btn-tamanho');
  if (btnTamanho) {
    const modal = btnTamanho.closest('.modal-overlay');
    if (!modal) return;

    modal.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('ativo'));
    btnTamanho.classList.add('ativo');
    atualizarTotalDoModal(modal);
    return;
  }

  // C) AUMENTAR OU DIMINUIR QUANTIDADE (- E +) DENTRO DO POP-UP ABERTO
  const btnQtd = e.target.closest('.btn-qtd');
  if (btnQtd) {
    const modal = btnQtd.closest('.modal-overlay');
    if (!modal) return;

    const qtdElem = modal.querySelector('#qtd-numero');
    let qtd = qtdElem ? parseInt(qtdElem.textContent) : 1;

    if (btnQtd.id === 'btn-mais' || btnQtd.textContent.trim() === '+') {
      qtd++;
    } else if ((btnQtd.id === 'btn-menos' || btnQtd.textContent.trim() === '-') && qtd > 1) {
      qtd--;
    }

    if (qtdElem) qtdElem.textContent = qtd;
    atualizarTotalDoModal(modal);
    return;
  }

  // D) FECHAR POP-UP NO "X" OU CLICANDO FORA
  const btnFechar = e.target.closest('.fechar-modal-prod');
  if (btnFechar) {
    const modal = btnFechar.closest('.modal-overlay');
    if (modal) modal.style.display = 'none';
    return;
  }

  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// 5. BOTÃO "ADICIONAR AO CARRINHO" (LÊ SOMENTE DO POP-UP ABERTO)
document.addEventListener('click', (e) => {
  const btnAdicionar = e.target.closest('.btn-add, .btn-add-carrinho, #btn-adicionar-carrinho');
  if (!btnAdicionar) return;

  const modal = btnAdicionar.closest('.modal-overlay');
  if (!modal) return;

  const btnAtivo = modal.querySelector('.btn-tamanho.ativo');
  const tamanho = btnAtivo ? btnAtivo.textContent.trim() : 'P';
  const precoUnitario = btnAtivo ? parseFloat(btnAtivo.getAttribute('data-preco')) : 0;

  const nome = modal.querySelector('#modal-titulo, h2')?.textContent.trim() || 'Produto';
  const imagem = modal.querySelector('#modal-img, img')?.getAttribute('src') || '';
  const qtdElem = modal.querySelector('#qtd-numero');
  const qtd = qtdElem ? parseInt(qtdElem.textContent) : 1;

  const item = {
    id: nome + '-' + tamanho,
    nome: nome,
    imagem: imagem,
    tamanho: tamanho,
    quantidade: qtd,
    precoUnitario: precoUnitario,
    precoTotal: precoUnitario * qtd
  };

  let sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  const index = sacola.findIndex(p => p.id === item.id);

  if (index > -1) {
    sacola[index].quantidade += item.quantidade;
    sacola[index].precoTotal += item.precoTotal;
  } else {
    sacola.push(item);
  }

  localStorage.setItem('carrinho', JSON.stringify(sacola));
  modal.style.display = 'none';
  atualizarBadgeCarrinho();
});

// 5. BOTÃO "ADICIONAR AO CARRINHO" DO POP-UP
document.addEventListener('click', (e) => {
  const btnAdicionar = e.target.closest('.btn-add, .btn-add-carrinho, #btn-adicionar-carrinho');
  if (!btnAdicionar) return;

  const btnAtivo = document.querySelector('.btn-tamanho.ativo');
  const tamanho = btnAtivo ? btnAtivo.textContent.trim() : 'P';
  const precoUnitario = btnAtivo ? parseFloat(btnAtivo.getAttribute('data-preco')) : 30.00;

  const nome = document.getElementById('modal-titulo')?.textContent || 'Combo Churrasco';
  const imagem = document.getElementById('modal-img')?.getAttribute('src') || 'img/PDD/CC.png';
  const qtdAtual = document.getElementById('qtd-numero');
  const qtd = qtdAtual ? parseInt(qtdAtual.textContent) : 1;

  const item = {
    id: nome + '-' + tamanho,
    nome: nome,
    imagem: imagem,
    tamanho: tamanho,
    quantidade: qtd,
    precoUnitario: precoUnitario,
    precoTotal: precoUnitario * qtd
  };

  let sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  const index = sacola.findIndex(p => p.id === item.id);

  if (index > -1) {
    sacola[index].quantidade += item.quantidade;
    sacola[index].precoTotal += item.precoTotal;
  } else {
    sacola.push(item);
  }

  localStorage.setItem('carrinho', JSON.stringify(sacola));

  const modal = document.getElementById('modal-produto');
  if (modal) modal.style.display = 'none';

  atualizarBadgeCarrinho();
});

//FUNÇÕES DA PÁGINA CARRINHO.HTML
function renderizarCarrinho() {
  const container = document.querySelector('.carrinho-container');
  if (!container) return;

  const sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  atualizarBadgeCarrinho();

  if (sacola.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2 style="color: #ff7b0f; font-family: 'Poppins', sans-serif;">Seu carrinho está vazio</h2>
        <a href="search.html" style="color: #333; text-decoration: underline; font-family: 'Poppins', sans-serif;">Voltar ao cardápio</a>
      </div>
    `;
    return;
  }

  let htmlItens = `
    <div class="carrinho-header-acoes">
      <button class="btn-historico">Histórico</button>
    </div>
  `;

  sacola.forEach((item, index) => {
    const valorFormatado = item.precoTotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    htmlItens += `
      <div class="card-item-carrinho">
        <div class="item-foto">
          <img src="${item.imagem}" alt="${item.nome}">
        </div>

        <div class="item-detalhes">
          <h3>${item.nome}</h3>
          <p class="tamanho-info">Tamanho ${item.tamanho}</p>
          <p class="qtd-info">
            Quantidade 
            <button type="button" class="btn-qtd-cart" onclick="alterarQtd(${index}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button type="button" class="btn-qtd-cart" onclick="alterarQtd(${index}, 1)">+</button>
          </p>
        </div>

        <div class="item-acoes-direita">
          <span class="item-preco-total">Total ${valorFormatado}</span>
          <button type="button" class="btn-excluir-item" onclick="removerItem(${index})">Excluir</button>
        </div>
      </div>
    `;
  });

  htmlItens += `
    <div class="fechar-pedido-box">
      <button class="btn-fechar-pedido">Fechar pedido</button>
    </div>
  `;

  container.innerHTML = htmlItens;
}

window.alterarQtd = function(index, mudanca) {
  let sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!sacola[index]) return;

  const novaQtd = sacola[index].quantidade + mudanca;
  if (novaQtd < 1) return;

  const precoUnitario = sacola[index].precoUnitario || (sacola[index].precoTotal / sacola[index].quantidade);

  sacola[index].quantidade = novaQtd;
  sacola[index].precoUnitario = precoUnitario;
  sacola[index].precoTotal = precoUnitario * novaQtd;

  localStorage.setItem('carrinho', JSON.stringify(sacola));
  renderizarCarrinho();
};

window.removerItem = function(index) {
  let sacola = JSON.parse(localStorage.getItem('carrinho')) || [];
  sacola.splice(index, 1);

  localStorage.setItem('carrinho', JSON.stringify(sacola));
  renderizarCarrinho();
};

document.addEventListener('click', (e) => {
  // Botão "Fechar pedido" dentro do carrinho.html
  if (e.target.closest('.btn-fechar-pedido')) {
    const clienteSalvo = JSON.parse(localStorage.getItem('Cliente'));
    const sacola = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (sacola.length === 0) {
      alert('Sua sacola está vazia!');
      return;
    }

    // Se ainda não tiver conta cadastrada, manda para a página de cadastro
    if (!clienteSalvo) {
      alert('Antes de fechar o pedido, crie sua conta para salvar seu CPF e CEP!');
      window.location.href = 'account.html'; // Coloque aqui o nome exato do seu arquivo de cadastro
      return;
    }

    const historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];

  
    const pedidoFinal = {
      "id-pedido": historico.length + 1,
      "data": new Date().toLocaleString('pt-BR'),
      "cliente": {
        "nome": clienteSalvo.Nome,
        "contato": clienteSalvo.Contato,
        "cpf": clienteSalvo.CPF,
        "cep": clienteSalvo.CEP
      },
      "mercadorias": sacola.map(item => ({
        "produto": `${item.nome} (Tamanho ${item.tamanho})`,
        "quantidade": item.quantidade,
        "preço": item.precoTotal
      })),
      "totalGeral": sacola.reduce((soma, item) => soma + item.precoTotal, 0)
    };


    historico.push(pedidoFinal);
    localStorage.setItem('historicoPedidos', JSON.stringify(historico));
    localStorage.removeItem('carrinho');

    console.log('Pedido fechado (JSON):', JSON.stringify(pedidoFinal, null, 2));
    alert(`Pedido #${pedidoFinal["id-pedido"]} confirmado para ${clienteSalvo.Nome} (Entrega CEP: ${clienteSalvo.CEP})!`);

    renderizarCarrinho();
    atualizarBadgeCarrinho();
  }


  if (e.target.closest('.btn-historico')) {
    const historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];
    if (historico.length === 0) {
      alert('Você ainda não tem pedidos fechados.');
      return;
    }

    const resumo = historico.map(p =>
      `Pedido #${p["id-pedido"]} (${p.data})\nCliente: ${p.cliente.nome} | CPF: ${p.cliente.cpf} | CEP: ${p.cliente.cep}\nTotal: R$ ${p.totalGeral.toFixed(2).replace('.', ',')}`
    ).join('\n\n');

    alert('Histórico de Pedidos:\n\n' + resumo);
  }
});