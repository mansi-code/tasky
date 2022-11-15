const taskContainer = document.querySelector(".task_container");
const taskModal = document.querySelector(".task_modal_body");

// Global Store
let globalStore = [];

const newcard = ({ id, imageurl, TaskTitle, Taskdescription, TaskType }) =>
  `<div class="col-md-6 col-lg-4" >

<div class="card ">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id=${id} onclick="editcard.apply(this,arguments)"><i class="fas fa-pencil-alt"  id=${id} onclick="editcard.apply(this,arguments)"></i></button>
    <button type="button " class="btn btn-outline-danger " id=${id} onclick="deleteCard.apply(this,arguments)"><i class="fas fa-trash-alt " id=${id} onclick="deleteCard.apply(this,arguments)"></i></button>
    </div>
  <img
    src=${imageurl}
    class="card-img-top" alt="image">
  <div class="card-body">
    <h5 class="card-title">${TaskTitle}</h5>
    <p class="card-text">${Taskdescription}</p>
    <span class="badge bg-primary">${TaskType}</span>
  </div>
  <div class="card-footer text-muted ">
  <button type="button " id=${id} onclick="openTask.apply(this,arguments)" class="btn btn-outline-primary float-end " data-bs-toggle="modal" data-bs-target="#exampleModal2">Open Task</button>
</div>
</div>
</div>`;

const htmlModalContent = ({ id, imageurl, TaskTitle, TaskType, Taskdescription }) => {
  const date = new Date(parseInt(id));
  return ` <div id=${id}>
  <img src=${imageurl} class="card-img-top " alt="Image ">
  
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${TaskTitle}</h2>
  <p class="lead">
  ${Taskdescription}
  </p>
  <span class="badge bg-primary ">${TaskType}</span>
  </div>`;
};
const openTask = (event) => {
  if (!event)
    event = window.event;
  const getTask = globalStore.filter(({ id }) => id === event.target.id);
  taskModal.innerHTML = htmlModalContent(getTask[0]);
};

const loadInitialTaskCards = () => {
  // access localstorage
  const getInitialData = localStorage.getItem("tasky");
  if (!getInitialData) return;

  // convert stringified-objet to object
  const { cards } = JSON.parse(getInitialData);

  // map around the array to generate html card and inject it to dom
  cards.map((cardObject) => {
    const createnewcard = newcard(cardObject);
    taskContainer.insertAdjacentHTML("beforeend", createnewcard);
    globalStore.push(cardObject);
  })
}
const updatelocalStorage = () =>
  localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

const savechanges = () => {

  const taskData = {
    id: `${Date.now()}`,
    imageurl: document.getElementById("image url").value,
    TaskTitle: document.getElementById("Task Title").value,
    Taskdescription: document.getElementById("Task description").value,
    TaskType: document.getElementById("Task Type").value,

  };
  // HTML code
  const createnewcard = newcard(taskData);

  taskContainer.insertAdjacentHTML("beforeend", createnewcard);
  globalStore.push(taskData);

  // add to localstorage
  updatelocalStorage();
};

const deleteCard = (event) => {
  //id
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);



  updatelocalStorage();
  if (tagname == "BUTTON") {
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
  }


  return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
}

const editcard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  let parentElement;

  if (tagname == "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  }
  else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let TaskTitle = parentElement.childNodes[5].childNodes[1];
  let Taskdescription = parentElement.childNodes[5].childNodes[3];
  let TaskType = parentElement.childNodes[5].childNodes[5];
  let Submitbutton = parentElement.childNodes[7].childNodes[1];

  TaskTitle.setAttribute("contenteditable", "true");
  Taskdescription.setAttribute("contenteditable", "true");
  TaskType.setAttribute("contenteditable", "true");
  Submitbutton.setAttribute("onclick", "(saveeditchanges.apply(this,arguments))");
  Submitbutton.removeAttribute("data-bs-toggle");
  Submitbutton.removeAttribute("data-bs-target");
  Submitbutton.innerHTML = ("save changes");
};

const saveeditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  let parentElement;

  if (tagname == "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  }
  else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let TaskTitle = parentElement.childNodes[5].childNodes[1];
  let Taskdescription = parentElement.childNodes[5].childNodes[3];
  let TaskType = parentElement.childNodes[5].childNodes[5];
  let Submitbutton = parentElement.childNodes[7].childNodes[1];

  const updateddata = {
    TaskTitle: TaskTitle.innerHTML,
    TaskType: TaskType.innerHTML,
    Taskdescription: Taskdescription.innerHTML,
  };
  globalStore = globalStore.map((task) => {
    if (task.id == targetID) {
      return {
        id: task.id,
        imageurl: task.imageurl,
        TaskTitle: updateddata.TaskTitle,
        Taskdescription: updateddata.Taskdescription,
        TaskType: updateddata.TaskType


      };
    }
    return task;
  })
  updatelocalStorage();

  TaskTitle.setAttribute("contenteditable", "false");
  Taskdescription.setAttribute("contenteditable", "false");
  TaskType.setAttribute("contenteditable", "false");
  Submitbutton.removeAttribute("onclick");
  Submitbutton.setAttribute("onclick", "openTask.apply(this, arguments)");
  Submitbutton.setAttribute("data-bs-toggle", "modal");
  Submitbutton.setAttribute("data-bs-target", "#exampleModal2");
  Submitbutton.innerHTML = "Open Task";
}