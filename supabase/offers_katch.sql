-- Два оффери від самого Katch. Запущено в базі 2026-10-29.
insert into offers (brand, title_uk, title_en, category, description_uk, description_en,
                    brief_uk, brief_en, rules_uk, rules_en, source_url,
                    rate_per_1k, budget, max_per_clip, platforms, status)
values
(
  'Katch',
  'Нарізки з логотипом Katch',
  'Clips with the Katch logo',
  'other',
  'Нарізай будь-що популярне й додай логотип Katch.',
  'Cut anything popular and add the Katch logo.',
  $uk1$Наріж будь-який контент, який зараз дивляться: серіали, фільми, стріми, подкасти, шоу.
На відео має бути видно логотип Katch — у кутку кадру або на перших секундах.
Додай плашку «Заробляю на таких нарізках» — щоб глядач зрозумів: такі ж нарізки, як він зараз дивиться, приносять гроші.
У підписі — твій код Katch і заклик: «Заробляй на нарізках у t.me/katch_ua_bot».
Логотип і плашка — у вихідниках нижче.$uk1$,
  $en1$Cut any content people are watching right now: series, films, streams, podcasts, shows.
The Katch logo must be visible — in a corner of the frame or in the first seconds.
Add the badge "I get paid for clips like this" so the viewer gets it: clips like the one they're watching make money.
In the caption: your Katch code and a call to action: "Earn on clips at t.me/katch_ua_bot".
Logo and badge are in the source files below.$en1$,
  $uk2$Код Katch у підписі — обовʼязково
Логотип Katch видно на відео
Вертикально, 15–60 секунд
Увімкни позначку «Реклама» або «Платне партнерство»
Якщо платформа видалить ролик через авторські права — він не оплачується
Накручені перегляди = відхилення$uk2$,
  $en2$Katch code in the caption — required
Katch logo visible in the video
Vertical, 15–60 seconds
Turn on the "Ad" or "Paid partnership" label
If the platform removes the clip for copyright, it isn't paid
Botted views = rejected$en2$,
  'https://danilorlov.github.io/katch-app/brand/',
  0.80, 1000.00, null,
  '{tiktok,instagram,youtube}', 'live'
),
(
  'Katch',
  'Розмовне відео: як працює Katch',
  'Talking video: how Katch works',
  'other',
  'Зніми себе й розкажи, як заробляти на нарізках у Katch.',
  'Film yourself explaining how to earn on clips with Katch.',
  $uk3$Зніми розмовне відео від себе: обличчя в кадрі, твій голос.
Розкажи й покажи, як це працює: відкриваєш Katch у Telegram → береш оффер → нарізаєш і публікуєш → додаєш посилання → отримуєш гроші за перегляди.
Покажи екран апки на телефоні — це переконує краще за слова.
Формат на твій вибір: розбір, реакція, «як я почав», відповідь на питання в коментарях.
Наприкінці — заклик: «Посилання в біо» або «t.me/katch_ua_bot».
Логотип і плашка для кадру — у вихідниках нижче.$uk3$,
  $en3$Film a talking video yourself: your face on camera, your voice.
Tell and show how it works: open Katch in Telegram → take an offer → cut and post → add the link → get paid for views.
Show the app screen on your phone — it convinces better than words.
Any format: walkthrough, reaction, "how I started", reply to a comment question.
End with a call to action: "Link in bio" or "t.me/katch_ua_bot".
Logo and badge for the frame are in the source files below.$en3$,
  $uk4$Код Katch у підписі — обовʼязково
Обличчя або голос автора в кадрі
Вертикально, 20–90 секунд
Не обіцяй конкретних сум заробітку
Увімкни позначку «Реклама» або «Платне партнерство»
Накручені перегляди = відхилення$uk4$,
  $en4$Katch code in the caption — required
Author's face or voice in the video
Vertical, 20–90 seconds
Don't promise specific earnings
Turn on the "Ad" or "Paid partnership" label
Botted views = rejected$en4$,
  'https://danilorlov.github.io/katch-app/brand/',
  1.50, 1000.00, null,
  '{tiktok,instagram,youtube}', 'live'
);

select id, brand, title_uk, rate_per_1k, budget, status from offers order by id;
