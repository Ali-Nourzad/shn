(function() {
    // ۱. تنظیمات اولیه
    const SUPABASE_URL = 'https://zyziyyhzxsnwzrsubulu.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_RIGsFvG_eSFBmXYAxe8UHA_JQjhVkpR';
    
    // مقداردهی سوپابیس (دسترسی از طریق window برای امنیت و دسترسی سراسری)
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let currentMode = 'login';

    // ۲. تعریف توابع به صورت متد روی window برای دسترسی در HTML
    window.hideForm = function() {
        document.getElementById('registration-section').style.display = 'none';
    };

    window.toggleMode = function() {
        currentMode = currentMode === 'login' ? 'register' : 'login';
        renderForm();
    };

    window.openModal = function(type, mode) {
        currentMode = mode || 'login';
        document.getElementById('registration-section').style.display = 'flex';
        renderForm();
    };

    // ۳. تابع اصلی ثبت‌نام و ورود
    async function handleAuth(event) {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            if (currentMode === 'login') {
                const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;
                alert('با موفقیت وارد شدید!');
            } else {
                const { error } = await window.supabaseClient.auth.signUp({ email, password });
                if (error) throw error;
                alert('ثبت‌نام موفق! لطفا ایمیل خود را برای تایید چک کنید.');
            }
        } catch (err) {
            alert(err.message);
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
})();
