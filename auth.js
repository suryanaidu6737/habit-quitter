let users = JSON.parse(localStorage.getItem("users")) || [];

function signup() {
  let u = signupUser.value;
  let p = signupPass.value;

  if (!u || !p) return alert("Fill all fields");

  if (users.find(x => x.username === u)) {
    return alert("User exists");
  }

  users.push({ username: u, password: p });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  window.location.href = "login.html";
}

function login() {
  let u = loginUser.value;
  let p = loginPass.value;

  let user = users.find(x => x.username === u && x.password === p);

  if (!user) return alert("Invalid credentials");

  localStorage.setItem("currentUser", u);
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}