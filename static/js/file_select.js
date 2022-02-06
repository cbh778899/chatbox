var multiple_download_activated = false;

function selectFile() {
    if(!multiple_download_activated) {
        console.log(1)
        multiple_download_activated = true;
        document.getElementById('index-main').insertAdjacentHTML('afterbegin', 
        `<div class='multiple-download'>
            批量下载所选内容
        </div>`)
    }
    else {
    }

    const selected = document.querySelectorAll('input[name="selected-file"]');
}