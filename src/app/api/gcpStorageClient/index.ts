import { Storage } from '@google-cloud/storage'

// Creates a client
// https://cloud.google.com/nodejs/docs/reference/storage/latest
const storage = new Storage({
  projectId: 'video-editor-449417', // unable to create a bucket without it
  credentials: {
    client_email: 'serverless-functions-storage@video-editor-449417.iam.gserviceaccount.com',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwB1UsrgDpMxRh\n+r2jkgYoAZzgknowzSVVBwjI0AU95ws2cE645p3V8P4uIZoRS1nES4ZA1xs4WVFg\nASwauVGcVNeaAY+r9BzqQA8DkuwhpT9SkbuH7kj2GpY5X4eOYf5dOcFi2XcyE5rc\nkC1euuc2mNfPZ5nQy7sH1lkGOWo0YFSoYwL97T76wKU2JgNDiSfrHk+yAM9E94xE\n9+P72KCXf1CU6eGWgr81yNfL4bqw+r5SUTt/C6PP9Ba526DIHLihY/qPPwQGjxAo\nUXr2WV+dqr+kMyLsJhxZYehoNEOXKKdCNA1uB4ly3KDOUOXdh2WUCRS3f+QubVVJ\nLXgnq/87AgMBAAECggEAV2QkkKyIbj46QdSCvsjZvpXiZQnDmSPYA2kdHtlLqOpi\nQjIqmxh/Rr5A6vUqsKhYliAqtFk2vdh2EnQyicf0cOkcKuzYf7WPf2qzKYKRMbkB\nAYSxdjBCT9BuQWige3tCFdV9IY62Ywmhqhv4Ml4XOR9TkTgtgKAMqDzt8K2jgQF5\nXuz3YFwdUl3YrobRs6/S6Qcrl8e404bn9G2UIzzO/sHZyfAzLNROXfbTgj78M/BN\nIwvCsqtzlZGa+sL5o0dL2mRzy5OzU77k1kFcADyguIxbNhjS2/nUAkHslkGgRbkw\nBiYqGOifcAw4rFUsffAU3RVD0dkYG+TR03yuP0JgmQKBgQDZX9KoTp+cF4nPtBKp\nUD+eiQb3WlloxJub8xWtP4Ryf4OKUn0IXaDq1PoLmhH26IVYhRjlxuwNasyce2Bn\n1J7KkMF8rACl//T07dnoJEtbttbXfsJohiXx/lan3mbzT7j70DYOKCsOKvTJcp6C\n/X+MbmFqZ0k9SfeUwpNa6F8bMwKBgQDPTrrU57KmN0WF+n4inzVrzuX4zfa+yoqj\n0duZpJRVqGhJbBEvNlhHNfPnW8u1jN6d8xMAtoVkAfu9Co5m1vp+FbsZA78pJxVp\nEfPoLTyrXVkbiHjEBc7RIoIi3MTxFI+88vnmXqzrkaXkpJ2SlRcqPwA/uDPl/54C\n5gew9ZJL2QKBgQCdT19gNiYEDHTLP4IRzeV8kaXc9CGoVEBYx750NndfdTB4teGO\nYFPIHoEmTEWb7gIyYX/3KdJCk3un8xF9kr2n0sJzuvZtK6LWbhs4iKuQn+0y3qVK\nh2qGio2jxquygYtZkQDNlfwysJud/bkBCvt3YZpWKpEyLYliur1xGKFbSQKBgDND\nVrP7L5Qmqsx8quBI2l70ZK3n0JJRZ4MnC9Sse/nKkS9Gx+ES4TWKw+t8KZ2VXh9U\n0mgkukuGqgePKrOHiZ3QJdoDsSut/H9k7xmExjHh/XzvfF2Myh2xGNkiGpk66mhg\n9SbgVoZSF+G4SzbKI1ZRCfC3zi2bzikNVO2PbEPRAoGACCPfv3I1OY0k9/qPA80x\nsHoTqZnbQb8k2mdHk2y22x6mjr6CqfD+bpdt7c47tHmAbKk7gD3S9EiCIOt/iPXb\n/HG9THfSISEn2BZr5kOvbficsN81pD6HXvwWxzrDw2VTvdsCqLXlJDICVT+hv8ng\ndJRKn6s75u+sKOy228lvIIM=\n-----END PRIVATE KEY-----\n',
  },
  // projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
  // scopes: 'https://www.googleapis.com/auth/cloud-platform',
  // credentials: {
  //   client_email: process.env.GOOGLE_STORAGE_EMAIL,
  //   private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY
  // }
})

export default storage
