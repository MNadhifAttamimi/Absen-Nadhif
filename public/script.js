const absensiForm = document.getElementById("absensi-form");
const absensiList = document.getElementById("absensi-list");

absensiForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idInput = document.getElementById("id");
    const id = idInput.value;

    const response = await fetch("http://localhost:3000/absensi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (data.success) {
        idInput.value = "";
        fetchData();
    } else {
        alert(data.error);
    }
});

function fetchData() {
    fetch("http://localhost:3000/absensi")
        .then((response) => response.json())
        .then((data) => {
            const absensiItems = data.map((item) => {
                return `<p>ID: ${item.id}, Waktu: ${item.timestamp}</p>`;
            });
            absensiList.innerHTML = absensiItems.join("");
        });
}

fetchData();
