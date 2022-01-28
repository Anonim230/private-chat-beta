const socket = io()
var token = localStorage.getItem('socket-server-token')
let promptedName
promptedName = localStorage.getItem('socket-server-name') ? `${~~(Math.random()*100000) }` /*localStorage.getItem('socket-server-name')*/ : prompt('What is your name?', 'Nobody')
const user = promptedName == 'All Users' ? socket.id.substring(0, 8) : promptedName
localStorage.setItem('socket-server-name', user)
console.log(user);
socket.emit('new-user', { user, token })
socket.on('get-token', data => localStorage.setItem('socket-server-token', data))
form.addEventListener('submit', e => {
    e.preventDefault()
    if (text && to)
        socket.emit('message', {
            from: user,
            to: to.value,
            text: text.value
        })
})
socket.on('new-message', data => {
    console.log(data);
    let h5 = document.getElementById(data.from)
    if (!h5) {
        h5 = document.createElement('h5')
        h5.innerHTML = data.from
        h5.id = data.from
        h5.classList.add('users')
        h5.onclick = open_chat
        user_list.appendChild(h5)
        let option = document.createElement('option')
        option.value = option.innerHTML = data.from
        list.appendChild(option)
    }
    h5.classList.add('badged')
    h5.setAttribute('aria-messages', !h5.getAttribute('aria-messages') ? 1 : +h5.getAttribute('aria-messages') + 1)
})
socket.on('get-user-list', users => {
    user_list.innerHTML = ''
    users = users.filter(listUser => {
        if (listUser != user) return true
        let h5 = document.createElement('h5')
        h5.innerHTML = 'You...'
        h5.classList.add('me')
        user_list.appendChild(h5)
    })
    for (let listUser of users) {
        let h5 = document.createElement('h5')
        h5.innerHTML = listUser
        h5.id = listUser
        h5.classList.add('users')
        h5.onclick = open_chat
        user_list.appendChild(h5)
        let option = document.createElement('option')
        option.value = option.innerHTML = listUser
        list.appendChild(option)
    }
})
socket.on('get-messages', messages => {
    console.log(messages);
    messages.map(message => {
        console.log(message);
    })
})

function open_chat(e) {
    if (to.value != e.target.innerHTML) return to.value = e.target.innerHTML
    modal_title.innerHTML = `Chat with ${to.value}`
    socket.emit('send-messages', to.value)
    console.log(e);
}
// socket.on('get-user-list', list => {

// })