var selected_to_download = 0;

function multipleDownload() {
    const all_files = document.querySelectorAll("input[type='checkbox'][name='file-selection']");
    var checked_files = [];
    all_files.forEach(e=>{
        if(e.checked)
            checked_files.push(parseInt(e.value))
    })
    sendPostRequest(checked_files)
}

function sendPostRequest(args) {
    const http_request = new XMLHttpRequest();
    http_request.open('POST', '/file/multiple', true);
    // http_request.onreadystatechange = () =>{
    //     if(http_request.readyState === 4 && http_request.status === 200) {
    //         res = JSON.parse(http_request.responseText);
    //         updatePage(res.data);
    //     }
    // };
    http_request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    http_request.send(JSON.stringify(args));
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