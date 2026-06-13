import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
  project: string;
  outputPath: string | null;
  verbosityLevel: string | null;
  configuration: string | null;
  interactive: boolean;
  noRestore: boolean;
}

export default createBuilder<Options>((options, context) => {
  return new Promise<BuilderOutput>((resolve, reject) => {
    const dotnetArgs = ['build'];
    dotnetArgs.push('--nologo');
    if (options.outputPath) {
      dotnetArgs.push('--output');
      dotnetArgs.push(options.outputPath);
    }
    if (options.verbosityLevel) {
      dotnetArgs.push('--verbosity');
      dotnetArgs.push(options.verbosityLevel);
    }
    if (options.configuration) {
      dotnetArgs.push('--configuration');
      dotnetArgs.push(options.configuration);
    }
    if (options.interactive) {
      dotnetArgs.push('--interactive');
    }
    if (options.noRestore) {
      dotnetArgs.push('--no-restore');
    }
    dotnetArgs.push(options.project);
    console.log(`Executing "dotnet ${dotnetArgs.join(' ')}"...`);
    const child = childProcess.spawn('dotnet', dotnetArgs, { stdio: 'pipe' });

    child.stdout.on('data', (data) => {
      context.logger.info(data.toString());
    });
    child.stderr.on('data', (data) => {
      context.logger.error(data.toString());
      reject();
    });

    context.reportStatus(`Done.`);
    child.on('close', (code) => {
      resolve({ success: code === 0 });
    });
  });
});
