const noteTitleInput = document.getElementById("noteTitle");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");
const createNote = document.getElementById("createNewNote");
const saveButton = document.getElementById("saveNote");
const deleteButton = document.getElementById("deleteNote");
const modal = document.getElementById("modal");
const cancelButton = document.querySelectorAll(".cancel_button");
const createModal = document.getElementById("cre_modal");
const createButton = document.getElementById("cre_button");
const deleteModal = document.getElementById("del_modal");
const deleteConfirmationButton = document.getElementById("confirm_delete");
const saveBut = document.getElementById("confirm_save");
const saveModal = document.getElementById("sav_modal");
const errorModal = document.getElementById("error_modal");
const errorButton = document.getElementById("error_button");
let errorFiller = document.getElementById("error");
let done = document.getElementById("done_modal");
   
let noteBeingEdited = null;
    console.log(`start`);

const loadNotes = () => {
      noteList.innerHTML = "";
      let tempArray = [];

      for(let i = 0; i < localStorage.length; i++ ) {
            const getKey = localStorage.key(i);
            if(getKey.startsWith("note_")) {
                const data = JSON.parse(localStorage.getItem(getKey));
                tempArray.push(data);
            }

        }

      tempArray.sort((a,b) => (b.time || 0) - (a.time || 0))

      tempArray.forEach(note => {
            const div = document.createElement("button");
            div.className = "note-item";

            if(note.time === noteBeingEdited) {
                div.classList.add("active")
            }
            div.innerText = note.title

            div.onclick = () => {
                noteTitleInput.value = note.title;
                noteInput.value = note.body;
                noteBeingEdited = note.time
                loadNotes()
            }

            noteList.appendChild(div)
       })
       wordCount()
    }


const saveNote = () =>{
      const noteBody =noteInput.value;
      const updatedNoteTitle = noteTitleInput.value.trim();

      errorFiller.innerText = ``;

      if(!updatedNoteTitle) {
            errorFiller.innerText = `you cannot save a note without a title!`;
            modal.classList.add("modal_active");
            errorModal.classList.add("error_modal_active");         
            return;
        }

      if(!noteBody) {
            errorFiller.innerText = `you cannot save an empty note!`;
            modal.classList.add("modal_active");
            errorModal.classList.add("error_modal_active");
            return;
        }
     
      if( updatedNoteTitle.length > 50) {
            errorFiller.innerText = `Note title is too long`;
            modal.classList.add("modal_active");
            errorModal.classList.add("error_modal_active");return;    
        }
      
         
            for(let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
        
                 if (key.startsWith("note_")) {
                      const existingNote = JSON.parse(localStorage.getItem(key));
                      // If the title matches AND it's not the note we are currently editing
                      if (existingNote.title.toLowerCase() === updatedNoteTitle.toLowerCase() && existingNote.time !== noteBeingEdited) {
                          errorFiller.innerText = `Note with this title already exist!`;
                          modal.classList.add("modal_active");
                          errorModal.classList.add("error_modal_active");
                          return;
                        }
                    }
                } 
         
           modal.classList.add("modal_active");
            saveModal.classList.add("sav_modal_active");
            console.log(`save note is working`);
        }
saveButton.addEventListener('click',saveNote);


saveBut.addEventListener('click',() => {
        const noteBody =noteInput.value;
        const updatedNoteTitle = noteTitleInput.value.trim();

        if(!noteBeingEdited) {
            noteBeingEdited = Date.now();
        }

        const noteContent = {
                title:updatedNoteTitle,
                body:noteBody,
                time: noteBeingEdited
        };

        const storageKey = `note_${noteBeingEdited}`;
        localStorage.setItem(storageKey, JSON.stringify(noteContent));

         
          saveModal.classList.remove("sav_modal_active");

            loadNotes();
            console.log(`note saved`);
            
             done.classList.add("done_modal_active");

            setTimeout(()=>{
                done.classList.remove("done_modal_active");
                 setTimeout(()=>{
                 modal.classList.remove("modal_active");
                 loadNotes();
            },300)
            },1200)
}) 
    



const createNoteModal = () =>{
      modal.classList.add("modal_active");
      createModal.classList.add("cre_modal_active");
}

createButton.addEventListener('click',()=>{
        modal.classList.remove("modal_active");
        createModal.classList.remove("cre_modal_active");
        noteBeingEdited = null;
        noteTitleInput.value = "";
        noteInput.value =""; 
        noteTitleInput.focus()  
        console.log(`Note ready`)
        loadNotes();
   })
createNote.addEventListener('click',createNoteModal);

const deleteNote = () =>{
      errorFiller.innerText = ``;
      const storageKey =`note_${noteBeingEdited}`;

      if(!noteBeingEdited) {
            errorFiller.innerText = `please select a note first!`;
            modal.classList.add("modal_active");
            errorModal.classList.add("error_modal_active");
            return;
        }
      if(localStorage.getItem(storageKey) === null) {
            errorFiller.innerText = `note not found in storage!`
            modal.classList.add("modal_active");
            errorModal.classList.add("error_modal_active");
            ;return;  
        }

      modal.classList.add("modal_active");
      deleteModal.classList.add("del_modal_active");
      console.log(`delModal is working`);  
    }
 
deleteConfirmationButton.addEventListener('click', () => {  
        const storageKey =`note_${noteBeingEdited}`;
        localStorage.removeItem(storageKey);
        noteTitleInput.value ="";
        noteInput.value = "";
        noteBeingEdited = null;
        console.log(`delbutton is working`);
        deleteModal.classList.remove("del_modal_active");
         done.classList.add("done_modal_active");

            setTimeout(()=>{
                done.classList.remove("done_modal_active");
                 setTimeout(()=>{
                 modal.classList.remove("modal_active");
                 loadNotes();
            },300)
            },1200)
        loadNotes();
   })  
deleteButton.addEventListener('click',deleteNote);

cancelButton.forEach((btn) =>{
    setTimeout(()=>{
        console.log(`closing modal`);
        btn.addEventListener('click',() => {
               deleteModal.classList.remove("del_modal_active");
                createModal.classList.remove("cre_modal_active");
                saveModal.classList.remove("sav_modal_active");
                 errorModal.classList.remove("error_modal_active");  
                 modal.classList.remove("modal_active");         
                loadNotes()
        })
        },300)
    
    })
    
const wordCount = () =>{
      const noteInput =  document.getElementById("noteInput"); 
      const numWordCon = document.getElementById("numWordCon");
    
      const word = noteInput.value.trim();
      
      let words = word.split(/\s+/).filter(word => word.length > 0).length;
      if (words === 0 ) {
            numWordCon.style.display = "none"
       }

      else {
            numWordCon.style.display = "flex"
            noteInput.style.marginBottom ="10px"
        }

      if (words < 2) {
            if (noteInput == 0){
                    document.getElementById('numWord').innerText = `0 word`
            }

            else {
                    document.getElementById('numWord').innerText = `${words} word`
            }
        }
      else {
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

setTimeout(()=>{
errorButton.addEventListener('click',() => {
        deleteModal.classList.remove("del_modal_active");
        createModal.classList.remove("cre_modal_active");
        saveModal.classList.remove("sav_modal_active");
        errorModal.classList.remove("error_modal_active");
         modal.classList.remove("modal_active");         
        loadNotes()
    })
    },300)

const fadeOut = (activeClass) =>{
    activeClass.classList.add()
}
 document.addEventListener('DOMContentLoaded',loadNotes)


