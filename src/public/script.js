const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const profileView = document.getElementById('profileView');

const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const updateProfileBtn = document.getElementById('updateProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');

function setToken(token) { localStorage.setItem('token', token); }
function getToken() { return localStorage.getItem('token'); }
function removeToken() { localStorage.removeItem('token'); }

function showView(view) {
  loginView.style.display = 'none';
  registerView.style.display = 'none';
  profileView.style.display = 'none';
  view.style.display = 'block';
}

showRegisterBtn.onclick = () => showView(registerView);
showLoginBtn.onclick = () => showView(loginView);
logoutBtn.onclick = () => { removeToken(); showView(loginView); };

async function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const address = document.getElementById('regAddress').value;

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name,email,password,address})
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      loadProfile();
    } else { alert(data.error); }
  } catch(err){ console.error(err); alert('Error registering'); }
}

async function login() {
  const name = document.getElementById('loginName').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name,password})
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      loadProfile();
    } else { alert(data.error); }
  } catch(err){ console.error(err); alert('Error logging in'); }
}

async function loadProfile() {
  const token = getToken();
  if (!token) return showView(loginView);
  try {
    const res = await fetch('http://localhost:3000/user', { headers:{'Authorization':'Bearer '+token}});
    const data = await res.json();
    if (res.ok) {
      document.getElementById('profileName').value = data.name;
      document.getElementById('profileEmail').value = data.email;
      document.getElementById('profileAddress').value = data.address;
      showView(profileView);
    } else { showView(loginView); }
  } catch(err){ console.error(err); showView(loginView); }
}

async function updateProfile() {
  const token = getToken();
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;
  const address = document.getElementById('profileAddress').value;

  try {
    const res = await fetch('http://localhost:3000/user', {
      method:'PUT',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({name,email,address})
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    alert('Profile updated!');
    loadProfile();
  } catch(err){ console.error(err); alert('Error updating profile'); }
}

// Attach event listeners
loginBtn.onclick = login;
registerBtn.onclick = register;
updateProfileBtn.onclick = updateProfile;

// Auto-load profile if token exists
document.addEventListener('DOMContentLoaded', loadProfile);
