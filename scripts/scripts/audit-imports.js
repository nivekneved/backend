
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('web-app/src');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const allFiles = getFiles(baseDir).map(f => path.relative(baseDir, f).replace(/\\/g, '/'));
const fileMap = new Map();
allFiles.forEach(f => fileMap.set(f.toLowerCase(), f));

const jsFiles = allFiles.filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.ts'));

jsFiles.forEach(jsFile => {
    const content = fs.readFileSync(path.join(baseDir, jsFile), 'utf8');
    const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const currentDir = path.dirname(jsFile);
            let resolvedPath = path.join(currentDir, importPath).replace(/\\/g, '/');

            // Handle directory imports (index.js/jsx)
            let possibleFiles = [
                resolvedPath + '.jsx',
                resolvedPath + '.js',
                resolvedPath + '/index.jsx',
                resolvedPath + '/index.js'
            ];

            let found = false;
            for (let pf of possibleFiles) {
                const actualFile = fileMap.get(pf.toLowerCase());
                if (actualFile) {
                    if (actualFile !== pf) {
                        console.log(`CASE MISMATCH in ${jsFile}: imported "${importPath}" (resolved as "${pf}") but actual file is "${actualFile}"`);
                    }
                    found = true;
                    break;
                }
            }
        }
    }
});
