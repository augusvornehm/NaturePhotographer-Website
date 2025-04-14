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

            // Check if there's a video
            if (section.video) {
                const videoElement = document.createElement("video");
                videoElement.src = section.video;
                videoElement.controls = true;
                videoElement.classList.add("portfolio-video");
                sectionElement.appendChild(videoElement);
            }

            // Create a single-row grid for images (including pop-up functionality)
            if (section.primaryImage || section.secondaryImage || section.tertiaryImage) {
                const imageRow = document.createElement("div");
                imageRow.classList.add("image-row");

                ["primaryImage", "secondaryImage", "tertiaryImage"].forEach(key => {
                    if (section[key]) {
                        const img = document.createElement("img");
                        img.src = section[key];
                        img.alt = "Project image";
                        img.classList.add("portfolio-image");
                        img.dataset.popup = "true"; // Mark for pop-up functionality
                        imageRow.appendChild(img);
                    }
                });

                sectionElement.appendChild(imageRow);
            }

            // Handle images array (images with links)
            if (section.images && Array.isArray(section.images)) {
                const imageRow = document.createElement("div");
                imageRow.classList.add("image-row");

                section.images.forEach(imageData => {
                    if (imageData.src) {
                        const img = document.createElement("img");
                        img.src = imageData.src;
                        img.alt = imageData.alt || "Project image";
                        img.classList.add("portfolio-image");

                        // If there's a link (and it's not null), open in a new tab
                        if (imageData.link && imageData.link !== "null") {
                            const link = document.createElement("a");
                            link.href = imageData.link;
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                            link.appendChild(img);
                            imageRow.appendChild(link);
                        } else {
                            // If no link or null link, open in pop-up
                            img.dataset.popup = "true"; // Mark for pop-up functionality
                            imageRow.appendChild(img);
                        }
                    }
                });

                sectionElement.appendChild(imageRow);
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
