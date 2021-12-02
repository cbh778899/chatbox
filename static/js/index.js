window.onload = () => {
    if(display_mode === 'Laptop') {
        document.getElementById('nv-bar').classList.add('nv-bar-laptop');
        if(history.length)
            document.getElementById('index-main').classList.add('laptop-mode');
    }
}

function createCover() {
    const cover = document.createElement('div');
    cover.className = 'cover';
    return cover;
}

async function upload(type) {
    // 0 for text and 1 for file
    const cover = createCover();
    
    function uploadText(cover) {
        cover.innerHTML = `
        <form class='panel input-text-panel' method='POST' action='/upload'>
            <textarea name='text'></textarea>
            <input type='hidden' name='type' value='text'>
            <input type='hidden' name='path' value='${window.location.pathname}'>
            <button type='submit'>上传</button>
        </form>
        `
    }

    uploadText(cover);

    document.body.appendChild(cover);
    await new Promise(s=>setTimeout(s, 1));
    cover.style.transform = 'scale(1, 1)';
}