import { Settings } from '../../../Implementation/Settings'


export function settingsFor(changes: Settings.Parsing): Settings {
  return { parsing: changes }
}
