// se importa funciones
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {getFirestore, collection, getDocs, setDoc,doc,query, where,onSnapshot, addDoc, deleteDoc} from 'firebase/firestore';

//Configuracion FireBase (datos de accesibilidad)
const firebaseConfig = {
  apiKey: "AIzaSyCq1hfElnxk0O2zT50KrdTb9PpSp-iu5EI",
  authDomain: "proyecto2-4e8de.firebaseapp.com",
  projectId: "proyecto2-4e8de",
  storageBucket: "proyecto2-4e8de.appspot.com",
  messagingSenderId: "117706629147",
  appId: "1:117706629147:web:fb3f0203ef3b99808dd8be"
  };

// FireBase (conexion en linea)
  initializeApp(firebaseConfig)
  //conexxion al panel de autenticacion
  const auth = getAuth();
  const db = getFirestore()
  const provider = new GoogleAuthProvider();
  

  const pageValue = document.querySelector('.page').value;
  if(pageValue == "login"){
    LoginPage();
    GoogleLogin();
  } else if(pageValue == "inicio"){
    LogOut();
  } else if(pageValue == "registro"){
    LogOut();
    registrarLibro();
  } else if (pageValue == "MisLibros"){
    LogOut();
    MostrarDatos();

    var EstadoSelect = "Obtenido";
    var btn = document.getElementById("seleccionar_categoria");
    btn.addEventListener("click",MostrarDatos);

  } else if(pageValue == "MisLibrosDeseados"){
    LogOut();
    MostrarDatos();

    var EstadoSelect = "Deseado";
    var btn = document.getElementById("seleccionar_categoria_deseada");
    btn.addEventListener("click",MostrarDatos);
  } else if (pageValue == "catalogo"){
    Catalogo();
    LogOut();
  }

function GoogleLogin(){
  var btn = document.getElementById("btn_google_auth");
  btn.addEventListener("click", () =>{
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    var id = auth.currentUser.uid;
    localStorage.setItem("ActualUid",id);


        location.href = 'inicio.html';
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  })
}

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
const logoutButton = document.querySelector('#Btn_salir')

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
    var titulo = document.getElementById('nombre').value;
    const autor = document.querySelector('#autor').value;
    const categoria = document.querySelector('#categoria').value;
    const estado = document.querySelector('#estado').value;

    e.preventDefault();
      //Se agrega un Nuevo Libro
      addDoc(collection(db, userUID), { 
        Titulo: titulo,
        Autor: autor,
        Categoria: categoria,
        Imagen: "img/stock.jpg",
        Estado: estado
      })
      .then(() => {
        addBookForm.reset();
        alert("Información Guardada con exito!");
      })
    })
}
function MostrarDatos(){

  var categoria_buscada = document.getElementById("categoria_seleccionada").value;
  
    

    var userUID = localStorage.getItem("ActualUid");
    const colRef = collection(db,userUID);
    var containerBooks = document.getElementById("Books_Container");
    var tag = "";
    var books = [];

    onSnapshot(colRef, (snapshot) => {
        snapshot.docs.forEach(doc => {
          books.push({ ...doc.data(), id: doc.id })
        })

        for(var i = 0; i < books.length; i++){


        if(books[i].Estado == EstadoSelect){

            if(categoria_buscada != "MostrarTodos"){

              if(categoria_buscada == books[i].Categoria){

                tag += "<div class='col-md-3'>"
                tag += "<div class='card' style='width: 18rem;'>"
                tag += "<img src='"+ books[i].Imagen +"' class='card-img-top' alt=''>"
                tag += "<div class='card-body'>"
                tag += "<h5 class='card-title'>"+ books[i].Titulo+"</h5>"
                tag += "<p class='card-text'>Autor: " + books[i].Autor + "</p>"
                tag += "<p class='card-text'>Categoria: " + books[i].Categoria + "</p>"
                tag += "<button class='btn btn-danger btn-eliminar' data-id="+ books[i].id +">Eliminar</button>";
                tag += "</div>"
                tag += "</div>" 
                tag += "</div>";

              } /*else {

                tag += "<div class='text-center'>"
                tag += "<p>Aún no tienes libros de esta categoria :(</p>"
                tag += "</div>"
              }*/
            } else{
                tag += "<div class='col-md-3'>"
                tag += "<div class='card' style='width: 18rem;'>"
                tag += "<img src='"+ books[i].Imagen +"' class='card-img-top' alt=''>"
                tag += "<div class='card-body'>"
                tag += "<h5 class='card-title'>"+ books[i].Titulo+"</h5>"
                tag += "<p class='card-text'>Autor: " + books[i].Autor + "</p>"
                tag += "<p class='card-text'>Categoria: " + books[i].Categoria + "</p>"
                tag += "<button class='btn btn-danger btn-eliminar' data-id="+ books[i].id +">Eliminar</button>";
                tag += "</div>"
                tag += "</div>" 
                tag += "</div>"
            }
          }
      
          containerBooks.innerHTML = tag;
        }

    });  
    //Se agrega EVENTS a todos los botoners de eliminar
    var btn_eliminar = document.querySelectorAll(".btn-eliminar");
    btn_eliminar.forEach(btn => {
      btn.addEventListener("click", ({target: {dataset}}) =>{
        eliminar(dataset.id);
      })
    })
}
function eliminar(id){
        console.log(id)
      //Borrar Libro
      var containerBooks = document.getElementById("Books_Container");
      var userUID = localStorage.getItem("ActualUid");
  
      deleteDoc(doc(db, userUID,id))
        .then(() => {
          location.reload();
        })
    
}
function Catalogo(){
var btn_obtenido = document.querySelectorAll(".btn_obtenido")
btn_obtenido.forEach(btn => {
    btn.addEventListener("click", ({target: {dataset}}) =>{
        registrarLibroCatalogo(dataset);
      })
    })

    var btndeseado = document.querySelectorAll(".btn_deseado")
    btndeseado.forEach(btn => {
      btn.addEventListener("click", ({target: {dataset}}) =>{
          registrarLibroCatalogo(dataset);
        })
  })

function registrarLibroCatalogo(dataset){

  var userUID = localStorage.getItem("ActualUid");//Obtiene UID de usuario Actual
      
        //Se obtienen los datos
        const titulo = dataset.nombre;
        const autor = dataset.autor
        const categoria = dataset.categoria;
        const imagen = dataset.imagen;
        const estado = dataset.estado;  
      
      
          //Se agrega un Nuevo Libro
          addDoc(collection(db, userUID), { 
            Titulo: titulo,
            Autor: autor,
            Categoria: categoria,
            Imagen: imagen, 
            Estado: estado
          })
          .then(() => {
            alert("Información Guardada con exito!");
          })
        
}
}