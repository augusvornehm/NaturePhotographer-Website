//Written by Augustina Vornehm

$(document).ready(function () {
    // When an image is clicked, show the popup
    $(".portfolio-piece-img").click(function () {
        var src = $(this).attr("src");
        $(".show").fadeIn(); // Show the popup
        $(".img-show img").attr("src", src); // Set the clicked image in the popup
    });

    // Close the popup when clicking the X or the overlay
    $(".close-btn, .show .overlay").click(function () {
        $(".show").fadeOut(); // Hide the popup
    });
});