import { JsPackageManager } from "./JsPackageManager";

export class Yarn1Proxy extends JsPackageManager {
    readonly type = 'yarn1'

    initPackageJson() {
        return this.executeCommand('yarn', ['init', '-y'])
    }
}