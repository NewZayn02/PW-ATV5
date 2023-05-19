import './style.css';

const lista = document.getElementById('lista');
const inputDescricao = document.getElementById('inputDescricao');
const btAdd = document.getElementById('btAdd');

const taskUrl = 'https://parseapi.back4app.com/classes/Task';
const headers = {
  'X-Parse-Application-Id': 'RkjwBkfNZRERi3k4FVjojkTgLLe6CbbTPbW4qrQo',
  'X-Parse-REST-API-Key': 'wmn69SVNaLq6UoW177InOj1tnXUsy2fkfvtHagdu',
};

const renderizaLista = (lista, tarefas) => {
  lista.innerHTML = '';
  tarefas.forEach((tarefa) => {
    const itemText = document.createTextNode(`${tarefa.description} `);
    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = 'DELETE';
    buttonDelete.onclick = () => deleteTask(tarefa.objectId);
    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.checked = tarefa.done;
    inputCheckbox.addEventListener('change', () => updateTask(tarefa));
    const listItem = document.createElement('ul');
    listItem.appendChild(inputCheckbox);
    listItem.appendChild(itemText);
    listItem.appendChild(buttonDelete);
    lista.appendChild(listItem);
    
  });
};

const getTasks = () => {
  fetch(taskUrl, { headers: headers })
    .then((res) => res.json())
    .then((data) => {
      const checkboxes = Array.from(lista.getElementsByTagName('input'));
      const checkboxStates = checkboxes.map((checkbox) => checkbox.checked);

      renderizaLista(lista, data.results);

      checkboxes.forEach((checkbox, index) => {
        checkbox.checked = checkboxStates[index];
      });
    });
};

const handleBtAddClick = () => {
  const description = inputDescricao.value;
  if (!description) {
    alert('É necessário digitar uma descrição!');
    return;
  }
  btAdd.disabled = true;
  fetch(taskUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: description }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      btAdd.disabled = false;
      inputDescricao.value = '';
      inputDescricao.focus();
      console.log('data', data);
    })
    .catch((err) => {
      btAdd.disabled = false;
      console.log(err);
    });
};

const updateTask = (id, done) => {
  fetch(`${taskUrl}/${id}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ done: done }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log('data', data);
    })
    .catch((err) => {
      console.log(err);
    });
};

getTasks();

const deleteTask = (id) => {
  const deleteUrl = `${taskUrl}/${id}`;

  fetch(deleteUrl, {
    method: 'DELETE',
    headers: headers,
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log('data', data);
    })
    .catch((err) => {
      console.log(err);
    });
};

btAdd.onclick = handleBtAddClick;
