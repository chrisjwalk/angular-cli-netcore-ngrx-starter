import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
  project: string;
  launchProfile: string | null;
  verbosityLevel: string | null;
  noBuild: boolean;
  noRestore: boolean;
}

export default createBuilder<Options>((options, context) => {
  return new Promise<BuilderOutput>((resolve, reject) => {
    const dotnetArgs = ['watch'];

    if (options.launchProfile) {
      dotnetArgs.push('--launch-profile');
      dotnetArgs.push(options.launchProfile);
    }
    if (options.verbosityLevel) {
      dotnetArgs.push('--verbosity');
      dotnetArgs.push(options.verbosityLevel);
    }
    if (options.noBuild) {
      dotnetArgs.push('--no-build');
    }
    if (options.noRestore) {
      dotnetArgs.push('--no-restore');
    }
    dotnetArgs.push('--project');
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
}) as any;
