let currentDate = new Date();
let currentView = 'month';
let events = {};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    const calendarDays = document.getElementById('calendarDays');
    calendarBody.innerHTML = '';
    calendarDays.innerHTML = '';

    // Render day names
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day-name');
        dayElement.textContent = day;
        calendarDays.appendChild(dayElement);
    });

    if (currentView === 'month') {
        renderMonthView();
    } else {
        renderWeekView();
    }

    updateHeader();
}

function renderMonthView() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
        const cell = createCalendarCell(new Date(startDate));
        document.getElementById('calendarBody').appendChild(cell);
        startDate.setDate(startDate.getDate() + 1);
    }
}

function renderWeekView() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
        const cell = createCalendarCell(new Date(startOfWeek));
        document.getElementById('calendarBody').appendChild(cell);
        startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
}

function createCalendarCell(date) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-cell');
    
    if (date.getMonth() !== currentDate.getMonth()) {
        cell.classList.add('other-month');
    }

    cell.textContent = date.getDate();
    
    const dateString = formatDate(date);
    if (events[dateString]) {
        events[dateString].forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event;
            cell.appendChild(eventElement);
        });
    }

    cell.addEventListener('click', () => openEventModal(dateString));

    return cell;
}

function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function openEventModal(date) {
    document.getElementById('eventModal').style.display = 'block';
    document.getElementById('addEvent').onclick = () => addEvent(date);
}

function addEvent(date) {
    const eventName = document.getElementById('eventName').value;
    if (eventName) {
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push(eventName);
        renderCalendar();
        closeEventModal();
    }
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.getElementById('eventName').value = '';
}

function updateHeader() {
    const headerElement = document.getElementById('currentMonth');
    if (currentView === 'month') {
        headerElement.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        headerElement.textContent = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }
}

function navigateCalendar(direction) {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else {
        currentDate.setDate(currentDate.getDate() + (7 * direction));
    }
    renderCalendar();
}

document.getElementById('prevMonth').addEventListener('click', () => navigateCalendar(-1));
document.getElementById('nextMonth').addEventListener('click', () => navigateCalendar(1));

document.getElementById('toggleView').addEventListener('click', () => {
    currentView = currentView === 'month' ? 'week' : 'month';
    renderCalendar();
});

document.getElementById('closeModal').addEventListener('click', closeEventModal);

renderCalendar();
