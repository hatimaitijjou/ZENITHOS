const HatimOS = {
    z: 100,
    apps: {},
    installedApps: JSON.parse(localStorage.getItem('h_apps')) || ['Browser', 'Notes', 'Calculator', 'Tic Tac Toe'],

    boot() {
        this.stars();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.registerAllApps();
        this.renderDesktop();
        this.loadStore();
    },

    unlock() {
        const lock = document.getElementById("lock");
        lock.style.transform = "translateY(-100%)";
        setTimeout(() => lock.style.display = "none", 1000);
    },

    stars() {
        const space = document.getElementById("space");
        for (let i = 0; i < 80; i++) {
            const s = document.createElement("div");
            s.className = "star";
            s.style.left = Math.random() * 100 + "vw";
            s.style.top = Math.random() * 100 + "vh";
            s.style.animationDelay = Math.random() * 2 + "s";
            space.appendChild(s);
        }
    },

    updateClock() {
        const t = new Date().toLocaleTimeString('ar-EG');
        if(document.getElementById("clock")) document.getElementById("clock").innerText = t;
        if(document.getElementById("mini-clock")) document.getElementById("mini-clock").innerText = t;
    },

    registerAllApps() {
        const appList = [
            { id: 'Snake', name: 'لعبة الثعبان', icon: 'fa-snake', color: '#4CAF50' },
            { id: 'Browser', name: 'المتصفح', icon: 'fa-globe', color: '#2196F3' },
            { id: 'Calculator', name: 'الحاسبة', icon: 'fa-calculator', color: '#FF9800' },
            { id: 'Notes', name: 'المفكرة', icon: 'fa-sticky-note', color: '#FFEB3B' },
            { id: 'Tic Tac Toe', name: 'إكس أو', icon: 'fa-gamepad', color: '#E91E63' },
            { id: 'AI', name: 'المساعد الذكي', icon: 'fa-robot', color: '#9C27B0' }
        ];

        appList.forEach(app => {
            this.apps[app.id] = {
                ...app,
                render: (win) => this.getAppTemplate(app.id, win)
            };
        });
    },

    renderDesktop() {
        const desk = document.getElementById("desktop");
        desk.innerHTML = "";
        this.installedApps.forEach(appId => {
            const app = this.apps[appId];
            if (!app) return;
            const icon = document.createElement("div");
            icon.className = "icon";
            icon.innerHTML = `<i class="fas ${app.icon}" style="color:${app.color}"></i><span>${app.name}</span>`;
            icon.onclick = () => this.openApp(appId);
            desk.appendChild(icon);
        });
    },

    openApp(id) {
        if (document.getElementById(`win-${id}`)) {
            this.focusWindow(`win-${id}`);
            return;
        }
        const app = this.apps[id];
        const win = document.createElement("div");
        win.className = "window";
        win.id = `win-${id}`;
        win.style.zIndex = ++this.z;
        win.innerHTML = `
            <div class="bar" onmousedown="HatimOS.focusWindow('win-${id}')">
                <span><i class="fas ${app.icon}"></i> ${app.name}</span>
                <span class="close-win" onclick="document.getElementById('win-${id}').remove()">×</span>
            </div>
            <div class="body"></div>
        `;
        document.body.appendChild(win);
        app.render(win.querySelector(".body"));
        this.makeDraggable(win);
    },

    focusWindow(winId) {
        document.getElementById(winId).style.zIndex = ++this.z;
    },

    makeDraggable(win) {
        const bar = win.querySelector(".bar");
        let x = 0, y = 0, nx = 0, ny = 0;
        bar.onmousedown = (e) => {
            e.preventDefault();
            nx = e.clientX; ny = e.clientY;
            document.onmousemove = (ev) => {
                x = nx - ev.clientX; y = ny - ev.clientY;
                nx = ev.clientX; ny = ev.clientY;
                win.style.top = (win.offsetTop - y) + "px";
                win.style.left = (win.offsetLeft - x) + "px";
            };
            document.onmouseup = () => document.onmousemove = null;
        };
    },

    toggleStore(show) {
        document.getElementById("store").style.display = show ? "block" : "none";
    },

    loadStore() {
        const grid = document.getElementById("store-items");
        grid.innerHTML = "";
        Object.keys(this.apps).forEach(id => {
            const app = this.apps[id];
            const isInstalled = this.installedApps.includes(id);
            const card = document.createElement("div");
            card.className = "store-card";
            card.innerHTML = `
                <i class="fas ${app.icon} fa-2x"></i>
                <h3>${app.name}</h3>
                <button onclick="HatimOS.installApp('${id}')" ${isInstalled ? 'disabled' : ''}>
                    ${isInstalled ? 'مثبت' : 'تثبيت'}
                </button>
            `;
            grid.appendChild(card);
        });
    },

    installApp(id) {
        if (!this.installedApps.includes(id)) {
            this.installedApps.push(id);
            localStorage.setItem('h_apps', JSON.stringify(this.installedApps));
            this.renderDesktop();
            this.loadStore();
        }
    },

    getAppTemplate(id, container) {
        switch (id) {
            case 'Notes':
                container.innerHTML = `<textarea placeholder="اكتب ملاحظاتك هنا..." style="width:100%;height:100%;background:transparent;color:white;border:none;outline:none;resize:none;"></textarea>`;
                break;
            case 'Calculator':
                container.innerHTML = `<div class="calc-ui">قريباً.. يمكنك وضع كود الحاسبة هنا</div>`;
                break;
            case 'Browser':
                container.innerHTML = `<iframe src="https://www.bing.com" style="width:100%;height:100%;border:none;background:white;"></iframe>`;
                break;
            default:
                container.innerHTML = `<div style="text-align:center;padding:20px;">محتوى تطبيق ${id} قيد التطوير</div>`;
        }
    }
};
const HOS = {
    z: 100,
    password: localStorage.getItem('hos_password'), // جلب كلمة المرور المخزنة
    apps: {},
    installed: JSON.parse(localStorage.getItem('installed_apps')) || ['Browser', 'Notes', 'Calculator'],

    boot() {
        this.createStars();
        this.timer();
        setInterval(() => this.timer(), 1000);
        this.initApps();
        this.renderDesktop();
        
        // التحقق من وجود كلمة مرور
        const setupBox = document.getElementById("setup-box");
        const loginBox = document.getElementById("login-box");

        if (!this.password) {
            setupBox.style.display = "block";
            loginBox.style.display = "none";
        } else {
            setupBox.style.display = "none";
            loginBox.style.display = "block";
        }
    },

    // دالة إنشاء كلمة المرور لأول مرة
    setupPassword() {
        const newPass = document.getElementById("new-pass").value;
        if (newPass.length < 4) {
            alert("يرجى إدخال كلمة مرور مكونة من 4 رموز على الأقل");
            return;
        }
        localStorage.setItem('hos_password', newPass); // حفظها في الذاكرة
        this.password = newPass;
        
        alert("تم تعيين كلمة المرور بنجاح!");
        document.getElementById("setup-box").style.display = "none";
        document.getElementById("login-box").style.display = "block";
    },

    // دالة التحقق العادية
    checkPassword() {
        const val = document.getElementById("pass-field").value;
        const screen = document.getElementById("lock-screen");
        
        if (val === this.password) {
            screen.style.transform = "translateY(-100%)"; // حركة رفع الستارة
            screen.style.opacity = "0";
            setTimeout(() => screen.style.display = "none", 800);
        } else {
            const msg = document.getElementById("error-msg");
            msg.innerText = "كلمة المرور التي أدخلتها غير صحيحة!";
            document.getElementById("pass-field").value = "";
            
            // إضافة اهتزاز عند الخطأ
            document.querySelector("#login-box .login-box").classList.add("shake");
            setTimeout(() => document.querySelector("#login-box .login-box").classList.remove("shake"), 500);
        }
    },

    // ... باقي الدوال (createStars, timer, openApp إلخ) تظل كما هي ...
};
