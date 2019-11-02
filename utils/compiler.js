const spawn = require('child_process').spawnSync
const fs = require('fs');

class Compiler {

    constructor(language, code, testAddress, ansAddress) {
        this.language = language;
        this.code = code
        this.ansAddress = ansAddress;
        this.testAddress = testAddress;
    }

    compile() {
        if (this.language === 'Python') {
            return this.compilePython();
        }
    }

    /*================================================================================
         * Standard:
         *  - Top number defines number of test cases in case of test case file
         *  - Answer for each test case needs to be seperated by newline char
         *  - If there are an sub test cases, format shoul specify it in line 1
            with char s followed by number of test cases
    ================================================================================*/

    compilePython() {
        fs.writeFileSync('/Users/Development/IWP_Lab/InterviewPad/tmp/file.py', this.code);
        let op = spawn('python3', [`/Users/Development/IWP_Lab/InterviewPad/tmp/file.py`, `${this.testAddress}`]);
        let err = op.stderr.toString();
        if (err.length > 1) {
            return { success: false, err: err }
        }
        let userOP = op.stdout.toString();
        //Calculate the number of testcases passed
        let ansData = fs.readFileSync(this.ansAddress, 'utf-8');
        ansData = ansData.split('\n');
        console.log(ansData)
        let opArray = userOP.split('\n');
        console.log(opArray);
        let score = 0;
        for (var i = 0; i < ansData.length; i++) {
            if (opArray[i] === ansData[i]) {
                score++;
            }
            console.log(opArray[i]," ", ansData[i]);
        }
        return { success: true, userOP: userOP, score: score };
    }

    compileCPP() {
        return
    }

    compileJS() {
        return
    }
}

module.exports = Compiler;

