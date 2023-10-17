import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore, collection, getDocs, setDoc,doc,query, where,onSnapshot, addDoc} from 'firebase/firestore';

//Configuracion FireBase
const firebaseConfig = {
    apiKey: "AIzaSyCq1hfElnxk0O2zT50KrdTb9PpSp-iu5EI",
    authDomain: "proyecto2-4e8de.firebaseapp.com",
    projectId: "proyecto2-4e8de",
    storageBucket: "proyecto2-4e8de.appspot.com",
    messagingSenderId: "117706629147",
    appId: "1:117706629147:web:fb3f0203ef3b99808dd8be"
  };

// FireBase
  initializeApp(firebaseConfig)
  const auth = getAuth();
  const db = getFirestore()

  
  const pageValue = document.querySelector('.page').value;
  if(pageValue == "login"){
    LoginPage();
  } else if(pageValue == "inicio"){
    LogOut();
  } else if(pageValue == "registro"){
    LogOut();
    registrarLibro();
  } else if (pageValue == "MisLibros"){
    LogOut();
    MostrarDatos();
  } else if (pageValue == "categorias")


function LoginPage(){
    //Registrarse
    const signupForm = document.querySelector('#SignUpForm')
    signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.UsuarioRegister.value
    const password = signupForm.ContrasenaRegister.value

    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
        console.log('user created:', cred.user)
        signupForm.reset()
        alert("Registrado con exito");
        })
        .catch(err => {
        console.log(err.message)
        if(password.length < 6){
            alert("Contraseña debe tener más de 6 caracteres");
        }
        })
    })

    //Logearse
    const loginForm = document.querySelector('#LogInForm')
    loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.UsuarioLogin.value
    const password = loginForm.ContrasenaLogin.value

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
        console.log('user logged in:', cred.user)
        loginForm.reset()
        alert("Logueado con exito");

        var user;
        user = auth.currentUser.uid;
        localStorage.setItem("ActualUid",user);


        location.href = 'inicio.html';
        })
        .catch(err => {
        console.log(err.message)
        alert("Error");
        })
    })


}
function LogOut(){
//Salir
const logoutButton = document.querySelector('.Btn_salir')

    logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
        alert('Saliendo...');
        localStorage.removeItem("ActualUid");
        location.href = 'login.html';
        })
        .catch(err => {
        console.log(err.message)
        alert('Error al salir');
        })
    })
}
function registrarLibro(){

    var userUID = localStorage.getItem("ActualUid");//Obtiene UID de usuario Actual
    const addBookForm = document.querySelector('#NuevoLibro_Form'); //Obtiene UID de usuario Actual

    addBookForm.addEventListener('submit', (e) => {
    //Se obtienen los datos
    var Titulo = document.getElementById('Nombre').value;
    const Autor = document.querySelector('#autor').value;
    const Categoria = document.querySelector('#categoria').value;
    const Fecha = document.querySelector('#fecha_compra').value;

      e.preventDefault()

      //Se agrega un Nuevo Libro
      addDoc(collection(db, userUID), { 
        Titulo: Titulo,
        Autor: Autor,
        Categoria: Categoria,
        FechaCompra: Fecha,
      })
      .then(() => {
        addBookForm.reset()
      })

    alert("Información Guardada con exito!");
    })
}
function MostrarDatos(){

    var userUID = localStorage.getItem("ActualUid");
    const colRef = collection(db,userUID);
    var tag;
    var containerBooks = document.getElementById("tbody");
    let posicion=0;

    onSnapshot(colRef, (snapshot) => {
        var books = [];
        snapshot.docs.forEach(doc => {
          books.push({ ...doc.data(), id: doc.id })
        })
        for(var i = 0; i < books.length; i++){
            tag += "\t<tr>\n";
            tag += "\t\t<td>" + books[i].Titulo + "</td>\n";
            tag += "\t\t<td>" + books[i].Autor  + "</td>\n";
            tag += "\t\t<td>" + books[i].Categoria + "</td>\n";
            tag += "\t\t<td>" + books[i].FechaCompra + "</td>\n";
            tag += "\t\t<td><button onclick='eliminar(" + (posicion++) + ")' class='btn btndanger' >Eliminar</button></td>\n";
            tag += "\t\t</tr>\n";
          }
          containerBooks.innerHTML = tag;
      })


      function eliminar(valor){
        console.log("entro a funcion")
      //Borrar Libro
      const docRef = doc(db, userUID,book[valor].doc)
  
      deleteDoc(docRef)
        .then(() => {
          deleteBookForm.reset()
        })
    
      }

}