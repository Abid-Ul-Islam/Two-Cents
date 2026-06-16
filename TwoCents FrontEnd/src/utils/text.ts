export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function capitalizeName(value: string): string {
  return value.split(' ').map(capitalize).join(' ')
}
