const languages = document.getElementById('languages');
const itens = document.getElementById('itens');
const form = document.getElementById('form');

const montaTexto = (tipo, texto) => {
    const elemento = document.createElement(tipo);
    elemento.innerText = texto;
    return elemento;
  };

var postData = async (evento) => {
    try {
        const dados = {
            title: evento.target.title.value,
            skill: evento.target.skill.value,
            category: evento.target.category.value,
            description: evento.target.description.value,
            video: video ? evento.target.video.value : ""
          };

        const result = await fetch('http://localhost:3000/dicas', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        console.log('postdata', result.json());
        evento = '';
    } catch (error) {
        console.error(error);
    }
}

async function getData() {
    try {
        const retorno = await fetch('http://localhost:3000/dicas');
        const retornoJson = await retorno.json();
        var total = retornoJson.length;
        //CRIAR DIV DE TITULO, ETC
    } catch (error) {
        console.error(error);
    }
}
  
async function getSkillsQuantity() {
    try {
        const retorno = await fetch('http://localhost:3000/dicas');
        const retornoJson = await retorno.json();
        
        //Montando arrays com as categorias
        const total = retornoJson.length;
        const backend = retornoJson.filter(retorno => retorno.category == 'BackEnd');
        const frontend = retornoJson.filter(retorno => retorno.category == 'FrontEnd');
        const fullstack = retornoJson.filter(retorno => retorno.category == 'FullStack');
        const softskill = retornoJson.filter(retorno => retorno.category == 'SoftSkill');
        
        languages.innerHTML = '';
        itens.innerHTML = '';

        //Criação dos botões com as quantidades por linguagem
        const btnTotal = document.createElement('button');
        btnTotal.innerHTML += `Total: ${total}`;  
        const btnBackend = document.createElement('button');
        btnBackend.innerHTML += `BackEnd: ${backend.length}`;  
        const btnFrontend = document.createElement('button');
        btnFrontend.innerHTML += `FrontEnd: ${frontend.length}`; 
        const btnFullstack = document.createElement('button');
        btnFullstack.innerHTML += `FullStack: ${fullstack.length}`; 
        const btnSoftskill = document.createElement('button');
        btnSoftskill.innerHTML += `SoftSkill: ${softskill.length}`; 

        languages.appendChild(btnTotal);
        languages.appendChild(btnBackend);        
        languages.appendChild(btnFrontend);        
        languages.appendChild(btnFullstack);        
        languages.appendChild(btnSoftskill);

        //FAZER UM FILTER PRA PEGAR A QUANTIDADE DE CADA LINGUAGEM

        retornoJson.forEach((retorno) => {
            const divItem = document.createElement('div');
            const divItemActions = document.createElement('div');
            const linkButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            const editButton = document.createElement('button');
            const title = montaTexto('p', `${retorno.title}`);

            divItem.classList.add('item');
            divItemActions.classList.add('item-actions');
            linkButton.classList.add('link');
            deleteButton.classList.add('delete');

            //Adicionando ícones aos botões
            if (retorno.video !== '') {
                linkButton.innerHTML += `<a href="${retorno.video}" target="_blank"><i class="fa-solid fa-link"></i></a>`;                
                divItemActions.appendChild(linkButton);
            };
            deleteButton.innerHTML += '<i class="fa-solid fa-trash"></i>';
            editButton.innerHTML += '<i class="fa-solid fa-pen-to-square"></i>';

            divItemActions.appendChild(deleteButton);
            divItemActions.appendChild(editButton);
            divItem.appendChild(title);
            divItem.innerHTML += `<b> Linguagem/Skill: </b> ${retorno.skill}`;       
            divItem.innerHTML += `<br><b> Categoria: </b> ${retorno.category}<br><br>`;
            divItem.innerHTML += `${retorno.description}`;
            divItem.appendChild(divItemActions);
            itens.appendChild(divItem);
            //const foto = document.createElement('img');
            //foto.src = user.picture.large;
    //
            //divDados.appendChild(nome);
            //divDados.appendChild(email);
            //divDados.appendChild(endereco);     
            //divContainer.appendChild(foto);
            //lista.appendChild(button);
        });
    } catch (error) {
      console.error(error);
    }
  }
  
getSkillsQuantity();

form.addEventListener('submit', postData);