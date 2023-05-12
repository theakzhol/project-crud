// ! ====================================== CRUD ============================================

// вытягиваю из html

let container = document.querySelector(".container");
let btnModalAdd = document.querySelector(".btn-modal-add");
let render = document.querySelector(".render");
let modal = document.querySelector(".modal");
let inputs = document.querySelectorAll(".modal input");
let inpName = document.querySelector(".inp-name");
let inpLastName = document.querySelector(".inp-lastname");
let btnAdd = document.querySelector(".btn-add");
let btnSave = document.querySelector(".btn-save");
let btnCancel = document.querySelector(".btn-cancel");

// API
const API = "http://localhost:8000/info";

// событие на открывание модалки
btnModalAdd.addEventListener("click", () => {
  modal.style.display = "flex";
  //   очищаем инпуты
  inpName.value = "";
  inpLastName.value = "";
});

// событие на закрывание модалки
btnCancel.addEventListener("click", () => {
  modal.style.display = "none";
});

// ! -------------------------------------- ADD ---------------

btnAdd.addEventListener("click", async function () {
  // собираем объект для добавления в db.json
  let obj = {
    name: inpName.value,
    lastname: inpLastName.value,
  };
  console.log(obj);

  //   проверка на заполненность input
  if (!obj.name.trim() || !obj.lastname.trim()) {
    alert("Fill inputs");
    return;
  }

  //   запрос для добавления
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(obj),
  });

  //   закрыть модалку
  modal.style.display = "none";

  //   вызов функции для отображение
  read();
});

// ! -------------------------------------- READ -------------------

async function read() {
  render.innerHTML = "";
  let data = await fetch(API);
  let res = await data.json();
  //   console.log(res);

  res.forEach((elem) => {
    render.innerHTML += `<div class='cards'>
      <div class="card">
        <h3 style="margin: 0 auto;">${elem.name}</h3>
        <p style="margin: 0 auto;">${elem.lastname}</p>
        <button onclick="updateCard(${elem.id})" class="btn-edit"><span>Edit</span></button>
        <button onclick="deleteCard(${elem.id})" class="btn-delete"><span>Delete</span></button>
      </div>  
    </div>`;
  });
}

read();

// ! ------------------------------------ DELETE -------------------

async function deleteCard(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  read();
}

// ! ------------------------------------ UPDATE -------------------

async function updateCard(id) {
  let res = await fetch(`${API}/${id}`);
  let cards = await res.json();
  console.log(cards);
  modal.style.display = "flex";
  btnAdd.style.display = "none";
  btnSave.style.display = "flex";
  inpName.value = cards.name;
  inpLastName.value = cards.lastname;

  read();
  btnSave.addEventListener("click", async () => {
    let newObj = {
      name: inpName.value,
      lastname: inpLastName.value,
    };
    console.log(newObj);
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newObj),
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
    modal.style.display = "none";
    read();
  });
}
