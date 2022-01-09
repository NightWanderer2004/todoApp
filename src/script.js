const todoInput = document.querySelector('.todoInput');
const todoButton = document.querySelector('.todoButton');
const todoList = document.querySelector('.todoList');
const todoSelect = document.querySelector('.todoSelect');
const swCheckbox = document.querySelector('.swCheckbox');

let todoArr;
if (localStorage.todoArr) todoArr = JSON.parse(localStorage.getItem('todoArr'));
else todoArr = [];
todoArr.length > 0 && renderTodoList();

function Todo(text) {
   this.text = text;
   this.completed = false;
}

//Theme switchers
if (localStorage.darkTheme === 'true') document.querySelector('body').classList.add('dark');
else swCheckbox.checked = false;

swCheckbox.addEventListener('click', () => {
   document.querySelector('body').classList.toggle('dark');
   updateLocal();
});

//Add todo
todoButton.addEventListener('click', event => {
   event.preventDefault();
   if (todoInput.value.trim() != '') {
      todoArr.push(new Todo(todoInput.value));
      updateLocal();
      renderTodoList();
   }
});
//Storage
function updateLocal() {
   localStorage.setItem('todoArr', JSON.stringify(todoArr));
   localStorage.setItem('darkTheme', swCheckbox.checked);
}
//Render
function renderTodoList() {
   todoList.innerHTML = '';
   todoInput.value = '';
   todoSelect.value = document.querySelector('option').value;

   todoArr.forEach((el, i) => {
      const todoItem = document.createElement('li');
      todoItem.className = 'todo';
      todoItem.setAttribute('data-index', i);
      el.completed && todoItem.classList.add('completed');

      const todoText = document.createElement('span');
      todoText.className = 'todoText';
      todoText.innerText = el.text;
      todoItem.appendChild(todoText);

      todoItem.innerHTML += `<div class='buttons ${el.text.length > 35 ? 'vertical' : ''} ${
         el.text.length > 20 ? 'mobile' : ''
      }'>
      <button class='checkButton'><i class="far fa-check-square"></i></button>
      <button class='deleteButton'><i class="far fa-minus-square"></i></button>
      </div>`;

      todoList.appendChild(todoItem);
   });
}
//Check - delete
todoList.addEventListener('click', event => {
   let todoItem;
   if (event.target.className === 'deleteButton') {
      todoItem = event.target.parentElement.parentElement;
      todoItem.classList.add('deleting');
      todoItem.addEventListener('transitionend', event => {
         if (event.propertyName == 'transform') {
            todoItem.remove();
            todoArr.splice(todoItem.dataset.index, 1);
         }
         updateLocal();
      });
   } else if (event.target.className === 'checkButton') {
      todoItem = event.target.parentElement.parentElement;
      todoItem.classList.toggle('completed');

      todoArr[todoItem.dataset.index].completed = !todoArr[todoItem.dataset.index].completed;
      updateLocal();
   }
});
//Filter
todoSelect.addEventListener('change', event => {
   const todos = todoList.querySelectorAll('.todo');
   todos.forEach(el => {
      switch (event.target.value) {
         case 'all':
            el.style.display = 'flex';
            break;
         case 'completed':
            if (el.classList.contains('completed')) el.style.display = 'flex';
            else el.style.display = 'none';
            break;
         case 'uncompleted':
            if (!el.classList.contains('completed')) el.style.display = 'flex';
            else el.style.display = 'none';
            break;
      }
   });
});
