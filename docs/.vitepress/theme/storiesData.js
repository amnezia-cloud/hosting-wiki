// Сторис для главной вики (theme/Stories.js). Каждый экран — HTML-разметка;
// стили — в custom.css, раздел «СТОРИС».
// Чтобы добавить историю: новый объект в массив ru (slides: [[класс фона, разметка], …]).

export const STORIES = {
  ru: [
  {
    "id": "cascade",
    "title": "Каскад: VPN без смены сервера",
    "who": "Каскад",
    "emoji": "🔀",
    "grad": "c1",
    "time": "0:50",
    "slides": [
      [
        "bg1",
        "<div class=\"grow\"><div class=\"big rise\">🔀</div></div>\n        <div class=\"k rise d1\">Amnezia Hosting</div>\n        <h2 class=\"rise d2\">Каскад за 30&nbsp;секунд</h2>\n        <p class=\"rise d3\">Что делать, если ваш сервер вдруг перестал открываться из вашего региона.</p>"
      ],
      [
        "bg2",
        "<div class=\"k rise\">Проблема</div>\n        <h2 class=\"rise d1\">IP сервера заблокировали</h2>\n        <p class=\"rise d2\">VPN перестаёт подключаться. Раньше выход был один — <b>новый сервер</b>: арендовать, заново ставить VPN и переносить всё.</p>\n        <div class=\"grow\">\n          <svg class=\"net rise d3\" viewBox=\"0 0 300 120\" aria-hidden=\"true\">\n            <path class=\"wire red\" d=\"M60 60 L240 60\"/>\n            <rect class=\"node\" x=\"6\" y=\"34\" width=\"62\" height=\"52\" rx=\"12\"/><text class=\"em\" x=\"37\" y=\"62\">📱</text><text x=\"37\" y=\"80\">Вы</text>\n            <rect class=\"node\" x=\"232\" y=\"34\" width=\"62\" height=\"52\" rx=\"12\"/><text class=\"em\" x=\"263\" y=\"62\">🖥</text><text x=\"263\" y=\"80\">Сервер</text>\n            <g class=\"xg\"><circle class=\"xc\" cx=\"150\" cy=\"60\" r=\"17\"/><path class=\"x\" d=\"M143 53 L157 67 M157 53 L143 67\"/></g>\n          </svg>\n        </div>"
      ],
      [
        "bg3",
        "<div class=\"k rise\">Решение</div>\n        <h2 class=\"rise d1\">Каскад даёт серверу новый адрес</h2>\n        <p class=\"rise d2\">Вы подключаетесь к Каскаду, он пересылает трафик на ваш сервер. В интернет вы выходите <b>как раньше — с IP сервера</b>.</p>\n        <div class=\"grow\">\n          <svg class=\"net rise d3\" viewBox=\"0 0 300 150\" aria-hidden=\"true\">\n            <path id=\"w1\" class=\"wire\" d=\"M40 110 C 70 110, 90 40, 150 40\"/>\n            <path id=\"w2\" class=\"wire\" d=\"M150 40 C 210 40, 230 110, 260 110\"/>\n            <rect class=\"node\" x=\"6\" y=\"86\" width=\"62\" height=\"50\" rx=\"12\"/><text class=\"em\" x=\"37\" y=\"113\">📱</text><text x=\"37\" y=\"129\">Вы</text>\n            <rect class=\"node g\" x=\"116\" y=\"14\" width=\"68\" height=\"52\" rx=\"12\"/><text class=\"em\" x=\"150\" y=\"42\">🔀</text><text x=\"150\" y=\"58\">Каскад</text>\n            <rect class=\"node\" x=\"232\" y=\"86\" width=\"62\" height=\"50\" rx=\"12\"/><text class=\"em\" x=\"263\" y=\"113\">🖥</text><text x=\"263\" y=\"129\">Сервер</text>\n            <circle class=\"pk\" r=\"4\"><animateMotion dur=\"1.6s\" repeatCount=\"indefinite\" path=\"M40 110 C 70 110, 90 40, 150 40 C 210 40, 230 110, 260 110\"/></circle>\n            <circle class=\"pk\" r=\"4\"><animateMotion dur=\"1.6s\" begin=\"0.8s\" repeatCount=\"indefinite\" path=\"M40 110 C 70 110, 90 40, 150 40 C 210 40, 230 110, 260 110\"/></circle>\n          </svg>\n        </div>\n        <p class=\"rise d4\" style=\"font-size:13px\">🔒 Каскад не видит ваш трафик — он только пересылает зашифрованные пакеты.</p>"
      ],
      [
        "bg4",
        "<div class=\"k rise\">Что вы получаете</div>\n        <h2 class=\"rise d1\">Сервер и данные остаются на месте</h2>\n        <div class=\"grow\">\n          <div class=\"tiles\">\n            <div class=\"rise d1\"><b>Сервер прежний</b><span>данные и протоколы на месте</span></div>\n            <div class=\"rise d2\"><b>2 новых адреса</b><span>для VPN и SSH, из разных подсетей</span></div>\n            <div class=\"rise d3\"><b>~10 минут</b><span>на настройку по инструкции</span></div>\n            <div class=\"rise d4\"><b>$2 в месяц</b><span>вместо нового сервера</span></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span>3</span><span>4</span></div>\n        <h2 class=\"rise d1\">Включите Каскад в личном кабинете</h2>\n        <p class=\"rise d2\">Укажите сервер, порт AmneziaWG из приложения и порт SSH — и дождитесь статуса <b>«Активен»</b>.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>Каскад · Управление</span><span class=\"flip\"><span class=\"st blue s1\"><i></i>Применяется</span><span class=\"st green s2\"><i></i>Активен</span></span></div>\n            <div class=\"fld\"><small>Сервер</small><b>192.0.2.147</b></div>\n            <div class=\"fld hl\"><small>UDP-порт (VPN) — из приложения</small><b>44212</b></div>\n            <div class=\"fld\"><small>TCP-порт (SSH)</small><b>22</b></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span class=\"on\">3</span><span>4</span></div>\n        <h2 class=\"rise d1\">Добавьте сервер через Каскад</h2>\n        <p class=\"rise d2\">В Amnezia VPN нажмите «+» и введите <b>адрес SSH Каскада</b> с портом из строки TCP.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>Amnezia VPN · Настроить ваш сервер</span></div>\n            <div class=\"fld hl\"><small>IP-адрес[:порт] сервера</small><b>203.0.113.89:38906</b></div>\n            <div class=\"fld\"><small>Имя пользователя SSH</small><b>root</b></div>\n            <div class=\"fld\"><small>Пароль</small><b>••••••••••</b></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span class=\"on\">3</span><span class=\"on\">4</span></div>\n        <h2 class=\"rise d1\">Укажите Каскад в AmneziaWG</h2>\n        <p class=\"rise d2\">В настройках сервера → AmneziaWG впишите <b>адрес VPN</b> и <b>порт UDP</b> Каскада. Сохраните и подключайтесь.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>AmneziaWG настройки сервера</span></div>\n            <div class=\"fld hl\"><small>Cascade endpoint</small><b>198.51.100.24</b></div>\n            <div class=\"fld hl\"><small>Cascade port</small><b>35495</b></div>\n          </div>\n        </div>\n        <p class=\"rise d4\" style=\"font-size:13px\">Тем, с кем делились доступом, выдайте подключения заново — уже через Каскад.</p>"
      ],
      [
        "bg1",
        "<div class=\"grow\"><div class=\"big rise\">⚡</div></div>\n        <div class=\"k rise d1\">Готово</div>\n        <h2 class=\"rise d2\">VPN снова работает — без смены сервера</h2>\n        <p class=\"rise d3\" style=\"margin-bottom:18px\">Подробная инструкция со скриншотами — в вики.</p>\n        <div class=\"cta rise d4\">\n          <a class=\"p\" href=\"https://storage.googleapis.com/amnezia/host?m-path=/ru/cascade\" target=\"_blank\" rel=\"noreferrer\">Подключить Каскад →</a>\n          <a class=\"s\" href=\"/cascade.html\">📖 Пошаговая инструкция</a>\n        </div>\n        <button class=\"replay\" type=\"button\" data-next-story>Следующая история →</button>"
      ]
    ]
  },
  {
    "id": "split",
    "title": "Банки и Госуслуги без VPN",
    "who": "Раздельное туннелирование",
    "emoji": "🚦",
    "grad": "c2",
    "time": "0:50",
    "slides": [
      [
        "bg2b",
        "<div class=\"grow\"><div class=\"big rise\">🚦</div></div>\n        <div class=\"k rise d1\">Раздельное туннелирование</div>\n        <h2 class=\"rise d2\">Банки и Госуслуги без VPN</h2>\n        <p class=\"rise d3\">Одна настройка — и российские сервисы работают как дома, а всё остальное идёт через VPN.</p>"
      ],
      [
        "bg2",
        "<div class=\"k rise\">Проблема</div>\n        <h2 class=\"rise d1\">Приложение банка видит VPN</h2>\n        <p class=\"rise d2\">С включённым VPN российские сервисы видят и записывают <b>IP вашего сервера</b>. Такой адрес уже не в безопасности — и рано или поздно его могут заблокировать.</p>\n        <div class=\"grow\">\n          <div class=\"ui bank rise d3\">\n            <div class=\"ttl\"><span>Банк Онлайн</span><span class=\"st red\"><i></i>VPN обнаружен</span></div>\n            <div class=\"warnbox\">Обнаружено подключение через VPN.<br><span class=\"ipline\">IP 203.0.113.89 зафиксирован</span></div>\n            <div class=\"line\" style=\"width:80%\"></div><div class=\"line\" style=\"width:55%\"></div>\n          </div>\n        </div>"
      ],
      [
        "bg3",
        "<div class=\"k rise\">Решение</div>\n        <h2 class=\"rise d1\">Трафик делится на два потока</h2>\n        <p class=\"rise d2\">Российские сайты и приложения — <b>напрямую</b> через провайдера. Всё остальное — <b>через VPN</b>.</p>\n        <div class=\"grow\">\n          <svg class=\"net rise d3\" viewBox=\"0 0 300 160\" aria-hidden=\"true\">\n            <path class=\"wire blue\" d=\"M70 80 C 120 80, 150 30, 220 30\"/>\n            <path class=\"wire\" d=\"M70 80 C 120 80, 150 130, 220 130\"/>\n            <rect class=\"node\" x=\"6\" y=\"54\" width=\"64\" height=\"52\" rx=\"12\"/><text class=\"em\" x=\"38\" y=\"82\">📱</text><text x=\"38\" y=\"98\">Вы</text>\n            <rect class=\"node b\" x=\"220\" y=\"6\" width=\"76\" height=\"48\" rx=\"12\"/><text class=\"em\" x=\"258\" y=\"30\">🏦</text><text x=\"258\" y=\"46\">напрямую</text>\n            <rect class=\"node g\" x=\"220\" y=\"106\" width=\"76\" height=\"48\" rx=\"12\"/><text class=\"em\" x=\"258\" y=\"130\">🔒</text><text x=\"258\" y=\"146\">через VPN</text>\n            <circle class=\"pk blue\" r=\"4\"><animateMotion dur=\"1.5s\" repeatCount=\"indefinite\" path=\"M70 80 C 120 80, 150 30, 220 30\"/></circle>\n            <circle class=\"pk\" r=\"4\"><animateMotion dur=\"1.5s\" begin=\"0.75s\" repeatCount=\"indefinite\" path=\"M70 80 C 120 80, 150 130, 220 130\"/></circle>\n          </svg>\n        </div>"
      ],
      [
        "bg4",
        "<div class=\"k rise\">Что вы получаете</div>\n        <h2 class=\"rise d1\">Удобно и безопаснее для сервера</h2>\n        <div class=\"grow\">\n          <div class=\"tiles\">\n            <div class=\"rise d1\"><b>Банки работают</b><span>без капч и блокировок входа</span></div>\n            <div class=\"rise d2\"><b>Сервер в тени</b><span>российские сервисы не видят его IP</span></div>\n            <div class=\"rise d3\"><b>Быстрее</b><span>местные сайты без крюка через другую страну</span></div>\n            <div class=\"rise d4\"><b>~5 минут</b><span>на настройку</span></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span>2</span><span>3</span></div>\n        <h2 class=\"rise d1\">Скачайте готовый список</h2>\n        <p class=\"rise d2\">Файл <b>amnezia.json</b> — 2000+ российских сервисов. Мы проверяем его сами: в нём нет общих зарубежных адресов.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"file\"><span class=\"fi\">📄</span><span><b>amnezia.json</b><small>2000+ доменов · рекомендуем</small></span><span class=\"dl\">⬇</span></div>\n            <div class=\"file dim\"><span class=\"fi\">📄</span><span><b>amnezia-ip-lite.json</b><small>~650 подсетей · для слабых устройств</small></span><span class=\"dl\">⬇</span></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span>3</span></div>\n        <h2 class=\"rise d1\">Выберите режим «Напрямую»</h2>\n        <p class=\"rise d2\">AmneziaVPN → <b>«Раздельное туннелирование»</b> → <b>«…сайтов»</b>. Режим — именно «Напрямую», не «Через VPN».</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>Раздельное туннелирование сайтов</span></div>\n            <div class=\"radio on\"><i></i><span><b>Напрямую</b><small>Адреса из списка не должны открываться через VPN</small></span></div>\n            <div class=\"radio\"><i></i><span><b>Через VPN</b><small>Только адреса из списка — через VPN</small></span></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span class=\"on\">3</span></div>\n        <h2 class=\"rise d1\">Загрузите файл и включите</h2>\n        <p class=\"rise d2\">⋮ → <b>«Заменить список с сайтами»</b> → выберите файл → включите переключатель.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>Раздельное туннелирование сайтов</span><span class=\"tog\"><i></i></span></div>\n            <div class=\"fld\"><small>Сайты в списке</small><b>sberbank.ru · gosuslugi.ru · …</b></div>\n          </div>\n        </div>\n        <p class=\"rise d4\" style=\"font-size:13px\">На Android и Windows исключите заодно приложения банков — так надёжнее.</p>"
      ],
      [
        "bg1",
        "<div class=\"grow\"><div class=\"big rise\">✅</div></div>\n        <div class=\"k rise d1\">Как проверить</div>\n        <h2 class=\"rise d2\">yandex.ru/internet — домашний IP, ifconfig.me — IP сервера</h2>\n        <p class=\"rise d3\" style=\"margin-bottom:16px\">Значит, российские сервисы идут напрямую, а остальное — через VPN.</p>\n        <div class=\"cta rise d4\">\n          <a class=\"p\" href=\"/lists/amnezia.json\" download>⬇ Скачать amnezia.json</a>\n          <a class=\"s\" href=\"/split-tunneling.html\">📖 Пошаговая инструкция</a>\n        </div>\n        <button class=\"replay\" type=\"button\" data-next-story>Следующая история →</button>"
      ]
    ]
  },
  {
    "id": "mask",
    "title": "Своя маскировка за минуту",
    "who": "Своя маскировка",
    "emoji": "⚙️",
    "grad": "c3",
    "time": "0:50",
    "slides": [
      [
        "bg4b",
        "<div class=\"grow\"><div class=\"big rise\">⚙️</div></div>\n        <div class=\"k rise d1\">Генератор параметров</div>\n        <h2 class=\"rise d2\">Своя маскировка за минуту</h2>\n        <p class=\"rise d3\">Оригинальные параметры AmneziaWG — не такие, как у всех.</p>"
      ],
      [
        "bg2",
        "<div class=\"k rise\">Проблема</div>\n        <h2 class=\"rise d1\">Одинаковое выглядит подозрительно</h2>\n        <p class=\"rise d2\">При автоматической установке у тысяч пользователей получаются <b>одинаковые параметры</b> — для DPI это выглядит подозрительно. Поэтому генератор предлагает <b>оригинальную маскировку</b>.</p>\n        <div class=\"grow\">\n          <div class=\"clones rise d3\">\n            <div><span class=\"sv\">👤 пользователь 1</span><code>автоустановка</code></div>\n            <div><span class=\"sv\">👤 пользователь 2</span><code>автоустановка</code></div>\n            <div><span class=\"sv\">👤 пользователь 3</span><code>автоустановка</code></div>\n            <div class=\"mine\"><span class=\"sv\">🛡️ вы + генератор</span><code>оригинально</code></div>\n          </div>\n        </div>"
      ],
      [
        "bg3",
        "<div class=\"k rise\">Решение</div>\n        <h2 class=\"rise d1\">Генератор на вики</h2>\n        <p class=\"rise d2\">Подбирает уникальные Jc, S1–S4, H1–H4 и таймеры, сам проверяет все правила совместимости. <b>Всё считается в браузере</b> — ничего не отправляется.</p>\n        <div class=\"grow\">\n          <div class=\"ui term rise d3\">\n            <div>› профиль: Сбалансированный</div>\n            <div>› Jc 5 · Jmin 124 · Jmax 980</div>\n            <div>› S1 42 · S2 27 · S3 31 · S4 18</div>\n            <div>› проверка правил <span class=\"ok\">8/8 ✓</span></div>\n            <div><span class=\"ok\">✓ готово</span> <span class=\"cur\"></span></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span>2</span><span>3</span></div>\n        <h2 class=\"rise d1\">Выберите профиль</h2>\n        <p class=\"rise d2\">Сколько маскировки добавить. Большинству подходит <b>сбалансированный</b>.</p>\n        <div class=\"grow\">\n          <div class=\"profs rise d3\">\n            <div><span>🍃</span><b>Экономный</b><i class=\"m\"><em class=\"on\"></em><em></em><em></em></i></div>\n            <div class=\"on\"><span>⚖️</span><b>Сбалансированный</b><i class=\"m\"><em class=\"on\"></em><em class=\"on\"></em><em></em></i></div>\n            <div><span>🛡️</span><b>Усиленный</b><i class=\"m\"><em class=\"on\"></em><em class=\"on\"></em><em class=\"on\"></em></i></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span>3</span></div>\n        <h2 class=\"rise d1\">Перенесите значения в приложение</h2>\n        <p class=\"rise d2\">Поля идут в том же порядке, что в AmneziaVPN. Нажмите на поле — значение скопируется.</p>\n        <div class=\"grow\">\n          <div class=\"ui rise d3\">\n            <div class=\"ttl\"><span>AmneziaWG</span><span class=\"st green\"><i></i>уникально</span></div>\n            <div class=\"grid2\"><div class=\"fld hl\"><small>S1</small><b>42</b></div><div class=\"fld\"><small>S2</small><b>27</b></div><div class=\"fld\"><small>S3</small><b>31</b></div><div class=\"fld\"><small>S4</small><b>18</b></div></div>\n          </div>\n        </div>"
      ],
      [
        "bg5",
        "<div class=\"steps rise\"><span class=\"on\">1</span><span class=\"on\">2</span><span class=\"on\">3</span></div>\n        <h2 class=\"rise d1\">Сохраните и перевыдайте доступ</h2>\n        <p class=\"rise d2\">После сохранения старые подключения перестанут работать — выдайте новые себе и всем, с кем делились доступом.</p>\n        <div class=\"grow\"><div class=\"big rise d3\" style=\"font-size:64px\">🔁</div></div>"
      ],
      [
        "bg3",
        "<div class=\"k rise\">Автонастройка</div>\n        <h2 class=\"rise d1\">Конфигурация из коробки — в два нажатия</h2>\n        <p class=\"rise d2\">Вставьте свою конфигурацию, <b>выберите тип маскировки</b> и нажмите <b>«Сгенерировать»</b>. Генератор сам пересоберёт конфигурацию — ключи и адреса останутся прежними.</p>\n        <div class=\"grow\">\n          <div class=\"auto rise d3\">\n            <div class=\"af-file\"><span>📄</span><b>ваша_конфигурация.conf</b><em>вставлена</em></div>\n            <div class=\"af-row\"><span class=\"tapn t1\">1</span><div class=\"af-prof\"><i>🍃</i><i class=\"on\">⚖️</i><i>🛡️</i></div></div>\n            <div class=\"af-row\"><span class=\"tapn t2\">2</span><div class=\"af-btn\">▶ Сгенерировать</div></div>\n            <div class=\"af-done\">✓ готово — скопируйте новую конфигурацию</div>\n          </div>\n        </div>"
      ],
      [
        "bg1",
        "<div class=\"grow\"><div class=\"big rise\">🛡️</div></div>\n        <div class=\"k rise d1\">Готово</div>\n        <h2 class=\"rise d2\">Ваша маскировка не похожа ни на чью</h2>\n        <p class=\"rise d3\" style=\"margin-bottom:16px\">Всё считается прямо в браузере — ничего не отправляется.</p>\n        <div class=\"cta rise d4\">\n          <a class=\"p\" href=\"/awg-generator.html\">⚙️ Открыть генератор</a>\n        </div>\n        <button class=\"replay\" type=\"button\" data-next-story>Смотреть сначала ↻</button>"
      ]
    ]
  }
]
}
