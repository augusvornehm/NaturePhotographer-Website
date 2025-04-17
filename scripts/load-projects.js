//Written by Augustina Vornehm

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch the JSON data
        const response = await fetch("../portfolio/data/projects.json");
        const projects = await response.json();

        console.log("Fetched Projects:", projects);  // Debug log

        const container = document.getElementById("projects-container");
        container.innerHTML = "";  // Clear existing content

        // Map sub-page file names to categories
        const categories = {
            "sweden": "sweden",
            "finland": "finland",
            "norway": "norway",
            "portugal": "portugal",
        };

        // Get the current page's category from URL
        const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
        console.log("Current Page Detected:", currentPage);  // Debug log

        // Check if the category is found
        const category = categories[currentPage];
        console.log("Mapped category:", category);  // Debug log

        if (!category) {
            container.innerHTML = "<p>No category found for this page.</p>";
            return;
        }

        // Filter projects based on category
        const filteredProjects = projects.filter(project => project.category === category);
        console.log("Filtered Projects for category:", filteredProjects);  // Debug log

        if (filteredProjects.length === 0) {
            container.innerHTML = "<p>No projects found for this category.</p>";
            return;
        }

        // Display filtered projects
        filteredProjects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("portfolio-piece-item");

            let projectLink = '';

            // If the category is 'graphic', open the image in a pop-up
            if (project.category === "graphic") {
                projectLink = "#"; // No link, just handle the pop-up
            } else {
                // For other categories, use the existing case study link
                projectLink = (project.category === "backend" && project.thirdPartyLink) 
                    ? project.thirdPartyLink 
                    : `data/casestudy.html?id=${project.id}`;
            }

            projectElement.innerHTML = `
                <a href="${projectLink}" ${project.category === "backend" ? 'target="_blank" rel="noopener noreferrer"' : ""} class="${project.category === "graphic" ? 'open-popup' : ''}">
                    <div class="portfolio-piece-img">
                        <img src="${project.image}" alt="${project.title}" class="${project.category === "graphic" ? 'portfolio-graphic-image' : ''}">
                    </div>
                </a>
                <h3>${project.title}</h3>
            `;

            container.appendChild(projectElement);
        });

        // Handle opening the image in a pop-up for 'graphic' category
        document.querySelectorAll(".portfolio-graphic-image").forEach(img => {
            img.addEventListener("click", function (event) {
                event.preventDefault();  // Prevent navigating if it's just the image

                const popup = document.querySelector(".show");
                const popupImg = document.querySelector(".img-show img");
                popupImg.src = img.src;

                popup.style.display = "flex"; // Show the pop-up
            });
        });

    } catch (error) {
        console.error("Error loading projects:", error);
    }
});
