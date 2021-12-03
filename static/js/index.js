window.onload = () => {
    if(display_mode === 'Laptop') {
        document.getElementById('nv-bar').classList.add('nv-bar-laptop');
        // if(history.length)
        //     document.getElementById('index-main').classList.add('laptop-mode');
        setHistoryGetter();
    }
}

var history = [];

function setHistoryGetter() {
    function updatePage() {
        const index_main = document.getElementById('index-main');
        if(history.length && !index_main.classList.contains('laptop-mode'))
            index_main.classList.add('laptop-mode');
        
    }

    function getHistory() {
        const http_request = new XMLHttpRequest();
        http_request.open('GET', '/history', true);
        http_request.onreadystatechange = () =>{
            if(http_request.readyState === 4 && http_request.status === 200) {
                res = JSON.parse(http_request.responseText);
                if(history.toString() !== res.data.toString()) {
                    history = res.data;
                    updatePage();
                }
            }
        };
        http_request.send();
    }

    getHistory();
    // get history every minute
    setTimeout(getHistory, 60000);
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
    
    function createForm(cover) {
        const form = document.createElement('form');
        form.classList.add('panel');
        form.enctype = 'multipart/form-data';
        form.method = 'POST';
        form.action = '/upload';

        const submit = document.createElement('div');
        submit.className = 'functional-btn';
        submit.onclick = () => form.submit();
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

        form.appendChild(submit);
        form.appendChild(cancel);
        
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
                    >当前未选择任何文件，请点击并选择文件
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