import sqlite3
import os
from datetime import datetime


def close(conn, cursor, commit = False):
    if commit:
        conn.commit()
    cursor.close()
    conn.close()

def tupleToList(tu):
    return list(tu)

class chat:
    def __init__(self, path):
        self.path = path

    def getChatHistory(self):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        chat_history = cursor.execute('select * from chat;').fetchall()
        close(conn, cursor)
        return map(tupleToList, chat_history)
    
    def new(self, user, content):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        cursor.execute(
            'insert into chat(time, uploader, content) values (?, ?, ?)',
            [str(datetime.now()), str(user), str(content)])
        close(conn, cursor, True)

class files:
    def __init__(self, path):
        self.path = path
    
    def getAllFiles(self):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        files_list = cursor.execute('select * from files;').fetchall()
        close(conn, cursor)
        return map(tupleToList, files_list)

    def new(self, user, f):
        filename = f.filename
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        cursor.execute(
            'insert into files(time, uploader, name) values (?, ?, ?)',
            [str(datetime.now()), str(user), str(filename)])
        f.save(cursor.lastrowid + '_' + filename)
        close(conn, cursor, True)

class dataBox:

    chat = None
    files = None

    def __init__(self):
        self.__DATA_BASIC_PATH = './chatbox_data'
        self.__DB_PATH = self.__DATA_BASIC_PATH + '/data.db'

        self.__initDB()

        self.chat = chat(self.__DB_PATH)
        self.files = files(self.__DB_PATH)

    def __initDB(self):
        if not os.path.isdir(self.__DATA_BASIC_PATH):
            os.mkdir(self.__DATA_BASIC_PATH)
        if not os.path.isfile(self.__DB_PATH):
            with open(self.__DB_PATH, 'w') as f:
                f.close()
        
        conn = sqlite3.connect(self.__DB_PATH)
        cursor = conn.cursor()
        cursor.execute('create table if not exists chat(id INTEGER PRIMARY KEY, time, uploader, content);')
        cursor.execute('create table if not exists files(id INTEGER PRIMARY KEY, time, uploader, name);')
        close(conn, cursor, True)

    def getAllHistory(self):
        chat_history = self.chat.getChatHistory()
        file_history = self.files.getAllFiles()

        history = []
        history.extend(chat_history)
        history.extend(file_history)

        def get_time(obj):
            return obj[1]
        
        if history:
            history.sort(key=get_time, reverse=True)
        return history