/**
 * Консольный скрипт для загрузки изображний в БД с помощью GridFS
 */

// npm run my-script -- arg1 arg2

const args = process.argv.slice(2);

console.log('Command-line arguments:', args);

// Use the arguments as needed
// Example: assuming you passed two arguments, you can access them like this:
const arg1 = args[0];
const arg2 = args[1];
console.log('Argument 1:', arg1);
console.log('Argument 2:', arg2);