window.onload = () => {
  chrome.runtime.sendMessage({ message: 'get_prefferences' }, (response) => {
    get_prefferences(response);
  });

  //verifica se foi aberto um chat
  document.addEventListener('click', clicado);
};

//obtem as preferencias do usuario
function get_prefferences(response) {
  prefferences = response;
}

//deleta o popup
function delete_elem() {
  if (!element) return;

  phrase_user = '';
  position = null;

  element.remove();
  phrase_user = '';
}

//responsável por adicionar o texto ao input
function sendMessage(i) {
  window.InputEvent = window.Event || window.InputEvent;
  var event = new InputEvent('input', { bubbles: true });
  var textselected = short_data[i].phrases;

  if (textselected.length > 0) {
    textselected =
      textselected[Math.floor(Math.random() * textselected.length)]; //seleciona mensagem aleatoria

    //pega o conteudo e substitui oque foi
    area_text.textContent = area_text.textContent.replace(
      phrase_user,
      textselected
    );
    area_text.dispatchEvent(event);
    delete_elem();
  }
}

//inicializa o 'popup' para mostrar os atalhs
function start_interface() {
  //cria uma div
  element = document.createElement('div');
  element.id = 'dialogpopup'; //define seu id
  document.querySelector('footer').appendChild(element); //coloca como filha do footer (onde está o 'input')

  chrome.runtime.sendMessage({ message: 'get_short' }, (response) => {
    get_data(response);
  });
}

//cria o popup e obtem os atalhos
function get_data(response) {
  if (!response) return;
  short_data = response;
  var div_fi = "<div class='div_pop'><div class='pop_list'>";

  for (i = 0; i < short_data.length; i++) {
    //cria a div
    div_fi += `<div class="resp"><span class="strongResp">${short_data[i].title}</span><div><span class="shortResp">${short_data[i].short}</span></div></div>`;
  }
  div_fi += '</div></div>';

  element.innerHTML += div_fi;
  childrens = document.querySelectorAll('.resp');
  childrens.forEach(function (element, index) {
    element.addEventListener('click', () => {
      sendMessage(index);
    });
  });

  element.animate(
    [
      {
        top: '350px',
      },
      {
        top: '0',
      },
    ],
    {
      iterations: 1,
      easing: 'ease-in-out',
      duration: 100,
    }
  );
}

//compara o que foi escrito pelo usuário com os atalhos e exibe apenas os coincidentes
function compare() {
  let similar;
  for (i = 0; i < short_data.length; i++) {
    similar = true;
    for (y = 0; y < phrase_user.length - 1; y++) {
      if (phrase_user[y + 1] != short_data[i].short[y]) {
        similar = false;
        break;
      }
    }
    if (!similar) childrens[i].style.display = 'none';
    else if (childrens[i].style.display == 'none')
      childrens[i].style.display = '';
  }
}

//verifica se foi adicionado palavras ou iniciado
function listen() {
  if (event.key == prefferences.key && phrase_user == '') {
    position = area_text.textContent.length;
    phrase_user += prefferences.key;
    start_interface();
  } else if (phrase_user != '') {
    if (event.key == 'Enter') {
      delete_elem();
    } else if (event.key.length == 1) {
      phrase_user += event.key;
      compare();
    }
  }
}

//verifica se houve mudanças na posição do caractere
function listen_backspace() {
  if (area_text.textContent[position] != prefferences.key) delete_elem();
  else if (event.key == 'Backspace') {
    phrase_user = phrase_user.slice(0, area_text.textContent.length);
    compare();
  }
}

function clicado() {
  //vai adicionar eventos ao 'input' do WhatsApp Web
  area_text = document.querySelector('footer .selectable-text');
  if (area_text) {
    area_text.addEventListener('keypress', listen);
    area_text.addEventListener('keyup', listen_backspace);

    //Faz uma verificação de se não foi pressionado o botão de enviar mensagem
    setTimeout(function () {
      if (area_text.textContent == 0) {
        delete_elem();
      }
    }, 5);
  }
}

let phrase_user = '';
let element, short_data, area_text, position, childrens, prefferences;
