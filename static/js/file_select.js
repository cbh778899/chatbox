var selected_to_download = 0;

function multipleDownload() {
    
}

function selectFile(event) {

    selected_to_download += event.target.checked ? 1 : -1;

    if(selected_to_download > 0 && !document.getElementById('multiple-download')) {
        document.getElementById('index-main').insertAdjacentHTML('afterbegin', 
        `<div class='multiple-download'
            onclick='multipleDownload()' id='multiple-download'>
            批量下载所选内容
        </div>`)
    } else if(selected_to_download <= 0) {
        document.getElementById('multiple-download').remove();
    }
}