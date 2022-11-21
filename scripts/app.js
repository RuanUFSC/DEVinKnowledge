const languages = document.getElementById('languages');
const itens = document.getElementById('itens');
const formCadastro = document.getElementById('formCadastro');
const formEdicao = document.getElementById('form-edicao');
const formConsulta = document.getElementById('form-consulta');
const deleteButton = document.getElementsByClassName('delete');
const btnTotal = document.getElementById('btn-total');
const btnBackend = document.getElementById('btn-backend');
const btnFrontend = document.getElementById('btn-frontend');
const btnFullstack = document.getElementById('btn-fulltstack');
const btnSoftskill = document.getElementById('btn-softskill');
const modal = document.querySelector('.modal');

async function getData() {
    try {
        const retorno = await fetch('http://localhost:3000/dicas');
        const retornoJson = await retorno.json();
        
        await quantityButtons(retornoJson);
        await itensHtml(retornoJson);

    } catch (error) {
      console.error(error);
    }
}

async function quantityButtons(dados) {
    try {  
        //Montando arrays com as categorias
        const total = dados.length;
        const backend = dados.filter(retorno => retorno.category == 'BackEnd');
        const frontend = dados.filter(retorno => retorno.category == 'FrontEnd');
        const fullstack = dados.filter(retorno => retorno.category == 'FullStack');
        const softskill = dados.filter(retorno => retorno.category == 'SoftSkill');
        
        //Adicionando quantidades por linguagem
        btnTotal.innerHTML += `Total: ${total}`;
        btnBackend.innerHTML += `BackEnd: ${backend.length}`;  
        btnFrontend.innerHTML += `FrontEnd: ${frontend.length}`; 
        btnFullstack.innerHTML += `FullStack: ${fullstack.length}`; 
        btnSoftskill.innerHTML += `SoftSkill: ${softskill.length}`; 
        
    } catch (error) {
        console.error(error);
    }
}

async function filterData(evento) {
    try {        
        evento.preventDefault();
        const retorno = await fetch('http://localhost:3000/dicas');
        const retornoJson = await retorno.json();
        
        const dadosFiltrados = retornoJson.filter(retorno => retorno.title.toLowerCase().includes(evento.target.titleSearch.value.toLowerCase()) || retorno.description.toLowerCase().includes(evento.target.titleSearch.value.toLowerCase()));
        console.log('dadosfiltrados', dadosFiltrados)
        await itensHtml(dadosFiltrados);

    } catch (error) {
        console.log(error);
    }
}

async function itensHtml(dados) {
    try {
        //Limpando a div        
        itens.innerHTML = '';

        //Criação das divs com os dados e botões
        dados.forEach((retorno) => {
            const divItem = document.createElement('div');
            const divItemActions = document.createElement('div');
            const linkButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            const editButton = document.createElement('button');

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

            //Montando estrutura html da div  
            divItemActions.appendChild(deleteButton);
            divItemActions.appendChild(editButton);
            divItem.innerHTML += `<p> ${retorno.title} </p>`
            divItem.innerHTML += `<b> Linguagem/Skill: </b> ${retorno.skill}`;       
            divItem.innerHTML += `<br><b> Categoria: </b> ${retorno.category}<br><br>`;
            divItem.innerHTML += `${retorno.description}`;
            divItem.appendChild(divItemActions);
            itens.appendChild(divItem);

            deleteButton.addEventListener('click', () => deleteItem(retorno.id))
            editButton.addEventListener('click', () => editItem(retorno.id, retorno))
        });
    } catch (error) {
        console.error(error);
    }
}

var postData = async (evento) => {
    try {
        evento.preventDefault();
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
    } catch (error) {
        console.error(error);
        postData(evento);
    }
}


var patchData = async (evento, id) => {
    try {
        evento.preventDefault();
        const editDados = {
            title: evento.target.titleEdit.value,
            skill: evento.target.skillEdit.value,
            category: evento.target.categoryEdit.value,
            description: evento.target.descriptionEdit.value,
            video: video ? evento.target.videoEdit.value : ""
          };

        const edita = await fetch(`http://localhost:3000/dicas/${id}`, {
            method: 'PATCH',            
            body: JSON.stringify(editDados),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteItem(id){
    try {
        if(window.confirm('Deseja realmente excluir essa dica?')) {
            const deleta = await fetch(`http://localhost:3000/dicas/${id}`, {
                method: 'DELETE'
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function modalEvent() {
    const style = modal.style.display;
            if (style == 'block') {
                modal.style.display = 'none';
            } else {
                modal.style.display = 'block';
            }
}

async function editItem(id, data){
    try {
        modalEvent();
        const titleEdit = document.getElementById('titleEdit');
        const skillEdit = document.getElementById('skillEdit');
        const categoryEdit = document.getElementById('categoryEdit');
        const descriptionEdit = document.getElementById('descriptionEdit');
        const videoEdit = document.getElementById('videoEdit');

        titleEdit.value = data.title;
        skillEdit.value = data.skill;
        categoryEdit.value = data.category;;
        descriptionEdit.value = data.description;;
        videoEdit.value = data.video;
        
        formEdicao.addEventListener('submit', () => patchData(event, id));
    } catch (error) {
        console.error(error);
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modalEvent();
    }
}

getData();
formCadastro.addEventListener('submit', postData);
formConsulta.addEventListener('submit', () => filterData(event));