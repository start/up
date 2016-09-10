import { UserProvidedSettings } from '../../../UserProvidedSettings'


export function settingsFor(changes: UserProvidedSettings.Parsing): UserProvidedSettings {
  return { parsing: changes }
}
