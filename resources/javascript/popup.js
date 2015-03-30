/*
 *  Simple Offline Calculator v0.3
 *  By Ian Esteves do Nascimento, 2015
 */

var commands = [
    new command("help", function() {
        var result = "Commands :";
        for(var i = 0 ; i < commands.length ; i++)
            result += "\n" + commands[i].name;
        return result;
    }),
    new command("clear", function() {
        document.getElementById("calculatorInput").value = "";
        document.getElementById("calculatorOutput").textContent = "";
        return "";
    }),
    new command("memory", function() {
        if(memory.length === 0)
            return "Empty";
        var result = memory[0].id + " = " + memory[0].val;
        for(var i = 1 ; i < memory.length ; i++)
            result += "\n" + memory[i].id + " = " + memory[i].val;
        return result;
    }),
    new command("log", function() {
        return errorLog;
    }),
    new command("functions", function() {
        var result = "";
        for(var i = 0 ; i < mathFunctions.length ; i++) {
            result += (i === 0 ? "" : "\n") + mathFunctions[i].id + "(";
            for(var j = 0 ; j < mathFunctions[i].numArgs ; j++)
                result += (j === 0 ? "" : ",") + "x" + (mathFunctions[i].numArgs === 1 ? "" : j+1);
            result += ")";
        }
        return result;
    }),
    new command("plot", function() {
        window.open("plot.html", "Plot - Simple Offline Calculator");
        return "Opening plot...";
    }),
    new command("tree", function() {
        window.open("tree.html", "Tree - Simple Offline Calculator");
        return "Opening tree...";
    })
];

var secretCommands = [
    new command(String.fromCharCode(0x50)+String.fromCharCode(0x45)+String.fromCharCode(0x4E)+String.fromCharCode(0x49)+String.fromCharCode(0x53), function() {
        return String.fromCharCode(0x38)+String.fromCharCode(0x3D)+String.fromCharCode(0x3D)+String.fromCharCode(0x3D)+String.fromCharCode(0x3D)+String.fromCharCode(0x3D)+String.fromCharCode(0x44)+String.fromCharCode(0x7E)+String.fromCharCode(0x7E)+String.fromCharCode(0x7E);
    })
];

var inputHistory = [];

function command(name, action) {
    this.name = name;
    this.action = action; // Action returns a message to the user.
};

window.onload = function() {
    
    var calculatorInput = document.getElementById("calculatorInput");
    
    var calculatorOutput = document.getElementById("calculatorOutput");
    
    // Registering events
    
    calculatorInput.onkeyup = function(event) {
        if(event.keyCode === 38) { // arrow up
            if(inputHistory[0] === calculatorInput.value)
                return;
            for(var i = 1 ; i < inputHistory.length ; i++) {
                if(inputHistory[i] === calculatorInput.value) {
                    calculatorInput.value = inputHistory[i-1];
                    return;
                }
            }
            calculatorInput.value = inputHistory[inputHistory.length-1];
            return;
        }
        
        if(event.keyCode === 40) { // arrow down
            for(var i = 0 ; i < inputHistory.length-1 ; i++) {
                if(inputHistory[i] === calculatorInput.value) {
                    calculatorInput.value = inputHistory[i+1];
                    return;
                }
            }
            calculatorInput.value = "";
            return;
        }
        
        if(event.keyCode !== 13) // enter
            return;
        
        for(var i = 0 ; i < inputHistory.length ; i++) { // if command comes from history, remove it
            if(inputHistory[i] === calculatorInput.value) {
                inputHistory.splice(i, 1);
                break;
            }
        }
        inputHistory.push(calculatorInput.value); // add command to history
        if(inputHistory.length > 20) // checks if size exceeded limit
            inputHistory.shift();
            
        var newOutput = null; // will be place in calculatorOutput
        
        for(var i = 0 ; i < commands.length ; i++) { // checks if the input is a command
            if(commands[i].name === calculatorInput.value) {
                newOutput = commands[i].action();
                break;
            }
        }
        
        for(var i = 0 ; i < secretCommands.length ; i++) { // ???
            if(secretCommands[i].name === calculatorInput.value) {
                newOutput = secretCommands[i].action();
                break;
            }
        }
        
        if(newOutput === null) {
            if(calculatorInput.value === "")
                calculatorInput.value = "0";
            result = calculate(calculatorInput.value);
            if(result === null || isNaN(result)) {
                newOutput = "ERR = " + calculatorInput.value;
            }
            else {
                newOutput =  result + " = " + calculatorInput.value;
                calculatorInput.value = result;
            }
        }
        
        calculatorOutput.textContent = newOutput + (calculatorOutput.textContent === "" ? "" : "\n") + calculatorOutput.textContent;
    };
    
};
