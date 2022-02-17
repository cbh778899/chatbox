function multipleDownload() {
    const all_files = document.querySelectorAll("input[type='checkbox'][name='file-selection']");
    var checked_files = [];
    all_files.forEach(e=>{
        if(e.checked)
            checked_files.push(parseInt(e.value))
    })
    if(checked_files.length > 0)
        sendPostRequest(checked_files)
    else
        showSomething("您还未选择任何文件！")
}

function changeAllStatus(status) {
    const all_files = document.querySelectorAll("input[type='checkbox'][name='file-selection']");
    all_files.forEach(e=>{
        e.checked = status
    })
}

function sendPostRequest(args) {
    const http_request = new XMLHttpRequest();
    http_request.open('POST', '/file/multiple', true);
    http_request.onreadystatechange = () =>{
        if(http_request.readyState === 4 && http_request.status === 200) {
            const download_link = document.createElement('a')
            download_link.href = window.URL.createObjectURL(http_request.response)
            download_link.download = "ChatboxDownload.zip"
            download_link.click()
        }
    };
    http_request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    http_request.send(JSON.stringify(args));
    http_request.responseType = 'blob';
}

function createMultipleDownloadBtns() {
    document.getElementById('index-main').insertAdjacentHTML('afterbegin', 
    `<div id='multiple-download'>
        <div class='select-all'
            onclick='changeAllStatus(true)'>
            全选
        </div>
        <div class='deselect-all'
            onclick='changeAllStatus(false)'>
            全不选
        </div>
        <div class='multiple-download'
            onclick='multipleDownload()'>
            批量下载所选内容
        </div>
    </div>`)
}