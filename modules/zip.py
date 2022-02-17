import os
import zipfile

def packzip(location, files):
    zip_file_name = location + "//ChatboxDownload.zip"
    # remove zip file from last time
    # TODO: This is not a long-term solution, should be changed
    if os.path.isfile(zip_file_name):
        os.remove(zip_file_name)
    f = zipfile.ZipFile(zip_file_name, 'w')
    for e in files:
        f.write(e[0], e[1])
    return zip_file_name