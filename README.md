# Quick Answers (Extensão)

## Propósito

Este projeto foi criado com a idéia de criar uma extensão que permitiria o usuário criar atalhos que pudessem invocar alguma resposta aleatória no WhatsApp Web, onde essas respostas seriam criadas pelo próprio usuário.

## Como executar a extensão?

1. Abra a pasta e execute o comando para baixar as dependências:
   `yarn`
2. Compile o projeto usando:
   `yarn build`
3. Com isso, será criada a pasta `build` com o projeto compilado para executar no Google Chrome.
4. Ative o modo de desenvolvimento na página de extensões no Google Chrome, usando o link `chrome://extensions` ou clicando no menu do Chrome, passando o mouse sobre Mais ferramentas e selecionando Extensões
5. Carregue sem compactação a pasta onde está com os códigos compilados(`SUA_PASTA/build`)

## Como configurar?

Para usar esta extensão, deve-se criar as respostas com seu atalho na seção de configurações da extensão, onde para acessar as configurações, deve-se ir em Gerenciar Extensões do Google Chrome, clicar no botão “Saiba mais” e na parte inferior da página deve-se clicar no botão “Opções da extensão”.
Na página de configurações da extensão, pode-se clicar no botão inferior ao lado direito para criar uma resposta, onde é necessário colocar o nome da resposta, seu atalho e as possíveis frases a serem invocadas, no qual, a resposta será selecionada aleatoriamente após invocar seu atalho, ou configurar a tecla de invocação dos atalhos.

## Como ajudar o projeto?

1. Faça a cópia o [Fork](https://help.github.com/articles/fork-a-repo/) para o seu próprio GitHub e [copie/clone](https://help.github.com/articles/cloning-a-repository/) para o seu dispositivo local.
2. Cria a sua própria 'branch': `git checkout -b NOME_ESCOLHIDO`
3. Faça as alterações no código desejada
4. Assim, que todo seu código estiver pronto e testado, crie um [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Possíveis melhorias

- Otimizações do código
- Melhoria da interface
- Tornar mais intuitivo
- Tornar mais semântico o código
- Permitir o uso dos atalhos em mais sites.
