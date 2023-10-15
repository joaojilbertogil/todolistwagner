let banco = [];

const getBanco = () => JSON.parse(localStorage.getItem('todoList')) ?? [];

const setBanco = (banco) => localStorage.setItem('todoList', JSON.stringify(banco));

const inputItem = (tarefa, status, cor, indice) => {
    const item = document.createElement('div');
    item.classList.add('todo_item');

    item.innerHTML = `
        <input type="checkbox" ${status} data-indice=${indice}></input>
        <div style="background-color: ${cor}">${tarefa}</div>
        <button class="edit-button">✏️</button>
        <input type="color" class="color-picker" value="${cor}">
        <button class="delete-button" data-indice=${indice}></button>
        <button class="clear-color" data-indice=${indice}>Limpar Cor</button>
    `;

    const div = item.querySelector('div');
    const checkbox = item.querySelector('input[type="checkbox"]');

    if (status === 'checked') {
        div.style.textDecoration = 'line-through';
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            div.style.textDecoration = 'line-through';
        } else {
            div.style.textDecoration = 'none';
        }
        atualizaItem(indice, checkbox.checked ? 'checked' : '');
        atualizaContadores();
    });

    document.getElementById('todoList').appendChild(item);

    const deleteButton = item.querySelector('.delete-button');
    const editButton = item.querySelector('.edit-button');
    const clearButton = item.querySelector('.clear-color');
    const colorPicker = item.querySelector('.color-picker');

    deleteButton.addEventListener('click', () => {
        removeItem(indice);
        atualizaContadores();
    });

    editButton.addEventListener('click', () => {
        div.contentEditable = true;
        div.focus();
        const textLength = div.innerText.length;
        div.setSelectionRange(textLength, textLength);
    });

    clearButton.addEventListener('click', () => {
        cor = '';
        div.style.backgroundColor = cor;
        colorPicker.value = cor;
    });

    colorPicker.addEventListener('change', () => {
        cor = colorPicker.value;
        div.style.backgroundColor = cor;
    });

    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            div.contentEditable = false;
        }
    });
}

const atualizaView = () => {
    limpaTela();
    const banco = getBanco();
    banco.forEach((item, indice) => inputItem(item.tarefa, item.status, item.cor, indice));
    atualizaContadores();
}

const limpaTela = () => {
    const lista = document.getElementById('todoList');
    while (lista.firstChild) {
        lista.removeChild(lista.lastChild);
    }
}

const insereItem = (event) => {
    const tecla = event.key;
    const value = event.target.value;
    let cor = '';

    if (tecla === 'Enter' && value.trim() !== '') {
        const banco = getBanco();
        banco.push({ 'tarefa': value, 'status': '', 'cor': cor });
        setBanco(banco);
        atualizaView();
        event.target.value = '';
        atualizaContadores();
    }
}

const removeItem = (indice) => {
    const banco = getBanco();
    banco.splice(indice, 1);
    setBanco(banco);
    atualizaView();
}

const atualizaItem = (indice, status) => {
    const banco = getBanco();
    banco[indice].status = status;
    setBanco(banco);
}

const atualizaContadores = () => {
    const banco = getBanco();
    const totalTasks = banco.length;
    const completedTasks = banco.filter((item) => item.status === 'checked').length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

const init = () => {
    atualizaView();
    atualizaContadores();
    document.getElementById('newItem').addEventListener('keydown', insereItem);

    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

init();
