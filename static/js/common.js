async function loadByPath() {
    const path = new CookiesOp().getCookie('path');
    console.log(path);
    switch(path) {
        case 'main':
            await loadPage('main'); break;
        case 'view_chat':
            viewUploads('chat'); break;
        case 'view_files':
            viewUploads('files'); break;
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

const main = `
<div class="upload-panel">
    <div class="select-btn select-btn-text" onclick="upload(0)">
        点击此处上传文字
    </div>
    <div class="select-btn" onclick="upload(1)">
        点击此处上传文件
</div>
`;

const menu = `
<div class='menu' id='menu'>
    <span class='menu-item' onclick="loadPage('main')">主页</span>
    <span class='menu-item' onclick="viewUploads('chat')">查看所有文字记录</span>
    <span class='menu-item' onclick="viewUploads('files')">查看所有文件记录</span>
    <span class='menu-item'>管理我的上传记录</span>
    <span class='menu-item'>设置</span>
</div>
`;

const views = `<div class='view-page' id='view-page'></div>`;


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