async function loadByPath() {
    const path = new CookiesOp().getCookie('path');
    switch(path) {
        case 'main':
            await loadPage('main'); break;
        case 'view_chat':
            viewUploads('chat'); break;
        case 'view_files':
            viewUploads('files'); break;
        case 'view_user':
            viewUploads('user'); break;
        case 'setting':
            loadSettingPage(); break;
        default: await loadPage('init'); return;
    }
}

async function loadPage(page) {
    if(page !== 'menu' && page !== 'init') {
        await closeMenu(true);
        removeIntervals();
    }

    const index_main = document.getElementById('index-main');
    switch(page) {
        case 'init':
        case 'main':
            new CookiesOp().setCookie('path', 'main');
            if(display_mode === 'Laptop')
                setHistoryGetter();
            index_main.innerHTML = main;
            break;
        case 'menu':
            index_main.insertAdjacentHTML('afterbegin', menu);
            break;
        case 'view':
            index_main.innerHTML = views;
            break;
        case 'setting':
            index_main.innerHTML = settings;
            break;
        default: return;
    }
}

async function closeMenu(fast = false) {
    const menu_exists = document.getElementById('menu');
    if(menu_exists) {
        // remove menu
        const menu_page = document.getElementById('menu');
        if(!fast) {
            menu_page.style.transform = 'scaleY(0)';
            await new Promise(s=>setTimeout(s, 1000));
        }
        menu_page.remove();   
    }
    return !menu_exists;
}

async function openMenu() {
    if(await closeMenu()) {
        // add menu
        loadPage('menu');
        const menu_page = document.getElementById('menu');
        await new Promise(s=>setTimeout(s, 1));
        menu_page.style.transform = 'scaleY(1)';
    }
}

function loadSettings() {
    if(!localStorage.getItem('get_history_timeout'))
        localStorage.setItem('get_history_timeout', '10');

    // console.log(localStorage.getItem('get_history_timeout'));
}

function loadSettingPage() {
    new CookiesOp().setCookie('path', 'setting');
    loadPage('setting');
}

function submitSetting(event) {
    event.preventDefault();

    const seconds = parseFloat(event.target.seconds.value);
    if(seconds >= -1) {
        localStorage.setItem('get_history_timeout', seconds.toString());
        showSomething("???????????????");
    }
}

function showSomething(text) {
    const copied = document.createElement('div');
    copied.className = 'show-something-alert';
    copied.innerHTML = text;
    document.body.appendChild(copied);
    new Promise(s => setTimeout(() => {
        copied.remove();
        s();
    }, 1000));
}

function createCover() {
    const cover = document.createElement('div');
    cover.className = 'cover';
    return cover;
}

function createLoadingPage(cover) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = "<img src='static/pic/arrow-repeat.svg'><span>Loading</span>";
    cover.appendChild(loading);
}

const main = `
<div class="upload-panel">
    <div class="select-btn select-btn-text" onclick="upload(0)">
        ????????????????????????
    </div>
    <div class="select-btn" onclick="upload(1)">
        ????????????????????????
</div>
`;

const menu = `
<div class='menu' id='menu'>
    <span class='menu-item' onclick="loadPage('main')">??????</span>
    <span class='menu-item' onclick="viewUploads('chat')">????????????????????????</span>
    <span class='menu-item' onclick="viewUploads('files')">????????????????????????</span>
    <span class='menu-item' onclick="viewUploads('user')">????????????????????????</span>
    <span class='menu-item' onclick="loadSettingPage()">??????</span>
</div>
`;

const views = `<div class='view-page' id='view-page'></div>`;

const settings = `
<form class='settings' onsubmit='submitSetting(event)'>
    <div class='single-setting' name='set-auto-get-time'>
        <span>???????????????????????????????????????????????????<input 
            type='number' value='${
                parseFloat(localStorage.getItem('get_history_timeout'))
            }' name='seconds'></span>
        <span class='note'>*?????????10?????????????????????-1???????????????</span>
    </div>
    <button type='submit' class='update'>????????????</button>
</form>
`;


class CookiesOp {

    getCookie(key) {
        if(document.cookie.length) {
            const parts = document.cookie.split(';');
            for(var i = 0; i < parts.length; i++) {
                const [k, v] = parts[i].split('=');
                if(k === key)
                    return v;
            }
        }
        return null;
    }

    setCookie(key, value) {
        var cookie_str = '';
        if(document.cookie.length) {
            const parts = document.cookie.split(';');
            for(var i = 0; i < parts.length; i++) {
                const [k, v] = parts[i].split('=')[0];
                if(k === key)
                    continue;
                cookie_str += `${k}=${v};`;
            }
        }
        document.cookie = `${key}=${value};` + cookie_str;
    }

}