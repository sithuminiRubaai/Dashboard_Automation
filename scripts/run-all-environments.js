const { spawnSync } = require('child_process');

const environments = ['dev', 'uat', 'staging'];
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const results = [];

for (const environment of environments) {
    console.log(`\n===== Running ${environment} =====`);
    const result = spawnSync(npmCommand, ['run', `test:${environment}`], {
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });

    const exitCode = result.status ?? 1;
    results.push({ environment, exitCode });
    console.log(`===== Finished ${environment} (exit ${exitCode}) =====`);
}

console.log('\n===== Environment Summary =====');
for (const result of results) {
    console.log(`${result.environment}: ${result.exitCode === 0 ? 'passed' : 'failed'}`);
}

process.exitCode = results.some(({ exitCode }) => exitCode !== 0) ? 1 : 0;
