// import some polyfill to ensure everything works OK
import "babel-polyfill"

// import bootstrap's javascript part
import 'bootstrap';

// import the style
import "./style.scss";

/*
  Put the JavaScript code you want below.
*/
import axios from 'axios';
const showdown = require('showdown');
const converter = new showdown.Converter();

let url = "https://character-database.becode.xyz/characters";
let charArray;

async function getHero() {
  //make the http request
  let response = await axios.get(url);
  charArray = response.data;

  //adding a listener on the add button 
  document.querySelector("#addID").addEventListener("click", () => {
    addHero();
  });
  for (let i = 0; i < response.data.length; i++) {
    //add all the character in the db to the html
    let hero = document.createElement("article");
    hero.setAttribute('class', 'Article');
    let heroName = document.createElement("h2");
    heroName.setAttribute('class', 'Name');
    heroName.textContent = response.data[i].name;
    let heroDesc = document.createElement("p");
    heroDesc.setAttribute('class', 'Intro')
    heroDesc.textContent = response.data[i].shortDescription;
    let heroPic = document.createElement("img");
    heroPic.setAttribute('class', 'Picture');
    heroPic.src = "data:image/jpeg;base64," + response.data[i].image;
    hero.appendChild(heroName);
    hero.appendChild(heroDesc);
    hero.appendChild(heroPic);

    document.querySelector("#listOfChar").appendChild(hero);
    
    let div = document.createElement('div');
    div.setAttribute('class', 'ButtonHolder');

    //create a button to display the character
    let displayBtn = document.createElement("button");
    displayBtn.setAttribute("class", "btn btn-primary");
    displayBtn.setAttribute("id", "displayID" + i);
    displayBtn.setAttribute("data-toggle", "modal");
    displayBtn.setAttribute("data-target", "#modal");
    displayBtn.innerText = "Description";
    div.appendChild(displayBtn);

    //create a button to edit the character
    let editBtn = document.createElement("button");
    editBtn.setAttribute("class", "btn btn-primary");
    editBtn.setAttribute("id", "editID" + i);
    editBtn.setAttribute("class", "btn btn-primary");
    editBtn.setAttribute("data-toggle", "modal");
    editBtn.setAttribute("data-target", "#modal");
    editBtn.innerText = "Edit";
    div.appendChild(editBtn);
    
    //create a button to delete the character
    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "btn btn-primary");
    deleteBtn.setAttribute("id", "deleteID" + i);
    deleteBtn.setAttribute("class", "btn btn-primary");
    deleteBtn.setAttribute("data-toggle", "modal");
    deleteBtn.setAttribute("data-target", "#modal");
    deleteBtn.innerText = "Delete";
    div.appendChild(deleteBtn);

    hero.appendChild(div);
    //adding listener on each button (display - edit - delete)
    document.querySelector("#displayID" + i).addEventListener("click", () => {
      displayHero(i);
    });

    document.querySelector("#editID" + i).addEventListener("click", () => {
      editHero(i);
    });

    document.querySelector("#deleteID" + i).addEventListener("click", () => {
      deleteHero(i);
    });
  };
}

getHero();

function addHero() {
  let content = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="examplemodalLabel">modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
          <p>Name: <input id="name" type="text" name="texte" placeholder="Name"></p>
          <p>Intro: <textarea id="intro" placeholder="Introduction"></textarea></p>
          <p>Description: <textarea id="description" placeholder="Description"></textarea></p>
          <p>Picture: <input id="file" type="file" name="texte"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" id='Confirm' class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>`;

  document.querySelector(".modal").innerHTML = content;
  document.querySelector('#Confirm').addEventListener("click", async () => {
    let name = document.querySelector("#name").value;
    let intro = document.querySelector("#intro").value;
    let desc = document.querySelector("#description").value;
    let file = document.querySelector("#file").files[0];

    if (file === undefined) {
      await axios.post(url, {
        name: name,
        shortDescription: intro,
        description: converter.makeHtml(desc)
      });
      window.location.reload();

    } else {
      let fileReader = new FileReader();
      fileReader.addEventListener('load', async (event) => {
        let result = event.target.result;

        await axios.post(url, {
          name: name,
          shortDescription: intro,
          description: converter.makeHtml(desc),
          image: result.slice(result.indexOf(',') + 1)
        });
        window.location.reload();
      });
      fileReader.readAsDataURL(file);
    }
  });
};

function displayHero(identifier) {
  let content = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="examplemodalLabel">` +
            charArray[identifier].name + `</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
          <p> ` + converter.makeHtml(charArray[identifier].description) + `</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>`;

  document.querySelector(".modal").innerHTML = content;
};

function editHero(identifier) {
  //create the content of the modal
  let content = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="examplemodalLabel">` +
    charArray[identifier].name + `</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
          <p>Name: <input id="name" type="text" name="texte" value=""></p>
          <p>Intro: <textarea id="intro" value=""></textarea></p>
          <p>Description: <textarea id="description" value=""></textarea></p>
          <p>Picture: <input id="file" type="file" name="texte"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" id='Confirm' class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>`;

  //write the content of the modal into the modal
  document.querySelector(".modal").innerHTML = content;
  document.querySelector('#name').value = charArray[identifier].name;
  document.querySelector('#intro').value = charArray[identifier].shortDescription;
  document.querySelector('#description').value = converter.makeMarkdown(charArray[identifier].description);

  //add the listener of the add button into the modal
  document.querySelector('#Confirm').addEventListener("click", async () => {
    let name = document.querySelector("#name").value;
    let intro = document.querySelector("#intro").value;
    let desc = converter.makeHtml(document.querySelector("#description").value);
    let file = document.querySelector("#file").files[0];

    if(file === undefined){
      //send a character to the db
      await axios.put(url + '/' + charArray[identifier].id, {
        name: name,
        shortDescription: intro,
        description: desc,
        image: charArray[identifier].image
      });
      window.location.reload();
    }
    else {
      let fileReader = new FileReader();
      fileReader.addEventListener('load', async (event) => {
        let result = event.target.result;

        await axios.put(url + '/' + charArray[identifier].id, {
          name: name,
          shortDescription: intro,
          description: converter.makeHtml(desc),
          image: result.slice(result.indexOf(',') + 1)
        });
        window.location.reload();
      });
      fileReader.readAsDataURL(file);
    }
  });
};

function deleteHero(identifier) {
  let content = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="examplemodalLabel">modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">Are you sure?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
          <button type="button" id='Confirm' class="btn btn-primary">yes</button>
        </div>
      </div>
    </div>`;

  document.querySelector(".modal").innerHTML = content;
  document.querySelector('#Confirm').addEventListener("click", async () => {
    await axios.delete(url + '/' + charArray[identifier].id);
    window.location.reload();
  });
};