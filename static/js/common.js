async function loadPage(page = 'init') {
    if(page !== 'menu' && page !== 'init') {
        await closeMenu(true);
        removeIntervals();
    }

    const index_main = document.getElementById('index-main');
    switch(page) {
        case 'init':
        case 'main':
            if(display_mode === 'Laptop')
                setHistoryGetter();
            index_main.innerHTML = main;
            break;
        case 'menu':
            index_main.insertAdjacentHTML('afterbegin', menu);
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
    <span class='menu-item'>查看所有文字记录</span>
    <span class='menu-item'>查看所有文件记录</span>
    <span class='menu-item'>管理我的上传记录</span>
    <span class='menu-item'>设置</span>
</div>
`;