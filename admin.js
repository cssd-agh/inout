// تهيئة Supabase
const { createClient } = supabase;
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener('DOMContentLoaded', async () => {
    const breakTableBody = document.querySelector('#breakTable tbody');

    const { data, error } = await supabase
        .from('employees')
        .select('name, total_break_time');

    if (error) {
        console.error(error);
        return;
    }

    data.forEach((employee) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const timeCell = document.createElement('td');

        nameCell.textContent = employee.name;
        timeCell.textContent = formatTime(employee.total_break_time);

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        breakTableBody.appendChild(row);
    });
});

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`;
}
