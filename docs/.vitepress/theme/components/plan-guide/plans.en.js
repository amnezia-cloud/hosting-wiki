// English data for the "Which plan to choose" page (docs/en/choose-plan.md).
// Hardware and prices mirror plans.js — change them in both files.

export const PLANS = [
  { n: 'Start', cpu: 1, ram: 1, ssd: 20, net: '100 Mbps', netM: 100, price: '$5.25', users: 5, proto: 'any protocol, but one is best', noBoth: true,
    fit: 'Personal VPN for your own devices',
    text: 'The minimum configuration. One core and 1 GB of memory are enough for a VPN for a small circle, but there is almost no headroom for the 3X-UI panel or other services. We do not recommend running several protocols at once on this plan.',
    other: 'Simple scripts, website monitoring, a light proxy',
    up: 'If you grow beyond 5 people, need several protocols at once or the 3X-UI panel — Basic.' },
  { n: 'Basic', cpu: 1, ram: 2, ssd: 20, net: '100 Mbps', netM: 100, price: '$6.15', users: 8, proto: 'several protocols and the 3X-UI panel are fine',
    fit: 'Family VPN, 3X-UI panel',
    text: 'Same CPU and bandwidth as Start, but twice the memory. Enough for the 3X-UI panel or a small bot next to the VPN.',
    other: 'Telegram bot, scheduled scripts, a scraper',
    up: 'If several people watch video in the evening and speed drops — Advanced.' },
  { n: 'Advanced', cpu: 2, ram: 4, ssd: 40, net: '200 Mbps', netM: 200, price: '$9.45', users: 15, proto: 'any protocols', pop: true,
    fit: 'A group of friends, a small team',
    text: 'A second core and twice the bandwidth. The first plan where several people can watch video at the same time without fighting for speed.',
    other: 'A website, an API or a service with PostgreSQL / MySQL',
    up: 'If you have more than 15 people — Pro.' },
  { n: 'Pro', cpu: 4, ram: 4, ssd: 80, net: '300 Mbps', netM: 300, price: '$15.15', users: 25, proto: 'any protocols, with CPU headroom',
    fit: 'Office, community',
    text: 'Four cores handle a large number of simultaneous connections without slowdowns.',
    other: 'Several websites, CPU-heavy services',
    up: 'If you need a bot, a website or a database next to the VPN — Pro Plus.' },
  { n: 'Pro Plus', cpu: 4, ram: 8, ssd: 80, net: '300 Mbps', netM: 300, price: '$18.95', users: 30, proto: 'any protocols, with services alongside',
    fit: 'VPN plus other services on the same server',
    text: 'Almost the same as Pro for VPN, but 8 GB of memory let you run a bot, a website or a database alongside without taking resources from the VPN.',
    other: 'Online store or CRM: app, database and cache',
    up: 'If you hit the 300 Mbps bandwidth limit — Power.' },
  { n: 'Power', cpu: 8, ram: 8, ssd: 160, net: '500 Mbps', netM: 500, price: '$30.35', users: 50, proto: 'any protocols, with headroom for peak hours',
    fit: 'Large audience, peak load in the evening',
    text: 'Eight cores and a 500 Mbps channel handle several dozen people active at the same time.',
    other: 'CI runner, app builds, automated tests',
    up: 'If there is a lot of 4K and torrents — Max with a 1 Gbps channel.' },
  { n: 'Max', cpu: 8, ram: 16, ssd: 160, net: '1 Gbps', netM: 1000, price: '$37.95', users: 80, proto: 'any protocols, including heavy traffic',
    fit: 'Large communities, lots of heavy traffic',
    text: 'The 1 Gbps channel is the main difference from Power. With heavy traffic the bandwidth is no longer the bottleneck.',
    other: 'AI agents, large databases, heavy backends',
    up: 'If you run out of CPU — Ultra.' },
  { n: 'Ultra', cpu: 16, ram: 32, ssd: 200, net: '1 Gbps', netM: 1000, price: '$58.85', users: 120, proto: 'any protocols, with several services alongside',
    fit: 'Maximum load and several services at once',
    text: 'Sixteen cores for the most demanding scenarios.',
    other: 'Several heavy services on one server',
    up: 'Beyond this, a second server in another location is the smarter choice — it is more reliable.' }
]

export const byName = Object.fromEntries(PLANS.map(p => [p.n, p]))

export const SCENARIOS_VPN = [
  { label: 'Just me', plan: 'Start', why: 'A phone and a laptop, sometimes a tablet. Messengers, YouTube, work — plenty of headroom.', alt: '<strong>Basic</strong>, if you need several protocols at once, the 3X-UI panel, or want to add a couple more people.' },
  { label: 'Family', plan: 'Basic', why: 'Up to 5–8 people, everyone watches video in the evening. You can run two protocols: a main one and a backup in case of blocking.', alt: '<strong>Advanced</strong>, if the family is large or everyone watches high-quality video at the same time.' },
  { label: 'Friends and team', plan: 'Advanced', why: '10–15 people, several streams at once, video calls. Two cores and a 200 Mbps channel keep people from getting in each other’s way.', alt: '<strong>Pro</strong>, if the group grows.' },
  { label: 'Office', plan: 'Pro', why: '20–25 people, the 3X-UI panel to manage clients, limits and expiry dates for each. Four cores handle this load without slowdowns.', alt: '<strong>Pro Plus</strong>, if a bot, a website or a database will run on the same server.' },
  { label: 'VPN + services', plan: 'Pro Plus', why: 'A VPN for a team of up to 30 people plus a company bot, an internal website or a database. 8 GB of memory keep the services from slowing the VPN.', alt: '<strong>Power</strong>, if there are more people or you hit the 300 Mbps limit.' },
  { label: 'Community', plan: 'Power', why: '40–50 people, high load in the evening. Eight cores and a 500 Mbps channel get through peak hours without slowdowns.', alt: '<strong>Max</strong>, if users watch a lot of 4K or download a lot.' },
  { label: 'Heavy traffic', plan: 'Max', why: 'Up to 80 people, lots of 4K video, torrents, large downloads. The key is the 1 Gbps channel.', alt: '<strong>Ultra</strong>, if you run out of CPU.' },
  { label: 'Maximum', plan: 'Ultra', why: '100 people or more, or a VPN together with several heavy services on one machine.', alt: '<strong>Max</strong>, if you have up to 80 people and the load is on bandwidth rather than CPU.' }
]

export const SCENARIOS_OTHER = [
  { label: 'Telegram bot', plan: 'Basic', why: 'A bot, scheduled scripts, scrapers, notifications. Barely any CPU needed, and 2 GB of memory are enough for Python or Node.js and a small SQLite database.', alt: '<strong>Start</strong> — for a very simple script without a database; <strong>Advanced</strong> — if the bot has thousands of users and its own database.' },
  { label: 'Website and database', plan: 'Advanced', why: 'A website, landing page, API or service with PostgreSQL / MySQL. 4 GB of memory are enough for both the app and the database.', alt: '<strong>Pro</strong> — if you have several websites or traffic is growing.' },
  { label: 'Store or CRM', plan: 'Pro Plus', why: 'App, database and cache (Redis) on one server. Enough resources for a large flow of customers at peak hours.', alt: '<strong>Power</strong> — if heavy background jobs run in parallel: exports, reports, product imports.' },
  { label: 'Builds and CI', plan: 'Power', why: 'Your own CI runner (GitLab Runner, GitHub Actions), app builds and test runs. Eight cores speed up parallel builds.', alt: '<strong>Max</strong> — if builds need a lot of memory, e.g. Docker images or Android.' },
  { label: 'AI agents', plan: 'Max', why: 'An isolated environment for AI agents and automations that work with external model APIs. 16 GB of memory leave room for browsers, containers and vector databases.', alt: '<strong>Ultra</strong> — if there are many agents running in parallel.' },
  { label: 'Everything at once', plan: 'Ultra', why: 'Several heavy services on one machine: website, database, queues, CI and a VPN for the team.', alt: '<strong>Max</strong>, if you have one or two heavy services and 8 cores are enough.' }
]

export const PROTOCOLS = [
  { label: 'AmneziaWG', text: 'Runs over UDP, connects quickly and gives the best speed. A good fit if your ISP does not restrict UDP.' },
  { label: 'XRay / VLESS', text: 'Disguises traffic as a regular HTTPS website. A good fit if AmneziaWG is blocked or UDP is restricted.' },
  { label: 'Both at once', text: 'One is the main protocol, the other a backup in case of blocking. The number of people does not change.' }
]

export const COMPARE = [
  { a: 'Start', b: 'Basic', diff: 'They differ only in memory: CPU and bandwidth are the same.', ca: 'if the VPN is just for you or you need a simple script.', cb: 'if you need several protocols at once, the 3X-UI panel, a family VPN or a Telegram bot.' },
  { a: 'Basic', b: 'Advanced', diff: 'Advanced adds a second core, twice the memory and twice the bandwidth.', ca: 'for a VPN of up to 8 people or a small bot.', cb: 'for a VPN of 10+ people, a website or a service with a database.' },
  { a: 'Advanced', b: 'Pro', diff: 'Same memory, but Pro has twice the cores, more bandwidth and a bigger disk.', ca: 'for a VPN of up to 15 people or one website with a database.', cb: 'for a VPN of 15+ people or several websites.' },
  { a: 'Pro', b: 'Pro Plus', diff: 'Almost identical for VPN — the only difference is 4 GB of memory.', ca: 'if the server is just for VPN or for services that need CPU more than memory.', cb: 'if a bot, a website or a database runs next to the VPN, or it is a store or CRM.' },
  { a: 'Pro Plus', b: 'Power', diff: 'Same memory; Power has twice the cores and disk and a 500 Mbps channel.', ca: 'if the load is mostly on memory: database, cache, store.', cb: 'for a VPN of 30+ people, builds, CI and other CPU-bound tasks.' },
  { a: 'Power', b: 'Max', diff: 'Same CPU; Max has twice the memory and a 1 Gbps channel.', ca: 'if traffic is ordinary: web, HD video, builds.', cb: 'if there is a lot of 4K and torrents, AI agents or large databases.' },
  { a: 'Max', b: 'Ultra', diff: 'Same bandwidth; Ultra has twice the cores and memory.', ca: 'if 8 cores and one or two heavy services are enough.', cb: 'if the server runs several heavy services or a VPN for 80+ people.' }
]

// Interface strings
export const T = {
  tabs: { scenarios: 'Scenarios', plans: 'Plans', protocols: 'Protocols', compare: 'Comparison', calc: 'Find my plan' },
  navLabel: 'How to choose',
  cta: { h: 'Not sure which plan to choose?', p: 'Answer a couple of simple questions and we will suggest the best option.' },
  gb: 'GB', upTo: 'up to', from: 'from', mo: '/mo', people: 'people',
  scenariosLead: 'Pick the task closest to yours — you will see the matching plan and an alternative.',
  recommend: 'Recommended', fits: 'Good fit', alsoFits: 'Also works:',
  otherH: 'Bots, websites and other tasks',
  otherP: 'The server runs around the clock — you can host more than just a VPN on it.',
  plansLead: 'Tap a plan to see how many people it comfortably handles, what else it is good for and when to move up.',
  popular: 'Popular', notOnly: 'Not only VPN:', whenUp: 'When to move up:',
  protocolsLead: 'Choose a protocol by how your internet connection behaves, not by server power: the number of people is the same on any protocol.',
  thPlan: 'Plan', thPeople: 'People', thBoth: 'both at once', thConfig: 'Configuration', thNet: 'Bandwidth',
  notRec: 'not recommended',
  compareLead: 'Most doubts arise between neighbouring plans. Here is how they really differ and which one to pick for your task.',
  vs: (b, a) => `${b} compared with ${a}:`,
  rowNet: 'Bandwidth', rowPeople: 'People', rowProto: 'Protocols', rowOther: 'Other tasks', rowPrice: 'Price', rowSpec: 'Spec',
  take: 'Take', takeSep: ' ',
  calcLead: 'Answer two questions and the matching plan appears right below. The estimate is approximate, and you can change the plan at any time.',
  q1: '1. How many people will use the VPN', q2: '2. What do you mostly do online',
  uses: [
    ['light', 'Chat and websites', 'messengers, social media'],
    ['mid', 'HD video', 'YouTube, calls'],
    ['heavy', '4K and torrents', 'lots of traffic']
  ],
  useNames: { light: 'mostly chat and websites', mid: 'HD video', heavy: '4K and torrents' },
  youNeed: 'Your plan',
  overUltra: 'Load is above the recommended level even for Ultra',
  loadPct: pct => `Estimated load: ${pct}% of the comfortable limit`,
  overText: u => `For ${u} people it is better to split users across two servers — more reliable and faster. Write to support and we will help pick a configuration.`,
  fitText: (u, use, fit) => `${u} people, ${use}. ${fit}.`,
  tight: (both, next) => ` Not much headroom — if the number of people grows${both ? ' or you need several protocols' : ''}, go straight for ${next}.`,
  startBoth: ' If you plan to run several protocols at once, take Basic: we do not recommend it on Start.',
  calcNote: 'The protocol does not affect the estimate: the server handles the same number of people on AmneziaWG and XRay. 4K and torrents are limited by bandwidth: 100 Mbps is enough for about 4 simultaneous 4K streams.',
  price: (s, d) => `${s}${d}`,
  money: n => '$' + n.toFixed(2)
}
