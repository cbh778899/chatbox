window.onload = () => {
    if(display_mode === 'Laptop') {
        document.getElementById('nv-bar').classList.add('nv-bar-laptop');
        if(history.length)
            document.getElementById('index-main').classList.add('laptop-mode');
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
        const type = document.createElement('input');
        type.type = 'hidden';
        type.name = 'type';
        type.value = 'text';
        form.appendChild(type);

        
        const path = document.createElement('input');
        path.type = 'hidden';
        path.name = 'path';
        path.value = window.location.pathname;
        form.appendChild(path);

        const text = document.createElement('textarea');
        text.name = 'text';
        text.className = 'upload-text';
        text.placeholder = '请在此输入您要上传的文字，点击左侧按钮上传或取消';
        form.appendChild(text);
    }

    function createUploadFile(form) {
        const text = document.createElement('textarea');
        text.name = 'text';
        text.className = 'upload-text';
        form.appendChild(text);
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