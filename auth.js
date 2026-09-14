const usersStorageKey = "seatspotterUsers";
const authModals = document.querySelectorAll(".auth-modal");
const authOpenButtons = document.querySelectorAll("[data-auth-open]");
const authCloseButtons = document.querySelectorAll("[data-auth-close]");

function getUsers() {
    return JSON.parse(localStorage.getItem(usersStorageKey) || "[]");
}
function showMessage(form, message, isError) {
    const messageElement = form.querySelector(".auth-message");
    messageElement.textContent = message;
    messageElement.style.color = isError ? "#ff9b9b" : "#ffd166";
}
function closeAuthModal(modal) {
    modal.hidden = true;
}
authOpenButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const modal = document.getElementById(button.dataset.authOpen);
        modal.hidden = false;
        modal.querySelector("input").focus();
    });
});
authCloseButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        closeAuthModal(button.closest(".auth-modal"));
    });
});
authModals.forEach(function(modal) {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeAuthModal(modal);
        }
    });
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        authModals.forEach(closeAuthModal);
    }
});
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username").trim();
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");
    const users = getUsers();

    if (users.some(function(user) { return user.email === email; })) {
        showMessage(event.currentTarget, "An account with this email already exists.", true);
        return;
    }

    users.push({ username: username, email: email, password: password });
    localStorage.setItem(usersStorageKey, JSON.stringify(users));
    event.currentTarget.reset();
    showMessage(event.currentTarget, "Account created. You can now log in.", false);
});

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");
    const user = getUsers().find(function(savedUser) {
        return savedUser.email === email && savedUser.password === password;
    });

    if (!user) {
        showMessage(event.currentTarget, "Email or password is incorrect.", true);
        return;
    }

    sessionStorage.setItem("seatspotterUser", user.username);
    event.currentTarget.reset();
    showMessage(event.currentTarget, "Logged in successfully. Welcome, " + user.username + "!", false);
});
