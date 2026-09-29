
const API_URL = "http://localhost:8080/api";

let allSwapRequests = [];


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.remove("hidden");
    }

    if (sectionId === "dashboard") {
        loadDashboardCounts();
    }

    if (sectionId === "employees") {
        loadEmployees();
    }

    if (sectionId === "shifts") {
        loadShifts();
    }

    if (sectionId === "roster") {
        loadRoster();
    }

    if (sectionId === "swapRequests") {
        loadSwapRequests();
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboardCounts() {

    try {

        const [
            employeeResponse,
            shiftResponse,
            rosterResponse,
            swapResponse
        ] = await Promise.all([

            fetch(`${API_URL}/employees`),
fetch(`${API_URL}/shifts`),
    fetch(`${API_URL}/rosters`),
    fetch(`${API_URL}/swap-requests`)
]);


if (!employeeResponse.ok ||
    !shiftResponse.ok ||
    !rosterResponse.ok ||
    !swapResponse.ok) {

    throw new Error("Failed to load dashboard data");
}


const employees = await employeeResponse.json();
const shifts = await shiftResponse.json();
const rosters = await rosterResponse.json();
const swaps = await swapResponse.json();


const employeeCount =
    document.getElementById("employeeCount");

const shiftCount =
    document.getElementById("shiftCount");

const rosterCount =
    document.getElementById("rosterCount");

const swapCount =
    document.getElementById("swapCount");


if (employeeCount) {
    employeeCount.textContent = employees.length;
}

if (shiftCount) {
    shiftCount.textContent = shifts.length;
}

if (rosterCount) {
    rosterCount.textContent = rosters.length;
}

if (swapCount) {

    swapCount.textContent =
        swaps.filter(request =>
            request.status === "PENDING_MANAGER"
        ).length;
}


/* Swap dashboard */

const totalSwapRequests =
    document.getElementById("totalSwapRequests");

const pendingSwapRequests =
    document.getElementById("pendingSwapRequests");

const approvedSwapRequests =
    document.getElementById("approvedSwapRequests");

const rejectedSwapRequests =
    document.getElementById("rejectedSwapRequests");


if (totalSwapRequests) {
    totalSwapRequests.textContent =
        swaps.length;
}

if (pendingSwapRequests) {

    pendingSwapRequests.textContent =
        swaps.filter(request =>
            request.status === "PENDING_MANAGER"
        ).length;
}

if (approvedSwapRequests) {

    approvedSwapRequests.textContent =
        swaps.filter(request =>
            request.status === "MANAGER_APPROVED"
        ).length;
}

if (rejectedSwapRequests) {

    rejectedSwapRequests.textContent =
        swaps.filter(request =>
            request.status === "MANAGER_REJECTED"
        ).length;
}

} catch (error) {

    console.error(
        "Dashboard count error:",
        error
    );
}
}


/* =========================================================
   EMPLOYEES
========================================================= */

async function loadEmployees() {

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


        const tableBody =
            document.getElementById(
                "employeeTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        employees.forEach(employee => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${employee.id}</td>

                <td>${employee.name || ""}</td>

                <td>${employee.email || ""}</td>

                <td>${employee.role || ""}</td>

                <td>

                    <button
                        type="button"
                        onclick="editEmployee(${employee.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteEmployee(${employee.id})">
                        Delete
                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Employee loading error:",
            error
        );
    }
}


/* ---------------------------------------------------------
   OPEN EMPLOYEE FORM
--------------------------------------------------------- */

function openEmployeeForm() {

    const card =
        document.getElementById(
            "employeeFormCard"
        );


    if (card) {
        card.classList.remove("hidden");
    }


    const title =
        document.getElementById(
            "employeeFormTitle"
        );


    if (title) {
        title.textContent = "Add Employee";
    }


    const form =
        document.getElementById(
            "employeeForm"
        );


    if (form) {
        form.reset();
    }


    const id =
        document.getElementById(
            "employeeId"
        );


    if (id) {
        id.value = "";
    }
}


/* ---------------------------------------------------------
   CLOSE EMPLOYEE FORM
--------------------------------------------------------- */

function closeEmployeeForm() {

    const card =
        document.getElementById(
            "employeeFormCard"
        );


    if (card) {
        card.classList.add("hidden");
    }


    const form =
        document.getElementById(
            "employeeForm"
        );


    if (form) {
        form.reset();
    }


    const id =
        document.getElementById(
            "employeeId"
        );


    if (id) {
        id.value = "";
    }
}


/* ---------------------------------------------------------
   EDIT EMPLOYEE
--------------------------------------------------------- */

async function editEmployee(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/employees/${id}`
            );


        /*
           If GET /employees/{id} is not available
           in backend, get all employees instead.
        */

        let employee;


        if (response.ok) {

            employee =
                await response.json();

        } else {

            const allResponse =
                await fetch(
                    `${API_URL}/employees`
                );


            if (!allResponse.ok) {

                throw new Error(
                    "Unable to load employee"
                );
            }


            const employees =
                await allResponse.json();


            employee =
                employees.find(
                    item => Number(item.id) === Number(id)
                );
        }


        if (!employee) {

            alert("Employee not found.");

            return;
        }


        document.getElementById(
            "employeeId"
        ).value = employee.id;


        document.getElementById(
            "employeeName"
        ).value = employee.name || "";


        document.getElementById(
            "employeeEmail"
        ).value = employee.email || "";


        document.getElementById(
            "employeeRole"
        ).value = employee.role || "";


        document.getElementById(
            "employeeFormTitle"
        ).textContent = "Edit Employee";


        document.getElementById(
            "employeeFormCard"
        ).classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit employee error:",
            error
        );


        alert(
            "Unable to load employee.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   SAVE EMPLOYEE
--------------------------------------------------------- */

async function saveEmployee(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "employeeId"
        ).value;


    const name =
        document.getElementById(
            "employeeName"
        ).value.trim();


    const email =
        document.getElementById(
            "employeeEmail"
        ).value.trim();


    const role =
        document.getElementById(
            "employeeRole"
        ).value.trim();


    if (!name || !email || !role) {

        alert(
            "Please fill all employee details."
        );

        return;
    }


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

            const message =
                await response.text();

            throw new Error(
                message ||
                `Request failed with status ${response.status}`
            );
        }


        closeEmployeeForm();


        await loadEmployees();

        await loadDashboardCounts();


        alert(
            id
                ? "Employee updated successfully!"
                : "Employee added successfully!"
        );


    } catch (error) {

        console.error(
            "Save employee error:",
            error
        );


        alert(
            "Unable to save employee.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   DELETE EMPLOYEE
--------------------------------------------------------- */

async function deleteEmployee(id) {

    if (
        !confirm(
            "Are you sure you want to delete this employee?"
        )
    ) {
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


        const message =
            await response.text();


        console.log(
            "Delete employee:",
            response.status,
            message
        );


        if (!response.ok) {

            throw new Error(
                message ||
                `Delete failed with status ${response.status}`
            );
        }


        await loadEmployees();

        await loadRoster();

        await loadSwapRequests();

        await loadDashboardCounts();


        alert(
            "Employee deleted successfully!"
        );


    } catch (error) {

        console.error(
            "Delete employee error:",
            error
        );


        alert(
            "Unable to delete employee.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   FILTER EMPLOYEES
--------------------------------------------------------- */

function filterEmployees() {

    const searchInput =
        document.getElementById(
            "employeeSearch"
        );


    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#employeeTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        row.style.display =
            text.includes(search)
                ? ""
                : "none";
    });
}


/* =========================================================
   SHIFTS
========================================================= */


/* ---------------------------------------------------------
   OPEN SHIFT FORM
--------------------------------------------------------- */

function openShiftForm() {

    const card =
        document.getElementById(
            "shiftFormCard"
        );


    if (card) {
        card.classList.remove("hidden");
    }


    const title =
        document.getElementById(
            "shiftFormTitle"
        );


    if (title) {
        title.textContent = "Add Shift";
    }


    const form =
        document.getElementById(
            "shiftForm"
        );


    if (form) {
        form.reset();
    }


    const id =
        document.getElementById(
            "shiftId"
        );


    if (id) {
        id.value = "";
    }
}


/* ---------------------------------------------------------
   CLOSE SHIFT FORM
--------------------------------------------------------- */

function closeShiftForm() {

    const card =
        document.getElementById(
            "shiftFormCard"
        );


    if (card) {
        card.classList.add("hidden");
    }


    const form =
        document.getElementById(
            "shiftForm"
        );


    if (form) {
        form.reset();
    }


    const id =
        document.getElementById(
            "shiftId"
        );


    if (id) {
        id.value = "";
    }
}


/* ---------------------------------------------------------
   LOAD SHIFTS
--------------------------------------------------------- */

async function loadShifts() {

    try {

        const response =
            await fetch(
                `${API_URL}/shifts`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load shifts"
            );
        }


        const shifts =
            await response.json();


        const tableBody =
            document.getElementById(
                "shiftTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        shifts.forEach(shift => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${shift.id}</td>

                <td>${shift.shiftName || ""}</td>

                <td>${shift.date || ""}</td>

                <td>${shift.startTime || ""}</td>

                <td>${shift.endTime || ""}</td>

                <td>

                    <button
                        type="button"
                        onclick="editShift(${shift.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteShift(${shift.id})">
                        Delete
                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Shift loading error:",
            error
        );
    }
}


/* ---------------------------------------------------------
   SAVE SHIFT
--------------------------------------------------------- */

async function saveShift(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "shiftId"
        ).value;


    const shiftName =
        document.getElementById(
            "shiftName"
        ).value.trim();


    const date =
        document.getElementById(
            "shiftDate"
        ).value;


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    if (
        !shiftName ||
        !date ||
        !startTime ||
        !endTime
    ) {

        alert(
            "Please fill all shift details."
        );

        return;
    }


    /*
       Night shift crosses midnight.
       Example:
       21:00 -> 01:00
    */

    if (
        shiftName !== "Night" &&
        startTime >= endTime
    ) {

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

            throw new Error(
                message ||
                `Request failed with status ${response.status}`
            );
        }


        closeShiftForm();


        await loadShifts();

        await loadRoster();

        await loadSwapRequests();

        await loadDashboardCounts();


        alert(
            id
                ? "Shift updated successfully!"
                : "Shift added successfully!"
        );


    } catch (error) {

        console.error(
            "Save shift error:",
            error
        );


        alert(
            "Unable to save shift.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   EDIT SHIFT
--------------------------------------------------------- */

async function editShift(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/shifts`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load shifts"
            );
        }


        const shifts =
            await response.json();


        const shift =
            shifts.find(
                item =>
                    Number(item.id) === Number(id)
            );


        if (!shift) {

            alert(
                "Shift not found."
            );

            return;
        }


        document.getElementById(
            "shiftId"
        ).value = shift.id;


        let shiftName =
            shift.shiftName || "";


        /*
           Support old database names.
        */

        if (shiftName === "Morning Shift") {
            shiftName = "Morning";
        }

        if (shiftName === "Afternoon Shift") {
            shiftName = "Afternoon";
        }

        if (shiftName === "Evening Shift") {
            shiftName = "Evening";
        }

        if (shiftName === "Night Shift") {
            shiftName = "Night";
        }


        document.getElementById(
            "shiftName"
        ).value = shiftName;


        document.getElementById(
            "shiftDate"
        ).value = shift.date || "";


        document.getElementById(
            "startTime"
        ).value =
            shift.startTime
                ? shift.startTime.substring(0, 5)
                : "";


        document.getElementById(
            "endTime"
        ).value =
            shift.endTime
                ? shift.endTime.substring(0, 5)
                : "";


        document.getElementById(
            "shiftFormTitle"
        ).textContent = "Edit Shift";


        document.getElementById(
            "shiftFormCard"
        ).classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit shift error:",
            error
        );


        alert(
            "Unable to load shift.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   DELETE SHIFT
--------------------------------------------------------- */

async function deleteShift(id) {

    if (
        !confirm(
            "Are you sure you want to delete this shift?"
        )
    ) {
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


        const message =
            await response.text();


        console.log(
            "Delete shift:",
            response.status,
            message
        );


        if (!response.ok) {

            throw new Error(
                message ||
                `Delete failed with status ${response.status}`
            );
        }


        await loadShifts();

        await loadRoster();

        await loadSwapRequests();

        await loadDashboardCounts();


        alert(
            "Shift deleted successfully!"
        );


    } catch (error) {

        console.error(
            "Delete shift error:",
            error
        );


        alert(
            "Unable to delete shift.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   FILTER SHIFTS
--------------------------------------------------------- */

function filterShifts() {

    const searchInput =
        document.getElementById(
            "shiftSearch"
        );


    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#shiftTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        row.style.display =
            text.includes(search)
                ? ""
                : "none";
    });
}


/* =========================================================
   ROSTER
========================================================= */


/* ---------------------------------------------------------
   LOAD ROSTER
--------------------------------------------------------- */

async function loadRoster() {

    try {

        const response =
            await fetch(
                `${API_URL}/rosters`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load roster"
            );
        }


        const rosters =
            await response.json();


        const tableBody =
            document.getElementById(
                "rosterTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        rosters.forEach(roster => {

            const row =
                document.createElement("tr");


            const employee =
                roster.employee || null;


            const shift =
                roster.shift || null;


            row.innerHTML = `
                <td>${roster.id}</td>

                <td>
                    ${employee
                ? employee.name
                : "N/A"}
                </td>

                <td>
                    ${shift
                ? shift.shiftName
                : "N/A"}
                </td>

                <td>
                    ${shift
                ? shift.date
                : "N/A"}
                </td>

                <td>
                    ${shift
                ? shift.startTime +
                " - " +
                shift.endTime
                : "N/A"}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="deleteRoster(${roster.id})">
                        Delete
                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Roster loading error:",
            error
        );
    }
}


/* ---------------------------------------------------------
   OPEN ROSTER FORM
--------------------------------------------------------- */

async function openRosterForm() {

    const card =
        document.getElementById(
            "rosterFormCard"
        );


    if (card) {
        card.classList.remove("hidden");
    }


    await loadRosterDropdowns();
}


/* ---------------------------------------------------------
   CLOSE ROSTER FORM
--------------------------------------------------------- */

function closeRosterForm() {

    const card =
        document.getElementById(
            "rosterFormCard"
        );


    if (card) {
        card.classList.add("hidden");
    }


    const form =
        document.getElementById(
            "rosterForm"
        );


    if (form) {
        form.reset();
    }
}


/* ---------------------------------------------------------
   ROSTER DROPDOWNS
--------------------------------------------------------- */

async function loadRosterDropdowns() {

    try {

        const [
            employeeResponse,
            shiftResponse
        ] = await Promise.all([

            fetch(`${API_URL}/employees`),

            fetch(`${API_URL}/shifts`)
        ]);


        if (
            !employeeResponse.ok ||
            !shiftResponse.ok
        ) {

            throw new Error(
                "Unable to load roster dropdowns"
            );
        }


        const employees =
            await employeeResponse.json();


        const shifts =
            await shiftResponse.json();


        const employeeSelect =
            document.getElementById(
                "rosterEmployee"
            );


        const shiftSelect =
            document.getElementById(
                "rosterShift"
            );


        if (employeeSelect) {

            employeeSelect.innerHTML = `
                <option value="">
                    Select Employee
                </option>
            `;


            employees.forEach(employee => {

                employeeSelect.innerHTML += `
                    <option value="${employee.id}">
                        ${employee.name}
                    </option>
                `;
            });
        }


        if (shiftSelect) {

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
        }


    } catch (error) {

        console.error(
            "Roster dropdown error:",
            error
        );
    }
}


/* ---------------------------------------------------------
   SAVE ROSTER
--------------------------------------------------------- */

async function saveRoster(event) {

    event.preventDefault();


    const employeeId =
        document.getElementById(
            "rosterEmployee"
        ).value;


    const shiftId =
        document.getElementById(
            "rosterShift"
        ).value;


    if (!employeeId || !shiftId) {

        alert(
            "Please select employee and shift."
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

            throw new Error(
                message ||
                `Request failed with status ${response.status}`
            );
        }


        closeRosterForm();


        await loadRoster();

        await loadDashboardCounts();


        alert(
            "Roster assigned successfully!"
        );


    } catch (error) {

        console.error(
            "Save roster error:",
            error
        );


        alert(
            "Unable to assign roster.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   DELETE ROSTER
--------------------------------------------------------- */

async function deleteRoster(id) {

    if (
        !confirm(
            "Are you sure you want to delete this roster?"
        )
    ) {
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


        const message =
            await response.text();


        if (!response.ok) {

            throw new Error(
                message ||
                `Delete failed with status ${response.status}`
            );
        }


        await loadRoster();

        await loadDashboardCounts();


        alert(
            "Roster deleted successfully!"
        );


    } catch (error) {

        console.error(
            "Delete roster error:",
            error
        );


        alert(
            "Unable to delete roster.\n\n" +
            error.message
        );
    }
}


/* =========================================================
   SWAP REQUESTS
========================================================= */


/* ---------------------------------------------------------
   OPEN SWAP FORM
--------------------------------------------------------- */

async function openSwapForm() {

    const card =
        document.getElementById(
            "swapFormCard"
        );


    if (card) {
        card.classList.remove("hidden");
    }


    const form =
        document.getElementById(
            "swapForm"
        );


    if (form) {
        form.reset();
    }


    const requesterShift =
        document.getElementById(
            "requesterShift"
        );


    const colleagueShift =
        document.getElementById(
            "colleagueShift"
        );


    if (requesterShift) {

        requesterShift.innerHTML = `
            <option value="">
                Select Requester Shift
            </option>
        `;
    }


    if (colleagueShift) {

        colleagueShift.innerHTML = `
            <option value="">
                Select Colleague Shift
            </option>
        `;
    }


    await loadSwapEmployees();
}


/* ---------------------------------------------------------
   CLOSE SWAP FORM
--------------------------------------------------------- */

function closeSwapForm() {

    const card =
        document.getElementById(
            "swapFormCard"
        );


    if (card) {
        card.classList.add("hidden");
    }


    const form =
        document.getElementById(
            "swapForm"
        );


    if (form) {
        form.reset();
    }
}


/* ---------------------------------------------------------
   LOAD SWAP EMPLOYEES
--------------------------------------------------------- */

async function loadSwapEmployees() {

    try {

        const response =
            await fetch(
                `${API_URL}/employees`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load employees"
            );
        }


        const employees =
            await response.json();


        const requester =
            document.getElementById(
                "requester"
            );


        const colleague =
            document.getElementById(
                "colleague"
            );


        if (requester) {

            requester.innerHTML = `
                <option value="">
                    Select Requester
                </option>
            `;


            employees.forEach(employee => {

                requester.innerHTML += `
                    <option value="${employee.id}">
                        ${employee.name}
                    </option>
                `;
            });
        }


        if (colleague) {

            colleague.innerHTML = `
                <option value="">
                    Select Colleague
                </option>
            `;


            employees.forEach(employee => {

                colleague.innerHTML += `
                    <option value="${employee.id}">
                        ${employee.name}
                    </option>
                `;
            });
        }


    } catch (error) {

        console.error(
            "Swap employee loading error:",
            error
        );


        alert(
            "Unable to load employees."
        );
    }
}


/* ---------------------------------------------------------
   LOAD REQUESTER ROSTER SHIFTS
--------------------------------------------------------- */

async function loadRequesterRosterShifts() {

    const employeeId =
        document.getElementById(
            "requester"
        ).value;


    const select =
        document.getElementById(
            "requesterShift"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select Requester Shift
        </option>
    `;


    if (!employeeId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/rosters`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load roster"
            );
        }


        const rosters =
            await response.json();


        const employeeRosters =
            rosters.filter(roster => {

                return roster.employee &&
                    String(roster.employee.id) ===
                    String(employeeId);
            });


        employeeRosters.forEach(roster => {

            if (!roster.shift) {
                return;
            }


            const shift =
                roster.shift;


            select.innerHTML += `
                <option value="${shift.id}">
                    ${shift.shiftName}
                    |
                    ${shift.date}
                    |
                    ${shift.startTime}
                    -
                    ${shift.endTime}
                </option>
            `;
        });


        if (employeeRosters.length === 0) {

            select.innerHTML = `
                <option value="">
                    No roster shift found
                </option>
            `;
        }


    } catch (error) {

        console.error(
            "Requester shift loading error:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load roster
            </option>
        `;
    }
}


/* ---------------------------------------------------------
   LOAD COLLEAGUE ROSTER SHIFTS
--------------------------------------------------------- */

async function loadColleagueRosterShifts() {

    const employeeId =
        document.getElementById(
            "colleague"
        ).value;


    const select =
        document.getElementById(
            "colleagueShift"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select Colleague Shift
        </option>
    `;


    if (!employeeId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/rosters`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load roster"
            );
        }


        const rosters =
            await response.json();


        const employeeRosters =
            rosters.filter(roster => {

                return roster.employee &&
                    String(roster.employee.id) ===
                    String(employeeId);
            });


        employeeRosters.forEach(roster => {

            if (!roster.shift) {
                return;
            }


            const shift =
                roster.shift;


            select.innerHTML += `
                <option value="${shift.id}">
                    ${shift.shiftName}
                    |
                    ${shift.date}
                    |
                    ${shift.startTime}
                    -
                    ${shift.endTime}
                </option>
            `;
        });


        if (employeeRosters.length === 0) {

            select.innerHTML = `
                <option value="">
                    No roster shift found
                </option>
            `;
        }


    } catch (error) {

        console.error(
            "Colleague shift loading error:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load roster
            </option>
        `;
    }
}


/* ---------------------------------------------------------
   SAVE SWAP REQUEST
--------------------------------------------------------- */

async function saveSwapRequest(event) {

    event.preventDefault();


    const requesterId =
        document.getElementById(
            "requester"
        ).value;


    const requesterShiftId =
        document.getElementById(
            "requesterShift"
        ).value;


    const colleagueId =
        document.getElementById(
            "colleague"
        ).value;


    const colleagueShiftId =
        document.getElementById(
            "colleagueShift"
        ).value;


    if (
        !requesterId ||
        !requesterShiftId ||
        !colleagueId ||
        !colleagueShiftId
    ) {

        alert(
            "Please select requester, requester shift, colleague and colleague shift."
        );

        return;
    }


    if (
        requesterId === colleagueId
    ) {

        alert(
            "Requester and colleague must be different employees."
        );

        return;
    }


    /*
       IMPORTANT:
       Backend SwapRequest entity expects:

       requester
       colleague
       requesterShift
       colleagueShift

       Therefore send nested JSON.
    */

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


    console.log(
        "Sending swap request:",
        swapRequest
    );


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
                        JSON.stringify(
                            swapRequest
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `Request failed with status ${response.status}`
            );
        }


        const savedRequest =
            await response.json();


        console.log(
            "Swap request created:",
            savedRequest
        );


        closeSwapForm();


        await loadSwapRequests();

        await loadDashboardCounts();


        alert(
            "Swap request created successfully!\n\n" +
            "Status: Pending Manager Approval"
        );


    } catch (error) {

        console.error(
            "Save swap request error:",
            error
        );


        alert(
            "Unable to create swap request.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   LOAD SWAP REQUESTS
--------------------------------------------------------- */

async function loadSwapRequests() {

    const container =
        document.getElementById(
            "swapList"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load swap requests"
            );
        }


        const requests =
            await response.json();


        console.log(
            "Swap requests:",
            requests
        );


        allSwapRequests =
            requests;


        window.allSwapRequests =
            requests;


        /*
           Update counts
        */

        const total =
            requests.length;


        const pending =
            requests.filter(request =>
                request.status ===
                "PENDING_MANAGER"
            ).length;


        const approved =
            requests.filter(request =>
                request.status ===
                "MANAGER_APPROVED"
            ).length;


        const rejected =
            requests.filter(request =>
                request.status ===
                "MANAGER_REJECTED"
            ).length;


        const totalElement =
            document.getElementById(
                "totalSwapRequests"
            );


        const pendingElement =
            document.getElementById(
                "pendingSwapRequests"
            );


        const approvedElement =
            document.getElementById(
                "approvedSwapRequests"
            );


        const rejectedElement =
            document.getElementById(
                "rejectedSwapRequests"
            );


        if (totalElement) {
            totalElement.textContent = total;
        }


        if (pendingElement) {
            pendingElement.textContent = pending;
        }


        if (approvedElement) {
            approvedElement.textContent = approved;
        }


        if (rejectedElement) {
            rejectedElement.textContent = rejected;
        }


        const oldSwapCount =
            document.getElementById(
                "swapCount"
            );


        if (oldSwapCount) {
            oldSwapCount.textContent = pending;
        }


        /*
           Display
        */

        if (container) {

            if (requests.length === 0) {

                container.innerHTML = `
                    <div class="data-card">

                        <h3>No Swap Requests</h3>

                        <p>
                            No employee swap requests
                            have been created yet.
                        </p>

                    </div>
                `;

            } else {

                renderSwapRequests(
                    requests
                );
            }
        }


    } catch (error) {

        console.error(
            "Swap request loading error:",
            error
        );


        if (container) {

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
}


/* ---------------------------------------------------------
   RENDER SWAP REQUESTS
--------------------------------------------------------- */

function renderSwapRequests(requests) {

    const container =
        document.getElementById(
            "swapList"
        );


    if (!container) {
        return;
    }


    if (
        !requests ||
        requests.length === 0
    ) {

        container.innerHTML = `
            <div class="data-card">

                <h3>
                    No Matching Requests
                </h3>

                <p>
                    No swap requests match your filter.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        requests.map(request => {

            const requester =
                request.requester || {};


            const colleague =
                request.colleague || {};


            const requesterShift =
                request.requesterShift || {};


            const colleagueShift =
                request.colleagueShift || {};


            const status =
                request.status ||
                "PENDING_MANAGER";


            let statusText =
                "Pending Manager";


            let statusClass =
                "pending";


            if (
                status ===
                "MANAGER_APPROVED"
            ) {

                statusText =
                    "Manager Approved";

                statusClass =
                    "approved";
            }


            if (
                status ===
                "MANAGER_REJECTED"
            ) {

                statusText =
                    "Manager Rejected";

                statusClass =
                    "rejected";
            }


            const requesterShiftName =
                requesterShift.shiftName ||
                "N/A";


            const colleagueShiftName =
                colleagueShift.shiftName ||
                "N/A";


            const requesterDate =
                requesterShift.date ||
                "N/A";


            const colleagueDate =
                colleagueShift.date ||
                "N/A";


            const requesterStart =
                requesterShift.startTime ||
                "N/A";


            const requesterEnd =
                requesterShift.endTime ||
                "N/A";


            const colleagueStart =
                colleagueShift.startTime ||
                "N/A";


            const colleagueEnd =
                colleagueShift.endTime ||
                "N/A";


            return `

                <div class="data-card swap-request-card">

                    <!-- HEADER -->

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                        flex-wrap:wrap;
                    ">

                        <div>

                            <h3>
                                🔄 Swap Request #${request.id}
                            </h3>

                            <small>
                                Employee shift exchange request
                            </small>

                        </div>


                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>

                    </div>


                    <hr>


                    <!-- EMPLOYEE DETAILS -->

                    <div style="
                        display:grid;
                        grid-template-columns:
                            repeat(auto-fit,minmax(250px,1fr));
                        gap:20px;
                    ">


                        <!-- REQUESTER -->

                        <div style="
                            padding:15px;
                            border:1px solid #ddd;
                            border-radius:8px;
                        ">

                            <h4>
                                👤 Requester
                            </h4>


                            <p>
                                <strong>Name:</strong>
                                ${requester.name || "N/A"}
                            </p>


                            <p>
                                <strong>Email:</strong>
                                ${requester.email || "N/A"}
                            </p>


                            <p>
                                <strong>Shift:</strong>
                                ${requesterShiftName}
                            </p>


                            <p>
                                <strong>Date:</strong>
                                ${requesterDate}
                            </p>


                            <p>
                                <strong>Time:</strong>
                                ${requesterStart}
                                -
                                ${requesterEnd}
                            </p>

                        </div>


                        <!-- COLLEAGUE -->

                        <div style="
                            padding:15px;
                            border:1px solid #ddd;
                            border-radius:8px;
                        ">

                            <h4>
                                👤 Colleague
                            </h4>


                            <p>
                                <strong>Name:</strong>
                                ${colleague.name || "N/A"}
                            </p>


                            <p>
                                <strong>Email:</strong>
                                ${colleague.email || "N/A"}
                            </p>


                            <p>
                                <strong>Shift:</strong>
                                ${colleagueShiftName}
                            </p>


                            <p>
                                <strong>Date:</strong>
                                ${colleagueDate}
                            </p>


                            <p>
                                <strong>Time:</strong>
                                ${colleagueStart}
                                -
                                ${colleagueEnd}
                            </p>

                        </div>

                    </div>


                    <!-- MANAGER ACTIONS -->

                    ${
                status === "PENDING_MANAGER"

                    ?

                    `
                        <div style="
                            margin-top:20px;
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        ">

                            <button
                                type="button"
                                class="primary-btn"
                                onclick="approveSwapRequest(${request.id})">

                                ✓ Approve

                            </button>


                            <button
                                type="button"
                                class="delete-btn"
                                onclick="rejectSwapRequest(${request.id})">

                                ✕ Reject

                            </button>

                        </div>
                        `

                    :

                    `
                        <div style="
                            margin-top:20px;
                            padding:12px;
                            border-radius:6px;
                        ">

                            ${
                        status ===
                        "MANAGER_APPROVED"

                            ?

                            "✓ This request has been approved by the manager."

                            :

                            "✕ This request has been rejected by the manager."
                    }

                        </div>
                        `
            }

                </div>
            `;

        }).join("");
}


/* ---------------------------------------------------------
   FILTER SWAP REQUESTS
--------------------------------------------------------- */

function filterSwapRequests() {

    const searchInput =
        document.getElementById(
            "swapSearch"
        );


    const statusInput =
        document.getElementById(
            "swapStatusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedStatus =
        statusInput
            ? statusInput.value
            : "ALL";


    const requests =
        window.allSwapRequests ||
        allSwapRequests ||
        [];


    const filtered =
        requests.filter(request => {

            const requester =
                request.requester || {};


            const colleague =
                request.colleague || {};


            const requesterShift =
                request.requesterShift || {};


            const colleagueShift =
                request.colleagueShift || {};


            const searchableText = `

                ${request.id || ""}

                ${requester.name || ""}

                ${requester.email || ""}

                ${colleague.name || ""}

                ${colleague.email || ""}

                ${requesterShift.shiftName || ""}

                ${colleagueShift.shiftName || ""}

                ${requesterShift.date || ""}

                ${colleagueShift.date || ""}

                ${requesterShift.startTime || ""}

                ${requesterShift.endTime || ""}

                ${colleagueShift.startTime || ""}

                ${colleagueShift.endTime || ""}

                ${request.status || ""}

            `.toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    search
                );


            const matchesStatus =
                selectedStatus === "ALL" ||
                request.status ===
                selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    renderSwapRequests(
        filtered
    );
}


/* ---------------------------------------------------------
   APPROVE SWAP REQUEST
--------------------------------------------------------- */

async function approveSwapRequest(id) {

    const confirmed =
        confirm(
            "Approve Swap Request #" +
            id +
            "?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests/${id}/approve`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `Approval failed with status ${response.status}`
            );
        }


        await response.json();


        alert(
            "Swap request approved successfully."
        );


        await loadSwapRequests();

        await loadRoster();

        await loadDashboardCounts();


    } catch (error) {

        console.error(
            "Approve error:",
            error
        );


        alert(
            "Unable to approve request.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   REJECT SWAP REQUEST
--------------------------------------------------------- */

async function rejectSwapRequest(id) {

    const confirmed =
        confirm(
            "Reject Swap Request #" +
            id +
            "?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/swap-requests/${id}/reject`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `Reject failed with status ${response.status}`
            );
        }


        await response.json();


        alert(
            "Swap request rejected."
        );


        await loadSwapRequests();

        await loadDashboardCounts();


    } catch (error) {

        console.error(
            "Reject error:",
            error
        );


        alert(
            "Unable to reject request.\n\n" +
            error.message
        );
    }
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardCounts();

        loadEmployees();

        loadShifts();

        loadRoster();

        loadSwapRequests();
    }
);


/* =========================================================
   WINDOW LOAD
========================================================= */

window.addEventListener(
    "load",
    function () {

        loadDashboardCounts();

        loadSwapRequests();
    }
);

