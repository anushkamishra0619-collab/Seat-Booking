
const prices = {
    VIP: 500,
    Premium: 300,
    Regular: 150
};

const rows = document.querySelectorAll(".row");
const seats = document.querySelectorAll(".seat");
const confirmButton =
    document.querySelector(".confirm-btn");
const cancelButton =
    document.querySelector(".cancel-btn");
const emptyMessage =
    document.querySelector(".empty-message");
const totalPrice =
    document.querySelector(".total-price");
const selects =
    document.querySelectorAll(".select-wrapper select");
const stats =
    document.querySelectorAll(".stats-row span");
const storageKey = "bookedSeats";
let selectedSeats = [];
let seatsToCancel = [];
let occupiedSeats = [];
rows.forEach(function(row) {
    const rowName =
        row.firstChild.textContent.trim();
        const rowSeats =
            row.querySelectorAll(".seat");

        rowSeats.forEach(function(seat, index) {

            if (seat.classList.contains("occupied")) {

                const seatNumber = index + 1;

                const seatId =
                    rowName + seatNumber;

            occupiedSeats.push(seatId);
        }

    });

});
rows.forEach(function(row) {

    const rowName =
        row.firstChild.textContent.trim();

    const rowSeats =
        row.querySelectorAll(".seat");
    rowSeats.forEach(function(seat, index) {

        const seatId =
            rowName + (index + 1);
        seat.dataset.seat = seatId;

        const category =
            getCategory(rowName);

        seat.dataset.category =
            category;

        seat.textContent =
            index + 1;

        seat.classList.add(
            category.toLowerCase()
        );
    });
});

const savedSeats = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
);
if (Array.isArray(savedSeats)) {
    savedSeats.forEach(function(seatId) {
        if (!occupiedSeats.includes(seatId)) {
            occupiedSeats.push(seatId);
        }
    });
}
occupiedSeats.forEach(function(seatId) {
    const seat =
        document.querySelector(
            `.seat[data-seat="${seatId}"]`
        );
    if (seat) {
        seat.classList.add("occupied");
        seat.style.cursor = "pointer";
    }
});
function getCategory(row) {
    switch (row) {
        case "A":
        case "B":
            return "VIP";
        case "C":
        case "D":
        case "E":
            return "Premium";
        default:
            return "Regular";
    }
}
function getPrice(seatId) {

    const row =
        seatId.charAt(0);

    const category =
        getCategory(row);

    return prices[category];
}
seats.forEach(function(seat) {

    seat.addEventListener(
        "click",
        function() {

            if (
                seat.classList.contains("occupied")
            ) {
                const seatId = seat.dataset.seat;
                if (seat.classList.contains("cancel-selected")) {
                    seat.classList.remove("cancel-selected");
                    seatsToCancel = seatsToCancel.filter(
                        function(id) {
                            return id !== seatId;
                        }
                    );
                } else {
                    seat.classList.add("cancel-selected");
                    seatsToCancel.push(seatId);
                }
                updateCancelButton();
                return;
            }

            const seatId =
                seat.dataset.seat;

            if (
                seat.classList.contains("selected")
            ) {

                seat.classList.remove(
                    "selected"
                );

                selectedSeats =
                    selectedSeats.filter(
                        function(id) {

                            return id !== seatId;

                        }
                    );

                }

            else {
                seat.classList.add(
                    "selected"
                );


                selectedSeats.push(
                    seatId
                );

            }

            updateBookingSummary();
        }
    );

});
function updateBookingSummary() {
    if (selectedSeats.length === 0) {

        emptyMessage.textContent =
            "No seats selected yet.";
        totalPrice.textContent =
            "Rs0";
        confirmButton.disabled =
            true;
        return;}
    emptyMessage.innerHTML =
        `
        <strong>
            Selected Seats:
        </strong>
        <br>
        ${selectedSeats.join(", ")}
        `;
    let total = 0;
    selectedSeats.forEach(
        function(seatId) {

            total +=
                getPrice(seatId);

        }
    );
    totalPrice.textContent =
        "₹" + total;
    confirmButton.disabled =
        false;

}
confirmButton.addEventListener(
    "click",
    function() {

        if (
            selectedSeats.length === 0
        ) {

            alert(
                "Please select a seat first."
            );

            return;
        }

        let total = 0;
        selectedSeats.forEach(
            function(seatId) {

                total +=
                    getPrice(seatId);

            }
        );
        selectedSeats.forEach(
            function(seatId) {
                const seat =
                    document.querySelector(
                        `.seat[data-seat="${seatId}"]`
                    );
                if (seat) {
                    seat.classList.remove(
                        "selected"
                    );
                    seat.classList.add(
                        "occupied"
                    );
                    seat.style.cursor =
                        "pointer";}
                if (
                    !occupiedSeats.includes(
                        seatId
                    )
                ) 
                {occupiedSeats.push(seatId);
                }
            }
        );
        localStorage.setItem(
            storageKey,
            JSON.stringify(occupiedSeats)
        );
        alert(
            "Booking Confirmed!\n\n" +
            "Seats: " +
            selectedSeats.join(", ") +
            "\nTotal: ₹" +
            total
        );

        selectedSeats = [];

        updateBookingSummary();

        updateStats();

    }
);
cancelButton.addEventListener(
    "click",
    function() {
        if (seatsToCancel.length === 0) {
            return;
        }

        seatsToCancel.forEach(function(seatId) {
            const seat =
                document.querySelector(
                    `.seat[data-seat="${seatId}"]`
                );
            if (seat) {
                seat.classList.remove(
                    "occupied",
                    "cancel-selected"
                );
                seat.style.cursor = "pointer";
            }
        });

        occupiedSeats = occupiedSeats.filter(
            function(seatId) {
                return !seatsToCancel.includes(seatId);
            }
        );
        localStorage.setItem(
            storageKey,
            JSON.stringify(occupiedSeats)
        );

        seatsToCancel = [];
        updateCancelButton();
        updateStats();
        applyFilters();
        alert("Selected bookings cancelled.");
    }
);

function updateCancelButton() {
    cancelButton.disabled = seatsToCancel.length === 0;
}

selects[0].addEventListener(
    "change",
    applyFilters
);
selects[1].addEventListener(
    "change",
    applyFilters
);
const contactLink = document.querySelector("#contact-link");
const contactModal = document.querySelector("#contact-modal");
const contactClose = document.querySelector("#contact-close");
contactLink.addEventListener("click", function(event) {
    event.preventDefault();
    contactModal.hidden = false;
    contactClose.focus();
});

contactClose.addEventListener("click", function() {
    contactModal.hidden = true;
    contactLink.focus();
});
contactModal.addEventListener("click", function(event) {
    if (event.target === contactModal) {
        contactModal.hidden = true;
        contactLink.focus();
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !contactModal.hidden) {
        contactModal.hidden = true;
        contactLink.focus();
    }
});
function applyFilters() {

    const selectedCategory =
        selects[0].value.toLowerCase();

    const selectedStatus =
        selects[1].value.toLowerCase();

    rows.forEach(function(row) {
        const rowSeats =
            row.querySelectorAll(".seat");
        let rowHasVisibleSeat = false;

        rowSeats.forEach(function(seat) {
            const category =
                seat.dataset.category.toLowerCase();
            const seatId =
                seat.dataset.seat;
            const isOccupied =
                occupiedSeats.includes(
                    seatId
                );

            let categoryMatch =
                true;
            if (selectedCategory !== "all") {
                categoryMatch =
                    category === selectedCategory;
            }

            let statusMatch = true;
            if (selectedStatus === "available only") {
                statusMatch = !isOccupied;
            } else if (selectedStatus === "booked only") {
                statusMatch = isOccupied;
            }

            const shouldShow =
                categoryMatch && statusMatch;

            seat.style.display =
                shouldShow ? "" : "none";

            if (shouldShow) {
                rowHasVisibleSeat = true;
            }
        });

        row.style.display =
            rowHasVisibleSeat ? "" : "none";
    });
}
applyFilters();
function updateStats() {
    const booked =
        occupiedSeats.length;
    const totalSeats =
        seats.length;
    const remaining =
        totalSeats - booked;
    stats[0].textContent =
        booked;
    stats[1].textContent =
        remaining;}
updateStats();
updateBookingSummary();
updateCancelButton();
