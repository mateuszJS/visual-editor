const config = {
  server: {
    command: 'npm run build-storybook && npx http-server storybook-static -p 6006',
    port: 6006,
    launchTimeout: 30000, // 30 seconds to allow Storybook to load
    // debug: true,
  },
  launch: {
    headless: true,
    args: ['--no-sandbox'], // fails to run chrome on ubuntu-latest with sandbox
    // as long as we trust the content of the pages we render, we shoyld be fine without the sanbox
  },
}

export default config
