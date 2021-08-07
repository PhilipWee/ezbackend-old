//TODO: Make this a non-relative import
import { EzBackend } from "./../model";


//TODO: Figure out how to watch the .ezb folder and recompile on update

export async function start(options: {}) {
  EzBackend.start()
}