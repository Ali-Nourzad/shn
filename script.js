// ۱. تنظیمات Supabase (این مقادیر را از پنل خود کپی کنید)
const SUPABASE_URL = 'https://zyziyyhzxsnwzrsubulu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RIGsFvG_eSFBmXYAxe8UHA_JQjhVkpR';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentType = 'user';
let currentMode = 'login';

// توابع را به صورت عمومی تعریف می‌کنیم تا در onclick در دسترس باشند
window.hideForm = function() {
    document.getElementById('registration-section').style.display = 'none';
};

window.toggleMode = function() {
    currentMode = currentMode === 'login' ? 'register' : 'login';
    renderForm();
};

window.openModal = function(type, mode) {
    currentType = type;
    currentMode = mode;
    document.getElementById('registration-section').style.display = 'flex';
    renderForm();
};

async function handleAuth(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (currentMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else alert('با موفقیت وارد شدید!');
    } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert('ثبت‌نام موفق! لطفا ایمیل خود را برای تایید چک کنید.');
    }
}

function renderForm() {
    const form = document.getElementById('auth-form');
    const title = document.getElementById('form-title');
    const switchBtn = document.getElementById('switch-mode-btn');

    form.onsubmit = handleAuth;
    title.innerText = currentMode === 'login' ? "ورود" : "ثبت‌نام";
    
    form.innerHTML = `
        <div class="form-group"><input type="email" name="email" placeholder="ایمیل" required></div>
        <div class="form-group"><input type="password" name="password" placeholder="رمز عبور" required></div>
        <button type="submit" class="submit-btn">${currentMode === 'login' ? 'ورود' : 'ثبت‌نام'}</button>
    `;
    
    switchBtn.innerText = currentMode === 'login' ? "حساب ندارید؟ ثبت‌نام" : "حساب دارید؟ ورود";
}
