import { SoftVector4 } from '@mateuszjs/magic-render/types'

export function softVecToHandles(value: SoftVector4) {
  // prettier-ignore
  return [
    value[0] === null ? null : { label: '', value: value[0], knobType: 'circle', removable: true },
    value[1] === null ? null : { label: '', value: value[1], removable: value[2] !== null },
    value[2] === null ? null : { label: '', value: value[2], removable: value[1] !== null },
    value[3] === null ? null : { label: '', value: value[3], knobType: 'circle', removable: true },
  ]
}
