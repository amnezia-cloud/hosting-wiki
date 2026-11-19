<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import PgTabs from './PgTabs.vue'
import './plan-guide.css'
import { activeTab, TAB_KEYS, scrollToTabs } from './plans.js'
import { useGuide } from './i18n.js'

// Данные и тексты на языке страницы (plans.js — русский, plans.en.js — английский)
const G = useGuide()
const TOP = computed(() => ['scenarios', 'plans', 'protocols', 'compare'].map(key => ({ key, label: G.value.T.tabs[key] })))

// Открыть нужную вкладку по ссылке: /choose-plan#calc, #compare и т. д.
function fromHash () {
  const h = decodeURIComponent(location.hash.slice(1))
  if (TAB_KEYS.includes(h)) activeTab.value = h
}
onMounted(() => {
  fromHash()
  window.addEventListener('hashchange', fromHash)
})
function go (key) {
  activeTab.value = key
  history.replaceState(history.state, '', '#' + key)
  nextTick(scrollToTabs)
}

// Вкладки второго уровня
const sVpn = ref(0)
const sOther = ref(0)
const sPlan = ref(0)
const sCmp = ref(0)


const usersNote = p => p.proto

// Метки преимуществ в сравнении
const num = s => parseFloat(String(s).replace('$', '').replace(',', '.'))
function mult (a, b) {
  if (a === b) return ''
  return b % a === 0 ? `×${b / a}` : `+${b - a}`
}
function cmpRows (c) {
  const { byName, T } = G.value
  const A = byName[c.a], B = byName[c.b]
  return [
    { k: 'vCPU', a: A.cpu, b: B.cpu, chip: mult(A.cpu, B.cpu) },
    { k: 'RAM', a: `${A.ram} ${T.gb}`, b: `${B.ram} ${T.gb}`, chip: mult(A.ram, B.ram) },
    { k: 'SSD', a: `${A.ssd} ${T.gb}`, b: `${B.ssd} ${T.gb}`, chip: mult(A.ssd, B.ssd) },
    { k: T.rowNet, a: A.net, b: B.net, chip: mult(A.netM, B.netM) },
    { k: T.rowPeople, a: `${T.upTo} ${A.users}`, b: `${T.upTo} ${B.users}`, chip: `+${B.users - A.users}` },
    { k: T.rowProto, a: A.proto, b: B.proto, chip: A.noBoth && !B.noBoth ? '✓' : '' }
  ]
}
const priceDiff = c => '+' + G.value.T.money(num(G.value.byName[c.b].price) - num(G.value.byName[c.a].price))

// Калькулятор
const users = ref(5)
const use = ref('mid')
const UF = { light: 0.7, mid: 1, heavy: 1.8 }
const result = computed(() => {
  const { PLANS, T } = G.value
  const u = users.value
  const load = u * UF[use.value]
  let i = PLANS.findIndex(p => p.users >= load)
  const over = i === -1
  const p = over ? PLANS[PLANS.length - 1] : PLANS[i]
  const pct = Math.min(100, Math.round((load / p.users) * 100))
  let text
  if (over) {
    text = T.overText(u)
  } else {
    text = T.fitText(u, T.useNames[use.value], p.fit)
    if (pct > 80 && PLANS[i + 1]) text += T.tight(p.noBoth, PLANS[i + 1].n)
    else if (p.noBoth) text += T.startBoth
  }
  return { p, pct, over, text }
})
</script>

<template>
  <div class="pg">
    <div id="plan-guide-anchor" aria-hidden="true"></div>
    <nav id="plan-guide" class="pg-top" :aria-label="G.T.navLabel">
      <button
        v-for="t in TOP" :key="t.key" type="button"
        :class="{ on: activeTab === t.key }" :aria-pressed="activeTab === t.key"
        @click="go(t.key)"
      >{{ t.label }}</button>
      <span class="pg-sep" aria-hidden="true"></span>
      <button type="button" class="pg-calc-tab" :class="{ on: activeTab === 'calc' }"
        :aria-pressed="activeTab === 'calc'" @click="go('calc')">{{ G.T.tabs.calc }}</button>
    </nav>

    <!-- Сценарии -->
    <section v-show="activeTab === 'scenarios'">
      <p class="pg-lead">{{ G.T.scenariosLead }}</p>
      <h3>VPN</h3>
      <PgTabs v-model="sVpn" :labels="G.SCENARIOS_VPN.map(s => s.label)" />
      <template v-for="(s, i) in G.SCENARIOS_VPN" :key="s.label">
        <div v-show="sVpn === i" class="pg-card">
          <div class="pg-head"><span class="pg-kicker">{{ G.T.recommend }}</span><span class="pg-name">{{ s.plan }}</span></div>
          <div class="pg-specs">
            <span>{{ G.byName[s.plan].cpu }} vCPU</span><span>{{ G.byName[s.plan].ram }} {{ G.T.gb }} RAM</span>
            <span>{{ G.byName[s.plan].ssd }} {{ G.T.gb }} SSD</span><span>{{ G.T.upTo }} {{ G.byName[s.plan].net }}</span>
            <span>{{ G.T.from }} {{ G.byName[s.plan].price }}{{ G.T.mo }}</span>
          </div>
          <div class="pg-users">
            <b>{{ G.T.upTo }} {{ G.byName[s.plan].users }} {{ G.T.people }}</b>
            <span>{{ usersNote(G.byName[s.plan]) }}</span>
          </div>
          <p>{{ s.why }}</p>
          <p class="pg-alt"><strong>{{ G.T.alsoFits }}</strong> <span v-html="s.alt" /></p>
        </div>
      </template>

      <h3>{{ G.T.otherH }}</h3>
      <p class="pg-muted">{{ G.T.otherP }}</p>
      <PgTabs v-model="sOther" :labels="G.SCENARIOS_OTHER.map(s => s.label)" />
      <template v-for="(s, i) in G.SCENARIOS_OTHER" :key="s.label">
        <div v-show="sOther === i" class="pg-card">
          <div class="pg-head"><span class="pg-kicker">{{ G.T.fits }}</span><span class="pg-name">{{ s.plan }}</span></div>
          <div class="pg-specs">
            <span>{{ G.byName[s.plan].cpu }} vCPU</span><span>{{ G.byName[s.plan].ram }} {{ G.T.gb }} RAM</span>
            <span>{{ G.byName[s.plan].ssd }} {{ G.T.gb }} SSD</span><span>{{ G.T.upTo }} {{ G.byName[s.plan].net }}</span>
            <span>{{ G.T.from }} {{ G.byName[s.plan].price }}{{ G.T.mo }}</span>
          </div>
          <p>{{ s.why }}</p>
          <p class="pg-alt"><strong>{{ G.T.alsoFits }}</strong> <span v-html="s.alt" /></p>
        </div>
      </template>
    </section>

    <!-- Тарифы -->
    <section v-show="activeTab === 'plans'">
      <p class="pg-lead">{{ G.T.plansLead }}</p>
      <PgTabs v-model="sPlan" :labels="G.PLANS.map(p => p.n)" />
      <template v-for="(p, i) in G.PLANS" :key="p.n">
        <div v-show="sPlan === i" class="pg-card">
          <div class="pg-head"><span class="pg-name">{{ p.n }}</span><span v-if="p.pop" class="pg-badge">{{ G.T.popular }}</span></div>
          <div class="pg-specs">
            <span>{{ p.cpu }} vCPU</span><span>{{ p.ram }} {{ G.T.gb }} RAM</span><span>{{ p.ssd }} {{ G.T.gb }} SSD</span>
            <span>{{ G.T.upTo }} {{ p.net }}</span><span>{{ G.T.from }} {{ p.price }}{{ G.T.mo }}</span>
          </div>
          <p class="pg-muted">{{ p.fit }}</p>
          <div class="pg-users">
            <b>{{ G.T.upTo }} {{ p.users }} {{ G.T.people }}</b>
            <span>{{ usersNote(p) }}</span>
          </div>
          <p>{{ p.text }}</p>
          <p class="pg-small"><strong>{{ G.T.notOnly }}</strong> {{ p.other }}.</p>
          <p class="pg-alt"><strong>{{ G.T.whenUp }}</strong> {{ p.up }}</p>
        </div>
      </template>
    </section>

    <!-- Протоколы -->
    <section v-show="activeTab === 'protocols'">
      <p class="pg-lead">{{ G.T.protocolsLead }}</p>
      <div class="pg-pcards">
        <div v-for="pr in G.PROTOCOLS" :key="pr.label" class="pg-pcard">
          <p class="pg-pcard-h">{{ pr.label }}</p>
          <p>{{ pr.text }}</p>
        </div>
      </div>
      <table class="pg-ptab">
        <thead>
          <tr>
            <th>{{ G.T.thPlan }}</th>
            <th>{{ G.T.thPeople }}<br><span class="pg-thsub">AWG / XRay</span></th>
            <th>{{ G.T.thPeople }}<br><span class="pg-thsub">{{ G.T.thBoth }}</span></th>
            <th>{{ G.T.thConfig }}</th><th>{{ G.T.thNet }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in G.PLANS" :key="p.n">
            <td><strong>{{ p.n }}</strong></td>
            <td class="pg-nw"><strong>{{ G.T.upTo }} {{ p.users }}</strong></td>
            <td>
              <span v-if="p.noBoth" class="pg-muted">{{ G.T.notRec }}</span>
              <strong v-else>{{ G.T.upTo }} {{ p.users }}</strong>
            </td>
            <td class="pg-nw">{{ p.cpu }} vCPU, {{ p.ram }} {{ G.T.gb }} RAM</td>
            <td class="pg-nw">{{ p.net }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Сравнение -->
    <section v-show="activeTab === 'compare'">
      <p class="pg-lead">{{ G.T.compareLead }}</p>
      <PgTabs v-model="sCmp" :labels="G.COMPARE.map(c => `${c.a} / ${c.b}`)" />
      <template v-for="(c, i) in G.COMPARE" :key="c.a">
        <div v-show="sCmp === i">
          <p>{{ c.diff }}</p>
          <div class="pg-sum">
            <span class="pg-sum-l">{{ G.T.vs(c.b, c.a) }}</span>
            <template v-for="r in cmpRows(c).slice(0, 4)" :key="r.k">
              <span v-if="r.chip" class="pg-pill">{{ r.k }} {{ r.chip }}</span>
            </template>
            <span class="pg-pill cost">{{ priceDiff(c) }}{{ G.T.mo }}</span>
          </div>
          <table class="pg-cmp">
            <thead><tr><th>{{ G.T.rowSpec }}</th><th>{{ c.a }}</th><th>{{ c.b }}</th></tr></thead>
            <tbody>
              <tr v-for="r in cmpRows(c)" :key="r.k">
                <td>{{ r.k }}</td>
                <td>{{ r.a }}</td>
                <td :class="{ better: r.chip }">{{ r.b }}<span v-if="r.chip" class="pg-up">{{ r.chip }}</span></td>
              </tr>
              <tr><td>{{ G.T.rowOther }}</td><td>{{ G.byName[c.a].other }}</td><td>{{ G.byName[c.b].other }}</td></tr>
              <tr>
                <td>{{ G.T.rowPrice }}</td><td>{{ G.T.from }} {{ G.byName[c.a].price }}{{ G.T.mo }}</td>
                <td>{{ G.T.from }} {{ G.byName[c.b].price }}{{ G.T.mo }}<span class="pg-cost">{{ priceDiff(c) }}</span></td>
              </tr>
            </tbody>
          </table>
          <div class="pg-pair">
            <div><strong>{{ G.T.take }} {{ c.a }}</strong>{{ G.T.takeSep }}{{ c.ca }}</div>
            <div><strong>{{ G.T.take }} {{ c.b }}</strong>{{ G.T.takeSep }}{{ c.cb }}</div>
          </div>
        </div>
      </template>
    </section>

    <!-- Подбор тарифа -->
    <section v-show="activeTab === 'calc'">
      <p class="pg-lead">{{ G.T.calcLead }}</p>
      <div class="pg-calc">
        <div class="pg-field">
          <label class="pg-lbl" for="pg-users">{{ G.T.q1 }} <output>{{ users }}</output></label>
          <input id="pg-users" v-model.number="users" type="range" min="1" max="150">
        </div>
        <div class="pg-field">
          <div class="pg-lbl">{{ G.T.q2 }}</div>
          <div class="pg-seg" role="radiogroup">
            <label v-for="o in G.T.uses" :key="o[0]"><input v-model="use" type="radio" :value="o[0]"><span>{{ o[1] }}<small>{{ o[2] }}</small></span></label>
          </div>
        </div>
        <div class="pg-result" aria-live="polite">
          <div class="pg-kicker">{{ G.T.youNeed }}</div>
          <div class="pg-rname">{{ result.p.n }}<small>{{ result.p.cpu }} vCPU, {{ result.p.ram }} {{ G.T.gb }} RAM, {{ result.p.net }}, {{ G.T.from }} {{ result.p.price }}{{ G.T.mo }}</small></div>
          <div class="pg-meter" :class="{ hot: result.pct > 80 }"><i :style="{ width: result.pct + '%' }" /></div>
          <p class="pg-small pg-muted">{{ result.over ? G.T.overUltra : G.T.loadPct(result.pct) }}</p>
          <p>{{ result.text }}</p>
        </div>
      </div>
      <p class="pg-small pg-muted">{{ G.T.calcNote }}</p>
    </section>
  </div>
</template>
