//Written by Augustina Vornehm
document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    if (!projectId) {
        document.getElementById("project-title").innerText = "Project not found";
        return;
    }

    try {
        const response = await fetch("/portfolio/data/casestudies.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const projects = await response.json();
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            document.getElementById("project-title").innerText = "Project not found";
            return;
        }

        // Populate project details
        document.getElementById("project-title").innerText = project.title;
        document.getElementById("project-description").innerText = project.description;
        document.getElementById("project-image").src = project.mainImage;
        document.getElementById("project-image").alt = project.title;

        // Inject project content
        const contentContainer = document.getElementById("project-content");
        contentContainer.innerHTML = "";

        project.content.forEach(section => {
            const sectionElement = document.createElement("div");
            sectionElement.classList.add("content-section");

            if (section.headline) {
                const headline = document.createElement("h3");
                headline.innerText = section.headline;
                sectionElement.appendChild(headline);
            }

            if (section.paragraph) {
                const paragraph = document.createElement("p");
                paragraph.innerText = section.paragraph;
                sectionElement.appendChild(paragraph);
            }

            // Create a single-row grid for images (including pop-up functionality)
            if (section.primaryImage || section.secondaryImage || section.tertiaryImage) {
                const galleryContainer = document.getElementById("project-gallery");

                ["primaryImage", "secondaryImage", "tertiaryImage"].forEach(key => {
                    if (section[key]) {
                        const imageItem = document.createElement("div");
                        imageItem.classList.add("image-item");

                        const img = document.createElement("img");
                        img.src = section[key];
                        img.alt = `${key} image`;
                        img.classList.add("portfolio-image");
                        img.dataset.popup = "true"; // Mark for pop-up functionality
                        imageItem.appendChild(img);

                        // Create a subtitle and link for price inquiry
                        const subtitle = document.createElement("p");
                        subtitle.classList.add("image-subtitle");
                        subtitle.innerText = key === "primaryImage" ? "Poster" : "Canvas"; // Display Poster or Canvas
                        imageItem.appendChild(subtitle);

                        const priceLink = document.createElement("a");
                        priceLink.href = "../../pages/contact.html";
                        priceLink.innerText = "Request price and size";
                        imageItem.appendChild(priceLink);

                        galleryContainer.appendChild(imageItem);
                    }
                });
            }

            contentContainer.appendChild(sectionElement);
        });

        // Attach click event for pop-up
        const popup = document.querySelector(".show");
        const popupImg = document.querySelector(".img-show img");
        const closeBtn = document.querySelector(".close-btn");

        document.querySelectorAll(".portfolio-image").forEach(img => {
            img.addEventListener("click", function (event) {
                if (this.dataset.popup === "true") {
                    // Open in pop-up
                    popupImg.src = this.src;
                    popup.style.display = "flex";
                    event.preventDefault(); // Prevent navigation if it's a linked image
                }
            });
        });

        // Close pop-up functionality
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                popup.style.display = "none";
            });
        }

    } catch (error) {
        console.error("Error loading project data:", error);
        document.getElementById("project-title").innerText = "Error loading project data.";
    }

    // Back arrow functionality
    const backArrow = document.getElementById("backArrow");
    if (backArrow) {
        backArrow.href = document.referrer || "../pages/portfolio.html";

        backArrow.addEventListener("click", function (event) {
            event.preventDefault();
            if (document.referrer) {
                window.history.back();
            } else {
                window.location.href = "../pages/portfolio.html";
            }
        });
    }
});
