import {sync as spawnSync} from 'cross-spawn'

export abstract class JsPackageManager {
    public abstract readonly type: 'npm' | 'yarn1' | 'yarn2'

    public abstract initPackageJson(): void

    public executeCommand(command: string, args: string[], stdio?: 'pipe' | 'inherit'): string {
        const commandResult = spawnSync(command, args, {
          stdio: stdio ?? 'pipe',
          encoding: 'utf-8',
        });
    
        if (commandResult.status !== 0) {
          throw new Error(commandResult.stderr ?? '');
        }
    
        return commandResult.stdout ?? '';
      }
}