// it('sends a message to the service worker when the page is hidden', async () => {
//   const broadcast = new BroadcastChannel('sync-data')
//   let receivedDataSync = false
//   let receivedMiniatureSync = false

//   const messagesReceivedPromise = new Promise<void>((resolve) => {
//     broadcast.onmessage = (event) => {
//       if (event.data === 'SYNC_PROJECT_DATA_START') {
//         receivedDataSync = true
//       }
//       if (event.data === 'SYNC_PROJECT_MINIATURE_START') {
//         receivedMiniatureSync = true
//       }
//       if (receivedDataSync && receivedMiniatureSync) {
//         resolve()
//       }
//     }
//   })

//   render(<InitializeData />)

//   fireEvent(window, new Event('pagehide', { bubbles: true }))

//   await act(() => messagesReceivedPromise)

//   expect(receivedDataSync).toBe(true)
//   expect(receivedMiniatureSync).toBe(true)
//   broadcast.close()
// })
