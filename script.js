function showOutput() {
    const input = document.getElementById("userInput").value.trim();
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = `Searching for author: ${input}`;

    if (input) {
        fetchData(input);
    } else {
        outputDiv.innerHTML = "<span style='color:red;'>Please enter an author name.</span>";
    }
}

async function fetchData(authorName) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // clear previous output

    try {
        const endpoint = `https://poetrydb.org/author/${encodeURIComponent(authorName)}`;
        const response = await fetch(endpoint);

        // Handle non-200 responses
        if (!response.ok) {
            let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = `API Error: ${errorData.message}`;
                }
            } catch (jsonError) {
                // If parsing JSON fails, keep default errorMessage
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error("Fetch error:", error);

        let userMessage = "";
        if (error instanceof TypeError) {
            userMessage = `Data Format Error: ${error.message}`;
        } else if (error instanceof Error) {
            userMessage = `Fetch Error: ${error.message}`;
        } else {
            userMessage = "An unknown error occurred during fetching.";
        }

        outputDiv.innerHTML = `<span style='color:red;'>${userMessage}</span>`;
    }
}

function displayResults(data) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML += "<br><strong>Results:</strong><br>";

    data.forEach(item => {
        outputDiv.innerHTML += `
            <div class="poem">
                <div class="poem-row">
                    <div class="label">Title:</div>
                    <div class="value">${item.title}</div>
                </div>
                <div class="poem-row">
                    <div class="label">Author:</div>
                    <div class="value">${item.author}</div>
                </div>
                <div class="poem-row">
                    <div class="label">Line Count:</div>
                    <div class="value">${item.linecount}</div>
                </div>
                <div class="poem-row poem-lines">
                    <div class="label">Lines:</div>
                    <div class="value">${item.lines.join("<br>")}</div>
                </div>
            </div>
        `;
    });
}


