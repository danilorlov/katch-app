-- Тестовий оффер, щоб побачити апку в дії. Видали його перед запуском:
-- delete from offers where brand = 'ТЕСТ';
insert into offers (brand, title_uk, title_en, category, description_uk, description_en, brief_uk, brief_en,
                    rules_uk, rules_en, source_url,
                    rate_per_1k, budget, max_per_clip, platforms)
values (
  'ТЕСТ',
  'Тестовий оффер: нарізка стріму',
  'Test offer: stream clips',
  'streams',
  'Наріж найкращі моменти зі стріму у вертикальні кліпи.',
  'Cut the best stream moments into vertical clips.',
  E'Наріж найкращі моменти зі стріму у вертикальні кліпи.\nОдин момент — один кліп, сильний перший кадр, субтитри.\nМожна кілька кліпів на день.',
  E'Cut the best stream moments into vertical clips.\nOne moment per clip, strong first frame, subtitles.\nSeveral clips a day is fine.',
  E'Код Katch у підписі — обовʼязково\n15–60 секунд, вертикально\nУвімкни позначку «Реклама / Платне партнерство»\nНакручені перегляди = відхилення',
  E'Katch code in the caption — required\n15–60 seconds, vertical\nTurn on the paid-partnership label\nBotted views = rejected',
  'https://drive.google.com/',
  1.00, 100.00, 50.00,
  '{tiktok,instagram,youtube}'
);
