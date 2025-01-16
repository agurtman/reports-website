const rowsPerPage = 10;
const totalRows = 250;
const totalPages = Math.ceil(totalRows / rowsPerPage);
const maxVisibleButtons = 5;

const paginationContainer = document.getElementById("pagination-container");
const tableWrapper = document.querySelector(".table");

function generateRows() {
	const rowTemplate = document.querySelector(".table__row");
	const queueTemplate = document.querySelector(".table__queue");
	let rows = [];

	for (let i = 1; i <= totalRows; i++) {
		const rowClone = rowTemplate.cloneNode(true);
		const queueClone = queueTemplate.cloneNode(true);

		queueClone.id = `tableQueue${i}`;
		queueClone.setAttribute("data-target", `tableQueue${i}`);

		const showButton = rowClone.querySelector(".table__show");
		showButton.setAttribute("data-target", `tableQueue${i}`);

		const title = rowClone.querySelector(".table__row__title");
		if (title) {
			function getRandomTime() {
				const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
				const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
				const seconds = String(Math.floor(Math.random() * 60)).padStart(2, "0");

				return `${hours}:${minutes}:${seconds}`;
			}

			title.textContent = getRandomTime();
		}

		const subtitle = rowClone.querySelector(".table__row__subtitle");
		if (subtitle) {
			function getRandomDate() {
				const startYear = 2020;
				const endYear = 2025;

				const startDate = new Date(startYear, 0, 1);
				const endDate = new Date(endYear, 11, 31);
				const randomDate = new Date(
					startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
				);

				const day = String(randomDate.getDate()).padStart(2, "0");
				const month = String(randomDate.getMonth() + 1).padStart(2, "0");
				const year = String(randomDate.getFullYear()).slice(-2);

				return `${day}.${month}.${year}`;
			}

			subtitle.textContent = getRandomDate();
		}


		rows.push({ row: rowClone, queue: queueClone });
	}

	return rows;
}

function updateTableRows(page, rows) {
	tableWrapper.querySelectorAll(".table__row, .table__queue").forEach((el) => el.remove());

	const startIndex = (page - 1) * rowsPerPage;
	const endIndex = Math.min(startIndex + rowsPerPage, rows.length);

	for (let i = startIndex; i < endIndex; i++) {
		tableWrapper.appendChild(rows[i].row);
		tableWrapper.appendChild(rows[i].queue);
	}
}

function renderPagination(currentPage, totalPages, rows) {
	paginationContainer.innerHTML = "";

	const createButton = (page, className = "") => {
		const button = document.createElement("button");
		button.textContent = page;
		button.className = `pagination__button ${className}`;
		if (page === currentPage) button.classList.add("active");

		button.addEventListener("click", () => {
			updateTableRows(page, rows);
			renderPagination(page, totalPages, rows);
		});

		return button;
	};

	let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
	let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

	if (endPage - startPage < maxVisibleButtons - 1) {
		startPage = Math.max(1, endPage - maxVisibleButtons + 1);
	}

	if (startPage > 1) {
		paginationContainer.appendChild(createButton(1));
		if (startPage > 2) paginationContainer.appendChild(createButton("...", "dots"));
	}

	for (let page = startPage; page <= endPage; page++) {
		paginationContainer.appendChild(createButton(page));
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) paginationContainer.appendChild(createButton("...", "dots"));
		paginationContainer.appendChild(createButton(totalPages));
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const rows = generateRows();
	updateTableRows(1, rows);
	renderPagination(1, totalPages, rows);

	tableWrapper.addEventListener("click", function (event) {
		if (event.target && event.target.closest(".table__show")) {
			const button = event.target.closest(".table__show");
			const targetId = button.getAttribute("data-target");
			const targetElement = document.getElementById(targetId);

			button.classList.toggle("active");
			if (targetElement) {
				targetElement.classList.toggle("active");
			}
		}
	});
});

function toggleButtonBehavior(event) {
	if (window.innerWidth > 1522) {
		if (event.target && event.target.closest(".table__show")) {
			const button = event.target.closest(".table__show");
			const targetId = button.getAttribute("data-target");
			const targetElement = document.getElementById(targetId);

			button.classList.toggle("active");
			if (targetElement) {
				targetElement.classList.toggle("active");
			}
		}
	}
}

tableWrapper.addEventListener("click", toggleButtonBehavior);



const closeButton = document.querySelector(".filters__close");
const filtersButton = document.querySelector(".reports__button.filters-button");
const filters = document.querySelector(".filters");
const reports = document.querySelector(".reports")
const overlay = document.querySelector(".overlay")
const filtersSubmit = document.querySelector(".filters__submit")

if (filtersButton && closeButton && filters) {
	const toggleFilters = () => {
		filters.classList.toggle("active");
		reports.classList.toggle("active");
		overlay.classList.toggle("active");
	};

	filtersButton.addEventListener("click", toggleFilters);
	filtersSubmit.addEventListener("click", toggleFilters);
	closeButton.addEventListener("click", toggleFilters);
}



document.addEventListener("DOMContentLoaded", () => {
	const calendarButton = document.querySelector(".calendar");
	const dateInput = document.createElement("input");
	dateInput.type = "text";
	dateInput.style.display = "none";
	document.body.appendChild(dateInput);

	const flatpickrInstance = flatpickr(dateInput, {
		locale: "ru",
		dateFormat: "Y-m-d",
		onChange: (selectedDates, dateStr) => {
			console.log("Выбранная дата:", dateStr);
		},
	});

	calendarButton.addEventListener("click", () => {
		flatpickrInstance.open();
		const rect = calendarButton.getBoundingClientRect();
		flatpickrInstance.calendarContainer.style.position = "absolute";
		flatpickrInstance.calendarContainer.style.top = `${rect.bottom + window.scrollY}px`;
		flatpickrInstance.calendarContainer.style.left = `${rect.right - 300}px`;
	});

	document.querySelectorAll(".filters__buttons button[data-period]").forEach((button) => {
		button.addEventListener("click", (event) => {
			const period = event.target.getAttribute("data-period");
			const today = new Date();
			let startDate, endDate;

			switch (period) {
				case "today":
					startDate = today;
					endDate = today;
					break;
				case "yesterday":
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 1);
					endDate = startDate;
					break;
				case "week":
					startDate = new Date(today);
					startDate.setDate(today.getDate() - 7);
					endDate = today;
					break;
				case "month":
					startDate = new Date(today);
					startDate.setMonth(today.getMonth() - 1);
					endDate = today;
					break;
			}

			console.log("Период:", period, startDate, endDate);
		});
	});
});

