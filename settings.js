let short_data, element;

window.onload = () => {
  //obtem as frases
  chrome.runtime.sendMessage({ message: 'get_short' }, (response) => {
    start_interface(response);
  });

  document
    .querySelector('.containerButtonPage button')
    .addEventListener('click', function () {
      create_short();
    });

  prefferences();
};

//responsável por colocar as frases salvas
function start_interface(data) {
  if (!data) return;
  let list = document.querySelector('#list_short');

  short_data = data;
  let childrens = '';

  short_data.forEach((element, index) => {
    childrens += `
        <div class="short">
            <div class="sectionTitle">
                <div class="containerButton left">
                  <button class="delete_short" data="${index}">Excluir</button>
                </div>
                <strong class="title">${element.title}</strong>
                <span>${element.short}</span>

                <div class="containerButton">
                    <button class="edit_short" data="${index}">Editar</button>
                </div>
            </div>
            <div>`;
    element.phrases.forEach((element) => {
      childrens += `
            <div class="phrases">
                <div class="phrase">
                    <span>${element}</span>
                </div>
            </div>`;
    });
    childrens += '</div></div>';
    list.innerHTML = childrens;

    list.querySelectorAll('button.edit_short').forEach((element) => {
      element.addEventListener('click', function () {
        edit_short(element.getAttribute('data'));
      });
    });

    list.querySelectorAll('button.delete_short').forEach((element) => {
      element.addEventListener('click', function () {
        delete_short(element.getAttribute('data'));
      });
    });
  });
}

function prefferences() {
  const elem_keyword = document.querySelector('input#keyword_short');

  elem_keyword.addEventListener('keydown', () => {
    if (event.key.length == 1) {
      event.target.value = event.key;
    }
    if (event.key === 'Enter') {
      console.log(event.target.value);
      chrome.runtime.sendMessage(
        {
          message: 'set_prefferences',
          payload: { key: event.target.value },
        },
        (response) => {
          if (response.message === 'success') {
            alert('Alterado com sucesso');
            location.reload();
          }
        }
      );
    }
  });

  chrome.runtime.sendMessage({ message: 'get_prefferences' }, (response) => {
    elem_keyword.value = response.key;
  });
}

//responsável por apagar o atalho atual
function delete_short(index) {
  if (confirm('Você tem certeza que deseja excluir esse atalho?')) {
    chrome.runtime.sendMessage(
      { message: 'delete_short', index: index },
      (response) => {
        if (response.message === 'success') {
          alert('Excluído com sucesso!');
          location.reload();
        } else alert('Erro ao excluir!');
      }
    );
  }
}

//responsável por salvar a nova frase
function save_data() {
  if (!element.querySelector('form').checkValidity()) return; //verifica se o formulário está preenchido
  let inputs = element.querySelectorAll('input');
  let phrases = document.querySelectorAll('textarea');
  let new_short = {
    title: inputs[0].value,
    short: inputs[1].value,
    phrases: [],
  };
  phrases.forEach((element, index) => {
    new_short.phrases[index] = element.value; //adiciona a frase atual ao novo atalho
    new_short.phrases[index].replaceAll(/\\n/g, '\\n'); //salva as quebras de linhas
  });

  //procura elementos repetidos
  if (short_data)
    for (i = 0; i < short_data.length; i++) {
      if (
        new_short.short.localeCompare(short_data[i].short, 'pt-BR', {
          sensitivity: 'base',
        }) == 0
      ) {
        alert('Não pode existir dois atalhos com o mesmo nome');
        return;
      }
    }

  chrome.runtime.sendMessage(
    { message: 'new_short', payload: new_short },
    (response) => {
      if (response.message === 'success') {
        alert('Inserido com sucesso!');
        location.reload();
      } else alert('Erro ao inserir!');
    }
  );
}

function save_edited_data(index) {
  if (!element.querySelector('form').checkValidity()) return; //verifica se o formulário está preenchido

  let inputs = element.querySelectorAll('input');
  let phrases = document.querySelectorAll('textarea');

  let new_short = {
    title: inputs[0].value,
    short: inputs[1].value,
    phrases: [],
  };
  phrases.forEach((element, index) => {
    new_short.phrases[index] = element.value;
  });

  //procura uma frase igual e verifica se não é a mesma que a posição atual
  for (i = 0; i < short_data.length; i++) {
    if (
      new_short.short.localeCompare(short_data[i].short, 'pt-BR', {
        sensitivity: 'base',
      }) == 0 &&
      i != index
    ) {
      alert('Não pode existir dois atalhos com o mesmo nome');
      return;
    }
  }

  chrome.runtime.sendMessage(
    {
      message: 'edit_short',
      payload: new_short,
      index: index,
    },
    (response) => {
      if (response.message === 'success') alert('Editado com sucesso!');
      else alert('Erro ao editar!');
    }
  );
  location.reload();
}

//responsável por criar o popup de edição/criação
function create_popup(text) {
  element = document.createElement('div');
  element.className = 'containerPopup';

  //detecta se foi clicado fora da janela para fechar
  element.addEventListener('click', () => {
    if (event.target == element) {
      element.remove();
    }
  });
  document.querySelector('.containerbody').appendChild(element);

  //cria as div's necessários
  element.innerHTML = `
  <form class="box popup" actions=""+>
    <div class="sectionTitle">
     
      <h2>${text}</h2>
      <div class="containerButton">
        <button id="save" type="submit">Salvar</button>
      </div>
    </div>
    <div class="short">
    </div>
  </div>
  `;

  return element;
}

//cria as div's com os atalhos
function create_input(element, index, cont) {
  element.querySelector('.phrases_short').innerHTML += `
  <div class="div_input">
      <label for="short">Frase ${index + 1}</label>
      <textarea id="phrase${index}" required>${cont}</textarea>
  </div>`;

  //responsável por salvar os dados
  element
    .querySelector(`textarea#phrase${index}`)
    .addEventListener('change', () => {
      event.target.innerHTML = event.target.value;
    });
}

function edit_short(index) {
  var length_phrases = short_data[index].phrases.length - 1;
  const element = create_popup('Editar');
  element.querySelector('.short').innerHTML = `
  <div class="div_input">
    <label for="name">Nome da resposta</label>
    <input id="name" name="name" minlength="2" maxlength="30" type="text" value="${short_data[index].title}" required/>
  </div>
  <div class="div_input">
    <label for="short">Atalho da resposta</label>
    <input id="short" name="short" minlength="2" maxlength="20" type="text" value="${short_data[index].short}" required/>
  </div>
  <div class="phrases_short">`;

  //add na janela, as falas salvas
  short_data[index].phrases.forEach((phrase, index) => {
    create_input(element, index, phrase);
  });

  element.querySelector('.short').innerHTML +=
    '</div><button class="biggest" id="create_input" type="button">+</button></form>';

  element.querySelector('button#create_input').addEventListener('click', () => {
    length_phrases++;
    create_input(element, length_phrases, '');
  });

  element.querySelector('button#save').addEventListener('click', () => {
    save_edited_data(index);
  });
}

function create_short() {
  let index = 0;
  const element = create_popup('Criar');
  element.querySelector('.short').innerHTML = `
  <div class="div_input">
    <label for="name">Nome da resposta</label>
    <input id="name" name="name" minlength="4" maxlength="20" type="text" required/>
  </div>
  <div class="div_input">
    <label for="short">Atalho da resposta</label>
    <input id="short" name="short" minlength="4" maxlength="20" type="text" required/>
  </div>
  <div class="phrases_short">
    
  </div>
  <button class="biggest" id="create_input" type="button">+</button>

  </form>`;
  create_input(element, index, '');

  element.querySelector('button#create_input').addEventListener('click', () => {
    index++;
    create_input(element, index, '');
  });

  element.querySelector('button#save').addEventListener('click', () => {
    save_data();
  });
}
