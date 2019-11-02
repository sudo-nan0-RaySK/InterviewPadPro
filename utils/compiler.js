const spawn = require('child_process').spawnSync
const fs = require('fs');

class Compiler{

    constructor(language, code, testAddress, ansAddress) {
        this.language = language;
        this.code = code
        this.ansAddress = ansAddress;
        this.testAddress = testAddress;
    }

    compile() {
        switch (this.language) {
            case 'C++':
                compileCPP();
                break;
            case 'Python':
                compilePython();
                break;
            case 'JavaScript':
                compileJS();
                break;
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
        fs.writeFileSync('/Users/Development/IWP_Lab/InterviewPad/tmp/file.py', code);
        let op = spawn('python3', [`/Users/Development/IWP_Lab/InterviewPad/tmp/file.py < ${this.testAddress}`]);
        let err = op.stderr.toString();
        if (err.length > 1) {
            return {success:false, err:err}
        } 
        let userOP = op.stdout.toString();
        return { success: true, userOP: userOP };
    }

    compileCPP() {
        return 
    }

    compileJS() {
        return
    }
}

module.exports = Compiler;

