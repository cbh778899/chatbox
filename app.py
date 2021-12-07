from flask import *
import random
from modules.dataBox import dataBox

data_box = dataBox()

app = Flask(__name__)


@app.route('/')
def home():
    random.seed(request.remote_addr)
    return render_template('index.html',
        user_id = str(random.random().hex()))

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        upload_type = request.form.get('type')
        user_id = request.form.get('user_id')
        if upload_type == 'text':
            text = request.form.get('text')
            text = text.replace('\r\n', '\n')
            data_box.chat.new(user_id, text)
        elif upload_type == 'file':
            files = request.files.getlist('file')
            for f in files:
                data_box.files.new(user_id, f)
        # TODO return without calculate id again
    return redirect('/')

@app.route('/history', methods=['GET'])
def getHistory():
    if request.method == 'GET':
        return make_response(
            jsonify({'data': data_box.getAllHistory()}), 200)
    return None

@app.route('/uploads/<type>', methods=['GET'])
@app.route('/uploads/<type>/<uid>', methods=['GET'])
def geUploads(type, uid = None):
    if request.method == 'GET':
        data = None
        if type == 'chat':
            data = data_box.chat.getChatHistory()
        elif type == 'files':
            data = data_box.files.getAllFiles()
        elif type == 'user':
            data = data_box.getAllUserHistory(str(uid))
        return make_response(
            jsonify({'data': data}), 200)
    return None

@app.route('/file/<filename>', methods=['GET'])
def file(filename):
    file_path = data_box.files.getFilePath()
    response = make_response(send_from_directory(file_path, filename, as_attachment=True))
    response.headers["Content-Disposition"] = "attachment; filename={}".format(filename.encode().decode('utf-8'))
    return send_from_directory(file_path, filename, as_attachment=True)

@app.route('/remove', methods=['POST'])
def remove():
    if request.method == 'POST':
        post_type = request.form.get('type')
        post_id = request.form.get('id')
        if post_type == 'file':
            data_box.files.remove(post_id)
        elif post_type == 'chat':
            data_box.chat.remove(post_id)
        # TODO return without calculate id again
    return redirect('/')

@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='pic/favicon.ico'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)