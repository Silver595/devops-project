import arcjet, { shield, detectBot,slidingWindow } from '@arcjet/node';



const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        //"CATEGORY:MONITOR", // Uptime monitoring services
        'CATEGORY:PREVIEW',
      ],
    }),
    slidingWindow({
      mode: 'LIVE',
      interval: '2s', // 60 seconds
      max: 5, // Allow 10 requests per window
    })
  ],
});

export default aj;
