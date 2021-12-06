const apostrophe = '@@replacedapostrophe@@'

var intervals = [null, null, null];
var display_mode = 'Mobile';

window.onload = () => {
    if(screen.width > screen.height) {
        display_mode = 'Laptop'
        document.getElementById('nv-bar').classList.add('nv-bar-laptop');
        document.getElementById('index-main').classList.add('laptop-mode');
    }
    loadPage();
}

function removeIntervals() {
    intervals.forEach(e=>{
        clearInterval(e);
    })
}

function setHistoryGetter() {
    var upload_history_old = [];

    function updatePage(upload_history) {
        const index_main = document.getElementById('index-main');
        const current = document.getElementById('show-history');
        if(upload_history.length) {
            if(upload_history_old.length && upload_history[0][0] === upload_history_old[0][0])
                return;
            if(!index_main.classList.contains('contains-history'))
                index_main.classList.add('contains-history');
        } else {
            if(upload_history_old.length) {
                upload_history_old = [];
                index_main.classList.remove('contains-history');
                current.remove();
            }
            return;
        }
        
        if(current)
            current.remove();
        upload_history_old = upload_history;

        index_main.insertAdjacentHTML("afterbegin", `
        <div class='show-history' id='show-history'>
            ${upload_history.map(e => formatPost(e)).join('')}
        </div>
        `);
    }

    function getHistory() {
        const http_request = new XMLHttpRequest();
        http_request.open('GET', '/history', true);
        http_request.onreadystatechange = () =>{
            if(http_request.readyState === 4 && http_request.status === 200) {
                res = JSON.parse(http_request.responseText);
                updatePage(res.data);
            }
        };
        http_request.send();
    }

    getHistory();
    // get history every minute
    intervals[0] = setInterval(getHistory, 60000);
}

function copy(text) {

    function showCopied() {
        const copied = document.createElement('div');
        copied.className = 'copied-alert';
        copied.innerHTML = '复制成功！';
        document.body.appendChild(copied);
        new Promise(s => setTimeout(() => {
            copied.remove();
            s();
        }, 1000));
    }

    text = text.replace(new RegExp(apostrophe, "g"), '\'');
    if(navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showCopied)
    } else {
        const copy_text = document.createElement('textarea');
        copy_text.className = 'hidden-text-area';
        copy_text.value = text;
        document.body.appendChild(copy_text);
        copy_text.select();
        document.execCommand('copy');
        showCopied();
        copy_text.remove();
    }
}

function remove(type, id) {
    const rm_form = document.createElement('form');
    rm_form.method = 'POST';
    rm_form.action = '/remove';
    rm_form.innerHTML = `
        <input type='hidden' name='type' value='${type}'>
        <input type='hidden' name='id' value='${id}'>
        <input type='hidden' name='path' value='${window.location.pathname}'>
    `;
    document.body.appendChild(rm_form);
    rm_form.submit();
    document.body.removeChild(rm_form);
}

function formatPost(post) {
    var main_str = "";
    if(post[4] === 'file') {
        if(post[3].match(/(.png|.jpg|.jpeg|.gif)$/i))
            main_str = `<img src='/file/${post[0]}_${post[3]}'>`;
        else
            main_str = `文件 ${post[3]}`;
    } else if(post[4] === 'chat') {
        const content = post[3]
        const urls = content.match(
            /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);

        var current_pos = 0;
        if(urls) {
            urls.forEach(e => {
                const index = content.indexOf(e);
                main_str += content.substring(current_pos, index);
                main_str += `<a href='${e}' target='_blank'>${e}</a>`;
                current_pos += index + e.length;
            })
        }

        if(current_pos !== content.length - 1)
            main_str += content.substring(current_pos)
    }

    return (
    `<form class='post-info'
        >用户${post[2]}\n于${new Date(post[1]).toLocaleString()}发表：
        <span>${main_str}</span>
        ${post[4] === 'file' ? 
        `<a href='/file/${post[0]}_${post[3]}'
            download='${post[3]}' class='op'>下载</a>` :
        `<span class='op' onclick="copy('${post[3].replace(/'/g, apostrophe)}')">复制</span>`
        }${post[2] === user_id ? 
        `<span class='op danger' onclick="remove('${post[4]}', ${post[0]})">删除</span>` : ''}
    </form>`)
}


function getSelectedFiles(event) {
    const files = event.target.files;
    const file_info = document.getElementById('file-info');
    const length = files.length;

    if(length) {
        var content = `当前已选择${length}个文件\r\n`;
        for(var i = 1; i <= (length < 5 ? length : 5); i++)
            content += `${i}: ${files[i-1].name}\r\n`;

        if(length > 5)
            content += "......\r\n";

        file_info.style.textAlign = 'left';
        file_info.textContent = content;
    } else {
        file_info.style.textAlign = 'center';
        file_info.textContent = "当前未选择任何文件，请点击并选择文件";
    }
}

async function upload(type) {
    // 0 for text and 1 for file

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
    
    function createForm(cover) {
        const form = document.createElement('form');
        form.classList.add('panel');
        form.enctype = 'multipart/form-data';
        form.method = 'POST';
        form.action = '/upload';

        const submit = document.createElement('div');
        submit.className = 'functional-btn';
        submit.onclick = () => {
            form.style.display = 'none';
            createLoadingPage(cover);
            form.submit();
        }
        const submit_img = document.createElement('img');
        submit_img.src = 'static/pic/upload.svg';
        submit_img.title = '上传';
        submit.appendChild(submit_img);

        const cancel = document.createElement('div');
        cancel.className = 'functional-btn';
        cancel.classList.add('cancel');
        cancel.onclick = async () => {
            cover.style.transform = 'scale(0, 0)';
            await new Promise(s=>setTimeout(s, 1000));
            document.body.removeChild(cover);
        }
        const cancel_img = document.createElement('img');
        cancel_img.src = 'static/pic/x-lg.svg';
        cancel_img.title = '取消';
        cancel.appendChild(cancel_img);

        const user_id_submit = document.createElement('input');
        user_id_submit.type = 'hidden';
        user_id_submit.name = 'user_id';
        user_id_submit.value = user_id;

        form.appendChild(submit);
        form.appendChild(cancel);
        form.appendChild(user_id_submit);
        
        cover.appendChild(form);
        return form;
    }

    function createUploadText(form) {
        form.insertAdjacentHTML("beforeend", `
            <textarea name='text' class='upload-text'
                placeholder='请在此输入您要上传的文字，点击左侧按钮上传或取消'
                ></textarea>
            <input type='hidden' name='type' value='text'>
            <input type='hidden' name='path' value='${window.location.pathname}'>
        `)
    }

    function createUploadFile(form) {

        form.insertAdjacentHTML("beforeend", `
            <div class='upload-file'>
                <input type='file' name='file'
                    onchange='getSelectedFiles(event)' multiple=''>
                <span id='file-info' class='file-info'
                    >当前未选择任何文件，请点击此处选择文件或拖拽文件到此处
                </span>
            </div>
            <input type='hidden' name='type' value='file'>
            <input type='hidden' name='path' value='${window.location.pathname}'>
        `)
    }

    const cover = createCover();
    const form = createForm(cover);

    switch(type) {
        case 0: createUploadText(form); break;
        case 1: createUploadFile(form); break;
        default: return;
    }

    document.body.appendChild(cover);
    await new Promise(s=>setTimeout(s, 1));
    cover.style.transform = 'scale(1, 1)';
}

// similiar to history one
function viewUploads(type) {

    var record_old = [];

    function updatePage(uploads) {
        if(uploads.length && record_old.length &&
           record_old[0][0] === uploads[0][0])
            return;

        record_old = uploads;
        const view_page = document.getElementById('view-page');
        if(uploads.length)
            view_page.innerHTML = uploads.map(e => formatPost(e)).join('');
        else
            view_page.innerHTML = "<h1 class='no-upload'>当前没有任何记录，可以前往主页进行上传！</h1>";
    }

    function getUploads() {
        const http_request = new XMLHttpRequest();
        http_request.open('GET', '/uploads/'+type, true);
        http_request.onreadystatechange = () =>{
            if(http_request.readyState === 4 && http_request.status === 200) {
                res = JSON.parse(http_request.responseText);
                updatePage(res.data);
            }
        };
        http_request.send();
    }

    loadPage('view');

    getUploads();
    intervals[(type === 'chat' ? 1 : 2)] = setInterval(getUploads, 10000);
}