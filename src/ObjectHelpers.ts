export function merge(base: StringInxexable, changes: StringInxexable): StringInxexable {
  if (changes == null) {
    return base
  }

  const merged: StringInxexable = {}

  for (const key in base) {
    const baseValue = merged[key] = base[key]
    const changedValue = changes[key]

    if (baseValue == null) {
      merged[key] = changedValue
      continue
    }

    if (changedValue != null) {
      merged[key] =
        typeof baseValue === 'object'
          ? merge(baseValue, changedValue)
          : changedValue
    }
  }

  return merged
}


interface StringInxexable {
  [key: string]: any
}
