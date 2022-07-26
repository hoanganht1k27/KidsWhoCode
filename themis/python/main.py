from datetime import datetime
from os import listdir
import signal
import time

from sqlalchemy import null

import shutil
import os
import subprocess
import json

CORRECT = 1
WA = 2
TLE = 3
COMPILE_SUCCEED = 4
COMPILE_ERROR = 5
SOLUTION_FILE_TLE = 6
CANNOT_JUDGE_ON_FILE = 7

judging = 0


def getSubmitInfo():
    t = listdir('./submits')
    if len(t) > 0:
        fileName = t[0]
        t = fileName.split('.')
        fileExtension = t[-1]
        t = t[0]
        t = t.split('_')
        if fileExtension == 'cpp' and len(t) == 3:
            return [fileName, fileExtension] + t
        os.remove('./submits/' + fileName)
        return null
    return null

def initFolderToUser(userId):
    t = os.path.exists('./ids/' + userId)
    if not t:
        os.makedirs('./ids/' + userId)

    t = os.path.exists('./ids/' + userId + '/logs')
    if not t:
        os.makedirs('./ids/' + userId + '/logs')

    t = os.path.exists('./ids/' + userId + '/logs/logs.txt')
    if not t:
        f = open('./ids/' + userId + '/logs/logs.txt', 'x')
        f.close()
    
    t = os.path.exists('./results/' + userId + '.json')
    if not t:
        f = open('./results/' + userId + '.json', 'x')
        f.close()


def prepareToJudge(toJudge):
    fileName = toJudge[0]
    userId = toJudge[-1]
    problemId = toJudge[-2]
    try:
        deleteOldResults(problemId, userId)
    except:
        print("Cannot delete old results")
    timeStamp = toJudge[-3]
    fileExtension = toJudge[1]
    targetPath = './ids/' + userId + '/judge/' + fileName
    fileName = './submits/' + fileName

    initFolderToUser(userId)

    # delete old judge folder
    try:
        shutil.rmtree('./ids/' + userId + '/judge')
    except:
        print("Nothing to delete")

    # move new file to judge folder
    try:
        os.mkdir('./ids/' + userId + '/judge')
        shutil.move(fileName, targetPath)
    except:
        print("Cannot create new judge folder")

    if fileExtension == 'py':
        putToLogs(problemId, userId, 'Compile succeed')
        return COMPILE_SUCCEED
    
    # compile the file if cpp file
    try:
        targetExecutePath = targetPath[:-(len(fileExtension) + 1)] + '.exe'
        if fileExtension == 'cpp':
            s = 'g++ ' + targetPath + ' -o ' + targetExecutePath
        else:
            s = 'gcc ' + targetPath + ' -o ' + targetExecutePath
        kt = os.system(s)
        if kt == 0:
            print("Compile succeed")
            putToLogs(problemId, userId, "Compile succeed")
            return COMPILE_SUCCEED
        else:
            print("Compile error")
            putToLogs(problemId, userId, "Compile error")
            putToResults(problemId, userId, statusCompile="Compile error")
            return COMPILE_ERROR

        
    except:
        print("Cannot compile cpp file")
        putToLogs(problemId, userId, "Cannot compile cpp file")
        putToResults(problemId, userId, statusCompile="Cannot compile cpp file")
        return COMPILE_ERROR


def runExecuteFile(targetExecutePath, inputFilePath, timeLimit):
    timeLimit = int(timeLimit)
    try:
        with open(inputFilePath) as f:
            start_time = time.time()
            try:                
                p = subprocess.run(targetExecutePath, capture_output=True, text=True, stdin=f, timeout=timeLimit // 1000 + 1)

                return [CORRECT, p.stdout, (time.time() - start_time) * 1000]
            except:
                return [TLE, "TLE", timeLimit // 1000 + 1]
    except Exception as e:
        print(e)
        return ["Cannot execute file", -1]

def getInputFiles(problemId):
    t = listdir('./tests/' + problemId)
    try:
        t.remove('sol.exe')
    except:
        pass
    try:
        t.remove('sol.cpp')
        t.remove('setup.json')
    except:
        pass
    return t

def getProblemSettings(problemId):
    try:
        with open('./tests/' + problemId + '/setup.json') as f:
            return json.load(f)
    except:
        return null

def test():
    # try:
    #     p = subprocess.run("timeout 5", capture_output=True, text=True, timeout=2)

    #     print(p.stdout)
    # except subprocess.TimeoutExpired as e:
    #     print("Error")
    #     print(str(e))

    with open('./tests/123/setup.json') as f:
        print(json.load(f))

def getScore(res):
    score = 0
    for r in res:
        if r['type'] == CORRECT:
            score += 1
    
    return [score, len(res)]

def getFullScore(problemId):
    t = listdir('./tests/' + problemId)
    try:
        t.remove('sol.exe')
        t.remove('sol.cpp')
        t.remove('setup.json')
    except:
        pass
    return len(t)

def getScoreEachTest(problemId):
    with open('./tests/' + problemId + '/setup.json') as f:
        t = json.load(f)
        return t['scoreEachTest']    

def putToLogs(problemId, userId, statusCompile):
    with open("./ids/" + userId + '/logs/logs.txt', 'a') as f:
        f.write(datetime.today().strftime('%Y-%m-%d %H:%M:%S') + '\n' + 'Submitted problem ' + problemId + '\n' + statusCompile + '\n')

def resToLogs(res):
    s = ""
    for r in res:
        s += '\n' + r['input'] + ': ' + r['status'] + '\n'
    return s

def deleteOldResults(problemId, userId):
    oldJson = ''
    with open('./results/' + userId + '.json', 'r') as f:
        oldJson = json.load(f)
    
    oldJson[problemId] = {}
    oldJson[problemId]["status"] = "Judging"

    with open('./results/' + userId + '.json', 'w') as f:
            json.dump(oldJson, f)

def putToResults(problemId, userId, res = null, statusCompile=null):
    scoreEachTest = getScoreEachTest(problemId)
    scoreEachTest = int(scoreEachTest)
    if statusCompile != null:
        oldJson = {}
        try:
            with open('./results/' + userId + '.json', 'r') as f:
                oldJson = json.load(f)
        except:
            pass
            
        if problemId not in oldJson:
            oldJson[problemId] = {}
        
        oldJson[problemId]["status"] = statusCompile
        oldJson[problemId]["score"] = 0
        oldJson[problemId]["fullScore"] = getFullScore(problemId) * scoreEachTest
        oldJson[problemId]["logs"] = ""

        with open('./results/' + userId + '.json', 'w') as f:
             json.dump(oldJson, f)

        return

    [score, fullScore] = getScore(res)
    

    score = int(score)
    fullScore = int(fullScore)

    oldJson = {}
    try:
        with open('./results/' + userId + '.json', 'r') as f:
            oldJson = json.load(f)
    except:
        pass

    if problemId not in oldJson:
            oldJson[problemId] = {}
    
    oldJson[problemId]["status"] = "Done"
    oldJson[problemId]["score"] = score * scoreEachTest
    oldJson[problemId]["fullScore"] = getFullScore(problemId) * scoreEachTest
    oldJson[problemId]["logs"] = resToLogs(res)

    with open('./results/' + userId + '.json', 'w') as f:
            json.dump(oldJson, f)



def judge(toJudge):
    fileName = toJudge[0]
    userId = toJudge[-1]
    problemId = toJudge[-2]
    fileExtension = toJudge[1]
    targetPath = './ids/' + userId + '/judge/' + fileName
    fileName = './submits/' + fileName
    targetExecutePath = targetPath[:-(len(fileExtension) + 1)] + '.exe'
    solExecutePath = './tests/' + problemId + '/sol.exe'
    inputFiles = getInputFiles(problemId)
    settings = getProblemSettings(problemId)

    if settings == null:
        return

    timeLimit = settings['time']
    checkSol = compileSolFile(problemId)

    results = []

    if not checkSol:
        results = ["Cannot compile solution file, please check solution file"]
        putToResults(problemId, userId, statusCompile="Compile solution file error, please check solution again")
        return

    

    for inputFile in inputFiles:
        inputFilePath = './tests/' + problemId + '/' + inputFile
        try:
            
            t1 = runExecuteFile(targetExecutePath, inputFilePath, timeLimit)

            if t1[0] == TLE:
                results.append({
                    'input': inputFile,
                    'status': 'TLE',
                    'type': TLE
                })
                continue
            
            t2 = runExecuteFile(solExecutePath, inputFilePath, timeLimit)

            if t2[0] == TLE:
                results.append({
                    'input': inputFile,
                    'status': 'Solution file tle',
                    'type': SOLUTION_FILE_TLE
                })
                continue
            
            out1 = t1[1].split()
            out2 = t2[1].split()

            if out1 == out2:
                results.append({
                    'input': inputFile,
                    'status': 'Correct answer',
                    'type': CORRECT
                })
            else:
                results.append({
                    'input': inputFile,
                    'status': 'Wrong answer',
                    'type': WA
                })
        except:
            results.append({
                'input': inputFile,
                'status': "Cannot judge on file " % inputFilePath,
                'type': CANNOT_JUDGE_ON_FILE
            })
    
    putToResults(problemId, userId, results)
    return results


def compileSolFile(problemId):
    targetPath = './tests/' + problemId + '/sol.cpp'
    fileExtension = 'cpp'
    targetExecutePath = targetExecutePath = targetPath[:-(len(fileExtension) + 1)] + '.exe'

    s = 'g++ ' + targetPath + ' -o ' + targetExecutePath
    kt = os.system(s)
    if kt == 0:
        print("Compile solution file succeed")
        return 1
    else:
        print("Compile solution file error")
        return 0


def runSolFile(problemId):
    targetPath = './tests/' + problemId + '/sol.cpp'
    fileExtension = 'cpp'
    targetExecutePath = targetExecutePath = targetPath[:-(len(fileExtension) + 1)] + '.exe'

    with open('./tests/' + problemId + '/inp1') as f:
        p = subprocess.run(targetExecutePath, capture_output=True, text=True, stdin=f)

        print(p.stdout)



if __name__ == '__main__':

    while 1:
        if judging == 0:
            toJudge = getSubmitInfo()
            if toJudge != null:
                kt =  prepareToJudge(toJudge)
                if kt == COMPILE_SUCCEED:
                    res = judge(toJudge)
                    print(res)
                else:
                    print("Compile failed")
        time.sleep(1)
        print("Looping")
