const edge = require('edge');

// Define the .NET function to call
const processTextFunction = edge.func({
    assemblyFile: 'Path/To/Your/DLL/MyDotNetLibrary.dll',
    typeName: 'MyDotNetLibrary.MyDotNetClass',
    methodName: 'ProcessText' // Name of the function to call in your DLL
});

// Call the .NET function with input text
const inputText = 'Hello from Node.js!';
processTextFunction(inputText, function (error, result) {
    if (error) throw error;
    console.log('Result:', result);
});