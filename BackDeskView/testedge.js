try {
	const edge = require('edge-js');

	// Define the .NET function to call
	// const processTextFunction = edge.func({
	//     assemblyFile: '/dll/testDLL.dll',
	//     typeName: 'TestDLL.TestClass',
	//     methodName: 'TestMe' // Name of the function to call in your DLL
	// });

	// Call the .NET function with input text
	// const inputText = 'Hello from Node.js!';
	// processTextFunction(inputText, function (error, result) {
	//     if (error) throw error;
	//     console.log(result);
	// });
	console.log("ok");
}
catch (error) {
	console.log(error.message);
}