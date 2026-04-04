const noteTitle = document.getElementById("noteTitle");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");
const addButton = document.getElementById("createNewNote");
const saveButton = document.getElementById("saveNote");
const deleteButton = document.getElementById("deleteNote");
let noteBeingEdited = null;
console.log(`start`);

const loadNotes = () => {
    const listContainer = document.getElementById("noteList");
    listContainer.innerHTML = "";
    let tempArray = [];

    for(let i=0;i<localStorage.length;i++ ){
        const getKey =localStorage.key(i);
        if(getKey.startsWith("note_")){
            const data = JSON.parse(localStorage.getItem(getKey));
            tempArray.push(data);
        }

    }
    tempArray.sort((a,b) => (b.time || 0) - (a.time || 0))

    tempArray.forEach(note =>{
        const div = document.createElement("button");
        div.className = "note-item";
        if(note.time === noteBeingEdited) {
            div.classList.add("active")
        }
        div.innerText = note.title

        div.onclick = () => {
            document.getElementById("noteTitle").value = note.title;
            document.getElementById("noteInput").value = note.body;
            noteBeingEdited = note.time
            loadNotes()
        }

        listContainer.appendChild(div)
    })
    wordCount()
}


const saveNote = () =>{
    const noteTitle = document.getElementById("noteTitle").value;
    const noteBody = document.getElementById("noteInput").value;
   let updatedNoteTitle = noteTitle.trim()
  for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("note_")) {
            const existingNote = JSON.parse(localStorage.getItem(key));
            // If the title matches AND it's not the note we are currently editing
            if (existingNote.title.toLowerCase() === noteTitle.toLowerCase() &&
                existingNote.time !== noteBeingEdited) {
                    console.log(`A note with this title already exists!`)
                alert("A note with this title already exists!");
                   return;
                
        }
    }
}
     if(!noteTitle){
         alert(`you can not save an Untitled note`);return
     }
     else if(!noteTitle && !noteBody){
         alert(`you cannot save an empty note`);return
     }
     if(!noteBeingEdited){
        noteBeingEdited = Date.now();
     }
    const noteContent = {
        title:noteTitle,
        body:noteBody,
        time: noteBeingEdited
    };
    const storageKey = `note_${noteBeingEdited}`;
    localStorage.setItem(storageKey, JSON.stringify(noteContent))
alert(`${updatedNoteTitle} is saved`);
loadNotes();
}


const addNote = () =>{
     alert(`Creating a new note! Type in your title and content, then hit save`);
noteBeingEdited = null;
noteTitle.value = "";
noteInput.value =""; 
noteTitle.focus()  
console.log(`Note ready`)
   loadNotes();

}



const deleteNote = () =>{
    const noteTitle= document.getElementById("noteTitle").value.trim();
    
    if(!noteBeingEdited){
        alert(`please select a note first`);return;
    }
    const storageKey =`note_${noteBeingEdited}`;

    if(localStorage.getItem(storageKey) === null){
        alert(`note not found in storage`);return;
    }

    if(confirm(`Delete "${noteTitle}"?`)){
        localStorage.removeItem(storageKey);
         document.getElementById("noteTitle").value ="";
        document.getElementById("noteInput").value = "";
        noteBeingEdited = null
        loadNotes()
    }

}




document.addEventListener('DOMContentLoaded',() =>{
    
    saveButton.addEventListener('click',saveNote)
    deleteButton.addEventListener('click',deleteNote)
    addButton.addEventListener('click',addNote)
    loadNotes()
})

const wordCount = () =>{
    const noteInput =  document.getElementById("noteInput"); 
    const numWordCon = document.getElementById("numWordCon");
    
    const word = noteInput.value.trim();
   let words = word.split(/\s+/).filter(word => word.length > 0).length;
   if (words === 0){
                numWordCon.style.display = "none"
   }
   else {
                 numWordCon.style.display = "flex"
                 noteInput.style.marginBottom ="10px"
   }

   if (words < 2){
                if (noteInput == 0){
         document.getElementById('numWord').innerText = `0 word`
   }
  else {
        document.getElementById('numWord').innerText = `${words} word`
  }
   }
   else{
     if (noteInput === 0){
         document.getElementById('numWord').innerText = `0 words`
   }
  else {
        document.getElementById('numWord').innerText = `${words} words`
  }
   }
   
   console.log(`number count working`)

}
noteInput.addEventListener('input',wordCount)

