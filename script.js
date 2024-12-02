const supabaseUrl = 'https://amljjbqcbklcukpeduzp.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }]);

    if (error) {
        console.error(error);
    } else {
        fetchUsers();
    }
});

async function fetchUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.error(error);
    } else {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        data.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', user.id);

                if (error) {
                    console.error(error);
                } else {
                    fetchUsers();
                }
            });
            li.appendChild(deleteButton);
            userList.appendChild(li);
        });
    }
}

fetchUsers();
