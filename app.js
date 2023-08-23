import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore, collection, doc, getDoc, setDoc, query, where, addDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

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
const db = getFirestore(app)
const collectionPhrases = collection(db, 'phrases')
 
const addPhrase = async (e, user) => {
    e.preventDefault()

    try {
        await addDoc(collectionPhrases, {
            movieTitle: DOMPurify.sanitize(e.target.title.value),
            phrase: DOMPurify.sanitize(e.target.phrase.value),
            userId: DOMPurify.sanitize(user.uid)
        })

        e.target.reset()

        const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
        M.Modal.getInstance(modalAddPhrase).close()
    } catch (error) {
        console.log('problema na edição do document:', error)
    }
}

const initCollapsibles = collapsibles => M.Collapsible.init(collapsibles)

const login = async () => {
    try {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect(auth, provider)
    } catch (error) {
        console.log('login error:', error)
    }
 }

 const logout = async unsubscribe => {
    try {
        await signOut(auth)
        unsubscribe()
        console.log('usuário deslogado')
    } catch (error) {
        console.log('logout error:', error)
    }
 }

const handleAuthStateChanged = async user => {
    try {
        const result = await getRedirectResult(auth)
        console.log('result:', result)
    } catch (error) {
        console.log('erro em getRedirectResult:', error)
    }

    const lis = [...document.querySelector('[data-js="nav-ul"]').children]
    
    lis.forEach(li => {
        const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

        if (liShouldBeVisible) {
            li.classList.remove('hide')
            return
        }

        li.classList.add('hide')
    })

    const loginMessageExists = document.querySelector('[data-js="login-message"]')
    loginMessageExists?.remove()

    const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')
    const phrasesList = document.querySelector('[data-js="phrases-list"]')
    const buttonGoogle = document.querySelector('[data-js="button-google"]')
    const linkLogout = document.querySelector('[data-js="logout"]')
    const accountDetailsContainer = document.querySelector('[data-js="account-details"]')
    const accountDetails = document.createElement('p')

    if (!user) {
        const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
        const loginMessage = document.createElement('h5')

        loginMessage.textContent = 'Faça login para ver as frases'
        loginMessage.classList.add('center-align', 'white-text')
        loginMessage.setAttribute('data-js', 'login-message')
        phrasesContainer.append(loginMessage)

        formAddPhrase.onsubmit = null
        buttonGoogle.addEventListener('click', login)
        linkLogout.onclick = null
        phrasesList.innerHTML = ''
        accountDetailsContainer.innerHTML = ''
        return
    }

    try {   
        const userDocRef = doc(db, 'users', user.uid)
        const docSnapshot = await getDoc(userDocRef)

        if (!docSnapshot.exists()) {
            await setDoc(userDocRef, {
                name: DOMPurify.sanitize(user.displayName),
                email: DOMPurify.sanitize(user.email),
                userId: DOMPurify.sanitize(user.uid)
            })
        }

    } catch (error) {
        console.log('Erro ao tentar registrar usuário:', error)
    }

    formAddPhrase.onsubmit = e => addPhrase(e, user)
    buttonGoogle.removeEventListener('click', login)

    const queryPhrases = query(collectionPhrases, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(queryPhrases, snapshot => {
        const documentFragment = document.createDocumentFragment()

        snapshot.docChanges().forEach(docChange => {
            const liPhrase = document.createElement('li')
            const movieTitleContainer = document.createElement('div')
            const phraseContainer = document.createElement('div')
            const { movieTitle, phrase } = docChange.doc.data()

            movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
            phraseContainer.textContent = DOMPurify.sanitize(phrase)
            movieTitleContainer.setAttribute('class', 'collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
            phraseContainer.setAttribute('class', 'collapsible-body blue-grey-text text-lighten-5 blue-grey darken-4')

            liPhrase.append(movieTitleContainer, phraseContainer)
            documentFragment.append(liPhrase)
        })

        phrasesList.append(documentFragment) 
    })
    linkLogout.onclick = () => logout(unsubscribe)
    initCollapsibles(phrasesList)
    accountDetails.textContent = DOMPurify.sanitize(`${user.displayName} | ${user.email}`)
    accountDetailsContainer.append(accountDetails)
}

const initModals = () => {
    const modals = document.querySelectorAll('[data-js="modal"]')
    M.Modal.init(modals)
}

onAuthStateChanged(auth, handleAuthStateChanged)
 
initModals()
