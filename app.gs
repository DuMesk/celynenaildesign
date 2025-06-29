function doGet(e) {
  const callback = e.parameter.callback;
  const acao = e.parameter.acao;
  const sheet = SpreadsheetApp.openById("1um1O9P4HtWDinv9PzC3ZSBshMhIlhZG5CoZHjaWu-Ag").getSheetByName("Dados");

if (acao === "listarHorarios") {
  const dataSelecionada = e.parameter.data;
  const dados = sheet.getDataRange().getValues();
  const cabecalho = dados.shift().map(h => h.toString().trim().toLowerCase());

  const indiceData = cabecalho.indexOf("data");
  const indiceHorario = cabecalho.indexOf("hora");
  const indiceStatus = cabecalho.indexOf("status");

  // Função para padronizar o formato do horário
  const formatarHoraComparacao = (hora) => {
    if (!hora) return '';
    const partes = hora.toString().split(':');
    if (partes.length >= 2) {
      return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
    }
    return hora.toString().trim();
  };

  const horariosOcupados = dados
    .filter(linha => {
      const dataPlanilha = (linha[indiceData] || "").toString().trim();
      const status = (linha[indiceStatus] || "").toString().toLowerCase().trim();
      const horarioPlanilha = formatarHoraComparacao(linha[indiceHorario]);
      
      return (
        dataPlanilha === dataSelecionada &&
        (status === 'confirmado' || status === 'confirmada') &&
        horarioPlanilha !== ''
      );
    })
    .map(linha => formatarHoraComparacao(linha[indiceHorario]));

  const resposta = {
    data: dataSelecionada,
    horariosOcupados: horariosOcupados
  };

  const resultado = `${callback}(${JSON.stringify(resposta)})`;
  return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

if (acao === 'salvar') {
  const nome = e.parameter.nome;
  const telefone = e.parameter.telefone;
  const mensagem = e.parameter.mensagem;
  const dataEscolhida = e.parameter.dataEscolhida;
  let horarioEscolhido = e.parameter.horarioEscolhido;
  const servico = e.parameter.servico;

  // Formata o horário para garantir o padrão HH:MM
  if (horarioEscolhido) {
    horarioEscolhido = horarioEscolhido.toString().split(':').slice(0, 2).join(':');
    if (horarioEscolhido.length === 4) horarioEscolhido = '0' + horarioEscolhido; // Adiciona zero se necessário (9:00 -> 09:00)
  }

  if (!nome || !dataEscolhida || !horarioEscolhido) {
    const resultado = `${callback}({"status":"erro","mensagem":"Dados incompletos"})`;
    return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  const novaLinha = [
    nome,
    telefone || '',
    mensagem || '',
    new Date(),
    dataEscolhida,
    horarioEscolhido, // Já formatado como texto
    servico || '',
    'Pendente'
  ];

  sheet.appendRow(novaLinha);
  
  // Garante que a célula será tratada como texto
  const ultimaLinha = sheet.getLastRow();
  sheet.getRange(ultimaLinha, 5).setNumberFormat('@STRING@');
  sheet.getRange(ultimaLinha, 6).setNumberFormat('@STRING@');
  
    const resposta = {  
        status: "sucesso",
        mensagem: "Agendamento recebido com sucesso"
    };

    const resultado = `${callback}(${JSON.stringify(resposta)})`;
    return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
}


  if (acao === "listarTodos") {
    const dados = sheet.getDataRange().getValues();
    const cabecalho = dados.shift().map(h => h.toString().trim().toLowerCase());

    const registros = dados.map(linha => {
      const obj = {};
      cabecalho.forEach((coluna, index) => {
        obj[coluna] = linha[index];
      });
      return obj;
    });

    const resposta = {
      status: "sucesso",
      registros: registros
    };

    const resultado = `${callback}(${JSON.stringify(resposta)})`;
    return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

if (acao === 'alterarStatus') {
  const linha = parseInt(e.parameter.linha);
  const novoStatus = e.parameter.status;

  if (!linha || !novoStatus) {
    const resultado = `${callback}({"status":"erro","mensagem":"Dados incompletos"})`;
    return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Atualizar status na planilha
  sheet.getRange(linha, 8).setValue(novoStatus);

  if (novoStatus.trim().toLowerCase() === 'confirmado') {
    const dadosLinha = sheet.getRange(linha, 1, 1, 8).getValues()[0];

    const dadosEvento = {
      nome: dadosLinha[0],
      telefone: dadosLinha[1],
      mensagem: dadosLinha[2],
      dataEscolhida: dadosLinha[4],
      horarioEscolhido: dadosLinha[5],
      servico: dadosLinha[6],
    };

    criarEventoGoogleAgenda(dadosEvento);
  }

  const resposta = {
    status: "sucesso",
    mensagem: `Status atualizado para ${novoStatus}`
  };

  const resultado = `${callback}(${JSON.stringify(resposta)})`;
  return ContentService.createTextOutput(resultado).setMimeType(ContentService.MimeType.JAVASCRIPT);
}


  // 🔥 Se não cair em nenhum dos IF acima
  return ContentService.createTextOutput(`${callback}({"erro": "Ação não reconhecida"})`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}


function formatarDataParaISO(data) {
  if (Object.prototype.toString.call(data) === '[object Date]') {
    return Utilities.formatDate(data, "GMT-3", "dd-MM-yyyy");
  }

  const partes = data.toString().split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
  }

  return data.toString();
}



function doPost(e) {
  const sheet = SpreadsheetApp.openById("1um1O9P4HtWDinv9PzC3ZSBshMhIlhZG5CoZHjaWu-Ag").getSheetByName("Dados");
  let responseData;

  try {
    const data = JSON.parse(e.postData.contents);

    if (data.acao === 'salvar') {
      const horarioBruto = data.horarioEscolhido || '';
      const horarioFormatado = horarioBruto.toString().slice(0,5); // 🔥 pega só HH:MM

      const novaLinha = [
        data.nome || '',
        data.telefone || '',
        data.mensagem || '',
        new Date(),
        data.dataEscolhida || '',
        horarioFormatado, // ⬅️ hora garantida como texto
        data.servico || '',
        'Pendente'
      ];

      sheet.appendRow(novaLinha);

      // 🔥 FORMATA A CÉLULA DA HORA COMO TEXTO
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 5).setNumberFormat('@STRING@'); 
      sheet.getRange(lastRow, 6).setNumberFormat('@STRING@'); 

      responseData = {
        status: 'sucesso',
        mensagem: 'Agendamento salvo com sucesso'
      };
    }

    else if (data.acao === 'alterarStatus') {
      const linha = parseInt(data.linha);
      const novoStatus = data.status;
      sheet.getRange(linha, 8).setValue(novoStatus);
      responseData = { resultado: "Status atualizado com sucesso", status: "success" };
    }

    else {
      responseData = { error: "Ação não reconhecida", status: "error" };
    }

  } catch (error) {
    responseData = { error: "Erro interno no servidor: " + error.message, status: "error" };
  }

  return ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON)
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}





function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}

function criarEventoGoogleAgenda(dados) {
  const calendario = CalendarApp.getDefaultCalendar(); // usa a agenda padrão do Google
  const titulo = `${dados.nome} - ${dados.servico}`;
  const descricao = `
  Telefone: ${dados.telefone}
  Serviço: ${dados.servico}
  Mensagem: ${dados.mensagem}
  `;

  // 🔥 Montar a data e hora certinha
  const [dia, mes, ano] = dados.dataEscolhida.split('/').map(Number);
  const [hora, minuto] = dados.horarioEscolhido.split(':').map(Number);

  const dataInicio = new Date(ano, mes - 1, dia, hora, minuto);
  const dataFim = new Date(ano, mes - 1, dia, hora + 1, minuto); // evento de 1h

  // 🔥 Criar o evento
  const evento = calendario.createEvent(titulo, dataInicio, dataFim, {
    description: descricao,
  });

  // 🔔 Adicionar lembrete 15 minutos antes
  evento.addPopupReminder(15);

  return evento.getId(); // opcional: podemos salvar esse ID na planilha se quiser
}


function testarLeituraData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dados');
  const dados = sheet.getDataRange().getValues();

  dados.forEach((linha, index) => {
    const data = linha[4]; // coluna da data (ajuste se for diferente)
    Logger.log(`Linha ${index + 2}: Valor: ${data} | Tipo: ${Object.prototype.toString.call(data)}`);
  });
}


function testarLeituraHorario() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dados');
  const dados = sheet.getDataRange().getValues();

  dados.forEach((linha, index) => {
    const horario = linha[5]; // coluna da hora (ajuste se for diferente)
    Logger.log(`Linha ${index + 2}: Valor: ${horario} | Tipo: ${Object.prototype.toString.call(horario)}`);
  });
}



