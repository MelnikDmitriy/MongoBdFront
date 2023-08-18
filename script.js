
const render = () => {
  const content = document.getElementById('container');

  while (content.hasChildNodes()) {
    content.removeChild(content.firstChild);
  }

  allTasks.sort((a, b) => {
    return a.isChecked > b.isChecked ? 1 : a.isChecked === b.isChecked ? 0 : -1;
  });

  allTasks.forEach((task, index) => {
    const { title, isChecked, isEdit } = task;
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'todo__list';

    const containerTasks = document.createElement('div');
    containerTasks.className = 'todo__task';
    container.appendChild(containerTasks);

    const containerCheckbox = document.createElement('div');
    containerCheckbox.className = 'todo__checkbox';
    containerTasks.appendChild(containerCheckbox);

    if (!isChecked) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      containerCheckbox.appendChild(checkbox);
      checkbox.addEventListener('click', () => changeCheckboxValue(index));
    } else {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      containerCheckbox.appendChild(checkbox);
      checkbox.addEventListener('click', () => changeCheckboxValue(index));
    }

    const actions = document.createElement('div');
    actions.className = 'todo__actions';
    container.appendChild(actions);

    if (!isEdit) {
      const titleElement = document.createElement('p');
      titleElement.className = 'todo__input-task';
      titleElement.innerText = title;
      containerCheckbox.appendChild(titleElement);

      const buttonEdit = document.createElement('button');
      buttonEdit.className = 'todo__edit';
      buttonEdit.innerText = 'edit';
      buttonEdit.addEventListener('click', () => editTask(index));
      actions.appendChild(buttonEdit);

      const buttonDelete = document.createElement('button');
      buttonDelete.className = 'todo__delete';
      buttonDelete.innerText = 'delete';
      buttonDelete.addEventListener('click', () => deleteTask(index));
      actions.appendChild(buttonDelete);
    } else {
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'todo__input-task';
      titleInput.value = title;
      containerCheckbox.appendChild(titleInput);

      const buttonBack = document.createElement('button');
      buttonBack.className = 'todo__edit';
      buttonBack.innerText = 'return';
      buttonBack.addEventListener('click', () =>
        returnPastValue(index)
      );
      actions.appendChild(buttonBack);

      const buttonEdit = document.createElement('button');
      buttonEdit.className = 'todo__edit';
      buttonEdit.innerText = 'save';
      buttonEdit.addEventListener('click', () =>
        saveTask(index, titleInput.value)
      );
      actions.appendChild(buttonEdit);

      const buttonDelete = document.createElement('button');
      buttonDelete.className = 'todo__delete';
      buttonDelete.innerText = 'delete';
      buttonDelete.addEventListener('click', () => deleteTask(index));
      actions.appendChild(buttonDelete);
    }

    content.appendChild(container);
  });
};

const getAllTask = async () => {
  let response = await fetch('http://localhost:3000/tasks', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
    },
    })
    .then(response => response.json())
    .then(data => {
      allTasks = data
      render()
    });
}

window.onload = () => {
  const input = document.getElementById('inputTodo');
  const buttonAdd = document.getElementById('submitAdd');

  buttonAdd.addEventListener('click', () => {
    addTask(input);
  });
};

const addTask = async (input) => {
  const newTask = {
    title: input.value,
    isChecked: false,
  };
  input.value = '';
  let response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newTask)
    });
  getAllTask()
  render();
};

const deleteTask = async (index) => {
  let response = await fetch(`http://localhost:3000/tasks/${allTasks[index]._id}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
    },
    });
  getAllTask()
  render()    
};

const editTask = async (index) => {
  allTasks[index].isEdit = true;
  render();
};

const saveTask = async (index, editText) => {
  allTasks[index].isEdit = false;
  const newTask = {
    title: editText,
    isChecked: false
  };
  let response = await fetch(`http://localhost:3000/tasks/${allTasks[index]._id}`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newTask)
    });
  getAllTask()
  render();
};

const returnPastValue = (index) => {
  allTasks[index].isEdit = false
  getAllTask()
  render();
};

const changeCheckboxValue = async (index) => {
  const newTask = {
    isChecked: !allTasks[index].isChecked
  };
  let response = await fetch(`http://localhost:3000/tasks/change-chackbox/${allTasks[index]._id}`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newTask)
    });
  getAllTask()
  render();
};

getAllTask()




