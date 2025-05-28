function toggleUserMenu() {
    const dropdown = document.getElementById("userDropdown");

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        dropdown.style.opacity = "0";
        dropdown.style.visibility = "hidden";
    } else {
        dropdown.style.display = "block";
        dropdown.style.opacity = "1";
        dropdown.style.visibility = "visible";
    }
}

document.addEventListener("click", function (event) {
    const userMenu = document.querySelector(".user-menu");
    const dropdown = document.getElementById("userDropdown");
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.style.display = "none";
        dropdown.style.opacity = "0";
        dropdown.style.visibility = "hidden";
    }
});