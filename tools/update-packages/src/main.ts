import { ExecOptions, exec } from 'child_process';

type NpmOudated = {
  [key: string]: {
    current: string;
    wanted: string;
    latest: string;
    dependent: string;
    location: string;
  };
};
const execAsync = (
  command: string,
  options: {
    encoding: BufferEncoding;
  } & ExecOptions = { encoding: 'utf8' },
) =>
  new Promise((resolve, reject) =>
    exec(command, options, (error, stdout, stderr) =>
      stderr !== '' ? reject(stderr) : resolve(stdout),
    ),
  );

async function npmOutdated() {
  const stdout = await execAsync(`npm outdated --json`);
  return stdout.toString().trim();
}

async function nxMigrateLatest(pkg: string) {
  const cmd = `nx migrate ${pkg}@latest`;
  console.log(cmd);
  const stdout = await execAsync(cmd);
  console.log(stdout);
}

async function main(omit: string[]) {
  console.log(`Updating packages...`);
  if (omit?.length) {
    console.log(`Omitting: ${omit}`);
  }
  const data = await npmOutdated();
  const parsed = JSON.parse(data.toString()) as NpmOudated;
  const packages = Object.keys(parsed).filter((p) => !omit.includes(p));
  if (packages.length === 0) {
    console.log('No packages to update');
    return;
  }
  packages.forEach(async (pkg) => nxMigrateLatest(pkg));
}

main(process.argv.slice(2));
