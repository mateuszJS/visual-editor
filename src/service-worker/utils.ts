export const getIsMiniature = (pathname: string) => {
  return pathname.startsWith('/api/projects/') && pathname.endsWith('/miniature')
}
