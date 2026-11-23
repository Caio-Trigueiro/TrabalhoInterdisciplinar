function salvarNoJson() {
  const nome = document.getElementById('name-acc')?.value.trim() || '';
  const contato = document.getElementById('email-acc')?.value.trim() || '';
  const senha = document.getElementById('pass-acc')?.value || '';
  const cpf = document.getElementById('cpf-acc')?.value.trim() || '';
  const cep = document.getElementById('cep-acc')?.value.trim() || '';

  if (!nome || !contato || !cpf || !cep) {
    alert('Por favor, preencha Nome, E-mail/Telefone, CPF e CEP!');
    return;
  }

  const cliente = {
    Nome: nome,
    Contato: contato,
    Senha: senha,
    CPF: cpf,
    CEP: cep
  };

  localStorage.setItem('Cliente', JSON.stringify(cliente));
  console.log('Cadastro salvo em JSON:', JSON.stringify(cliente, null, 2));

  alert(`Conta criada com sucesso, ${cliente.Nome}!`);
  window.location.href = 'search.html';
}