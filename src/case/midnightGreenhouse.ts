import type { CaseDefinition } from './types'
import { renderMidnightGreenhouseReconstruction, renderMidnightGreenhouseScene } from './midnightGreenhouseArtwork'

const locations = {
  conservatory: { en: 'Glasshouse', ru: 'Оранжерея' },
  'potting-room': { en: 'Potting Room', ru: 'Комната садовника' },
  courtyard: { en: 'Courtyard', ru: 'Двор' },
  office: { en: 'Botanist’s Office', ru: 'Кабинет ботаника' },
  boiler: { en: 'Boiler Room', ru: 'Котельная' },
}

const people = {
  iris: { en: 'Dr. Iris Vale', ru: 'Доктор Ирис Вейл' },
  pavel: { en: 'Pavel', ru: 'Павел' },
  mila: { en: 'Mila', ru: 'Мила' },
  yuri: { en: 'Yuri', ru: 'Юрий' },
}

export const midnightGreenhouseCase: CaseDefinition = {
  id: 'midnight-greenhouse',
  title: { en: 'The Midnight Greenhouse', ru: 'Полуночная оранжерея' },
  introduction: {
    en: 'A rare moon orchid bloomed in a locked glasshouse overnight. Find out how it was cared for—and who kept the secret.',
    ru: 'Редкая лунная орхидея зацвела за ночь в запертой оранжерее. Узнайте, как за ней ухаживали и кто хранил это в тайне.',
  },
  initialLocationId: 'conservatory',
  initiallyOpenedLocationIds: ['conservatory', 'potting-room', 'courtyard', 'office'],
  locations: [
    { id: 'conservatory', title: locations.conservatory, description: { en: 'The moon orchid has opened, though the glasshouse was locked for the night.', ru: 'Лунная орхидея раскрылась, хотя на ночь оранжерею заперли.' }, sceneId: 'conservatory-diorama' },
    { id: 'potting-room', title: locations['potting-room'], description: { en: 'Tools are ready for morning work; one watering can still feels warm.', ru: 'Инструменты приготовлены к утру; одна лейка всё ещё тёплая.' }, sceneId: 'potting-diorama' },
    { id: 'courtyard', title: locations.courtyard, description: { en: 'The rain-dark courtyard keeps faint tracks beneath the windows.', ru: 'Во дворе после дождя под окнами видны едва заметные следы.' }, sceneId: 'courtyard-diorama' },
    { id: 'office', title: locations.office, description: { en: 'Dr. Vale’s notes track the coming cold and every greenhouse key.', ru: 'В записях доктора Вейл отмечены похолодание и каждый ключ от оранжереи.' }, sceneId: 'head-office-diorama' },
    { id: 'boiler', title: locations.boiler, description: { en: 'A warm pipe runs from the boiler toward the orchid benches.', ru: 'От котла к стеллажам с орхидеями тянется тёплая труба.' }, sceneId: 'boiler-diorama', unlockedBy: { kind: 'statement', id: 'mila-admits-visits' } },
  ],
  hotspots: [
    { id: 'orchid', locationId: 'conservatory', placement: { x: 0.42, y: 0.52 }, title: { en: 'Moon orchid', ru: 'Лунная орхидея' }, description: { en: 'Its petals are open, and tiny beads of water cling to the leaves.', ru: 'Лепестки раскрыты, на листьях блестят капли воды.' }, observationId: 'orchid-bloom' },
    { id: 'warm-pot', locationId: 'conservatory', placement: { x: 0.69, y: 0.74 }, title: { en: 'Warm flowerpot', ru: 'Тёплый горшок' }, description: { en: 'The soil is warm even though the central heater is set low.', ru: 'Земля тёплая, хотя центральный обогрев выставлен на минимум.' }, observationId: 'warm-soil' },
    { id: 'damp-saucer', locationId: 'conservatory', placement: { x: 0.42, y: 0.76 }, title: { en: 'Fresh water', ru: 'Свежая вода' }, description: { en: 'A clean ring of water surrounds the orchid pot.', ru: 'Вокруг горшка с орхидеей остался чистый влажный круг.' }, observationId: 'fresh-water' },
    { id: 'heater-dial', locationId: 'conservatory', placement: { x: 0.81, y: 0.44 }, title: { en: 'Heater dial', ru: 'Регулятор обогрева' }, description: { en: 'The dial was turned up and then returned to its usual setting.', ru: 'Регулятор поднимали, а потом вернули в обычное положение.' }, observationId: 'heater-adjusted' },
    { id: 'service-lock', locationId: 'courtyard', placement: { x: 0.81, y: 0.72 }, title: { en: 'Service door lock', ru: 'Замок служебной двери' }, description: { en: 'The lock is intact; there are no marks from a forced entry.', ru: 'Замок цел: следов взлома нет.' }, observationId: 'lock-intact' },
    { id: 'watering-can', locationId: 'potting-room', placement: { x: 0.35, y: 0.6 }, title: { en: 'Watering can', ru: 'Лейка' }, description: { en: 'The water inside is still warm, unlike the room.', ru: 'Вода внутри ещё тёплая, хотя в комнате прохладно.' }, observationId: 'warm-water' },
    { id: 'silver-soil', locationId: 'potting-room', placement: { x: 0.65, y: 0.69 }, title: { en: 'Silver soil', ru: 'Серебристая земля' }, description: { en: 'A trail of pale potting soil leads toward the service door.', ru: 'К служебной двери тянется след светлой земли для рассады.' }, observationId: 'soil-trail' },
    { id: 'thermos-ring', locationId: 'potting-room', placement: { x: 0.6, y: 0.4 }, title: { en: 'Thermos mark', ru: 'След от термоса' }, description: { en: 'A warm circular mark sits beside the potting notes.', ru: 'Рядом с записями садовника остался тёплый круглый след.' }, observationId: 'thermos-mark' },
    { id: 'blue-thread', locationId: 'courtyard', placement: { x: 0.85, y: 0.68 }, title: { en: 'Blue apron thread', ru: 'Синяя нитка фартука' }, description: { en: 'A blue thread is caught on the service-door latch.', ru: 'На задвижке служебной двери зацепилась синяя нитка.' }, observationId: 'apron-thread' },
    { id: 'night-window', locationId: 'courtyard', placement: { x: 0.4, y: 0.38 }, title: { en: 'Lit window', ru: 'Освещённое окно' }, description: { en: 'A small lamp would be visible from the night-watch path.', ru: 'С тропинки ночного сторожа было бы видно маленький фонарь.' }, observationId: 'window-sightline', falseLead: { en: 'The reflection looks like a lantern, but it is the courtyard lamp in the glass.', ru: 'Отражение похоже на фонарь, но это свет дворового светильника в стекле.' }, falseLeadEvidenceIds: ['lamp-glass'] },
    { id: 'courtyard-lamp', locationId: 'courtyard', placement: { x: 0.75, y: 0.27 }, title: { en: 'Courtyard lamp', ru: 'Дворовый светильник' }, description: { en: 'Its fixed light reflects in the glasshouse window.', ru: 'Его неподвижный свет отражается в окне оранжереи.' }, observationId: 'lamp-glass' },
    { id: 'boot-prints', locationId: 'courtyard', placement: { x: 0.69, y: 0.705 }, title: { en: 'Small boot prints', ru: 'Следы маленьких ботинок' }, description: { en: 'The prints match the pale soil from the potting room.', ru: 'Следы оставлены светлой землёй из комнаты садовника.' }, observationId: 'small-prints' },
    { id: 'frost-chart', locationId: 'office', placement: { x: 0.46, y: 0.36 }, title: { en: 'Frost forecast', ru: 'Прогноз заморозков' }, description: { en: 'The notes warn that the greenhouse will turn cold before dawn.', ru: 'В записях сказано, что к рассвету в оранжерее похолодает.' }, observationId: 'frost-warning' },
    { id: 'key-hook', locationId: 'office', placement: { x: 0.5, y: 0.45 }, title: { en: 'Spare key hook', ru: 'Крючок запасного ключа' }, description: { en: 'The hook is empty, but its dust shows the key was returned.', ru: 'Крючок пуст, но по пыли видно, что ключ уже повесили обратно.' }, observationId: 'key-returned' },
    { id: 'open-log', locationId: 'office', placement: { x: 0.78, y: 0.57 }, title: { en: 'Key log', ru: 'Журнал ключей' }, description: { en: 'Someone signed out the spare key after closing and returned it before dawn.', ru: 'Кто-то взял запасной ключ после закрытия и вернул его до рассвета.' }, observationId: 'key-log' },
    { id: 'boiler-gauge', locationId: 'boiler', placement: { x: 0.52, y: 0.43 }, title: { en: 'Boiler gauge', ru: 'Манометр котла' }, description: { en: 'The pipe was warmed for a short stretch during the coldest part of the night.', ru: 'Трубу ненадолго прогрели в самый холодный час ночи.' }, observationId: 'boiler-cycle' },
  ],
  evidence: [
    { id: 'orchid-bloom', kind: 'observation', text: { en: 'The moon orchid bloomed overnight.', ru: 'Лунная орхидея зацвела за ночь.' } },
    { id: 'warm-soil', kind: 'observation', text: { en: 'The orchid soil was warmed recently.', ru: 'Землю у орхидеи недавно подогревали.' } },
    { id: 'fresh-water', kind: 'observation', text: { en: 'The orchid was watered after the glasshouse closed.', ru: 'Орхидею полили после закрытия оранжереи.' } },
    { id: 'heater-adjusted', kind: 'observation', text: { en: 'Someone briefly raised the heater setting.', ru: 'Кто-то ненадолго повысил обогрев.' } },
    { id: 'lock-intact', kind: 'observation', text: { en: 'No one forced the service-door lock.', ru: 'Служебную дверь не взламывали.' } },
    { id: 'warm-water', kind: 'observation', text: { en: 'Warm water was carried from the potting room.', ru: 'Из комнаты садовника вынесли тёплую воду.' } },
    { id: 'soil-trail', kind: 'observation', text: { en: 'Pale potting soil links the workroom to the service door.', ru: 'Светлая земля соединяет комнату садовника со служебной дверью.' } },
    { id: 'thermos-mark', kind: 'observation', text: { en: 'Someone brought a hot drink to the potting room.', ru: 'Кто-то приносил в комнату садовника горячий напиток.' } },
    { id: 'apron-thread', kind: 'observation', text: { en: 'A blue work-apron thread caught on the service-door latch.', ru: 'На задвижке служебной двери осталась синяя нитка рабочего фартука.' } },
    { id: 'window-sightline', kind: 'observation', text: { en: 'The courtyard lamp reflects in the glass like a lantern.', ru: 'Дворовый светильник отражается в стекле, будто это фонарь.' } },
    { id: 'lamp-glass', kind: 'observation', text: { en: 'The bright shape is only a reflection of the fixed courtyard lamp.', ru: 'Яркое пятно — лишь отражение неподвижного дворового светильника.' } },
    { id: 'small-prints', kind: 'observation', text: { en: 'Small boot prints lead between the workroom and the service door.', ru: 'Маленькие следы ведут от комнаты садовника к служебной двери.' } },
    { id: 'frost-warning', kind: 'observation', text: { en: 'A frost was expected before dawn.', ru: 'До рассвета ожидался заморозок.' } },
    { id: 'key-returned', kind: 'observation', text: { en: 'The spare key was put back after use.', ru: 'Запасной ключ после использования вернули на место.' } },
    { id: 'key-log', kind: 'observation', text: { en: 'The spare key was checked out after closing and returned before dawn.', ru: 'Запасной ключ взяли после закрытия и вернули до рассвета.' } },
    { id: 'boiler-cycle', kind: 'observation', text: { en: 'The boiler briefly warmed the pipe overnight.', ru: 'Ночью котёл ненадолго прогревал трубу.' } },
    { id: 'mila-denies-visit', kind: 'statement', statementId: 'mila-denies-visit' },
    { id: 'iris-frost-statement', kind: 'statement', statementId: 'iris-frost-statement' },
    { id: 'pavel-lamp-statement', kind: 'statement', statementId: 'pavel-lamp-statement' },
    { id: 'yuri-water-statement', kind: 'statement', statementId: 'yuri-water-statement' },
    { id: 'iris-key-statement', kind: 'statement', statementId: 'iris-key-statement' },
    { id: 'mila-admits-visits', kind: 'statement', statementId: 'mila-admits-visits' },
    { id: 'mila-saved-orchid', kind: 'statement', statementId: 'mila-saved-orchid' },
  ],
  characters: [
    { id: 'iris', locationId: 'office', placement: { x: 0.27, y: 0.63 }, name: people.iris, role: { en: 'the head botanist', ru: 'главный ботаник' }, questions: [
      { id: 'ask-iris-frost', text: { en: 'Was cold weather expected?', ru: 'Ожидалось похолодание?' }, responseStatementIds: ['iris-frost-statement'] },
      { id: 'ask-iris-key', text: { en: 'Who used the spare key?', ru: 'Кто брал запасной ключ?' }, requires: [{ kind: 'deduction', id: 'key-entry' }], responseStatementIds: ['iris-key-statement'] },
    ] },
    { id: 'pavel', locationId: 'courtyard', placement: { x: 0.68, y: 0.56 }, name: people.pavel, role: { en: 'the night watch', ru: 'ночной сторож' }, questions: [
      { id: 'ask-pavel-window', text: { en: 'Did you see anyone outside?', ru: 'Вы кого-нибудь видели снаружи?' }, responseStatementIds: ['pavel-lamp-statement'] },
    ] },
    { id: 'mila', locationId: 'conservatory', placement: { x: 0.79, y: 0.61 }, name: people.mila, role: { en: 'the greenhouse apprentice', ru: 'ученица садовника' }, questions: [
      { id: 'ask-mila-night', text: { en: 'Did you return after closing?', ru: 'Вы возвращались после закрытия?' }, responseStatementIds: ['mila-denies-visit'] },
      { id: 'ask-mila-orchid', text: { en: 'Why was the orchid warmed?', ru: 'Зачем подогревали орхидею?' }, requires: [{ kind: 'deduction', id: 'night-care' }, { kind: 'statement', id: 'mila-admits-visits' }], responseStatementIds: ['mila-saved-orchid'], unlockLocationIds: ['boiler'] },
    ] },
    { id: 'yuri', locationId: 'potting-room', placement: { x: 0.78, y: 0.53 }, name: people.yuri, role: { en: 'the gardener', ru: 'садовник' }, questions: [
      { id: 'ask-yuri-water', text: { en: 'Was warm water used last night?', ru: 'Вчера использовали тёплую воду?' }, responseStatementIds: ['yuri-water-statement'] },
    ] },
  ],
  statements: [
    { id: 'mila-denies-visit', speakerId: 'mila', kind: 'initial', text: { en: 'Mila says she did not return after the glasshouse closed.', ru: 'Мила говорит, что не возвращалась после закрытия оранжереи.' } },
    { id: 'iris-frost-statement', speakerId: 'iris', text: { en: 'Dr. Vale expected a sharp frost before dawn.', ru: 'Доктор Вейл ожидала сильный заморозок до рассвета.' } },
    { id: 'pavel-lamp-statement', speakerId: 'pavel', text: { en: 'Pavel saw a glow, but it was the courtyard lamp reflected in the glass.', ru: 'Павел видел свет, но это был дворовый фонарь в отражении стекла.' } },
    { id: 'yuri-water-statement', speakerId: 'yuri', text: { en: 'Yuri filled the watering can with warm water for the delicate orchid.', ru: 'Юрий налил в лейку тёплую воду для нежной орхидеи.' } },
    { id: 'iris-key-statement', speakerId: 'iris', text: { en: 'Dr. Vale lent Mila the spare key for emergency checks, but told her not to change the orchid’s regulated conditions.', ru: 'Доктор Вейл дала Миле запасной ключ для срочных проверок, но запретила менять режим орхидеи.' } },
    { id: 'mila-admits-visits', speakerId: 'mila', kind: 'admission', text: { en: 'Mila admits she used the spare key and visited after closing.', ru: 'Мила признаётся, что брала запасной ключ и приходила после закрытия.' } },
    { id: 'mila-saved-orchid', speakerId: 'mila', kind: 'admission', text: { en: 'Mila warmed and watered the orchid to save it from the frost; she feared being blamed for interfering.', ru: 'Мила подогревала и поливала орхидею, чтобы спасти её от мороза; она боялась, что её обвинят во вмешательстве.' } },
  ],
  deductions: [
    { id: 'key-entry', prompt: { en: 'How was the locked glasshouse entered?', ru: 'Как попали в запертую оранжерею?' }, title: { en: 'A key opened the service door', ru: 'Служебную дверь открыли ключом' }, text: { en: 'The lock is intact and the spare-key log records a late checkout.', ru: 'Замок цел, а в журнале отмечено позднее получение запасного ключа.' }, requiresEvidenceIds: ['lock-intact', 'key-log'] },
    { id: 'night-care', prompt: { en: 'What happened to the orchid overnight?', ru: 'Что происходило с орхидеей ночью?' }, title: { en: 'Someone warmed and watered it', ru: 'Кто-то подогревал и поливал её' }, text: { en: 'Warm soil, fresh water, and the can of warm water show deliberate care.', ru: 'Тёплая земля, свежая вода и тёплая вода в лейке говорят об уходе.' }, requiresEvidenceIds: ['warm-soil', 'fresh-water', 'warm-water'] },
    { id: 'mila-connection', prompt: { en: 'Who left the trail?', ru: 'Кто оставил этот след?' }, title: { en: 'The trail leads to Mila', ru: 'След ведёт к Миле' }, text: { en: 'Small prints, pale potting soil, and a blue apron thread connect the route to Mila.', ru: 'Маленькие следы, светлая земля и синяя нитка фартука связывают путь с Милой.' }, requiresEvidenceIds: ['soil-trail', 'small-prints', 'apron-thread'] },
    { id: 'frost-plan', prompt: { en: 'Why was extra warmth needed?', ru: 'Зачем понадобилось дополнительное тепло?' }, title: { en: 'The orchid was protected from frost', ru: 'Орхидею защищали от мороза' }, text: { en: 'The forecast and brief heater adjustment fit a careful attempt to keep the plant alive.', ru: 'Прогноз и краткое включение обогрева объясняются попыткой спасти растение.' }, requiresEvidenceIds: ['frost-warning', 'heater-adjusted', 'boiler-cycle'] },
  ],
  contradictions: [{
    id: 'mila-visit-contradiction', title: { en: 'Mila’s denial does not fit', ru: 'Слова Милы не сходятся' },
    prompt: { en: 'Show Mila the warm-water and apron-thread trail.', ru: 'Покажите Миле след тёплой воды и нитку фартука.' },
    evidenceIds: ['warm-water', 'apron-thread'], initialStatementId: 'mila-denies-visit', revealedStatementId: 'mila-admits-visits',
  }],
  theoryFields: [
    { id: 'person', prompt: { en: 'Who cared for the orchid?', ru: 'Кто ухаживал за орхидеей?' }, value: 'mila', options: [
      { id: 'mila', label: people.mila }, { id: 'iris', label: people.iris }, { id: 'pavel', label: people.pavel }, { id: 'yuri', label: people.yuri },
    ], evidenceIds: ['apron-thread', 'mila-admits-visits'] },
    { id: 'entry', prompt: { en: 'How did they enter?', ru: 'Как удалось войти?' }, value: 'spare-key', options: [
      { id: 'spare-key', label: { en: 'With the spare key', ru: 'С запасным ключом' } }, { id: 'forced-lock', label: { en: 'By forcing the lock', ru: 'Взломав замок' } }, { id: 'window', label: { en: 'Through a window', ru: 'Через окно' } },
    ], evidenceIds: ['lock-intact', 'key-log', 'iris-key-statement'] },
    { id: 'action', prompt: { en: 'What did they do?', ru: 'Что они делали?' }, value: 'warm-and-water', options: [
      { id: 'warm-and-water', label: { en: 'Warmed and watered it', ru: 'Подогревали и поливали' } }, { id: 'moved-it', label: { en: 'Moved the flower', ru: 'Перенесли цветок' } }, { id: 'changed-the-clock', label: { en: 'Changed the clock', ru: 'Перевели часы' } },
    ], evidenceIds: ['warm-soil', 'fresh-water', 'heater-adjusted'] },
    { id: 'motive', prompt: { en: 'Why keep it secret?', ru: 'Зачем это скрывали?' }, value: 'save-from-frost', options: [
      { id: 'save-from-frost', label: { en: 'To save it from frost', ru: 'Чтобы спасти от мороза' } }, { id: 'hide-damage', label: { en: 'To hide damage', ru: 'Чтобы скрыть повреждение' } }, { id: 'take-the-flower', label: { en: 'To take the flower', ru: 'Чтобы забрать цветок' } },
    ], evidenceIds: ['frost-warning', 'mila-saved-orchid'] },
    { id: 'time', prompt: { en: 'When did it happen?', ru: 'Когда это произошло?' }, value: 'after-closing', options: [
      { id: 'after-closing', label: { en: 'After closing, before dawn', ru: 'После закрытия, до рассвета' } }, { id: 'during-day', label: { en: 'During the day', ru: 'Днём' } }, { id: 'before-closing', label: { en: 'Before closing', ru: 'До закрытия' } },
    ], evidenceIds: ['key-log', 'mila-admits-visits'] },
  ],
  reconstruction: [
    { id: 'reconstruction-1', timestamp: { en: '9:30 PM', ru: '21:30' }, text: { en: 'The frost forecast worries Mila as the glasshouse closes.', ru: 'Прогноз заморозков тревожит Милу, пока оранжерею закрывают.' }, sceneId: 'reconstruction-frost' },
    { id: 'reconstruction-2', timestamp: { en: '11:20 PM', ru: '23:20' }, text: { en: 'She borrows the spare key and slips through the service door.', ru: 'Она берёт запасной ключ и входит через служебную дверь.' }, sceneId: 'reconstruction-key' },
    { id: 'reconstruction-3', timestamp: { en: '11:35 PM', ru: '23:35' }, text: { en: 'Mila waters the orchid with warm water.', ru: 'Мила поливает орхидею тёплой водой.' }, sceneId: 'reconstruction-water' },
    { id: 'reconstruction-4', timestamp: { en: '11:45 PM', ru: '23:45' }, text: { en: 'She briefly warms the bench, then returns the key before dawn.', ru: 'Она ненадолго прогревает стеллаж и возвращает ключ до рассвета.' }, sceneId: 'reconstruction-heat' },
    { id: 'reconstruction-5', timestamp: { en: '12:10 AM', ru: '00:10' }, text: { en: 'The protected moon orchid opens safely in the night.', ru: 'Защищённая лунная орхидея благополучно раскрывается ночью.' }, sceneId: 'reconstruction-bloom' },
  ],
  renderScene: renderMidnightGreenhouseScene,
  renderReconstruction: renderMidnightGreenhouseReconstruction,
}
