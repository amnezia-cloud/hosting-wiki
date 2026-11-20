---
title: "Каскад: VPN снова работает без смены сервера"
description: "Каскад даёт серверу новый адрес для VPN и SSH, если IP недоступен из вашего региона: сервер и данные остаются прежними. Пошаговая настройка в личном кабинете и в Amnezia VPN."
head:
  - - meta
    - name: keywords
      content: каскад, cascade, ip недоступен, сервер недоступен, новый адрес сервера, amneziawg, cascade endpoint, cascade port, проброс портов
---

<script setup>
import { onMounted, onUnmounted } from 'vue'

// Увеличение скриншотов по нажатию: работает только на этой странице.
let detach
onMounted(() => {
  const open = (img) => {
    const box = document.createElement('div')
    box.className = 'cz-lightbox'
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
    const img = e.target.closest('.cz-shot img')
    if (img) open(img)
  }
  document.addEventListener('click', onClick)
  detach = () => document.removeEventListener('click', onClick)
})
onUnmounted(() => detach && detach())
</script>

# 🔀 Каскад: VPN снова работает без смены сервера

Если IP-адрес вашего сервера стал недоступен из вашего региона, VPN перестаёт подключаться. Раньше выход был один — новый сервер с новым IP: арендовать его, заново ставить VPN и переносить всё, что было на старом сервере.

Каскад решает это иначе: **сервер остаётся прежним**, а подключаетесь вы к нему через новый адрес. Обновить нужно только подключения — у себя и у тех, с кем вы делились доступом.

<div class="cz-summary">
<div><b>Сервер прежний</b><span>данные и установленные протоколы остаются</span></div>
<div><b>Два новых адреса</b><span>для VPN и для управления сервером</span></div>
<div><b>~10 минут</b><span>на настройку по этой инструкции</span></div>
<div><b>$2 в месяц</b><span>вместо нового сервера и повторной настройки</span></div>
</div>

## Как это работает {#how}

Каскад — это промежуточный узел между вашим устройством и сервером. Провайдер видит только подключение к адресу Каскада, а Каскад пересылает трафик дальше, на ваш сервер. В интернет вы выходите как раньше — с IP-адреса своего сервера.

<figure class="cz-scheme" aria-label="Схема подключения без Каскада и с Каскадом">
<svg class="cz-scheme-svg" viewBox="0 0 680 270" role="img">
<title>Без Каскада сервер недоступен из вашего региона. С Каскадом устройство подключается к Каскаду, а он пересылает трафик на ваш сервер.</title>
<text x="0" y="22" class="cz-s-cap">Без Каскада</text>
<rect x="0" y="38" width="130" height="56" rx="12" class="cz-s-box"/>
<text x="65" y="64" class="cz-s-t">📱 Устройство</text><text x="65" y="82" class="cz-s-sub">телефон, ПК</text>
<line x1="130" y1="66" x2="530" y2="66" class="cz-s-line cz-s-dash"/>
<circle cx="330" cy="66" r="16" class="cz-s-block"/><path d="M322 58 L338 74 M338 58 L322 74" class="cz-s-x"/>
<text x="330" y="106" class="cz-s-sub cz-s-red">IP недоступен из вашего региона</text>
<rect x="530" y="38" width="150" height="56" rx="12" class="cz-s-box"/>
<text x="605" y="64" class="cz-s-t">🖥 Ваш сервер</text><text x="605" y="82" class="cz-s-mono">192.0.2.147</text>

<text x="0" y="160" class="cz-s-cap">С Каскадом</text>
<rect x="0" y="176" width="130" height="56" rx="12" class="cz-s-box"/>
<text x="65" y="202" class="cz-s-t">📱 Устройство</text><text x="65" y="220" class="cz-s-sub">телефон, ПК</text>
<line x1="130" y1="204" x2="262" y2="204" class="cz-s-line cz-s-ok"/><path d="M254 198 L264 204 L254 210" class="cz-s-arrow"/>
<rect x="264" y="172" width="152" height="64" rx="12" class="cz-s-box cz-s-accent"/>
<text x="340" y="198" class="cz-s-t">🔀 Каскад</text><text x="340" y="218" class="cz-s-mono">198.51.100.24</text>
<line x1="416" y1="204" x2="528" y2="204" class="cz-s-line cz-s-ok"/><path d="M520 198 L530 204 L520 210" class="cz-s-arrow"/>
<rect x="530" y="176" width="150" height="56" rx="12" class="cz-s-box"/>
<text x="605" y="202" class="cz-s-t">🖥 Ваш сервер</text><text x="605" y="220" class="cz-s-mono">192.0.2.147</text>
<text x="605" y="256" class="cz-s-sub">→ выход в интернет</text>
</svg>
</figure>

::: tip Каскад не видит ваш трафик
Он только пересылает зашифрованные пакеты. Ключи шифрования есть только у вас и у вашего сервера.
:::

## Что входит в Каскад {#what}

После оплаты вы получаете два адреса. Они из разных подсетей: если один станет недоступен из вашего региона, второй продолжит работать.

| Адрес | Протокол | Для чего | Пример |
| --- | --- | --- | --- |
| **Адрес VPN** | UDP | Подключение к VPN по AmneziaWG | `198.51.100.24` |
| **Адрес SSH** | TCP | Управление сервером, в том числе из приложения Amnezia VPN | `203.0.113.89` |

## Перед началом {#before}

<div class="cz-check">

- Сервер арендован в Amnezia Hosting — Каскад работает только с нашими серверами.
- Установлено приложение **Amnezia VPN** версии **5.1.1.10 и выше**.
- Под рукой данные для входа на сервер: логин `root` и пароль. Они есть в личном кабинете, в карточке сервера.
- Услуга **Каскад** оплачена и отображается в личном кабинете.

</div>

::: info Адреса на скриншотах — пример
У вас будут свои адреса и порты. Главное — подставлять их туда же, куда показано в инструкции.
:::

## Пошаговая настройка {#setup}

::: details Сервер ещё не добавлен в приложение? Сначала сделайте это
В Amnezia VPN нажмите **«+»**, введите IP-адрес сервера, логин `root` и пароль из карточки сервера в личном кабинете. Выберите **«Автоматическая»** установку и дождитесь окончания — приложение установит протокол AmneziaWG.

<figure class="cz-shot"><img src="/img/cascade/01.webp" alt="Данные для входа (2) берутся из карточки сервера в личном кабинете и вводятся в приложение (1)" loading="lazy"><figcaption>Данные для входа (2) берутся из карточки сервера в личном кабинете и вводятся в приложение (1)</figcaption></figure>

<div class="cz-row cz-row-3"><figure class="cz-shot"><img src="/img/cascade/02.webp" alt="Выберите «Автоматическая»" loading="lazy"><figcaption>Выберите «Автоматическая»</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/03.webp" alt="Установка AmneziaWG" loading="lazy"><figcaption>Установка AmneziaWG</figcaption></figure></div>

<figure class="cz-shot"><img src="/img/cascade/04.webp" alt="Сервер добавлен, VPN подключается напрямую" loading="lazy"><figcaption>Сервер добавлен, VPN подключается напрямую</figcaption></figure>

Если IP сервера уже недоступен из вашего региона, этот шаг можно пропустить: сервер добавится через Каскад на шаге 4.
:::

### Узнайте порт AmneziaWG {#cz-step-1}

В приложении откройте настройки сервера → **AmneziaWG** → **AmneziaWG настройки сервера**. Запомните число в поле **«Порт»** — в примере это `44212`.

<div class="cz-row cz-row-1"><figure class="cz-shot"><img src="/img/cascade/06-app.webp" alt="Порт протокола AmneziaWG на вашем сервере" loading="lazy"><figcaption>Порт протокола AmneziaWG на вашем сервере</figcaption></figure></div>

### Настройте Каскад в личном кабинете {#cz-step-2}

Откройте услугу **Каскад**, вкладка **«Управление»**. Там уже указаны ваши адрес VPN и адрес SSH. Заполните три поля:

- **Сервер** — выберите свой сервер из списка;
- **UDP-порт (VPN)** — порт AmneziaWG из шага 1;
- **TCP-порт (SSH)** — `22`, если вы не меняли порт SSH.

Нажмите **«Сохранить»**.

<figure class="cz-shot"><img src="/img/cascade/05.webp" alt="Пустая форма Каскада: сначала заполните поля (1), затем сохраните (2)" loading="lazy"><figcaption>Пустая форма Каскада: сначала заполните поля (1), затем сохраните (2)</figcaption></figure>

<figure class="cz-shot"><img src="/img/cascade/06-panel.webp" alt="Пример заполненной формы" loading="lazy"><figcaption>Пример заполненной формы</figcaption></figure>

### Дождитесь статуса «Активен» {#cz-step-3}

Справа от полей появятся две строки и статус. Обычно Каскад включается за несколько секунд.

<div class="cz-row cz-row-2 cz-row-panel"><figure class="cz-shot"><img src="/img/cascade/07.webp" alt="«Применяется» — настройка идёт" loading="lazy"><figcaption>«Применяется» — настройка идёт</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/08.webp" alt="«Активен» — можно подключаться" loading="lazy"><figcaption>«Активен» — можно подключаться</figcaption></figure></div>

Каждая строка показывает, куда Каскад пересылает подключения. Например, `198.51.100.24:35495 → 192.0.2.147:44212` значит: всё, что приходит на адрес Каскада и порт `35495`, уходит на ваш сервер, порт `44212`.

::: warning Запишите два значения — они понадобятся дальше
**Из строки TCP-порт (SSH):** адрес и порт слева от стрелки — `203.0.113.89:38906`.<br>
**Из строки UDP-порт (VPN):** порт после двоеточия слева от стрелки — `35495`.
:::

::: info Каскад можно переключить на другой свой сервер
Одна услуга Каскад работает с одним сервером, но его можно сменить: выберите другой свой сервер в поле **«Сервер»**, укажите его порты и сохраните. Адреса Каскада при этом останутся прежними, а для нового сервера нужно повторить шаги 4 и 5.

Сервер и порты можно менять не чаще установленного лимита. Когда станет доступна следующая смена, показывает надпись **«Следующее изменение — после…»** под строками.
:::

### Добавьте сервер в приложение через Каскад {#cz-step-4}

В Amnezia VPN нажмите **«+»** и заполните:

- **IP-адрес[:порт] сервера** — адрес и порт из строки TCP, в примере `203.0.113.89:38906`;
- **Имя пользователя** — `root`;
- **Пароль** — тот же, что и раньше.

Нажмите **«Продолжить»**, выберите **«Автоматическая»** и дождитесь окончания.

<figure class="cz-shot"><img src="/img/cascade/09.webp" alt="В поле адреса (1) — адрес SSH Каскада и порт из строки TCP (2)" loading="lazy"><figcaption>В поле адреса (1) — адрес SSH Каскада и порт из строки TCP (2)</figcaption></figure>

<div class="cz-row cz-row-2"><figure class="cz-shot"><img src="/img/cascade/10.webp" alt="Выберите «Автоматическая»" loading="lazy"><figcaption>Выберите «Автоматическая»</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/11.webp" alt="Приложение подключается к серверу через Каскад" loading="lazy"><figcaption>Приложение подключается к серверу через Каскад</figcaption></figure></div>

### Укажите Каскад в настройках AmneziaWG {#cz-step-5}

Откройте настройки этого сервера → **AmneziaWG** → **AmneziaWG настройки сервера** и пролистайте вниз до блока **Cascade connection**:

- **Cascade endpoint** — адрес VPN Каскада, в примере `198.51.100.24`;
- **Cascade port** — порт из строки UDP, в примере `35495`.

Нажмите **«Сохранить»**.

<div class="cz-row cz-row-1"><figure class="cz-shot"><img src="/img/cascade/12.webp" alt="Нужен второй пункт — «AmneziaWG настройки сервера»" loading="lazy"><figcaption>Нужен второй пункт — «AmneziaWG настройки сервера»</figcaption></figure></div>

<figure class="cz-shot"><img src="/img/cascade/13.webp" alt="Cascade endpoint и Cascade port (1) берутся из личного кабинета: адрес VPN (3) и порт из строки UDP (2)" loading="lazy"><figcaption>Cascade endpoint и Cascade port (1) берутся из личного кабинета: адрес VPN (3) и порт из строки UDP (2)</figcaption></figure>

::: danger Уже выданные ключи не изменятся
Через Каскад будут работать только подключения, созданные после сохранения. Если сервером пользуются другие люди, поделитесь с ними доступом заново — см. [ниже](#share).
:::

### Подключитесь и проверьте {#cz-step-6}

Нажмите **«Подключиться»**. Затем откройте любой сайт проверки IP, например 2ip.ru: он должен показать **IP вашего сервера**. Это значит, что трафик идёт через Каскад на ваш сервер, а оттуда — в интернет.

<figure class="cz-shot"><img src="/img/cascade/14.webp" alt="VPN подключён через Каскад" loading="lazy"><figcaption>VPN подключён через Каскад</figcaption></figure>

<figure class="cz-shot"><img src="/img/cascade/15.webp" alt="Сайт видит IP вашего сервера — всё работает" loading="lazy"><figcaption>Сайт видит IP вашего сервера — всё работает</figcaption></figure>

## Шпаргалка: что куда вводить {#cheat}

| Куда | Что вводить | Где взять | Пример |
| --- | --- | --- | --- |
| Личный кабинет → UDP-порт (VPN) | Порт AmneziaWG | Приложение → AmneziaWG настройки сервера → Порт | `44212` |
| Личный кабинет → TCP-порт (SSH) | Порт SSH сервера | Обычно `22` | `22` |
| Приложение → IP-адрес[:порт] | Адрес SSH Каскада и порт | Строка TCP, слева от стрелки | `203.0.113.89:38906` |
| Приложение → Cascade endpoint | Адрес VPN Каскада | «Адрес VPN» в личном кабинете | `198.51.100.24` |
| Приложение → Cascade port | Порт UDP на Каскаде | Строка UDP, порт слева от стрелки | `35495` |

## Если сервером пользуются другие люди {#share}

Ключи, которые вы раздали раньше, ведут на старый адрес, который недоступен из вашего региона. После шага 5 создайте для каждого новое подключение: в приложении откройте **«Поделиться»** и отправьте новый ключ или QR-код. Старые ключи можно удалить.

## Вход на сервер по SSH {#ssh}

Если вы заходите на сервер по SSH для управления, используйте адрес сервера Каскада и порт из строки TCP:

```bash
ssh -p 38906 root@203.0.113.89
```

Подставьте свой порт и адрес из личного кабинета.

## Статусы и что с ними делать {#status}

| Статус | Что значит | Что делать |
| --- | --- | --- |
| <span class="cz-dot cz-blue"></span>Применяется | Каскад настраивается | Подождать несколько секунд |
| <span class="cz-dot cz-green"></span>Активен | Всё работает | Можно подключаться |
| <span class="cz-dot cz-yellow"></span>Задерживается | Нет подтверждения дольше 5 минут | Подождать; если не изменится — написать в поддержку |
| <span class="cz-dot cz-red"></span>Ошибка | Настройка не применилась | Проверить сервер и порт, сохранить заново или написать в поддержку |
| <span class="cz-dot cz-grey"></span>Сервер недоступен | Сервер удалён или сменил IP | Выбрать другой сервер в поле «Сервер» |

## Частые вопросы {#faq}

::: details Чем Каскад лучше замены сервера?
Сервер, его данные и установленные протоколы остаются: не нужно арендовать новый сервер, заново ставить VPN и переносить данные. Но подключения обновить придётся — себе и тем, с кем вы делились доступом, нужно выдать новые, уже через Каскад (см. [«Если сервером пользуются другие люди»](#share)).
:::

::: details Нужно что-то менять на самом сервере?
Вручную на сервере ничего делать не нужно: всё настраивается в личном кабинете и в приложении Amnezia VPN.
:::

::: details Скорость упадёт?
Трафик проходит через дополнительный узел, поэтому возможна небольшая добавочная задержка. На обычную работу и видео это обычно не влияет.
:::

::: details Можно подключить сервер у другого провайдера?
Нет, Каскад работает только с серверами в Amnezia Hosting.
:::

::: details Можно перенаправить Каскад на другой свой сервер?
Да, одну услугу Каскад можно переключать между своими серверами: выберите другой сервер в поле «Сервер» и сохраните. Менять можно не чаще установленного лимита — время следующей смены указано в строке «Следующее изменение — после…». Подробнее — в [шаге 3](#cz-step-3).
:::

::: details Какие протоколы работают через Каскад?
На данный момент адрес VPN принимает только UDP, а адрес SSH — только TCP: он нужен для входа на сервер и управления им из приложения.

**Для VPN через Каскад рекомендуем AmneziaWG 3.1.** С ним Каскад проверен и работает стабильно. Другие протоколы через Каскад могут работать с ошибками или не подключаться вовсе.
:::

<style>
/* Оформление только для этой страницы (классы с префиксом cz-) */
.cz-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0}
.cz-summary div{padding:14px;border:1.5px solid var(--vp-c-brand-1);border-radius:12px;background:var(--vp-c-brand-soft)}
.cz-summary b{display:block;color:var(--vp-c-brand-1);font-size:16px;line-height:1.3;margin-bottom:4px}
.cz-summary span{display:block;font-size:13px;line-height:1.45;color:var(--vp-c-text-1)}
@media (max-width:760px){.cz-summary{grid-template-columns:1fr 1fr}}

.cz-scheme{margin:20px 0;padding:18px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}
.cz-scheme-svg{width:100%;height:auto;display:block}
.cz-s-cap{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1)}
.cz-s-box{fill:var(--vp-c-bg);stroke:var(--vp-c-divider);stroke-width:1.5}
.cz-s-accent{stroke:var(--vp-c-brand-1);stroke-width:2;fill:var(--vp-c-brand-soft)}
.cz-s-t{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1);text-anchor:middle}
.cz-s-sub{font:12px var(--vp-font-family-base);fill:var(--vp-c-text-2);text-anchor:middle}
.cz-s-red{fill:var(--vp-c-danger-1)}
.cz-s-mono{font:500 12px var(--vp-font-family-mono);fill:var(--vp-c-brand-1);text-anchor:middle}
.cz-s-line{stroke-width:2.5} .cz-s-dash{stroke:var(--vp-c-text-3);stroke-dasharray:6 6} .cz-s-ok{stroke:var(--vp-c-brand-1)}
.cz-s-arrow{fill:none;stroke:var(--vp-c-brand-1);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.cz-s-block{fill:var(--vp-c-bg);stroke:var(--vp-c-danger-1);stroke-width:2.5} .cz-s-x{stroke:var(--vp-c-danger-1);stroke-width:3;stroke-linecap:round}

.cz-check ul{list-style:none;padding-left:0}
.cz-check li{position:relative;padding-left:30px}
.cz-check li::before{content:"";position:absolute;left:0;top:4px;width:18px;height:18px;border-radius:5px;background:var(--vp-c-brand-soft);border:1.5px solid var(--vp-c-brand-1)}
.cz-check li::after{content:"";position:absolute;left:6px;top:7px;width:5px;height:9px;border:solid var(--vp-c-brand-1);border-width:0 2px 2px 0;transform:rotate(45deg)}

/* Нумерация шагов: зелёные кружки перед заголовками шагов */
.vp-doc h2#setup{counter-reset:czstep}
.vp-doc h3[id^="cz-step-"]{counter-increment:czstep;position:relative;padding-left:48px;margin-top:40px;min-height:36px;display:flex;align-items:center}
.vp-doc h3[id^="cz-step-"]::before{content:counter(czstep);position:absolute;left:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--vp-button-brand-bg);color:var(--vp-button-brand-text);font-weight:700;font-size:17px;display:grid;place-items:center}

.cz-shot{margin:14px 0}
.cz-shot img{display:block;width:100%;height:auto;border:1px solid var(--vp-c-divider);border-radius:10px;background:#111;cursor:zoom-in}
.cz-shot figcaption{font-size:13px;color:var(--vp-c-text-2);margin-top:6px;line-height:1.45}
.cz-row{display:grid;gap:12px;align-items:start}
.cz-row .cz-shot{margin:8px 0}
.cz-row-2{grid-template-columns:1fr 1fr} .cz-row-3{grid-template-columns:repeat(3,1fr)} .cz-row-1{max-width:300px}
@media (max-width:560px){.cz-row-3{grid-template-columns:1fr 1fr} .cz-row-panel{grid-template-columns:1fr}}

.cz-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:8px;vertical-align:1px}
.cz-green{background:#22c55e} .cz-blue{background:#3b82f6} .cz-yellow{background:#eab308} .cz-red{background:#ef4444} .cz-grey{background:#9ca3af}

.cz-lightbox{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}
.cz-lightbox img{max-width:100%;max-height:100%;border-radius:8px}
.cz-lightbox button{position:absolute;top:12px;right:16px;background:rgba(255,255,255,.15);color:#fff;border:0;border-radius:20px;padding:6px 14px;font-size:14px;cursor:pointer}
</style>
