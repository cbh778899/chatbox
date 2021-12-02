from flask import *
import random
from modules.dataBox import dataBox

mode = None
user_id = None
dataBox = dataBox()

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
        return mode + ' ' + user_id
    return redirect('/')

if __name__ == "__main__":
    app.run(port=8080, debug=True)