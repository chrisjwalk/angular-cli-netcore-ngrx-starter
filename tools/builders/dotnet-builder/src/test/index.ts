import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
  solutionFolder: string;
  resultsDirectory: string | null;
  verbosityLevel: string | null;
  configuration: string | null;
  interactive: boolean;
  noRestore: boolean;
  noBuild: boolean;
  logger: string | null;
  coverage: boolean;
  coverageOutputFormat: string | null;
  coverageOutputFileName: string | null;
}

export default createBuilder<Options>((options, context) => {
  return new Promise<BuilderOutput>((resolve, reject) => {
    const dotnetTestArgs = ['test'];
    dotnetTestArgs.push('--nologo');
    if (options.verbosityLevel) {
      dotnetTestArgs.push('--verbosity');
      dotnetTestArgs.push(options.verbosityLevel);
    }
    if (options.configuration) {
      dotnetTestArgs.push('--configuration');
      dotnetTestArgs.push(options.configuration);
    }
    if (options.interactive) {
      dotnetTestArgs.push('--interactive');
    }
    if (options.noRestore) {
      dotnetTestArgs.push('--no-restore');
    }
    if (options.noBuild) {
      dotnetTestArgs.push('--no-build');
    }
    dotnetTestArgs.push('--logger');
    dotnetTestArgs.push(options.logger ? options.logger : 'trx');

    if (options.coverage) {
      dotnetTestArgs.push('--collect');
      dotnetTestArgs.push('"Code Coverage"');
    }

    if (options.resultsDirectory) {
      dotnetTestArgs.push('--results-directory');
      dotnetTestArgs.push(options.resultsDirectory);
    }

    console.log(`Executing "dotnet ${dotnetTestArgs.join(' ')}"...`);
    const tests = childProcess.spawn('dotnet', dotnetTestArgs, {
      stdio: 'pipe',
      cwd: options.solutionFolder,
    });

    tests.stdout.on('data', (data) => {
      context.logger.info(data.toString());
    });
    tests.stderr.on('data', (data) => {
      context.logger.error(data.toString());
      reject();
    });

    tests.on('close', (testsCode) => {
      context.reportStatus('Running tests done.');
      context.logger.info('Running tests done.');

      if (testsCode !== 0) {
        resolve({ success: false });
      } else if (options.coverage) {
        const dotnetCoverageArgs = ['coverage'];
        dotnetCoverageArgs.push('merge');
        dotnetCoverageArgs.push('--nologo');

        if (options.coverageOutputFileName) {
          dotnetCoverageArgs.push('--output');
          dotnetCoverageArgs.push(options.coverageOutputFileName);
        }

        if (options.coverageOutputFormat) {
          dotnetCoverageArgs.push('--output-format');
          dotnetCoverageArgs.push(options.coverageOutputFormat);
        }

        dotnetCoverageArgs.push('--recursive');
        dotnetCoverageArgs.push(`*.coverage`);

        console.log(`Executing "dotnet ${dotnetCoverageArgs.join(' ')}"...`);
        const coverage = childProcess.spawn('dotnet', dotnetCoverageArgs, {
          stdio: 'pipe',
          cwd: options.solutionFolder,
        });

        coverage.stdout.on('data', (data) => {
          context.logger.info(data.toString());
        });
        coverage.stderr.on('data', (data) => {
          context.logger.error(data.toString());
          reject();
        });

        coverage.on('close', (coverageCode) => {
          context.reportStatus('Merging coverages done.');
          context.logger.info('Merging coverages done.');

          resolve({ success: coverageCode === 0 });
        });
      }
    });
  });
}) as any;

//dotnet test --configuration Release --no-restore --no-build --logger trx --collect "Code Coverage" --results-directory .
//dotnet coverage merge -o coverage.xml -f xml -r *.coverage
