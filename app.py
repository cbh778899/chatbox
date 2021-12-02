from flask import *
import random
from modules.dataBox import dataBox

mode = None
user_id = None
data_box = dataBox()

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def root():
    if request.method == 'POST':
        global mode
        global user_id
        # get website display mode (Laptop / Mobile)
        mode = request.form.get('display_mode')
        # generate uid by ip address
        random.seed(request.remote_addr)
        user_id = str(random.random().hex())
        return redirect('/home')
    return render_template('init.html')

@app.route('/home')
def home():
    if mode and user_id:
        history = 'null'
        if mode == 'Laptop':
            history = str(data_box.getAllHistory())
        return render_template('index.html',
            user_id = user_id, display_mode = mode,
            history = history)
    return redirect('/')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        upload_type = request.form.get('type')
        path = request.form.get('path')
        if upload_type == 'text':
            text = request.form.get('text')
            text = text.replace('\r\n', '\n')
            data_box.chat.new(user_id, text)
        return redirect(path)
    return redirect('/')

if __name__ == "__main__":
    app.run(port=8080, debug=True)