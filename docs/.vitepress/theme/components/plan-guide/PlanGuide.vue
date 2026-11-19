<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import PgTabs from './PgTabs.vue'
import './plan-guide.css'
import { activeTab, TAB_KEYS, scrollToTabs, PLANS, byName, SCENARIOS_VPN, SCENARIOS_OTHER, PROTOCOLS, COMPARE } from './plans.js'

const TOP = [
  { key: 'scenarios', label: 'Сценарии' },
  { key: 'plans', label: 'Тарифы' },
  { key: 'protocols', label: 'Протоколы' },
  { key: 'compare', label: 'Сравнение' }
]

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
const num = s => parseFloat(String(s).replace(',', '.'))
function mult (a, b) {
  if (a === b) return ''
  return b % a === 0 ? `×${b / a}` : `+${b - a}`
}
function cmpRows (c) {
  const A = byName[c.a], B = byName[c.b]
  return [
    { k: 'vCPU', a: A.cpu, b: B.cpu, chip: mult(A.cpu, B.cpu) },
    { k: 'RAM', a: `${A.ram} ГБ`, b: `${B.ram} ГБ`, chip: mult(A.ram, B.ram) },
    { k: 'SSD', a: `${A.ssd} ГБ`, b: `${B.ssd} ГБ`, chip: mult(A.ssd, B.ssd) },
    { k: 'Канал', a: A.net, b: B.net, chip: mult(A.netM, B.netM) },
    { k: 'Количество человек', a: `до ${A.users}`, b: `до ${B.users}`, chip: `+${B.users - A.users}` },
    { k: 'Протоколы', a: A.proto, b: B.proto, chip: A.noBoth && !B.noBoth ? '✓' : '' }
  ]
}
const priceDiff = c => '+' + (num(byName[c.b].price) - num(byName[c.a].price)).toFixed(2).replace('.', ',') + ' $'

// Калькулятор
const users = ref(5)
const use = ref('mid')
const UF = { light: 0.7, mid: 1, heavy: 1.8 }
const UN = { light: 'в основном переписка и сайты', mid: 'видео в HD', heavy: '4K и торренты' }
const result = computed(() => {
  const u = users.value
  const load = u * UF[use.value]
  let i = PLANS.findIndex(p => p.users >= load)
  const over = i === -1
  const p = over ? PLANS[PLANS.length - 1] : PLANS[i]
  const pct = Math.min(100, Math.round((load / p.users) * 100))
  let text
  if (over) {
    text = `Для ${u} человек лучше разнести пользователей на два сервера — так надёжнее и быстрее. Напишите в поддержку, поможем подобрать конфигурацию.`
  } else {
    text = `${u} человек, ${UN[use.value]}. ${p.fit}.`
    if (pct > 80 && PLANS[i + 1]) text += ` Запаса немного — если количество человек будет расти${p.noBoth ? ' или понадобится несколько протоколов' : ''}, сразу берите ${PLANS[i + 1].n}.`
    else if (p.noBoth) text += ' Если планируете несколько протоколов сразу, берите Basic: на Start это не рекомендуем.'
  }
  return { p, pct, over, text }
})
</script>

<template>
  <div class="pg">
    <div id="plan-guide-anchor" aria-hidden="true"></div>
    <nav id="plan-guide" class="pg-top" aria-label="Способ подбора">
      <button
        v-for="t in TOP" :key="t.key" type="button"
        :class="{ on: activeTab === t.key }" :aria-pressed="activeTab === t.key"
        @click="go(t.key)"
      >{{ t.label }}</button>
      <span class="pg-sep" aria-hidden="true"></span>
      <button type="button" class="pg-calc-tab" :class="{ on: activeTab === 'calc' }"
        :aria-pressed="activeTab === 'calc'" @click="go('calc')">Подобрать тариф</button>
    </nav>

    <!-- Сценарии -->
    <section v-show="activeTab === 'scenarios'">
      <p class="pg-lead">Выберите задачу, которая ближе к вашей, — там подходящий тариф и альтернатива к нему.</p>
      <h3>VPN</h3>
      <PgTabs v-model="sVpn" :labels="SCENARIOS_VPN.map(s => s.label)" />
      <template v-for="(s, i) in SCENARIOS_VPN" :key="s.label">
        <div v-show="sVpn === i" class="pg-card">
          <div class="pg-head"><span class="pg-kicker">Рекомендуем</span><span class="pg-name">{{ s.plan }}</span></div>
          <div class="pg-specs">
            <span>{{ byName[s.plan].cpu }} vCPU</span><span>{{ byName[s.plan].ram }} ГБ RAM</span>
            <span>{{ byName[s.plan].ssd }} ГБ SSD</span><span>до {{ byName[s.plan].net }}</span>
            <span>от {{ byName[s.plan].price }}/мес</span>
          </div>
          <div class="pg-users">
            <b>до {{ byName[s.plan].users }} человек</b>
            <span>{{ usersNote(byName[s.plan]) }}</span>
          </div>
          <p>{{ s.why }}</p>
          <p class="pg-alt"><strong>Также подойдёт:</strong> <span v-html="s.alt" /></p>
        </div>
      </template>

      <h3>Боты, сайты и другие задачи</h3>
      <p class="pg-muted">Сервер работает круглосуточно — на нём можно держать не только VPN.</p>
      <PgTabs v-model="sOther" :labels="SCENARIOS_OTHER.map(s => s.label)" />
      <template v-for="(s, i) in SCENARIOS_OTHER" :key="s.label">
        <div v-show="sOther === i" class="pg-card">
          <div class="pg-head"><span class="pg-kicker">Подойдёт</span><span class="pg-name">{{ s.plan }}</span></div>
          <div class="pg-specs">
            <span>{{ byName[s.plan].cpu }} vCPU</span><span>{{ byName[s.plan].ram }} ГБ RAM</span>
            <span>{{ byName[s.plan].ssd }} ГБ SSD</span><span>до {{ byName[s.plan].net }}</span>
            <span>от {{ byName[s.plan].price }}/мес</span>
          </div>
          <p>{{ s.why }}</p>
          <p class="pg-alt"><strong>Также подойдёт:</strong> <span v-html="s.alt" /></p>
        </div>
      </template>
    </section>

    <!-- Тарифы -->
    <section v-show="activeTab === 'plans'">
      <p class="pg-lead">Нажмите на тариф, чтобы увидеть, сколько человек он комфортно потянет, для каких ещё задач подходит и когда переходить выше.</p>
      <PgTabs v-model="sPlan" :labels="PLANS.map(p => p.n)" />
      <template v-for="(p, i) in PLANS" :key="p.n">
        <div v-show="sPlan === i" class="pg-card">
          <div class="pg-head"><span class="pg-name">{{ p.n }}</span><span v-if="p.pop" class="pg-badge">Популярный</span></div>
          <div class="pg-specs">
            <span>{{ p.cpu }} vCPU</span><span>{{ p.ram }} ГБ RAM</span><span>{{ p.ssd }} ГБ SSD</span>
            <span>до {{ p.net }}</span><span>от {{ p.price }}/мес</span>
          </div>
          <p class="pg-muted">{{ p.fit }}</p>
          <div class="pg-users">
            <b>до {{ p.users }} человек</b>
            <span>{{ usersNote(p) }}</span>
          </div>
          <p>{{ p.text }}</p>
          <p class="pg-small"><strong>Не только VPN:</strong> {{ p.other }}.</p>
          <p class="pg-alt"><strong>Когда переходить выше:</strong> {{ p.up }}</p>
        </div>
      </template>
    </section>

    <!-- Протоколы -->
    <section v-show="activeTab === 'protocols'">
      <p class="pg-lead">Протокол выбирают по тому, как работает интернет у вас, а не по мощности сервера: количество человек на любом протоколе одинаковое.</p>
      <div class="pg-pcards">
        <div v-for="pr in PROTOCOLS" :key="pr.label" class="pg-pcard">
          <p class="pg-pcard-h">{{ pr.label }}</p>
          <p>{{ pr.text }}</p>
        </div>
      </div>
      <table class="pg-ptab">
        <thead>
          <tr>
            <th>Тариф</th>
            <th>Кол-во человек<br><span class="pg-thsub">AWG / XRay</span></th>
            <th>Кол-во человек<br><span class="pg-thsub">оба сразу</span></th>
            <th>Конфигурация</th><th>Канал</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in PLANS" :key="p.n">
            <td><strong>{{ p.n }}</strong></td>
            <td class="pg-nw"><strong>до {{ p.users }}</strong></td>
            <td>
              <span v-if="p.noBoth" class="pg-muted">не рекомендуем</span>
              <strong v-else>до {{ p.users }}</strong>
            </td>
            <td class="pg-nw">{{ p.cpu }} vCPU, {{ p.ram }} ГБ RAM</td>
            <td class="pg-nw">{{ p.net }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Сравнение -->
    <section v-show="activeTab === 'compare'">
      <p class="pg-lead">Чаще всего сомнения возникают между соседними тарифами. Здесь — чем они на самом деле отличаются и что выбрать для вашей задачи.</p>
      <PgTabs v-model="sCmp" :labels="COMPARE.map(c => `${c.a} / ${c.b}`)" />
      <template v-for="(c, i) in COMPARE" :key="c.a">
        <div v-show="sCmp === i">
          <p>{{ c.diff }}</p>
          <div class="pg-sum">
            <span class="pg-sum-l">{{ c.b }} по сравнению с {{ c.a }}:</span>
            <template v-for="r in cmpRows(c).slice(0, 4)" :key="r.k">
              <span v-if="r.chip" class="pg-pill">{{ r.k }} {{ r.chip }}</span>
            </template>
            <span class="pg-pill cost">{{ priceDiff(c) }}/мес</span>
          </div>
          <table class="pg-cmp">
            <thead><tr><th>Характеристика</th><th>{{ c.a }}</th><th>{{ c.b }}</th></tr></thead>
            <tbody>
              <tr v-for="r in cmpRows(c)" :key="r.k">
                <td>{{ r.k }}</td>
                <td>{{ r.a }}</td>
                <td :class="{ better: r.chip }">{{ r.b }}<span v-if="r.chip" class="pg-up">{{ r.chip }}</span></td>
              </tr>
              <tr><td>Другие задачи</td><td>{{ byName[c.a].other }}</td><td>{{ byName[c.b].other }}</td></tr>
              <tr>
                <td>Цена</td><td>от {{ byName[c.a].price }}/мес</td>
                <td>от {{ byName[c.b].price }}/мес<span class="pg-cost">{{ priceDiff(c) }}</span></td>
              </tr>
            </tbody>
          </table>
          <div class="pg-pair">
            <div><strong>Берите {{ c.a }}</strong>, {{ c.ca }}</div>
            <div><strong>Берите {{ c.b }}</strong>, {{ c.cb }}</div>
          </div>
        </div>
      </template>
    </section>

    <!-- Подбор тарифа -->
    <section v-show="activeTab === 'calc'">
      <p class="pg-lead">Ответьте на два вопроса — ниже сразу появится подходящий тариф. Расчёт ориентировочный, поменять тариф потом можно в любой момент.</p>
      <div class="pg-calc">
        <div class="pg-field">
          <label class="pg-lbl" for="pg-users">1. Сколько человек будет пользоваться VPN <output>{{ users }}</output></label>
          <input id="pg-users" v-model.number="users" type="range" min="1" max="150">
        </div>
        <div class="pg-field">
          <div class="pg-lbl">2. Чем чаще всего заняты в интернете</div>
          <div class="pg-seg" role="radiogroup">
            <label><input v-model="use" type="radio" value="light"><span>Переписка и сайты<small>мессенджеры, соцсети</small></span></label>
            <label><input v-model="use" type="radio" value="mid"><span>Видео в HD<small>YouTube, звонки</small></span></label>
            <label><input v-model="use" type="radio" value="heavy"><span>4K и торренты<small>много трафика</small></span></label>
          </div>
        </div>
        <div class="pg-result" aria-live="polite">
          <div class="pg-kicker">Вам подойдёт</div>
          <div class="pg-rname">{{ result.p.n }}<small>{{ result.p.cpu }} vCPU, {{ result.p.ram }} ГБ RAM, {{ result.p.net }}, от {{ result.p.price }}/мес</small></div>
          <div class="pg-meter" :class="{ hot: result.pct > 80 }"><i :style="{ width: result.pct + '%' }" /></div>
          <p class="pg-small pg-muted">{{ result.over ? 'Нагрузка выше рекомендуемой даже для Ultra' : `Ориентировочная загрузка: ${result.pct}% от комфортного предела` }}</p>
          <p>{{ result.text }}</p>
        </div>
      </div>
      <p class="pg-small pg-muted">Протокол на расчёт не влияет: на AmneziaWG и XRay сервер потянет одинаковое количество человек. 4K и торренты упираются в канал: на 100 Мбит/с хватит примерно на 4 одновременных 4K-потока.</p>
    </section>
  </div>
</template>
