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
}

//responsável por adicionar o texto ao input
function sendMessageInput(i) {
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

//inicializa o 'popup' para mostrar os atalhos
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
    div_fi += `<div class="resp visible" data="${i}"><span class="strongResp">${short_data[i].title}</span><div><span class="shortResp">${short_data[i].short}</span></div></div>`;
  }
  div_fi += '</div></div>';

  element.innerHTML += div_fi;
  childrens = document.querySelectorAll('.resp');
  childrens.forEach(function (element, index) {
    element.addEventListener('click', () => {
      sendMessageInput(index);
    });
    element.addEventListener('mouseover', () => {
      actual_short = navigate_short(actual_short, index, false);
    });
  });

  actual_short = 0;
  childrens[actual_short].classList.add('focus');

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

    if (!similar) {
      childrens[i].classList.remove('visible');
    } else if (!childrens[i].classList.contains('visible'))
      childrens[i].classList.add('visible');
  }

  //torna os elementos invisiveis ou visiveis caso seja o que o usuário estiver escrevendo
  let visibles = document.querySelector('.resp.visible');
  if (visibles)
    actual_short = navigate_short(
      actual_short,
      parseInt(visibles.getAttribute('data'))
    );
}

//responsável pela navegação usando a seta do teclado
function navigate_short(actual_index, new_index, option) {
  if (new_index >= 0 && new_index < childrens.length) {
    childrens[actual_index].classList.remove('focus');

    if (childrens[new_index].classList.contains('visible'))
      childrens[new_index].classList.add('focus');
    else {
      new_index = parseInt(
        document.querySelector('.resp.visible').getAttribute('data')
      );
      navigate_short(actual_index, new_index, option);
    }

    if (option) childrens[new_index].scrollIntoView(false);
    return new_index;
  }
  return actual_index;
}

//gerencia a navegação do usuário nos atalhos
function listen_navigate_short() {
  if (event.key == 'Enter') {
    if (
      position !== null &&
      childrens[actual_short].classList.contains('visible')
    ) {
      event.preventDefault();

      sendMessageInput(actual_short);
    } else delete_elem();
  } else if (position !== null) {
    if (event.key == 'ArrowUp') {
      event.preventDefault();
      actual_short = navigate_short(actual_short, actual_short - 1, true);
    } else if (event.key == 'ArrowDown') {
      event.preventDefault();
      actual_short = navigate_short(actual_short, actual_short + 1, true);
    }
  }
}

function listen() {
  //verifica se o usuário clicou a tecla do atalho
  if (event.key == prefferences.key) {
    //caso não tenha nenhuma posição no momento, significa que está ativando a extensão
    if (position === null) {
      position = area_text.textContent.length - 1;
      phrase_user = prefferences.key;
      start_interface();
    }
  }
  //verifica as outras possibilidades
  else if (position !== null) {
    if (area_text.textContent[position] != prefferences.key) {
      delete_elem();
      return;
    }

    //copia o que o usuário digitou para fazer a comparação
    phrase_user = area_text.textContent.slice(
      position,
      area_text.textContent.length
    );
    if (event.key != 'ArrowUp' && event.key != 'ArrowDown') compare();
  }
}

function clicado() {
  //vai adicionar eventos ao 'input' do site
  area_text = document.querySelector('footer .selectable-text');
  if (area_text) {
    area_text.addEventListener('keyup', listen);

    //para gerenciar a navegação, é necessário usar keydown para previnir (preventDefault) ação da tecla
    area_text.addEventListener('keydown', listen_navigate_short);

    //Faz uma verificação de se não foi pressionado o botão de enviar mensagem
    setTimeout(function () {
      if (area_text.textContent == 0) {
        delete_elem();
      }
    }, 5);
  }
}

var element,
  short_data,
  area_text,
  phrase_user = '',
  position = null,
  childrens,
  prefferences,
  actual_short;
