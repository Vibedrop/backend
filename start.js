// Wrapper script to start the application
// 
// Why is this needed?
// The application uses the "nanoid" library, which is an ESM-only package (ECMAScript Module). 
// This means it uses the 'import' syntax and cannot be loaded using the 'require' function,
// which is used when TypeScript compiles with "module": "commonjs".
// 
// Problem:
// Since the TypeScript configuration uses "commonjs", the compiled output cannot directly use
// ESM modules, causing runtime errors when trying to load nanoid using 'require'.
//
// Solution:
// This wrapper script dynamically imports the compiled "index.js" using 'import()', 
// which is compatible with ESM. By using this approach, we can keep the original TypeScript configuration
// intact and make the application compatible with both CommonJS and ESM packages during runtime.
//
// How it works:
// 1. Uses 'import()' to load the main "index.js" file dynamically.
// 2. Catches any errors during the import and logs them to the console.
// 
// This allows the application to run without changing the existing codebase or TypeScript configuration.

import('./dist/index.js').catch((err) => {
    console.error("Error starting the application:", err);
    process.exit(1);
});
