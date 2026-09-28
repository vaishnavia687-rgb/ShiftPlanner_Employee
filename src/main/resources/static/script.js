const API_URL = "http://localhost:8080/api";

/* =========================================================
   GLOBAL DATA
========================================================= */

let allSwapRequests = [];


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showSection(sectionId, clickedButton) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    const pageInformation = {

        dashboard: {
            title: "Dashboard",
            subtitle:
                "Employee shift roster and swap request management"
        },

        employees: {
            title: "Employees",
            subtitle:
                "Manage registered employees"
        },

        shifts: {
            title: "Shifts",
            subtitle:
                "Manage available work shifts"
        },

        roster: {
            title: "Employee Roster",
            subtitle:
                "View employee shift assignments"
        },

        swap: {
            title: "Swap Requests",
            subtitle:
                "Manage employee shift swap requests"
        }

    };

    if (pageInformation[sectionId]) {

        document.getElementById("pageTitle").textContent =
            pageInformation[sectionId].title;

        document.getElementById("pageSubtitle").textContent =
            pageInformation[sectionId].subtitle;
    }

    if (sectionId === "employees") {
        loadEmployees();
    }
    function filterEmployees() {
        const searchValue = document
            .getElementById("employeeSearch")
            .value
            .toLowerCase();

        const rows = document.querySelectorAll(
            "#employeeTableBody tr"
        );

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();

            if (text.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (sectionId === "shifts") {
        loadShifts();
    }
    function filterShifts() {
        const searchValue = document
            .getElementById("shiftSearch")
            .value
            .toLowerCase();

        const rows = document.querySelectorAll(
            "#shiftTableBody tr"
        );

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();

            if (text.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (sectionId === "roster") {
        loadRoster();
    }

    if (sectionId === "swap") {
        loadSwapRequests();
    }
    function filterSwapRequests() {
        const searchValue = document
            .getElementById("swapSearch")
            .value
            .toLowerCase();

        const cards = document.querySelectorAll("#swapList > *");

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();

            if (text.includes(searchValue)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }
}


/* =========================================================
   QUICK ACCESS
========================================================= */

function showSectionById(sectionId) {

    const menuItems =
        document.querySelectorAll(".menu-item");

    let selectedButton = null;

    menuItems.forEach(button => {

        const onclickValue =
            button.getAttribute("onclick");

        if (
            onclickValue &&
            onclickValue.includes("'" + sectionId + "'")
        ) {
            selectedButton = button;
        }

    });

    showSection(sectionId, selectedButton);
}


/* =========================================================
   EMPLOYEE CRUD
========================================================= */


/* OPEN ADD EMPLOYEE FORM */

function openEmployeeForm() {

    document
        .getElementById("employeeFormCard")
        .classList.remove("hidden");

    document
        .getElementById("employeeFormTitle")
        .textContent = "Add Employee";

    document
        .getElementById("employeeForm")
        .reset();

    document
        .getElementById("employeeId")
        .value = "";
}


/* CLOSE EMPLOYEE FORM */

function closeEmployeeForm() {

    document
        .getElementById("employeeFormCard")
        .classList.add("hidden");

    document
        .getElementById("employeeForm")
        .reset();

    document
        .getElementById("employeeId")
        .value = "";
}


/* LOAD EMPLOYEES */

async function loadEmployees() {

    const tableBody =
        document.getElementById("employeeTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="empty-table">
                Loading employees...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_URL}/employees`);

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const employees =
            await response.json();

        const employeeCount =
            document.getElementById("employeeCount");

        if (employeeCount) {
            employeeCount.textContent =
                employees.length;
        }

        if (employees.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="empty-table">

                        No employees found.

                        <br><br>

                        Click
                        <strong>+ Add Employee</strong>
                        to create one.

                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            employees.map(employee => {

                const firstLetter =
                    employee.name
                        ? employee.name
                            .charAt(0)
                            .toUpperCase()
                        : "?";

                return `
                    <tr>

                        <td>
                            ${employee.id}
                        </td>

                        <td>

                            <div class="employee-name">

                                <div class="employee-avatar">
                                    ${firstLetter}
                                </div>

                                ${employee.name}

                            </div>

                        </td>

                        <td>
                            ${employee.email}
                        </td>

                        <td>

                            <span class="role-badge">
                                ${employee.role}
                            </span>

                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    class="edit-btn"
                                    onclick="editEmployee(${employee.id})"
                                    title="Edit Employee">

                                    ✏

                                </button>

                                <button
                                    class="delete-btn"
                                    onclick="deleteEmployee(${employee.id})"
                                    title="Delete Employee">

                                    🗑

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    class="empty-table">

                    ⚠ Unable to connect to
                    Spring Boot backend.

                </td>
            </tr>
        `;
    }
}


/* CREATE / UPDATE EMPLOYEE */

async function saveEmployee(event) {

    event.preventDefault();

    const id =
        document.getElementById("employeeId").value;

    const name =
        document
            .getElementById("employeeName")
            .value
            .trim();

    const email =
        document
            .getElementById("employeeEmail")
            .value
            .trim();

    const role =
        document
            .getElementById("employeeRole")
            .value;

    const employee = {

        name: name,

        email: email,

        role: role

    };

    try {

        let response;

        if (id) {

            response =
                await fetch(
                    `${API_URL}/employees/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(employee)
                    }
                );

        } else {

            response =
                await fetch(
                    `${API_URL}/employees`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(employee)
                    }
                );
        }

        if (!response.ok) {
            throw new Error(
                "Unable to save employee"
            );
        }

        const savedEmployee =
            await response.json();

        console.log(
            "Saved employee:",
            savedEmployee
        );

        closeEmployeeForm();

        await loadEmployees();

        alert(
            id
                ? "Employee updated successfully!"
                : "Employee added successfully!"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to save employee.\n\n" +
            "Please check the Spring Boot server."
        );
    }
}


/* EDIT EMPLOYEE */

async function editEmployee(id) {

    try {

        const response =
            await fetch(`${API_URL}/employees`);

        if (!response.ok) {
            throw new Error(
                "Unable to load employees"
            );
        }

        const employees =
            await response.json();

        const employee =
            employees.find(
                item => item.id == id
            );

        if (!employee) {

            alert("Employee not found.");

            return;
        }

        document
            .getElementById("employeeId")
            .value = employee.id;

        document
            .getElementById("employeeName")
            .value = employee.name;

        document
            .getElementById("employeeEmail")
            .value = employee.email;

        document
            .getElementById("employeeRole")
            .value = employee.role;

        document
            .getElementById("employeeFormTitle")
            .textContent = "Edit Employee";

        document
            .getElementById("employeeFormCard")
            .classList.remove("hidden");

        document
            .getElementById("employeeFormCard")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load employee details."
        );
    }
}


/* DELETE EMPLOYEE */

async function deleteEmployee(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete Employee ID "
            + id
            + "?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/employees/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Employee deleted successfully!"
        );

        await loadEmployees();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete employee.\n\n" +
            "If this employee is already assigned " +
            "to a roster or swap request, " +
            "the database may prevent deletion."
        );
    }
}


/* =========================================================
   SHIFT CRUD
========================================================= */


/* OPEN ADD SHIFT FORM */

function openShiftForm() {

    document
        .getElementById("shiftFormCard")
        .classList.remove("hidden");

    document
        .getElementById("shiftFormTitle")
        .textContent = "Add Shift";

    document
        .getElementById("shiftForm")
        .reset();

    document
        .getElementById("shiftId")
        .value = "";
}


/* CLOSE SHIFT FORM */

function closeShiftForm() {

    document
        .getElementById("shiftFormCard")
        .classList.add("hidden");

    document
        .getElementById("shiftForm")
        .reset();

    document
        .getElementById("shiftId")
        .value = "";
}


/* LOAD SHIFTS */

async function loadShifts() {

    const tableBody =
        document.getElementById("shiftTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="6"
                class="empty-table">

                Loading shifts...

            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_URL}/shifts`);

        if (!response.ok) {

            throw new Error(
                "Failed to load shifts"
            );
        }

        const shifts =
            await response.json();

        const shiftCount =
            document.getElementById("shiftCount");

        if (shiftCount) {
            shiftCount.textContent =
                shifts.length;
        }

        if (shifts.length === 0) {

            tableBody.innerHTML = `
                <tr>

                    <td colspan="6"
                        class="empty-table">

                        No shifts found.

                        <br><br>

                        Click
                        <strong>+ Add Shift</strong>
                        to create one.

                    </td>

                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            shifts.map(shift => {

                return `
                    <tr>

                        <td>
                            ${shift.id}
                        </td>

                        <td>
                            <strong>
                                ${shift.shiftName}
                            </strong>
                        </td>

                        <td>
                            ${shift.date}
                        </td>

                        <td>
                            ${shift.startTime}
                        </td>

                        <td>
                            ${shift.endTime}
                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    class="edit-btn"
                                    onclick="editShift(${shift.id})"
                                    title="Edit Shift">

                                    ✏

                                </button>

                                <button
                                    class="delete-btn"
                                    onclick="deleteShift(${shift.id})"
                                    title="Delete Shift">

                                    🗑

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>

                <td colspan="6"
                    class="empty-table">

                    ⚠ Unable to connect to
                    Spring Boot backend.

                </td>

            </tr>
        `;
    }
}


/* CREATE / UPDATE SHIFT */

async function saveShift(event) {

    event.preventDefault();

    const id =
        document
            .getElementById("shiftId")
            .value;

    const shiftName =
        document
            .getElementById("shiftName")
            .value
            .trim();

    const date =
        document
            .getElementById("shiftDate")
            .value;

    const startTime =
        document
            .getElementById("startTime")
            .value;

    const endTime =
        document
            .getElementById("endTime")
            .value;

    if (startTime >= endTime) {

        alert(
            "End time must be later than start time."
        );

        return;
    }

    const shift = {

        shiftName: shiftName,

        date: date,

        startTime: startTime,

        endTime: endTime

    };

    try {

        let response;

        if (id) {

            response =
                await fetch(
                    `${API_URL}/shifts/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(shift)
                    }
                );

        } else {

            response =
                await fetch(
                    `${API_URL}/shifts`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(shift)
                    }
                );
        }

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        const savedShift =
            await response.json();

        console.log(
            "Saved shift:",
            savedShift
        );

        closeShiftForm();

        await loadShifts();

        alert(
            id
                ? "Shift updated successfully!"
                : "Shift added successfully!"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to save shift.\n\n" +
            "Please check the Spring Boot server."
        );
    }
}


/* EDIT SHIFT */

async function editShift(id) {

    try {

        const response =
            await fetch(`${API_URL}/shifts`);

        if (!response.ok) {

            throw new Error(
                "Unable to load shifts"
            );
        }

        const shifts =
            await response.json();

        const shift =
            shifts.find(
                item => item.id == id
            );

        if (!shift) {

            alert("Shift not found.");

            return;
        }

        document
            .getElementById("shiftId")
            .value = shift.id;

        document
            .getElementById("shiftName")
            .value = shift.shiftName;

        document
            .getElementById("shiftDate")
            .value = shift.date;

        document
            .getElementById("startTime")
            .value = shift.startTime;

        document
            .getElementById("endTime")
            .value = shift.endTime;

        document
            .getElementById("shiftFormTitle")
            .textContent = "Edit Shift";

        document
            .getElementById("shiftFormCard")
            .classList.remove("hidden");

        document
            .getElementById("shiftFormCard")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load shift details."
        );
    }
}


/* DELETE SHIFT */

async function deleteShift(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete Shift ID "
            + id
            + "?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/shifts/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Shift deleted successfully!"
        );

        await loadShifts();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete shift.\n\n" +
            "If this shift is already assigned " +
            "to a roster or swap request, " +
            "the database may prevent deletion."
        );
    }
}


/* =========================================================
   ROSTER
========================================================= */


/* OPEN ROSTER FORM */

function openRosterForm() {

    document
        .getElementById("rosterFormCard")
        .classList.remove("hidden");

    document
        .getElementById("rosterForm")
        .reset();

    loadRosterEmployees();

    loadRosterShifts();
}


/* CLOSE ROSTER FORM */

function closeRosterForm() {

    document
        .getElementById("rosterFormCard")
        .classList.add("hidden");

    document
        .getElementById("rosterForm")
        .reset();
}


/* LOAD EMPLOYEES INTO ROSTER DROPDOWN */

async function loadRosterEmployees() {

    const employeeSelect =
        document.getElementById("rosterEmployee");

    if (!employeeSelect) return;

    employeeSelect.innerHTML = `
        <option value="">
            Loading employees...
        </option>
    `;

    try {

        const response =
            await fetch(`${API_URL}/employees`);

        if (!response.ok) {

            throw new Error(
                "Failed to load employees"
            );
        }

        const employees =
            await response.json();

        employeeSelect.innerHTML = `
            <option value="">
                Select Employee
            </option>
        `;

        employees.forEach(employee => {

            employeeSelect.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name} - ${employee.email}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        employeeSelect.innerHTML = `
            <option value="">
                Unable to load employees
            </option>
        `;
    }
}


/* LOAD SHIFTS INTO ROSTER DROPDOWN */

async function loadRosterShifts() {

    const shiftSelect =
        document.getElementById("rosterShift");

    if (!shiftSelect) return;

    shiftSelect.innerHTML = `
        <option value="">
            Loading shifts...
        </option>
    `;

    try {

        const response =
            await fetch(`${API_URL}/shifts`);

        if (!response.ok) {

            throw new Error(
                "Failed to load shifts"
            );
        }

        const shifts =
            await response.json();

        shiftSelect.innerHTML = `
            <option value="">
                Select Shift
            </option>
        `;

        shifts.forEach(shift => {

            shiftSelect.innerHTML += `
                <option value="${shift.id}">
                    ${shift.shiftName}
                    -
                    ${shift.date}
                    (${shift.startTime}
                    -
                    ${shift.endTime})
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        shiftSelect.innerHTML = `
            <option value="">
                Unable to load shifts
            </option>
        `;
    }
}


/* LOAD ROSTER TABLE */

async function loadRoster() {

    const tableBody =
        document.getElementById("rosterTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>

            <td colspan="6"
                class="empty-table">

                Loading roster...

            </td>

        </tr>
    `;

    try {

        const response =
            await fetch(`${API_URL}/rosters`);

        if (!response.ok) {

            throw new Error(
                "Failed to load roster"
            );
        }

        const rosters =
            await response.json();

        const rosterCount =
            document.getElementById("rosterCount");

        if (rosterCount) {
            rosterCount.textContent =
                rosters.length;
        }

        if (rosters.length === 0) {

            tableBody.innerHTML = `
                <tr>

                    <td colspan="6"
                        class="empty-table">

                        No roster assignments found.

                        <br><br>

                        Click
                        <strong>+ Assign Shift</strong>
                        to create one.

                    </td>

                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            rosters.map(roster => {

                const employee =
                    roster.employee;

                const shift =
                    roster.shift;

                const firstLetter =
                    employee &&
                    employee.name
                        ? employee.name
                            .charAt(0)
                            .toUpperCase()
                        : "?";

                return `
                    <tr>

                        <td>
                            ${roster.id}
                        </td>

                        <td>

                            <div class="employee-name">

                                <div class="employee-avatar">
                                    ${firstLetter}
                                </div>

                                ${employee.name}

                            </div>

                        </td>

                        <td>

                            <strong>
                                ${shift.shiftName}
                            </strong>

                        </td>

                        <td>
                            ${shift.date}
                        </td>

                        <td>

                            ${shift.startTime}
                            -
                            ${shift.endTime}

                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    class="delete-btn"
                                    onclick="deleteRoster(${roster.id})"
                                    title="Delete Assignment">

                                    🗑

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>

                <td colspan="6"
                    class="empty-table">

                    ⚠ Unable to connect to
                    Spring Boot backend.

                </td>

            </tr>
        `;
    }
}


/* CREATE ROSTER ASSIGNMENT */

async function saveRoster(event) {

    event.preventDefault();

    const employeeId =
        document
            .getElementById("rosterEmployee")
            .value;

    const shiftId =
        document
            .getElementById("rosterShift")
            .value;

    if (!employeeId || !shiftId) {

        alert(
            "Please select both an employee and a shift."
        );

        return;
    }

    const roster = {

        employee: {
            id: Number(employeeId)
        },

        shift: {
            id: Number(shiftId)
        }

    };

    try {

        const response =
            await fetch(
                `${API_URL}/rosters`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(roster)
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        const savedRoster =
            await response.json();

        console.log(
            "Saved roster:",
            savedRoster
        );

        closeRosterForm();

        await loadRoster();

        alert(
            "Shift assigned successfully!"
        );

    } catch (error) {

        console.error(error);

        if (
            error.message &&
            error.message !== "Failed to fetch"
        ) {

            alert(
                "Unable to assign shift.\n\n" +
                error.message
            );

        } else {

            alert(
                "Unable to assign shift.\n\n" +
                "Please check the Spring Boot server."
            );
        }
    }
}


/* DELETE ROSTER */

async function deleteRoster(id) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this shift assignment?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/rosters/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Roster assignment deleted successfully!"
        );

        await loadRoster();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete roster assignment."
        );
    }
}


/* =========================================================
   SWAP REQUESTS
========================================================= */


/* LOAD SWAP REQUESTS */

async function loadSwapRequests() {

    const container =
        document.getElementById("swapList");

    if (!container) return;

    container.innerHTML = `
        <div class="data-card">
            <p>Loading swap requests...</p>
        </div>
    `;

    try {

        const response =
            await fetch(`${API_URL}/swap-requests`);

        if (!response.ok) {

            throw new Error(
                "Unable to load swap requests"
            );
        }

        const requests =
            await response.json();

        /*
         * Store all requests globally.
         * The filter will use this array.
         */
        allSwapRequests = requests;

        const swapCount =
            document.getElementById("swapCount");

        if (swapCount) {
            swapCount.textContent =
                requests.length;
        }

        /*
         * Reset filter to ALL whenever
         * requests are freshly loaded.
         */
        const filter =
            document.getElementById("swapStatusFilter");

        if (filter) {
            filter.value = "ALL";
        }

        renderSwapRequests(requests);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="data-card">

                <h3>
                    ⚠ Unable to Load Swap Requests
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
}


/* =========================================================
   RENDER SWAP REQUESTS
========================================================= */

function renderSwapRequests(requests) {

    const container =
        document.getElementById("swapList");

    if (!container) return;

    if (requests.length === 0) {

        container.innerHTML = `
            <div class="data-card">

                <h3>
                    🔄 No Swap Requests
                </h3>

                <p>
                    No requests match the selected filter.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        requests.map(request => {

            const requester =
                request.requester;

            const colleague =
                request.colleague;

            const requesterShift =
                request.requesterShift;

            const colleagueShift =
                request.colleagueShift;

            return `
                <div class="data-card">

                    <h3>
                        🔄 Swap Request #${request.id}
                    </h3>

                    <hr>

                    <p>

                        <strong>
                            Requester:
                        </strong>

                        ${requester?.name || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Requester Email:
                        </strong>

                        ${requester?.email || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Current Shift:
                        </strong>

                        ${requesterShift?.shiftName || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${requesterShift?.date || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Time:
                        </strong>

                        ${requesterShift?.startTime || "N/A"}

                        -

                        ${requesterShift?.endTime || "N/A"}

                    </p>

                    <hr>

                    <p>

                        <strong>
                            Colleague:
                        </strong>

                        ${colleague?.name || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Colleague Email:
                        </strong>

                        ${colleague?.email || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Requested Shift:
                        </strong>

                        ${colleagueShift?.shiftName || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${colleagueShift?.date || "N/A"}

                    </p>

                    <p>

                        <strong>
                            Time:
                        </strong>

                        ${colleagueShift?.startTime || "N/A"}

                        -

                        ${colleagueShift?.endTime || "N/A"}

                    </p>

                    <hr>

                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span class="status">
                            ${request.status}
                        </span>

                    </p>

                    ${
                request.status === "PENDING_MANAGER"
                    ?

                    `
                            <div class="action-buttons">

                                <button
                                    class="edit-btn"
                                    onclick="approveSwapRequest(${request.id})">

                                    ✓ Approve

                                </button>

                                <button
                                    class="delete-btn"
                                    onclick="rejectSwapRequest(${request.id})">

                                    ✕ Reject

                                </button>

                            </div>
                        `

                    : ""
            }

                </div>
            `;

        }).join("");
}


/* =========================================================
   FILTER SWAP REQUESTS
========================================================= */

function filterSwapRequests() {

    const filter =
        document.getElementById("swapStatusFilter");

    if (!filter) return;

    const selectedStatus =
        filter.value;

    /*
     * If ALL is selected,
     * show every request.
     */
    if (selectedStatus === "ALL") {

        renderSwapRequests(
            allSwapRequests
        );

        return;
    }

    /*
     * Otherwise show only
     * matching status.
     */
    const filteredRequests =
        allSwapRequests.filter(
            request =>
                request.status === selectedStatus
        );

    renderSwapRequests(
        filteredRequests
    );
}


/* =========================================================
   APPROVE SWAP REQUEST
========================================================= */

async function approveSwapRequest(id) {

    const confirmed =
        confirm(
            "Approve this swap request?"
        );

    if (!confirmed) return;

    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests/${id}/approve`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Swap request approved successfully!"
        );

        await loadSwapRequests();

        await loadRoster();

        await loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to approve swap request.\n\n"
            + error.message
        );
    }
}


/* =========================================================
   REJECT SWAP REQUEST
========================================================= */

async function rejectSwapRequest(id) {

    const confirmed =
        confirm(
            "Decline this swap request?"
        );

    if (!confirmed) return;

    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests/${id}/reject`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Swap request declined."
        );

        await loadSwapRequests();

        await loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to decline swap request.\n\n"
            + error.message
        );
    }
}


/* =========================================================
   SWAP REQUEST FORM
========================================================= */


/* OPEN SWAP FORM */

async function openSwapForm() {

    document
        .getElementById("swapFormCard")
        .classList.remove("hidden");

    await loadSwapEmployees();

    await loadSwapShifts();
}


/* CLOSE SWAP FORM */

function closeSwapForm() {

    document
        .getElementById("swapFormCard")
        .classList.add("hidden");

    document
        .getElementById("swapForm")
        .reset();
}


/* LOAD EMPLOYEES FOR SWAP */

async function loadSwapEmployees() {

    try {

        const response =
            await fetch(`${API_URL}/employees`);

        if (!response.ok) {
            throw new Error(
                "Unable to load employees"
            );
        }

        const employees =
            await response.json();

        const requester =
            document.getElementById(
                "swapRequester"
            );

        const colleague =
            document.getElementById(
                "swapColleague"
            );

        requester.innerHTML =
            `
                <option value="">
                    Select Requester
                </option>
            `;

        colleague.innerHTML =
            `
                <option value="">
                    Select Colleague
                </option>
            `;

        employees.forEach(employee => {

            requester.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name}
                </option>
            `;

            colleague.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load employees."
        );
    }
}


/* LOAD SHIFTS FOR SWAP */

async function loadSwapShifts() {

    try {

        const response =
            await fetch(`${API_URL}/shifts`);

        if (!response.ok) {
            throw new Error(
                "Unable to load shifts"
            );
        }

        const shifts =
            await response.json();

        const requesterShift =
            document.getElementById(
                "swapRequesterShift"
            );

        const colleagueShift =
            document.getElementById(
                "swapColleagueShift"
            );

        requesterShift.innerHTML =
            `
                <option value="">
                    Select Requester Shift
                </option>
            `;

        colleagueShift.innerHTML =
            `
                <option value="">
                    Select Colleague Shift
                </option>
            `;

        shifts.forEach(shift => {

            const text =
                `${shift.shiftName} - ${shift.date} ${shift.startTime}-${shift.endTime}`;

            requesterShift.innerHTML += `
                <option value="${shift.id}">
                    ${text}
                </option>
            `;

            colleagueShift.innerHTML += `
                <option value="${shift.id}">
                    ${text}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load shifts."
        );
    }
}


/* SAVE SWAP REQUEST */

async function saveSwapRequest(event) {

    event.preventDefault();

    const requesterId =
        document
            .getElementById("swapRequester")
            .value;

    const colleagueId =
        document
            .getElementById("swapColleague")
            .value;

    const requesterShiftId =
        document
            .getElementById("swapRequesterShift")
            .value;

    const colleagueShiftId =
        document
            .getElementById("swapColleagueShift")
            .value;

    if (
        !requesterId ||
        !colleagueId ||
        !requesterShiftId ||
        !colleagueShiftId
    ) {

        alert(
            "Please select all employee and shift details."
        );

        return;
    }

    if (requesterId === colleagueId) {

        alert(
            "Requester and colleague must be different employees."
        );

        return;
    }

    const swapRequest = {

        requester: {
            id: Number(requesterId)
        },

        colleague: {
            id: Number(colleagueId)
        },

        requesterShift: {
            id: Number(requesterShiftId)
        },

        colleagueShift: {
            id: Number(colleagueShiftId)
        }

    };

    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(swapRequest)
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        alert(
            "Swap request created successfully!"
        );

        closeSwapForm();

        await loadSwapRequests();

        await loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to create swap request.\n\n"
            + error.message
        );
    }
}


/* =========================================================
   DASHBOARD COUNTS
========================================================= */

async function loadDashboardCounts() {

    try {

        const employeesResponse =
            await fetch(
                `${API_URL}/employees`
            );

        const shiftsResponse =
            await fetch(
                `${API_URL}/shifts`
            );

        const rosterResponse =
            await fetch(
                `${API_URL}/rosters`
            );

        const swapsResponse =
            await fetch(
                `${API_URL}/swap-requests`
            );

        const employees =
            await employeesResponse.json();

        const shifts =
            await shiftsResponse.json();

        const rosters =
            await rosterResponse.json();

        const swaps =
            await swapsResponse.json();

        document
            .getElementById("employeeCount")
            .textContent =
            employees.length;

        document
            .getElementById("shiftCount")
            .textContent =
            shifts.length;

        document
            .getElementById("rosterCount")
            .textContent =
            rosters.length;

        document
            .getElementById("swapCount")
            .textContent =
            swaps.length;

    } catch (error) {

        console.log(
            "Backend is not available."
        );
    }
}


/* =========================================================
   START APPLICATION
========================================================= */

loadDashboardCounts();

loadEmployees();

loadShifts();

loadRoster();

loadSwapRequests();