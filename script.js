(function() {
    const SUPABASE_URL = 'https://zyziyyhzxsnwzrsubulu.supabase.co'; 
    const SUPABASE_KEY = 'sb_publishable_RIGsFvG_eSFBmXYAxe8UHA_JQjhVkpR';
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let currentMode = 'login'; 
    let targetRole = ''; // نقش مورد نظر که از کارت انتخاب شده

    window.hideForm = () => {
        document.getElementById('registration-section').style.display = 'none';
    };

    // تغییر پارامترها: حالا نوع عملیات و نقش هدف را می‌گیرد
    window.openModal = (mode, role) => {
        currentMode = mode;
        targetRole = role; // ذخیره می‌کنیم که کاربر می‌خواهد وارد چه نقشه‌ای شود
        document.getElementById('registration-section').style.display = 'flex';
        renderForm();
    };

    function renderForm() {
        const form = document.getElementById('auth-form');
        const formTitle = document.getElementById('form-title');
        const switchModeBtn = document.getElementById('switch-mode-btn');

        // اگر حالت ثبت نام است و نقش کارمند باشد، دکمه تغییر حالت را مخفی می‌کنیم (چون کارمند ثبت نام ندارد)
        let switchBtnHtml = '';
        if (targetRole === 'user') {
            switchBtnHtml = currentMode === 'login' 
                ? `<button type="button" class="switch-btn" onclick="window.toggleMode()">حساب ندارید؟ ثبت‌نام</button>`
                : `<button type="button" class="switch-btn" onclick="window.toggleMode()">حساب دارید؟ ورود</button>`;
        }

        form.innerHTML = `
            <div class="form-group"><input type="email" id="email" placeholder="ایمیل" required></div>
            <div class="form-group"><input type="password" id="password" placeholder="رمز عبور" required></div>
            <button type="submit" class="submit-btn">${currentMode === 'login' ? 'ورود' : 'ثبت‌نام'}</button>
            ${switchBtnHtml}
        `;
        formTitle.innerText = currentMode === 'login' ? "ورود" : "ثبت‌نام";
    }

    // تابع کمکی برای تغییر حالت (فقط برای کاربران)
    window.toggleMode = () => {
        currentMode = currentMode === 'login' ? 'register' : 'login';
        renderForm();
    };

    document.getElementById('auth-form').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (currentMode === 'login') {
            // ۱. تلاش برای ورود
            const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({ email, password });

            if (authError) {
                alert("خطا در ورود: " + authError.message);
                return;
            }

            // ۲. بررسی نقش از جدول پروفایل
            const { data: profile, error: profileError } = await window.supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError || !profile) {
                alert("پروفایل کاربر یافت نشد!");
                await window.supabaseClient.auth.signOut();
                return;
            }

            // ۳. مقایسه نقش پروفایل با نقش کارت انتخاب شده
            if (profile.role === targetRole) {
                alert(`خوش آمدید ${profile.role}!`);
                window.location.href = targetRole === 'user' ? 'user_dashboard.html' : 'employee_dashboard.html';
            } else {
                alert(`خطا: شما با اکانت ${profile.role} سعی دارید وارد بخش ${targetRole === 'user' ? 'کاربر' : 'کارمند'} شوید!`);
                await window.supabaseClient.auth.signOut();
            }

        } else {
            // --- شروع بخش اصلاح شده ---
            // ۱. تلاش برای ثبت‌نام در سیستم احراز هویت (Auth)
            const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { role: 'user' } // ذخیره در metadata برای اطمینان
                }
            });

            if (authError) {
                alert("خطا در ثبت‌نام: " + authError.message);
                return; // اگر خطا داشت، از تابع خارج شو
            }

            // ۲. اگر ثبت‌نام موفق بود، حالا دستی پروفایل را در جدول profiles بساز
            if (authData.user) {
                const { error: profileError } = await window.supabaseClient
                    .from('profiles')
                    .insert([
                        { 
                            id: authData.user.id, 
                            email: email, 
                            role: 'user' 
                        }
                    ]);

                if (profileError) {
                    console.error("خطای ساخت پروفایل:", profileError);
                    alert("ثبت‌نام با موفقیت انجام شد، اما ایجاد پروفایل با خطا مواجه شد. لطفا با پشتیبانی تماس بگیرید.");
                } else {
                    alert("ثبت‌نام و ایجاد پروفایل با موفقیت انجام شد!");
                    window.hideForm();
                }
            }
            // --- پایان بخش اصلاح شده ---
        }
    };
})();
