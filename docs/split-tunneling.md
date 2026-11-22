---
title: "Раздельное туннелирование: российские сервисы — напрямую"
description: "Как настроить раздельное туннелирование в AmneziaVPN: готовый список российских сайтов, исключение приложений на Android и Windows, свой список на iplist. Банки и Госуслуги работают, а сервер не светится лишний раз."
head:
  - - meta
    - name: keywords
      content: раздельное туннелирование, split tunneling, amneziavpn, российские сайты без vpn, исключения vpn, amnezia.json, amnezia-ip-lite, iplist, opencck, банки через vpn, госуслуги vpn, туннелирование приложений
---

<script setup>
import { onMounted, onUnmounted } from 'vue'

// Увеличение скриншотов по нажатию: работает только на этой странице.
let detach
onMounted(() => {
  const open = (img) => {
    const box = document.createElement('div')
    box.className = 'st-lightbox'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-label', img.alt)
    box.innerHTML = '<button type="button" aria-label="Закрыть">Закрыть ✕</button>'
    const big = document.createElement('img')
    big.src = img.src
    big.alt = img.alt
    box.appendChild(big)
    const close = () => { box.remove(); document.removeEventListener('keydown', onKey) }
    const onKey = (e) => { if (e.key === 'Escape') close() }
    box.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
    document.body.appendChild(box)
    box.querySelector('button').focus()
  }
  const onClick = (e) => {
    const img = e.target.closest('.st-shot img')
    if (img) open(img)
  }
  document.addEventListener('click', onClick)
  detach = () => document.removeEventListener('click', onClick)
})
onUnmounted(() => detach && detach())
</script>

# 🚦 Раздельное туннелирование: российские сервисы — напрямую

Раздельное туннелирование делит трафик на два потока. Российские сайты и приложения — банки, Госуслуги, маркетплейсы, Яндекс, VK — идут **напрямую**, через вашего провайдера. Всё остальное — **через VPN** на ваш сервер.

::: tip Настройте это сразу после установки VPN
Это не «дополнительная опция для продвинутых», а базовая настройка, которую мы советуем всем. Занимает 5 минут, а VPN после неё работает стабильнее и дольше.
:::

<div class="st-summary">
<div><b>Банки и Госуслуги</b><span>работают без капч, блокировок входа и звонков из службы безопасности</span></div>
<div><b>Сервер в тени</b><span>российские сервисы видят ваш домашний адрес, а не IP сервера</span></div>
<div><b>Быстрее</b><span>местные сайты открываются без крюка через другую страну</span></div>
<div><b>~5 минут</b><span>на настройку по этой инструкции</span></div>
</div>

## Зачем это нужно {#why}

<figure class="st-scheme" aria-label="Схема: российские сервисы идут напрямую, остальной трафик — через VPN-сервер">
<svg class="st-scheme-svg" viewBox="0 0 800 250" role="img">
  <rect class="st-s-box st-s-accent" x="20" y="95" width="150" height="60" rx="12"/>
  <text class="st-s-t" x="95" y="122">Ваше устройство</text>
  <text class="st-s-sub" x="95" y="141">AmneziaVPN</text>

  <path class="st-s-line st-s-direct" d="M170 112 C 260 112, 280 55, 380 55" fill="none"/>
  <path class="st-s-line st-s-ok" d="M170 138 C 260 138, 280 195, 380 195" fill="none"/>

  <rect class="st-s-box" x="380" y="25" width="170" height="60" rx="12"/>
  <text class="st-s-t" x="465" y="51">Провайдер</text>
  <text class="st-s-sub" x="465" y="70">ваш обычный адрес</text>

  <rect class="st-s-box st-s-accent" x="380" y="165" width="170" height="60" rx="12"/>
  <text class="st-s-t" x="465" y="191">VPN-сервер</text>
  <text class="st-s-sub" x="465" y="210">зашифрованный туннель</text>

  <path class="st-s-line st-s-direct" d="M550 55 L 590 55" fill="none"/>
  <path class="st-s-line st-s-ok" d="M550 195 L 590 195" fill="none"/>

  <text class="st-s-head" x="600" y="44">Российские сервисы</text>
  <text class="st-s-sub st-s-left" x="600" y="64">банки, Госуслуги,</text>
  <text class="st-s-sub st-s-left" x="600" y="80">маркетплейсы, Яндекс, VK</text>

  <text class="st-s-head" x="600" y="184">Всё остальное</text>
  <text class="st-s-sub st-s-left" x="600" y="204">зарубежные сайты</text>
  <text class="st-s-sub st-s-left" x="600" y="220">и приложения</text>
</svg>
<div class="st-scheme-m">
<div><b>Российские сервисы</b><span>банки, Госуслуги, маркетплейсы, Яндекс, VK</span><i>→ напрямую, через провайдера</i></div>
<div class="st-m-vpn"><b>Всё остальное</b><span>зарубежные сайты и приложения</span><i>→ через VPN-сервер</i></div>
</div>
</figure>

- **Банки, Госуслуги и налоговая работают как обычно.** Они видят привычный домашний адрес, а не «вход из-за границы» — без капч, блокировок перевода и звонков из службы безопасности.
- **Ваш сервер реже попадает в чужие логи.** Российские сайты и приложения подробно записывают, откуда к ним подключаются. Когда их трафик идёт мимо VPN, адрес вашего сервера им просто не виден — и сервер дольше остаётся незаметным.
- **Местные сайты работают быстрее.** Не нужно гнать видео с RuTube или Кинопоиска через другую страну и обратно.
- **Экономится трафик сервера.** Тяжёлый российский контент не расходует канал вашего VPN.

::: info Сайты и приложения — настройте оба
Правило по адресам действует и на сайт, и на приложение сервиса: если адреса Сбера идут напрямую, то и сайт, и приложение Сбера пойдут мимо VPN. Но списки не охватывают всё. Там, где это возможно (Android и Windows), дополнительно исключите российские приложения целиком — так надёжнее всего.
:::

## Что поддерживает ваше устройство {#platforms}

| Платформа | По сайтам | По приложениям |
| --- | --- | --- |
| **Android** | ✅ | ✅ оба режима |
| **Windows** | ✅ | ✅ только режим «без VPN» — его и нужно |
| **iOS, macOS, Linux** | ✅ | ❌ — поэтому список сайтов здесь особенно важен |

На Android и Windows оба вида туннелирования можно включить одновременно — так и делайте.

## Какой список скачать {#lists}

Готовые списки российских сервисов мы проверяем сами: из них убраны адреса общих зарубежных CDN, из-за которых мимо VPN могли уходить ChatGPT, Codex, GitHub и другие сервисы. Скачивайте по ссылкам ниже.

| Список | Что внутри | Когда брать |
| --- | --- | --- |
| **[amnezia.json](/lists/amnezia.json){download}** ⭐ | 2000+ доменов российских сервисов | **рекомендуем** — подходит большинству |
| **[amnezia-ip-lite.json](/lists/amnezia-ip-lite.json){download}** | ~650 IP-подсетей российских сервисов | слабое или старое устройство: VPN с большим списком подключается долго или не подключается |

::: details Обновляйте список раз в месяц
Когда вы импортируете доменный список, приложение один раз узнаёт IP-адреса этих сайтов и дальше их не обновляет. Сервисы иногда переезжают на новые адреса — поэтому раз в месяц скачайте свежий файл и загрузите его заново через **⋮ → «Заменить список с сайтами»**.
:::

## Настройка по сайтам {#sites}

Работает на всех устройствах: Windows, macOS, Linux, Android и iOS.

### Скачайте список {#st-step-1}

Скачайте **[amnezia.json](/lists/amnezia.json){download}** — или **[amnezia-ip-lite.json](/lists/amnezia-ip-lite.json){download}** для слабого устройства.

### Откройте раздельное туннелирование {#st-step-2}

В AmneziaVPN на главном экране нажмите **«Раздельное туннелирование»** под кнопкой подключения (или **Настройки** → **Подключение**). Откроется окно с двумя пунктами — выберите **«Раздельное туннелирование сайтов»**.

<div class="st-row st-row-1"><figure class="st-shot"><img src="/img/split-tunneling/01.webp" alt="Окно «Раздельное VPN-туннелирование»: пункты для сайтов и для приложений" loading="lazy"><figcaption>Окно «Раздельное VPN-туннелирование»: пункты для сайтов и для приложений</figcaption></figure></div>

### Выберите режим «Напрямую» и загрузите файл {#st-step-3}

1. Выберите режим **«Напрямую»** — под ним появится подпись «Адреса из списка не должны открываться через VPN».
2. Нажмите **⋮** справа от поля ввода → **«Заменить список с сайтами»** и выберите скачанный файл. Если в списке уже есть ваши адреса и их нужно сохранить — выберите **«Добавить импортированные сайты к существующим»**.
3. Включите переключатель **«Раздельное туннелирование сайтов»**.

::: danger Режим именно «Напрямую»
В режиме «Через VPN» всё получится наоборот: через сервер пойдут только российские сайты, а всё остальное — мимо VPN.
:::

<div class="st-row st-row-2"><figure class="st-shot"><img src="/img/split-tunneling/02.webp" alt="Режим «Напрямую» и меню ⋮ с импортом списка" loading="lazy"><figcaption>Режим «Напрямую» и меню ⋮ с импортом списка</figcaption></figure><figure class="st-shot"><img src="/img/split-tunneling/03.webp" alt="Список загружен, переключатель включён" loading="lazy"><figcaption>Список загружен, переключатель включён</figcaption></figure></div>

Загрузка большого списка на слабом устройстве может занять до минуты — это нормально.

### Подключитесь {#st-step-4}

Под кнопкой подключения появится надпись **«Раздельное туннелирование включено»** — всё готово.

<div class="st-row st-row-1"><figure class="st-shot"><img src="/img/split-tunneling/04.webp" alt="VPN подключён, раздельное туннелирование включено" loading="lazy"><figcaption>VPN подключён, раздельное туннелирование включено</figcaption></figure></div>

## Настройка по приложениям {#apps}

Доступно на **Android** и **Windows**. Включайте вместе с настройкой по сайтам, а не вместо неё.

### Android

1. Откройте **«Раздельное туннелирование»** → **«Раздельное туннелирование приложений»**.
2. Выберите режим **«Напрямую»** — приложения из списка будут работать без VPN.
3. Добавьте российские приложения и включите переключатель.

Что стоит добавить:

<div class="st-check">

- **Банки:** Сбербанк Онлайн, Т-Банк, ВТБ, Альфа-Банк, Газпромбанк и другие, которыми пользуетесь.
- **Госсервисы:** Госуслуги, Налоги ФЛ, Мос.ру, ЕМИАС.
- **Маркетплейсы и доставка:** Wildberries, Ozon, Яндекс Маркет, Авито, Самокат, Купер.
- **Яндекс:** Go, Карты, Музыка, Еда, Браузер — если пользуетесь им для российских сайтов.
- **VK и соцсети:** ВКонтакте, MAX, Одноклассники, VK Видео.
- **Операторы и сервисы:** приложения МТС, Билайн, МегаФон, T2, Ростелеком; RuTube, Кинопоиск, 2ГИС.

</div>

::: warning Не добавляйте то, чему нужен VPN
Telegram, YouTube, Instagram и браузер, через который вы открываете зарубежные сайты, в этот список не добавляйте — иначе они пойдут мимо VPN.
:::

### Windows

На Windows доступен один режим — **приложения из списка работают без VPN**, и это как раз то, что нужно. Добавлять придётся `.exe`-файлы программ.

::: tip Отдельный браузер для российских сайтов
Удобная схема для компьютера: заведите отдельный браузер только для российских сайтов (например, Яндекс Браузер) и добавьте его `.exe` в исключения. Основной браузер остаётся в VPN, а для банков и Госуслуг открываете второй.
:::

## Свой список на iplist {#iplist}

Если нужного сервиса нет в готовом списке или хочется собрать список самому, используйте **[russia.iplist.opencck.org](https://russia.iplist.opencck.org/ru/)** — там IP-адреса российских сервисов, разбитые по группам.

1. **Формат** — `Amnezia`, **Тип данных** — `IP-зоны ipv4 (CIDR)`.
2. На вкладке **«Порталы»** отметьте нужные группы (`russia`, `vk`, `yandex`) или отдельные сервисы.
3. Включите **«Сохранить как файл»** и нажмите **«Отправить»** — скачается файл для Amnezia.
4. В приложении: **⋮** → **«Добавить импортированные сайты к существующим»** — адреса добавятся к уже загруженному списку, а не заменят его.

<div class="st-row st-row-1 st-row-wide"><figure class="st-shot"><img src="/img/split-tunneling/05.webp" alt="iplist: формат Amnezia, IP-зоны ipv4 (CIDR), отмечены группы russia, vk и yandex" loading="lazy"><figcaption>Формат Amnezia, IP-зоны ipv4 (CIDR), отмечены группы russia, vk и yandex</figcaption></figure></div>

Один сайт можно добавить и вручную: впишите адрес в поле **«веб-сайт или IP»** внизу экрана и нажмите **+**.

## Как проверить {#check}

С включённым VPN откройте два сайта:

| Сайт | Что должен показать |
| --- | --- |
| [yandex.ru/internet](https://yandex.ru/internet) | ваш **домашний** IP — российский трафик идёт напрямую |
| [ifconfig.me](https://ifconfig.me) | IP **вашего сервера** — остальной трафик идёт через VPN |

Если оба показывают одно и то же — проверьте режим («Напрямую») и включён ли переключатель.

## Частые вопросы {#faq}

**Российский сайт всё равно открывается через VPN.** Скорее всего, его нет в списке. Добавьте адрес вручную в поле «веб-сайт или IP» или соберите файл на [iplist](#iplist).

**После загрузки списка VPN не подключается.** Список слишком большой для устройства. Замените его на [amnezia-ip-lite.json](/lists/amnezia-ip-lite.json){download} через **⋮ → «Заменить список с сайтами»**.

**Сайт раньше работал напрямую, а теперь нет.** Сервис сменил IP-адреса. Загрузите свежий список — [раз в месяц](#lists) этого достаточно.

**Приложение пишет, что включён VPN, хотя я добавил его в исключения.** Android сообщает приложениям, что на устройстве работает VPN, — это нельзя скрыть настройками. Главное, что трафик этого приложения при этом идёт мимо сервера.

::: info Про сторонние списки
Наши списки собраны на основе открытого проекта amnezia-tunneling-ru и очищены от общих адресов. Iplist ведёт независимый проект — мы не управляем им. Если какого-то сервиса не хватает, добавьте его вручную.
:::

<style>
/* Оформление только для этой страницы (классы с префиксом st-) */
.st-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0}
.st-summary div{padding:14px;border:1.5px solid var(--vp-c-brand-1);border-radius:12px;background:var(--vp-c-brand-soft)}
.st-summary b{display:block;color:var(--vp-c-brand-1);font-size:16px;line-height:1.3;margin-bottom:4px}
.st-summary span{display:block;font-size:13px;line-height:1.45;color:var(--vp-c-text-1)}
@media (max-width:760px){.st-summary{grid-template-columns:1fr 1fr}}

.st-scheme{margin:20px 0;padding:18px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}
.st-scheme-svg{width:100%;height:auto;display:block}
.st-scheme-m{display:none}
@media (max-width:640px){.st-scheme-svg{display:none}.st-scheme-m{display:grid;gap:10px}
.st-scheme-m div{padding:12px 14px;border:1.5px dashed var(--vp-c-text-3);border-radius:12px;background:var(--vp-c-bg)}
.st-scheme-m .st-m-vpn{border:1.5px solid var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}
.st-scheme-m b{display:block;font-size:15px}.st-scheme-m span{display:block;font-size:13px;color:var(--vp-c-text-2)}
.st-scheme-m i{display:block;font-style:normal;font-size:13px;font-weight:600;margin-top:4px;color:var(--vp-c-brand-1)}}
.st-s-box{fill:var(--vp-c-bg);stroke:var(--vp-c-divider);stroke-width:1.5}
.st-s-accent{stroke:var(--vp-c-brand-1);stroke-width:2;fill:var(--vp-c-brand-soft)}
.st-s-t{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1);text-anchor:middle}
.st-s-head{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1)}
.st-s-sub{font:12px var(--vp-font-family-base);fill:var(--vp-c-text-2);text-anchor:middle}
.st-s-left{text-anchor:start}
.st-s-line{stroke-width:2.5}
.st-s-ok{stroke:var(--vp-c-brand-1)}
.st-s-direct{stroke:var(--vp-c-text-3);stroke-dasharray:6 6}

.st-check ul{list-style:none;padding-left:0}
.st-check li{position:relative;padding-left:30px}
.st-check li::before{content:"";position:absolute;left:0;top:4px;width:18px;height:18px;border-radius:5px;background:var(--vp-c-brand-soft);border:1.5px solid var(--vp-c-brand-1)}
.st-check li::after{content:"";position:absolute;left:6px;top:7px;width:5px;height:9px;border:solid var(--vp-c-brand-1);border-width:0 2px 2px 0;transform:rotate(45deg)}

/* Нумерация шагов: зелёные кружки перед заголовками шагов */
.vp-doc h2#sites{counter-reset:ststep}
.vp-doc h3[id^="st-step-"]{counter-increment:ststep;position:relative;padding-left:48px;margin-top:40px;min-height:36px;display:flex;align-items:center}
.vp-doc h3[id^="st-step-"]::before{content:counter(ststep);position:absolute;left:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--vp-button-brand-bg);color:var(--vp-button-brand-text);font-weight:700;font-size:17px;display:grid;place-items:center}

.st-shot{margin:14px 0}
.st-shot img{display:block;width:100%;height:auto;border:1px solid var(--vp-c-divider);border-radius:10px;background:#111;cursor:zoom-in}
.st-shot figcaption{font-size:13px;color:var(--vp-c-text-2);margin-top:6px;line-height:1.45}
.st-row{display:grid;gap:12px;align-items:start}
.st-row .st-shot{margin:8px 0}
.st-row-2{grid-template-columns:1fr 1fr;max-width:600px} .st-row-1{max-width:300px} .st-row-wide{max-width:440px}

.st-lightbox{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}
.st-lightbox img{max-width:100%;max-height:100%;border-radius:8px}
.st-lightbox button{position:absolute;top:12px;right:16px;background:rgba(255,255,255,.15);color:#fff;border:0;border-radius:20px;padding:6px 14px;font-size:14px;cursor:pointer}
</style>
