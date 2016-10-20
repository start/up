import { Settings } from '../../../Settings'


export function settingsFor(changes: Settings.Parsing): Settings {
  return { parsing: changes }
}
