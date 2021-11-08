//não deixa os dados vazios para o usuário
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (response) => {
    if (!response.short_arrays) response.short_arrays = [];
    if (!response.prefferences)
      response.prefferences = {
        key: '/',
      };

    chrome.storage.sync.set(response);
  });
});

//verifica as mensagens recebidas
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.message) {
    case 'new_short':
      chrome.storage.sync.get(['short_arrays'], (response) => {
        response = response.short_arrays;

        response[response.length] = request.payload;

        //organiza o vetor
        response.sort((a, b) =>
          a.short > b.short ? 1 : b.short > a.short ? -1 : 0
        );

        chrome.storage.sync.set({ short_arrays: response }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ message: 'fail' });
            return;
          }

          sendResponse({ message: 'success' });
        });
      });
      return true;
      break;

    //mensagem para obter os atalhos
    case 'get_short':
      chrome.storage.sync.get(['short_arrays'], (response) => {
        sendResponse(response.short_arrays);
      });
      return true;
      break;

    //mensagem para editar um atalho
    case 'edit_short':
      chrome.storage.sync.get(['short_arrays'], (response) => {
        response = response.short_arrays;

        //vai substituir a posição atual pelo novo conteudo
        response[request.index] = request.payload;

        //reorganiza
        response.sort((a, b) =>
          a.short > b.short ? 1 : b.short > a.short ? -1 : 0
        );

        chrome.storage.sync.set({ short_arrays: response }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ message: 'fail' });
            return;
          }

          sendResponse({ message: 'success' });
        });
      });
      return true;
      break;

    //mensagem para apagar um atalho
    case 'delete_short':
      chrome.storage.sync.get(['short_arrays'], (response) => {
        response = response.short_arrays;

        //muda a posição do elemento a ser excluido para o final
        response[request.index] = response[response.length - 1];

        //remove
        response.pop();

        response.sort((a, b) =>
          a.short > b.short ? 1 : b.short > a.short ? -1 : 0
        );

        chrome.storage.sync.set({ short_arrays: response }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ message: 'fail' });
            return;
          }

          sendResponse({ message: 'success' });
        });
      });
      return true;
      break;

    case 'get_prefferences':
      chrome.storage.sync.get('prefferences', (response) => {
        sendResponse(response.prefferences);
      });
      return true;
      break;
    case 'set_prefferences':
      chrome.storage.sync.set({ prefferences: request.payload }, () => {
        if (chrome.runtime.lastError) {
          sendResponse({ message: 'fail' });
          return;
        }
        sendResponse({ message: 'success' });
      });
      return true;
  }
});
