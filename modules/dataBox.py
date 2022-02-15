import sqlite3
import os
from pathlib import Path
from datetime import datetime


def close(conn, cursor, commit = False):
    if commit:
        conn.commit()
    cursor.close()
    conn.close()

class chat:
    def __init__(self, path):
        self.path = path

    def getChatHistory(self):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        chat_history = cursor.execute('select * from chat;').fetchall()
        close(conn, cursor)
        for i in range(len(chat_history)):
            chat_history[i] = list(chat_history[i])
            chat_history[i].append('chat')
        return chat_history

    def getUserChats(self, id):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        chat_history = cursor.execute('select * from chat where uploader = ?;', [id]).fetchall()
        close(conn, cursor)
        for i in range(len(chat_history)):
            chat_history[i] = list(chat_history[i])
            chat_history[i].append('chat')
        return chat_history
    
    def new(self, user, content):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        cursor.execute(
            'insert into chat(time, uploader, content) values (?, ?, ?)',
            [str(datetime.now()), str(user), str(content)])
        close(conn, cursor, True)

    def remove(self, id):
        conn = sqlite3.connect(self.path)
        cursor = conn.cursor()
        cursor.execute('delete from chat where id=?', [int(id)])
        close(conn, cursor, True)

class files:
    def __init__(self, data_path, db_path):
        self.__data_path = data_path
        self.__db_path = db_path
    
    def getAllFiles(self):
        conn = sqlite3.connect(self.__db_path)
        cursor = conn.cursor()
        files_list = cursor.execute('select * from files;').fetchall()
        close(conn, cursor)
        for i in range(len(files_list)):
            files_list[i] = list(files_list[i])
            files_list[i].append('file')
        return files_list

    def getUserFiles(self, id):
        conn = sqlite3.connect(self.__db_path)
        cursor = conn.cursor()
        files_list = cursor.execute('select * from files where uploader = ?;', [id]).fetchall()
        close(conn, cursor)
        for i in range(len(files_list)):
            files_list[i] = list(files_list[i])
            files_list[i].append('file')
        return files_list

    def getFilePath(self):
        return os.path.join(
            os.getcwd(),
            self.__data_path.replace('./', '')
        )

    def getFilesFromIDs(self, IDs):
        conn = sqlite3.connect(self.__db_path)
        cursor = conn.cursor()
        query = 'select * from files where id in ({});'.format(', '.join(str(i) for i in IDs))
        file_list = cursor.execute(query).fetchall()
        pass

    def new(self, user, f):
        filename = f.filename
        conn = sqlite3.connect(self.__db_path)
        cursor = conn.cursor()
        cursor.execute(
            'insert into files(time, uploader, name) values (?, ?, ?)',
            [str(datetime.now()), str(user), str(filename)])

        f.save(os.path.join(self.__data_path, 
            str(cursor.lastrowid) + '_' + filename))
        close(conn, cursor, True)
    
    def remove(self, id):
        conn = sqlite3.connect(self.__db_path)
        cursor = conn.cursor()
        cursor.execute('delete from files where id=?', [int(id)])
        close(conn, cursor, True)
        for f in Path(self.__data_path).glob(str(id)+'_*'):
            os.remove(f)

class dataBox:

    chat = None
    files = None

    def __init__(self):
        self.__DATA_BASIC_PATH = './chatbox_data'
        self.__DB_PATH = self.__DATA_BASIC_PATH + '/data.db'

        self.__initDB()

        self.chat = chat(self.__DB_PATH)
        self.files = files(self.__DATA_BASIC_PATH, self.__DB_PATH)

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

        if len(history) > 9:
            history = history[0:9]

        return history

    def getAllUserHistory(self, id):
        chat_history = self.chat.getUserChats(id)
        file_history = self.files.getUserFiles(id)
        
        history = []
        history.extend(chat_history)
        history.extend(file_history)

        return history