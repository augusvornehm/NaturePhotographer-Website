document.getElementById("homepage-contact-form").addEventListener("submit", function (e) {
    let formData = new FormData(this);
    fetch(this.action, { method: "POST", body: formData })
        .then(response => response.text())
        .then(data => console.log(data));
    e.preventDefault(); // Prevents double submission
});


    // Toggle the menu when the burger icon is clicked
    document.getElementById("burgerMenu").addEventListener("click", function () {
        // Toggle the visibility of the menu
        document.querySelector(".menu-container").classList.toggle("show-menu");
    });
});




