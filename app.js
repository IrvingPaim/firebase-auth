import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import {  } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

const firebaseConfig = {
    apiKey: 'AIzaSyCr2-mujMv4U-qe4dzHteeChECdlRyDui0',
    authDomain: 'fir-authentication-461b5.firebaseapp.com',
    projectId: 'fir-authentication-461b5',
    storageBucket: 'fir-authentication-461b5.appspot.com',
    messagingSenderId: '828709679088',
    appId: '1:828709679088:web:ac88af8090f70f5c33f735',
    measurementId: 'G-WWPY2S6B45'
  }

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
 
const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
const buttonGoogle = document.querySelector('[data-js="button-google"]')

const user = null

const showAppropriatedNavLinks = () => {
    const lis = [...document.querySelector('[data-js="nav-ul"]').children]
    
    lis.forEach(li => {
        const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

        if (liShouldBeVisible) {
            li.classList.remove('hide')
            return
        }

        li.classList.add('hide')
    })

    if (!user) {
        const loginMessage = document.createElement('h5')

        loginMessage.textContent = 'Faça login para ver as frases'
        loginMessage.classList.add('center-align', 'white-text')
        phrasesContainer.append(loginMessage)
    }
}

const initModals = () => {
    const modals = document.querySelectorAll('[data-js="modal"]')
    M.Modal.init(modals)
}

const login = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        console.log(result)
    } catch (error) {
        console.log('error:', error)
    }
 }

buttonGoogle.addEventListener('click', login) 

showAppropriatedNavLinks()

initModals()
