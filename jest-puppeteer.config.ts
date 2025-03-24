const config = {
  server: {
    command: 'npx http-server storybook-static -p 6006',
    port: 6006,
    launchTimeout: 30000, // 30 seconds to allow Storybook to load
    // debug: true,
  },
  launch: {
    headless: true,
    args: ['--no-sandbox'],
  },
}

export default config
