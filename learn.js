// Тексты вкладки «Навчання». Правь здесь — код апки трогать не нужно.
//
// Структура: язык (uk / en) → трек (clipper / brand) → модули → уроки.
// id урока одинаковый в обоих языках: по нему запоминается прогресс.
//
// Блоки внутри body:
//   'Текст'                                  — абзац, **так** выделяется жирным
//   { t: 'list',  items: [...] }             — список с галочками
//   { t: 'steps', items: [...] }             — нумерованные шаги
//   { t: 'ex',    label?, lines: [...] }     — карточка «Приклад»
//   { t: 'vs',    bad, good }                — плохо / хорошо
//   { t: 'math',  title, rows: [[k, v]], total: [k, v] } — расчет
//   { t: 'yn',    yes: [...], no: [...] }    — засчитываем / нет
//   { t: 'phone', top, sub, cap, note? }     — вертикальный кадр + подпись с кодом
//   { t: 'faq',   items: [[вопрос, ответ]] } — раскрывающиеся вопросы
// quiz: { q, o: [варианты], a: индекс правильного, why } — мини-тест в конце урока.
// Без quiz в конце урока будет кнопка «Зрозуміло».
// Все цифры в примерах условные и помечены как пример.

window.KATCH_LEARN = {
  uk: {
    clipper: [
      { mod: 'Основи', lessons: [
        { id: 'c1', min: 1, title: 'Що таке кліпінг', body: [
          'Кліпінг — це коли ти береш довге відео (стрім, подкаст, інтервʼю, музичний кліп) і вирізаєш з нього **найяскравіші 15–60 секунд**. Робиш вертикальне відео й публікуєш у TikTok, Reels або Shorts.',
          'Бренди й автори платять за це, бо короткі кліпи приводять їм нових глядачів. Ти отримуєш гроші **за перегляди**.',
          { t: 'phone', top: 'Він не чекав цього донату 😳', sub: '…і тут приходить донат на 10 000', cap: 'Стрімер у шоці 😂 #katch #k7f2q', note: 'Так виглядає готовий кліп: сильний перший кадр, субтитри, код у підписі.' },
          { t: 'ex', lines: ['Стрімер 4 години грає. На 2:13:40 йому приходить великий донат, і він смішно кричить.', 'Ці 20 секунд, вертикально і з субтитрами, — це і є кліп.'] }
        ], quiz: { q: 'Що з цього — кліп?', o: ['Повний 3-годинний запис стріму', '20 секунд найсмішнішого моменту зі стріму, вертикально', 'Скриншот зі стріму'], a: 1, why: 'Кліп — це короткий вертикальний фрагмент найкращого моменту.' } },

        { id: 'c2', min: 1, title: 'За що тут платять', body: [
          'Платять **за перегляди**. У кожному оффері вказана ставка: скільки доларів ти отримаєш за кожні 1 000 зарахованих переглядів.',
          'Лайки, підписники й коментарі на оплату не впливають. Тільки перегляди.',
          { t: 'math', title: 'Приклад · ставка $1 за 1 000', rows: [['Кліп набрав', '250 000 переглядів'], ['Рахуємо', '250 × $1']], total: ['Ти отримуєш', '$250'] },
          'За одним оффером можна зробити скільки завгодно кліпів, і кожен рахується окремо. Три кліпи по 80 000 переглядів = $240.',
          'У деяких офферах є **«максимум за кліп»**: більше цієї суми один кліп не принесе.'
        ], quiz: { q: 'Ставка $2 за 1 000. Кліп набрав 50 000 переглядів. Скільки отримаєш?', o: ['$50', '$100', '$1 000'], a: 1, why: '50 000 ÷ 1 000 = 50. 50 × $2 = $100.' } },

        { id: 'c3', min: 1, title: 'Як працює Katch: 6 кроків', body: [
          { t: 'steps', items: [
            'Обери оффер у стрічці',
            'Прочитай ТЗ: що різати, де публікувати, які правила',
            'Натисни «Взяти оффер» і скопіюй свій підпис з кодом',
            'Наріж кліп і опублікуй з цим підписом',
            'Встав посилання на кліп у кабінеті',
            'На 7-й день рахуємо перегляди, ще 7 днів холду — і гроші в гаманці'
          ] },
          'Реєстрації немає: твій Telegram — це твій вхід. Доступ до твоїх соцмереж нам не потрібен.'
        ], quiz: { q: 'Що зробити після того, як опублікував кліп?', o: ['Нічого, ми самі його знайдемо', 'Вставити посилання на кліп у кабінеті', 'Написати бренду в директ'], a: 1, why: 'Ми рахуємо тільки ті кліпи, посилання на які ти додав у кабінет.' } }
      ] },

      { mod: 'Робота з оффером', lessons: [
        { id: 'c4', min: 1, title: 'Як читати ТЗ оффера', body: [
          'ТЗ — це завдання від бренду. Прочитай його до кінця **до того**, як береш оффер.',
          { t: 'list', items: ['Що різати і де взяти вихідники', 'На які платформи публікувати', 'Довжина кліпу', 'Вимоги — обовʼязкові правила', 'Ставка і максимум за кліп', 'Скільки бюджету ще залишилось'] },
          { t: 'ex', label: 'Приклад оффера', lines: ['Подкаст із фаундером · TikTok + Shorts', '30–60 секунд · одна думка — один кліп', 'Субтитри обовʼязкові', '$0.90 за 1 000 переглядів'] },
          'Головне правило: **кліп не за ТЗ не зарахуємо**, навіть якщо він залетів. Бюджет оффера обмежений — коли він закінчиться, оффер закриють, тож не відкладай.'
        ], quiz: { q: 'Кліп набрав 300 000 переглядів, але без субтитрів, хоча в ТЗ вони обовʼязкові. Що буде?', o: ['Зарахуємо, бо переглядів багато', 'Не зарахуємо — кліп не за ТЗ'], a: 1, why: 'Вимоги з ТЗ обовʼязкові для кожного кліпу, незалежно від переглядів.' } },

        { id: 'c5', min: 1, title: 'Підпис з кодом Katch', body: [
          'Коли береш оффер, отримуєш підпис із твоїм особистим кодом, наприклад `#katch #k7f2q`. Встав його в **опис кожного кліпу** за цим оффером.',
          'Так ми бачимо, що кліп саме твій і зроблений під цей оффер.',
          { t: 'phone', top: 'Найдорожча помилка', sub: 'я втратив усе за один день', cap: 'Він такого не очікував 😳 #katch #k7f2q' },
          { t: 'list', items: ['Код — у підписі до відео, а не в коментарі', 'Один оффер — один код. В іншого оффера буде інший', 'Не видаляй і не змінюй підпис після публікації'] },
          { t: 'vs', bad: 'Кліп без коду — не зарахуємо, навіть з мільйоном переглядів', good: 'Кліп з #katch #k7f2q у підписі — рахуємо перегляди' }
        ], quiz: { q: 'Куди ставити код?', o: ['У підпис (опис) відео', 'У коментар під відео', 'Сказати голосом у кліпі'], a: 0, why: 'Код має бути саме в підписі до відео — там ми його перевіряємо.' } }
      ] },

      { mod: 'Кліп, що залітає', lessons: [
        { id: 'c6', min: 2, title: 'Що робить кліп вірусним', body: [
          { t: 'list', items: [
            '**Хук у перші 1–2 секунди.** Починай з найгострішого моменту, без вступів',
            '**Один кліп — одна думка** або одна емоція',
            '**Великі субтитри:** половина людей дивиться без звуку',
            '**Вертикально 9:16**, обличчя в кадрі',
            '**Кінець, який хочеться передивитися:** обріж на піку'
          ] },
          { t: 'vs', bad: '«Всім привіт, сьогодні в нас у подкасті гість…»', good: '«Я втратив $40 000 за один день» — і одразу обличчя гостя' }
        ], quiz: { q: 'Який початок кліпу кращий?', o: ['Заставка з логотипом на 3 секунди', 'Найгостріша фраза з першої секунди', 'Ведучий вітається з глядачами'], a: 1, why: 'Глядач вирішує, гортати чи ні, за 1–2 секунди. Почни з головного.' } },

        { id: 'c7', min: 1, title: 'Інструменти і де шукати моменти', body: [
          { t: 'list', items: [
            '**CapCut** — безкоштовний: нарізка, автосубтитри, вертикальний формат',
            '**Таймкоди під відео** — автор часто сам позначає найкраще',
            '**Сплески в чаті стріму** — там, де всі пишуть «ахаха», щось сталося',
            '**Коментарі типу «2:13:40 🤣»** — готова підказка'
          ] },
          { t: 'ex', lines: ['Відкрий коментарі під подкастом → знайди найпопулярніший таймкод → виріж 30 секунд навколо нього → додай субтитри в CapCut → опублікуй з підписом.'] },
          'Іноді таймкоди найкращих моментів уже лежать у папці з вихідниками. Дивись ТЗ.'
        ], quiz: { q: 'Як швидше знайти сильний момент у 2-годинному подкасті?', o: ['Дивитися все підряд', 'Подивитися таймкоди й популярні коментарі'], a: 1, why: 'Глядачі вже знайшли найкращі моменти за тебе — користуйся цим.' } },

        { id: 'c8', min: 1, title: 'Платформи й акаунт', body: [
          'TikTok, Instagram Reels і YouTube Shorts. Які саме можна — написано в оффері.',
          'Якщо оффер дозволяє кілька платформ, можна викласти кліп на кожну. Кожне посилання — окремий кліп, перегляди рахуються окремо.',
          { t: 'ex', lines: ['Той самий кліп: TikTok — 60 000 переглядів, Shorts — 40 000.', 'Два посилання в кабінеті = 100 000 переглядів до оплати.'] },
          { t: 'list', items: ['Новий акаунт теж може залетіти: алгоритм дивиться на відео, а не на підписників', 'Краще один акаунт — одна тема: подкасти, ґеймінг, музика', 'Не накручуй перегляди: такі кліпи відхилимо, а платформа може заблокувати акаунт'] }
        ], quiz: { q: 'У тебе новий акаунт з 0 підписників. Чи можна брати оффер?', o: ['Так, алгоритм оцінює саме відео', 'Ні, спочатку треба набрати підписників'], a: 0, why: 'Короткі відео показують і новим акаунтам, якщо ролик чіпляє.' } }
      ] },

      { mod: 'Гроші', lessons: [
        { id: 'c9', min: 1, title: 'Що зараховуємо, а що ні', body: [
          { t: 'yn', yes: ['Живі перегляди', 'Кліп за ТЗ', 'Код у підписі', 'Відео на місці'], no: ['Накручені перегляди', 'Кліп без коду', 'Кліп не за ТЗ', 'Видалене або приховане відео', 'Перезалив чужого кліпу'] },
          'Якщо кліп відхилили, у кабінеті буде вказана причина.'
        ], quiz: { q: 'Ти видалив кліп на 5-й день. Що буде?', o: ['Зарахуємо перегляди за 5 днів', 'Не зарахуємо — перегляди рахуємо на 7-й день, і відео має бути на місці'], a: 1, why: 'Ми рахуємо перегляди на 7-й день після публікації. Видалене відео порахувати не можна.' } },

        { id: 'c10', min: 1, title: 'Статуси і коли приходять гроші', body: [
          { t: 'steps', items: [
            '**На перевірці** — кліп надіслано, чекаємо 7-го дня',
            '**Зараховано · холд** — перегляди пораховані, ще 7 днів на випадок спорів',
            '**Можна вивести** — гроші доступні в гаманці',
            '**Виплата в дорозі** → **Виплачено**'
          ] },
          { t: 'ex', lines: ['1 листопада опублікував', '8 листопада рахуємо перегляди', '15 листопада гроші можна вивести'] },
          'Вивід — на USDT (гаманець TON) або банківську картку: **Профіль → Вивести кошти**. Мінімальна сума вказана там же.'
        ], quiz: { q: 'Опублікував 10-го числа. Коли найраніше можна вивести гроші?', o: ['11-го', '17-го', '24-го'], a: 2, why: '10 + 7 днів до підрахунку = 17-те, ще 7 днів холду = 24-те.' } },

        { id: 'c11', min: 1, title: 'Скасування оффера', body: [
          'Якщо передумав, оффер можна скасувати в кабінеті.',
          'Але **все, що за ним ще не виплачено, згорає** — навіть кліпи, які вже зараховані або в холді. Те, що вже пішло на виплату, залишається твоїм.',
          { t: 'ex', lines: ['$40 уже запитано на вивід, $25 у холді, ще 1 кліп на перевірці.', 'Скасовуєш → $40 твої, а $25 і кліп на перевірці згорають.'] },
          'Скасований оффер можна взяти знову — буде новий код.'
        ], quiz: { q: 'У тебе кліп у холді на $30. Ти скасовуєш оффер. Що буде з $30?', o: ['Прийдуть як звичайно', 'Згорять'], a: 1, why: 'Скасування обнуляє все, що ще не пішло на виплату.' } }
      ] },

      { mod: 'Питання', lessons: [
        { id: 'c12', min: 1, title: 'Часті питання', body: [
          { t: 'faq', items: [
            ['Можна брати кілька офферів одночасно?', 'Так. У кожного оффера свій код — не плутай підписи.'],
            ['Скільки кліпів можна зробити за одним оффером?', 'Скільки завгодно, поки оффер відкритий і в ньому є бюджет.'],
            ['Кліп відхилили. Що робити?', 'Подивись причину в кабінеті, виправ і опублікуй новий кліп. Якщо незрозуміло — напиши в підтримку з Профілю.'],
            ['Потрібен досвід монтажу?', 'Ні. Вистачить телефона і CapCut. Почни з простих нарізок із субтитрами.'],
            ['Чи треба давати доступ до акаунта?', 'Ні. Нам потрібне тільки публічне посилання на кліп.']
          ] }
        ] }
      ] }
    ],

    brand: [
      { mod: 'Для брендів', lessons: [
        { id: 'b1', min: 1, title: 'Що таке кліпінг для бренду', body: [
          'Кліпери нарізають твій контент — стріми, подкасти, кліпи, інтервʼю — і публікують зі своїх акаунтів у TikTok, Reels і Shorts.',
          { t: 'list', items: ['Без продакшену: кліпи роблять кліпери', 'Багато акаунтів і форматів одночасно', 'Оплата тільки за зараховані перегляди'] },
          { t: 'ex', lines: ['Подкаст на 1,5 години → 20 кліперів → десятки коротких кліпів на різних акаунтах.'] }
        ], quiz: { q: 'За що платить бренд?', o: ['За кожен опублікований кліп', 'За зараховані перегляди', 'Фіксовану суму на місяць'], a: 1, why: 'Ти платиш тільки за перегляди, які ми зарахували.' } },

        { id: 'b2', min: 1, title: 'Як рахується бюджет', body: [
          'Ставка — це ціна за 1 000 переглядів. Ділимо бюджет на ставку — і бачимо, скільки переглядів ти отримаєш.',
          { t: 'math', title: 'Приклад · ставка $1.20 за 1 000', rows: [['Бюджет', '$1 000'], ['Рахуємо', '$1 000 ÷ $1.20 × 1 000']], total: ['Перегляди', '≈ 833 000'] },
          'Точну ставку погоджуємо в брифі.'
        ], quiz: { q: 'Бюджет $600, ставка $1.20 за 1 000. Скільки переглядів?', o: ['≈ 50 000', '≈ 500 000', '≈ 5 млн'], a: 1, why: '$600 ÷ $1.20 = 500, тобто 500 × 1 000 = 500 000 переглядів.' } },

        { id: 'b3', min: 1, title: 'Як розмістити оффер', body: [
          { t: 'steps', items: [
            'Натисни «Написати бриф» — відкриється чат з менеджером',
            'Заповни короткий бриф прямо в чаті',
            'Ми публікуємо оффер для кліперів',
            'Кліпери публікують, на 7-й день рахуємо перегляди',
            'Отримуєш звіт: кожен кліп, перегляди і скільки списано'
          ] }
        ] },

        { id: 'b4', min: 1, title: 'Що підготувати', body: [
          { t: 'list', items: ['Що просуваємо і куди вести людей', 'Вихідники: стрім, подкаст, кліп, трек', 'Бюджет кампанії', 'Платформи: TikTok, Reels, Shorts', 'Стоп-лист: теми і слова, яких не можна', 'Ключові меседжі: що обовʼязково показати', 'Дедлайн'] },
          { t: 'ex', label: 'Приклад брифу', lines: ['Що просуваємо: новий випуск подкасту', 'Куди вести: посилання на YouTube', 'Вихідники: папка на Google Drive', 'Платформи: TikTok, Shorts', 'Стоп-лист: політика, мат у перші 3 секунди'] }
        ], quiz: { q: 'Без чого кліпери не зможуть почати?', o: ['Без вихідників', 'Без логотипу у високій якості'], a: 0, why: 'Кліпи нарізають з вихідників — без них нема з чого різати.' } },

        { id: 'b5', min: 1, title: 'Контроль і безпека бренду', body: [
          { t: 'list', items: ['У кожному кліпі код кліпера в підписі — видно, хто і під який оффер його зробив', 'Перегляди рахуємо на 7-й день після публікації', 'Кліпи з накрученими переглядами або не за ТЗ не оплачуємо', 'Твій стоп-лист і правила — частина ТЗ', 'Звіт з посиланням на кожен кліп'] }
        ], quiz: { q: 'Кліп порушує стоп-лист. Чи платить бренд за його перегляди?', o: ['Так', 'Ні — кліп не за ТЗ не зараховуємо'], a: 1, why: 'Стоп-лист входить у ТЗ, а кліпи не за ТЗ не зараховуються.' } },

        { id: 'b6', min: 1, title: 'Часті питання', body: [
          { t: 'faq', items: [
            ['Який мінімальний бюджет?', 'Обговорюємо в брифі — напиши менеджеру.'],
            ['Можна обрати платформи?', 'Так, вкажи в брифі: TikTok, Reels, Shorts або тільки деякі з них.'],
            ['Чиї акаунти публікують кліпи?', 'Кліперів. Вони публікують зі своїх акаунтів, а в підписі стоїть код Katch.'],
            ['Можна поставити кампанію на паузу?', 'Так, напиши менеджеру — оффер зупинять.']
          ] }
        ] }
      ] }
    ]
  },

  en: {
    clipper: [
      { mod: 'Basics', lessons: [
        { id: 'c1', min: 1, title: 'What clipping is', body: [
          'Clipping means taking a long video (a stream, podcast, interview or music video) and cutting out **its best 15–60 seconds**. You make it vertical and post it on TikTok, Reels or Shorts.',
          'Brands and creators pay for this because short clips bring them new viewers. You get paid **for the views**.',
          { t: 'phone', top: "He didn't see that donation coming 😳", sub: '…and then a 10,000 donation drops', cap: 'Streamer in shock 😂 #katch #k7f2q', note: 'A finished clip: a strong first frame, subtitles, the code in the caption.' },
          { t: 'ex', lines: ['A streamer plays for 4 hours. At 2:13:40 a big donation comes in and he yells in a funny way.', 'Those 20 seconds, vertical and with subtitles, are the clip.'] }
        ], quiz: { q: 'Which of these is a clip?', o: ['The full 3-hour stream recording', 'The funniest 20 seconds of the stream, vertical', 'A screenshot from the stream'], a: 1, why: 'A clip is a short vertical cut of the best moment.' } },

        { id: 'c2', min: 1, title: 'What you get paid for', body: [
          'You get paid **for views**. Every offer shows a rate: how many dollars you get for every 1,000 counted views.',
          "Likes, followers and comments don't affect pay. Only views do.",
          { t: 'math', title: 'Example · $1 per 1,000', rows: [['Your clip got', '250,000 views'], ['We count', '250 × $1']], total: ['You earn', '$250'] },
          'You can make as many clips for one offer as you like, and each one counts separately. Three clips with 80,000 views each = $240.',
          "Some offers have a **max per clip**: one clip won't earn more than that."
        ], quiz: { q: 'The rate is $2 per 1,000. Your clip got 50,000 views. How much do you earn?', o: ['$50', '$100', '$1,000'], a: 1, why: '50,000 ÷ 1,000 = 50. 50 × $2 = $100.' } },

        { id: 'c3', min: 1, title: 'How Katch works: 6 steps', body: [
          { t: 'steps', items: [
            'Pick an offer in the feed',
            'Read the brief: what to cut, where to post, the rules',
            'Tap Take offer and copy your caption with the code',
            'Cut the clip and post it with that caption',
            'Paste the clip link in your dashboard',
            'On day 7 we count the views, 7 more days of hold — and the money is in your wallet'
          ] },
          "No sign-up: your Telegram is your login. We don't need access to your social accounts."
        ], quiz: { q: 'What do you do after posting a clip?', o: ["Nothing, you'll find it", 'Paste the clip link in the dashboard', 'DM the brand'], a: 1, why: 'We only count clips whose links you added to the dashboard.' } }
      ] },

      { mod: 'Working with an offer', lessons: [
        { id: 'c4', min: 1, title: 'How to read a brief', body: [
          'The brief is the brand’s task. Read it to the end **before** you take the offer.',
          { t: 'list', items: ['What to cut and where to get the source', 'Which platforms to post on', 'Clip length', 'Requirements — the mandatory rules', 'Rate and max per clip', 'How much budget is left'] },
          { t: 'ex', label: 'Example offer', lines: ['Founder podcast · TikTok + Shorts', '30–60 seconds · one idea per clip', 'Subtitles required', '$0.90 per 1,000 views'] },
          "The main rule: **a clip that doesn't follow the brief isn't counted**, even if it goes viral. Offer budgets are limited — when it runs out, the offer closes, so don't wait."
        ], quiz: { q: 'A clip got 300,000 views but has no subtitles, and the brief requires them. What happens?', o: ["It's counted, it has lots of views", "It isn't counted — it doesn't follow the brief"], a: 1, why: 'Brief requirements apply to every clip, whatever its views.' } },

        { id: 'c5', min: 1, title: 'Your Katch caption code', body: [
          'When you take an offer, you get a caption with your personal code, like `#katch #k7f2q`. Put it in **the caption of every clip** for that offer.',
          "That's how we know the clip is yours and made for this offer.",
          { t: 'phone', top: 'The most expensive mistake', sub: 'I lost everything in one day', cap: "He didn't expect that 😳 #katch #k7f2q" },
          { t: 'list', items: ['The code goes in the video caption, not in a comment', 'One offer, one code. Another offer has a different one', "Don't delete or edit the caption after posting"] },
          { t: 'vs', bad: "No code in the caption — not counted, even with a million views", good: '#katch #k7f2q in the caption — we count the views' }
        ], quiz: { q: 'Where does the code go?', o: ['In the video caption', 'In a comment under the video', 'Said out loud in the clip'], a: 0, why: 'The code has to be in the video caption — that is where we check it.' } }
      ] },

      { mod: 'Clips that take off', lessons: [
        { id: 'c6', min: 2, title: 'What makes a clip go viral', body: [
          { t: 'list', items: [
            '**A hook in the first 1–2 seconds.** Start with the sharpest moment, no intros',
            '**One clip, one idea** or one emotion',
            '**Big subtitles:** half of people watch with the sound off',
            '**Vertical 9:16**, face in frame',
            '**An ending people rewatch:** cut at the peak'
          ] },
          { t: 'vs', bad: '“Hi everyone, today on the podcast our guest is…”', good: '“I lost $40,000 in one day” — and straight to the guest’s face' }
        ], quiz: { q: 'Which opening is better?', o: ['A 3-second logo intro', 'The sharpest line from second one', 'The host greeting viewers'], a: 1, why: 'Viewers decide whether to scroll within 1–2 seconds. Lead with the best part.' } },

        { id: 'c7', min: 1, title: 'Tools and finding moments', body: [
          { t: 'list', items: [
            '**CapCut** — free: cutting, auto-subtitles, vertical format',
            '**Timestamps under the video** — creators often mark the best parts',
            '**Chat spikes on streams** — when everyone types “lol”, something happened',
            '**Comments like “2:13:40 🤣”** — a ready-made hint'
          ] },
          { t: 'ex', lines: ['Open the podcast comments → find the most-liked timestamp → cut 30 seconds around it → add subtitles in CapCut → post with your caption.'] },
          'Sometimes the best timestamps are already in the source folder. Check the brief.'
        ], quiz: { q: 'How do you find a strong moment in a 2-hour podcast fastest?', o: ['Watch the whole thing', 'Check timestamps and top comments'], a: 1, why: 'Viewers have already found the best moments for you — use them.' } },

        { id: 'c8', min: 1, title: 'Platforms and your account', body: [
          'TikTok, Instagram Reels and YouTube Shorts. Which ones are allowed is in the offer.',
          'If the offer allows several platforms, you can post the clip on each. Every link is a separate clip, and views count separately.',
          { t: 'ex', lines: ['Same clip: TikTok — 60,000 views, Shorts — 40,000.', 'Two links in the dashboard = 100,000 views to be paid.'] },
          { t: 'list', items: ['A new account can take off too: the algorithm looks at the video, not the follower count', 'Better one account, one topic: podcasts, gaming, music', "Don't bot your views: those clips are rejected, and the platform may ban the account"] }
        ], quiz: { q: 'Your account is new, with 0 followers. Can you take an offer?', o: ['Yes, the algorithm judges the video itself', 'No, build followers first'], a: 0, why: 'Short videos get shown from new accounts too, if they hook people.' } }
      ] },

      { mod: 'Money', lessons: [
        { id: 'c9', min: 1, title: "What counts and what doesn't", body: [
          { t: 'yn', yes: ['Real views', 'Clip follows the brief', 'Code in the caption', 'Video still up'], no: ['Botted views', 'Clip without the code', "Clip doesn't follow the brief", 'Deleted or hidden video', "Re-upload of someone else's clip"] },
          'If a clip is rejected, the reason shows in your dashboard.'
        ], quiz: { q: 'You delete a clip on day 5. What happens?', o: ['We count 5 days of views', 'Not counted — views are counted on day 7 and the video must still be up'], a: 1, why: "We count views on day 7 after posting. A deleted video can't be counted." } },

        { id: 'c10', min: 1, title: 'Statuses and when money arrives', body: [
          { t: 'steps', items: [
            '**On review** — clip submitted, waiting for day 7',
            '**Counted · hold** — views counted, 7 more days in case of disputes',
            '**Ready to withdraw** — the money is in your wallet',
            '**Payout on its way** → **Paid**'
          ] },
          { t: 'ex', lines: ['Posted on November 1', 'Views counted on November 8', 'Money ready to withdraw on November 15'] },
          'Withdraw to USDT (TON wallet) or a bank card: **Profile → Withdraw**. The minimum amount is shown there.'
        ], quiz: { q: 'You posted on the 10th. When is the earliest you can withdraw?', o: ['The 11th', 'The 17th', 'The 24th'], a: 2, why: '10 + 7 days to counting = the 17th, plus 7 days of hold = the 24th.' } },

        { id: 'c11', min: 1, title: 'Cancelling an offer', body: [
          'Changed your mind? You can cancel an offer in the dashboard.',
          "But **anything not yet paid out for it is forfeited** — even clips that are already counted or in hold. Whatever has already gone to payout stays yours.",
          { t: 'ex', lines: ['$40 already requested for payout, $25 in hold, 1 more clip on review.', 'You cancel → the $40 is yours, the $25 and the clip on review are gone.'] },
          'You can take a cancelled offer again — you get a new code.'
        ], quiz: { q: 'You have a $30 clip in hold and cancel the offer. What happens to the $30?', o: ['It arrives as usual', "It's forfeited"], a: 1, why: "Cancelling wipes everything that hasn't gone to payout yet." } }
      ] },

      { mod: 'Questions', lessons: [
        { id: 'c12', min: 1, title: 'FAQ', body: [
          { t: 'faq', items: [
            ['Can I take several offers at once?', "Yes. Each offer has its own code — don't mix up the captions."],
            ['How many clips can I make for one offer?', 'As many as you like, while the offer is open and has budget.'],
            ['My clip was rejected. What now?', "Check the reason in your dashboard, fix it and post a new clip. If it's unclear, message support from your Profile."],
            ['Do I need editing experience?', 'No. A phone and CapCut are enough. Start with simple cuts with subtitles.'],
            ['Do I have to give access to my account?', 'No. We only need the public link to your clip.']
          ] }
        ] }
      ] }
    ],

    brand: [
      { mod: 'For brands', lessons: [
        { id: 'b1', min: 1, title: 'What clipping does for a brand', body: [
          'Clippers cut your content — streams, podcasts, music videos, interviews — and post it from their own accounts on TikTok, Reels and Shorts.',
          { t: 'list', items: ['No production: clippers make the clips', 'Many accounts and formats at once', 'You pay only for counted views'] },
          { t: 'ex', lines: ['A 1.5-hour podcast → 20 clippers → dozens of short clips across different accounts.'] }
        ], quiz: { q: 'What does the brand pay for?', o: ['Every posted clip', 'Counted views', 'A fixed monthly fee'], a: 1, why: 'You pay only for the views we count.' } },

        { id: 'b2', min: 1, title: 'How the budget works', body: [
          'The rate is the price per 1,000 views. Divide the budget by the rate and you see how many views you get.',
          { t: 'math', title: 'Example · $1.20 per 1,000', rows: [['Budget', '$1,000'], ['We count', '$1,000 ÷ $1.20 × 1,000']], total: ['Views', '≈ 833,000'] },
          'We agree the exact rate in the brief.'
        ], quiz: { q: 'Budget $600, rate $1.20 per 1,000. How many views?', o: ['≈ 50,000', '≈ 500,000', '≈ 5M'], a: 1, why: '$600 ÷ $1.20 = 500, so 500 × 1,000 = 500,000 views.' } },

        { id: 'b3', min: 1, title: 'How to place an offer', body: [
          { t: 'steps', items: [
            'Tap Send a brief — a chat with the manager opens',
            'Fill in a short brief right in the chat',
            'We publish the offer for clippers',
            'Clippers post, and we count views on day 7',
            'You get a report: every clip, its views and what was charged'
          ] }
        ] },

        { id: 'b4', min: 1, title: 'What to prepare', body: [
          { t: 'list', items: ['What you promote and where to send people', 'Source: stream, podcast, music video, track', 'Campaign budget', 'Platforms: TikTok, Reels, Shorts', 'Stop-list: topics and words to avoid', 'Key messages: what must be shown', 'Deadline'] },
          { t: 'ex', label: 'Example brief', lines: ['Promoting: a new podcast episode', 'Send people to: the YouTube link', 'Source: a Google Drive folder', 'Platforms: TikTok, Shorts', 'Stop-list: politics, swearing in the first 3 seconds'] }
        ], quiz: { q: "What can't clippers start without?", o: ['The source footage', 'A high-res logo'], a: 0, why: "Clips are cut from the source — without it there's nothing to cut." } },

        { id: 'b5', min: 1, title: 'Control and brand safety', body: [
          { t: 'list', items: ["Every clip has the clipper's code in the caption — you see who made it and for which offer", 'Views are counted on day 7 after posting', "Clips with botted views or that don't follow the brief aren't paid", 'Your stop-list and rules are part of the brief', 'A report with a link to every clip'] }
        ], quiz: { q: 'A clip breaks the stop-list. Does the brand pay for its views?', o: ['Yes', "No — clips that don't follow the brief aren't counted"], a: 1, why: "The stop-list is part of the brief, and off-brief clips aren't counted." } },

        { id: 'b6', min: 1, title: 'FAQ', body: [
          { t: 'faq', items: [
            ["What's the minimum budget?", "We discuss it in the brief — message the manager."],
            ['Can I choose platforms?', 'Yes, set them in the brief: TikTok, Reels, Shorts or just some of them.'],
            ['Whose accounts post the clips?', "The clippers'. They post from their own accounts, with the Katch code in the caption."],
            ['Can I pause a campaign?', 'Yes, message the manager and the offer is paused.']
          ] }
        ] }
      ] }
    ]
  }
};
