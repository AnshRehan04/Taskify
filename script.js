document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.querySelector('.add');
    addTaskButton.addEventListener('click', addTask);

    const taskInput = document.getElementById('new');
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('hideOnAdd').style.display = 'none';
            document.getElementById('hideEmpty').style.display = 'block';
            addTask();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from local storage
    loadTasks();

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskName => {
            const taskContainer = document.getElementById('d1-1');
            const newTaskElement = createTaskElement(taskName);
            taskContainer.appendChild(newTaskElement);
        });

        // Show the "No Tasks Here!" image if there are no tasks
        if (!tasks.length) {
            document.getElementById('notask').style.display = 'block';
        }
    }

    // Function to create task element
    function createTaskElement(taskName) {
        const newTaskElement = document.createElement('div');
        newTaskElement.classList.add('task-element');
        newTaskElement.innerHTML = `
            <i class="far fa-circle"></i>
            <p>${taskName}</p>
            <i class="fas fa-trash delete-task-icon"></i>
        `;

        // Add event listener to the delete icon
        const deleteIcon = newTaskElement.querySelector('.delete-task-icon');
        deleteIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent triggering selectTask
            newTaskElement.remove();

            // Show the "No Tasks Here!" image if there are no more tasks
            if (!document.querySelector('.task-element')) {
                document.getElementById('notask').style.display = 'block';
            }

            // Remove task from local storage
            removeTaskFromLocalStorage(taskName);
        });

        return newTaskElement;
    }

    // Function to add task to local storage
    function addTaskToLocalStorage(taskName) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(taskName);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to remove task from local storage
    function removeTaskFromLocalStorage(taskName) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task !== taskName);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

});

    const addNewListButton = document.querySelector('.new h1');
    addNewListButton.addEventListener('click', showAddListPopup);

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', searchTasks);

    const dateInput = document.getElementById('date');
    dateInput.addEventListener('change', updateDueDate);

    const menuButton = document.getElementById('hint');
    menuButton.addEventListener('click', toggleMenu);

    const deleteListButton = document.querySelector('#menu div:last-child');
    deleteListButton.addEventListener('click', showDeleteListPopup);

    const taskContainer = document.getElementById('d1-1');
    taskContainer.addEventListener('click', function(event) {
        const taskElement = event.target.closest('.task-element');
        if (taskElement && !event.target.classList.contains('delete-task-icon')) {
            selectTask(taskElement);
        }
    });

    const saveButton = document.getElementById('done');
    saveButton.addEventListener('click', save_change);

    const submitNewListButton = document.getElementById('submitNewList');
    submitNewListButton.addEventListener('click', addNewList);

    const cancelNewListButton = document.getElementById('cancelNewList');
    cancelNewListButton.addEventListener('click', hideAddListPopup);

    const confirmDeleteListButton = document.getElementById('confirmDeleteList');
    confirmDeleteListButton.addEventListener('click', deleteList);

    const cancelDeleteListButton = document.getElementById('cancelDeleteList');
    cancelDeleteListButton.addEventListener('click', hideDeleteListPopup);

    // Add event listener for voice recognition
    const voiceIcon = document.getElementById('voice-icon');
    voiceIcon.addEventListener('click', startVoiceRecognitionForTask);

    const voiceSearchIcon = document.getElementById('voice-search-icon');
    voiceSearchIcon.addEventListener('click', startVoiceRecognitionForSearch);

    // document.getElementById('date').disabled = true;
    // document.getElementById('note').disabled = true;
    // Add event listener for task delete button
    // const deleteTaskButton = document.getElementById('canc');
    // deleteTaskButton.addEventListener('click', delete_change);
});

let selectedTaskElement = null;

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function addTask() {
    const taskInput = document.getElementById('new');
    const taskName = taskInput.value.trim();
    document.getElementById('hideOnAdd').style.display = 'none';
    document.getElementById('hideEmpty').style.display = 'block';
    const taskTextArea = document.getElementById('task');
    const notes = document.getElementById('note');
    taskTextArea.value = "";
    notes.value = "";

    if (taskName === '') return;

    const taskContainer = document.getElementById('d1-1');
    const newTaskElement = document.createElement('div');
    newTaskElement.classList.add('task-element');
    newTaskElement.innerHTML = `
        <button class="check-mark" onclick="toggleCheck()">
        <i class="far fa-circle" style="font-size:20px;" id="not-done"></i>
        <i class="fa-regular fa-circle-check" style="color: #BA71ED; font-size:20px; display: none;" id="done"></i>
        </button>
        <div>
        <p class="taskName">${taskName}</p>
        <p id="duedate"><input id="duedate" type="date" disabled></p>
        <div class="taskNotes"></div>
        </div>
        <i class="fas fa-trash delete-task-icon"></i>
    `;

    taskContainer.appendChild(newTaskElement);
    taskInput.value = '';

    // Add event listener to the delete icon
    const deleteIcon = newTaskElement.querySelector('.delete-task-icon');
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering selectTask
        newTaskElement.remove();
        
        // Show the "No Tasks Here!" image if there are no more tasks
        if (!document.querySelector('.task-element')) {
            document.getElementById('hideOnAdd').style.display = 'block';
            document.getElementById('hideEmpty').style.display = 'none';
            document.getElementById('notask').style.display = 'block';
        }
    });

    // Hide the "No Tasks Here!" image since we just added a task
    document.getElementById('notask').style.display = 'none';
}

function toggleCheck() {
    const taskTextArea = document.getElementById('task');
    const notesTextArea = document.getElementById('note');
    const dateInput = document.getElementById('date'); // Add this line to get the date input
    const taskNameElement = selectedTaskElement.querySelector('.taskName');
    const taskNotes = selectedTaskElement.querySelector('.taskNotes');

    if (taskNameElement.classList.contains('completed')) {
        taskNameElement.innerHTML = taskTextArea.value;
        taskNameElement.classList.remove('completed');
        taskTextArea.disabled = false;
        notesTextArea.disabled = false;
        dateInput.disabled = false; // Enable the date input
        document.getElementById('done').style.display = 'none';
        document.getElementById('not-done').style.display = 'flex';
    } else {
        taskNameElement.innerHTML = `<strike style=" text-decoration-color: gray; text-decoration-thickness: 3px;">${taskTextArea.value}</strike>`;
        taskNameElement.classList.add('completed');
        taskTextArea.disabled = true;
        notesTextArea.disabled = true;
        dateInput.disabled = true; // Disable the date input
        document.getElementById('done').style.display = 'flex';
        document.getElementById('not-done').style.display = 'none';
    }
}


function selectTask(taskElement) {
    if (selectedTaskElement) {
        selectedTaskElement.classList.remove('selected');
    }
    selectedTaskElement = taskElement;
    selectedTaskElement.classList.add('selected');

    const taskText = selectedTaskElement.querySelector('p').innerText;
    const taskTextArea = document.getElementById('task');
    taskTextArea.value = taskText;
}

function save_change() {
    if (selectedTaskElement) {
        const taskTextArea = document.getElementById('task');
        const date = document.getElementById('date');
        const notes = document.getElementById('note');

        selectedTaskElement.querySelector('.taskName').innerText = taskTextArea.value;
        console.log("This is date value -> ", date.value);

        const dueDateInput = selectedTaskElement.querySelector('#duedate');
        dueDateInput.innerHTML = ' <i class="far fa-calendar-alt rt-icn"></i>' +date.value+'<dot class="dot"> • </dot>';

        const taskNotes = selectedTaskElement.querySelector('.taskNotes');
        taskNotes.innerHTML = '<i class="far fa-sticky-note rt-icn"></i> ' + notes.value;
    }
}

function delete_change() {
    if (selectedTaskElement) {
        selectedTaskElement.remove(); // Remove the selected task element
        selectedTaskElement = null; // Reset selected task

        // Clear the task textarea
        document.getElementById('task').value = '';

        // Show the "No Tasks Here!" image if there are no more tasks
        if (!document.querySelector('.task-element')) {
            document.getElementById('notask').style.display = 'block';
        }
    }
}

function startVoiceRecognitionForTask() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Google Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognition result:', transcript);

        const taskInput = document.getElementById('new');
        taskInput.value = transcript;
    };

    recognition.start();
}

function startVoiceRecognitionForSearch() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Google Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognition result:', transcript);

        const searchInput = document.getElementById('search');
        searchInput.value = transcript;
        searchTasks();
    };

    recognition.start();
}

function updateDueDate() {
    const dateInput = document.getElementById('date');
    const dateLabel = document.querySelector('.due-date-label');
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to only compare dates

    if (selectedDate < today) {
        alert('Please enter a valid date.');
        dateInput.value = ''; // Clear the invalid date
        dateLabel.textContent = 'Add Due Date'; // Reset the label
    } else if (!isNaN(selectedDate)) {
        dateLabel.textContent = selectedDate.toDateString();
    } else {
        dateLabel.textContent = 'Add Due Date';
    }
}
function showAddListPopup() {
    const addListPopup = document.getElementById('addListPopup');
    addListPopup.style.display = 'block';
}

function hideAddListPopup() {
    const addListPopup = document.getElementById('addListPopup');
    addListPopup.style.display = 'none';
}
function addNewList() {
    const newListName = document.getElementById('new_list').value.trim();
    if (newListName !== '') {
        const list = { name: newListName, tasks: [] };
        addListToDOM(list);
        document.getElementById('new_list').value = ''; // Clear input
        hideAddListPopup(); // Hide popup
    }
}

function addListToDOM(list) {
    if (list.name) {
        const listElement = document.createElement('div');
        listElement.classList.add('list-item');
        listElement.innerHTML = `<i class="fas fa-tasks"></i><p>${list.name}</p>`;
        listElement.addEventListener('click', function() {
            switchList(list.name);
        });
        document.getElementById('list-items').appendChild(listElement);
    }
}

function switchList(listName) {
    document.getElementById('curlisname').textContent = listName;
    document.getElementById('up_list').textContent = listName;
    document.getElementById('d1-1').innerHTML = '';
}
// function showDeleteListPopup() {
//     const deleteListPopup = document.getElementById('deleteListPopup');
//     deleteListPopup.style.display = 'block';
// }

function showDeleteListPopup() {
    document.getElementById('deleteListPopup').style.display = 'flex';
}
function hideDeleteListPopup() {
    const deleteListPopup = document.getElementById('deleteListPopup');
    deleteListPopup.style.display = 'none';
}

// function deleteList() {
//     // Implement list deletion functionality here
//     hideDeleteListPopup();
// }

function addTaskToDOM(task) {
    const taskContainer = document.getElementById('d1-1');
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-element');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        toggleTaskCompletion(taskElement, task);
    });
    taskElement.appendChild(checkbox);

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskElement.appendChild(taskText);

    taskContainer.insertBefore(taskElement, taskContainer.firstChild);
}

function toggleTaskCompletion(taskElement, task) {
    if (taskElement.querySelector('input').checked) {
        task.completed = true;
        taskElement.querySelector('span').style.textDecoration = 'line-through';
        // moveToCompletedSection(taskElement);
    } else {
        task.completed = false;
        taskElement.querySelector('span').style.textDecoration = 'none';
        // moveToIncompleteSection(taskElement);
    }
}
function moveToCompletedSection(taskElement) {
    const completedSection = document.getElementById('d1-2');
    completedSection.appendChild(taskElement);
}

function moveToIncompleteSection(taskElement) {
    const taskContainer = document.getElementById('d1-1');
    taskContainer.insertBefore(taskElement, taskContainer.firstChild);
}
function deleteList() {
    const listName = document.getElementById('curlisname').textContent;
    const listItems = document.getElementById('list-items');
    const listElements = listItems.querySelectorAll('.list-item p');
    listElements.forEach(item => {
        if (item.textContent === listName) {
            item.parentElement.remove();
        }
    });
    switchList(''); // Switch to a default or blank list
    document.getElementById('d1-1').innerHTML = ''; // Clear tasks
    hideDeleteListPopup(); // Hide popup
    toggleMenu(); // Hide the menu
}

function searchTasks() {
    const searchInput = document.getElementById('search');
    const filter = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll('#d1-1 .task-element');

    tasks.forEach(task => {
        const text = task.querySelector('p').innerText.toLowerCase();
        if (text.includes(filter)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function clearSearchInput() {
    const searchInput = document.getElementById('search');
    searchInput.value = '';
    searchTasks();
}

const username = localStorage.getItem('username');
const email = localStorage.getItem('email');
const profilePic = localStorage.getItem('profilePic');

if (username && email && profilePic) {
  document.getElementById('j_name').textContent = username;
  document.getElementById('j_usn').textContent = email;
  document.getElementById('circle-txt').src = profilePic;
} else {
  // If no username, email, or profile picture is found, redirect to login page
  window.location.href = "/index.html";
}

function darkMode() {
    document.getElementById('lmBtn').style.display = 'block';
    document.getElementById('dmBtn').style.display = 'none';
    document.documentElement.style.setProperty('--bg-color', '#1e1e29');
    document.documentElement.style.setProperty('--bg-color2', '#27293d');
    document.documentElement.style.setProperty('--bg-color3', '#16161e');
    document.documentElement.style.setProperty('--txt-color', '#ffffff');
}

function lightMode() {
    document.getElementById('dmBtn').style.display = 'block';
    document.getElementById('lmBtn').style.display = 'none';
    document.documentElement.style.setProperty('--bg-color', '#c99955');
    document.documentElement.style.setProperty('--bg-color2', '#c9ab83');
    document.documentElement.style.setProperty('--bg-color3', '#d98f24');
    document.documentElement.style.setProperty('--txt-color', '#000000');
}
