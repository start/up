export function merge(base: StringInxexable, changes: StringInxexable): StringInxexable {
  const merged: StringInxexable = {}

  for (const key in base) {
    merged[key] = base[key]

    if (changes[key] != null) {
      merged[key] =
        typeof base[key] === 'object'
          ? merge(base[key], changes[key])
          : changes[key]
    }
  }

  return merged
}

interface StringInxexable {
  [key: string]: any
}
