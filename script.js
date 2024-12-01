// تهيئة Supabase
const { createClient } = supabase;
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let startTime = null;
let endTime = null;
let totalBreakTime = 0;
let employeeName = '';

document.getElementById('startBreak').addEventListener('click', () => {
    employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        startTime = new Date();
        alert('بدأ الاستأذان في: ' + startTime.toLocaleTimeString());
    } else {
        alert('يرجى إدخال اسم الموظف.');
    }
});

document.getElementById('endBreak').addEventListener('click', async () => {
    if (startTime && employeeName) {
        endTime = new Date();
        const breakDuration = (endTime - startTime) / 1000; // حساب الفرق بالثواني
        totalBreakTime += breakDuration;

        // تحديث قاعدة البيانات
        const { data, error } = await supabase
            .from('employees')
            .select('total_break_time')
            .eq('name', employeeName)
            .single();

        if (error) {
            console.error(error);
            return;
        }

        if (data) {
            await supabase
                .from('employees')
                .update({ total_break_time: data.total_break_time + breakDuration })
                .eq('name', employeeName);
        } else {
            await supabase
                .from('employees')
                .insert([{ name: employeeName, total_break_time: breakDuration }]);
        }

        updateBreakTimeDisplay();
        alert('انتهى الاستأذان في: ' + endTime.toLocaleTimeString());
    } else {
        alert('يرجى بدء الاستأذان أولاً وإدخال اسم الموظف.');
    }
});

function updateBreakTimeDisplay() {
    const breakTimeElement = document.getElementById('breakTime');
    breakTimeElement.textContent = `وقت الاستأذان: ${formatTime(totalBreakTime)}`;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`;
}
