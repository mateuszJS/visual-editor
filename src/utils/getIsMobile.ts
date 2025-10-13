export default function getIsMobile() {
  const isTouchDevice = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0
  return isTouchDevice
}
