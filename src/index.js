document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");

    let filterGoodDogs = false; // Track filter state

    // Fetch and display all pups
    function fetchPups() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(pups => {
                renderPups(pups);
            })
            .catch(error => console.error("Error fetching pups:", error));
    }

    // Render pups in the Dog Bar
    function renderPups(pups) {
        dogBar.innerHTML = ""; // Clear dog bar before re-rendering
        pups
            .filter(pup => !filterGoodDogs || pup.isGoodDog) // Apply filter if ON
            .forEach(pup => {
                const span = document.createElement("span");
                span.textContent = pup.name;
                span.addEventListener("click", () => showPupInfo(pup));
                dogBar.appendChild(span);
            });
    }

    // Show pup details in the Dog Info section
    function showPupInfo(pup) {
        dogInfo.innerHTML = `
            <img src="${pup.image}" />
            <h2>${pup.name}</h2>
            <button id="toggle-good">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        const toggleButton = document.getElementById("toggle-good");
        toggleButton.addEventListener("click", () => toggleGoodDog(pup, toggleButton));
    }

    // Toggle Good Dog status
    function toggleGoodDog(pup, button) {
        const updatedStatus = !pup.isGoodDog;

        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isGoodDog: updatedStatus })
        })
        .then(response => response.json())
        .then(updatedPup => {
            button.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";
            pup.isGoodDog = updatedPup.isGoodDog; // Update local state
            fetchPups(); // Refresh pup list to reflect changes
        })
        .catch(error => console.error("Error updating pup:", error));
    }

    // Toggle Good Dog Filter
    filterButton.addEventListener("click", () => {
        filterGoodDogs = !filterGoodDogs;
        filterButton.textContent = `Filter good dogs: ${filterGoodDogs ? "ON" : "OFF"}`;
        fetchPups();
    });

    // Initialize app
    fetchPups();
});
