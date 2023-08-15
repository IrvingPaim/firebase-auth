import {  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import {  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
import {  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"

const phrasesContainer = document.querySelector('[data-js="phrases-container"]')

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

showAppropriatedNavLinks()

document.addEventListener('DOMContentLoaded', initModals)
