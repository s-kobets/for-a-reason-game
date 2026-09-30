import type { CaseDefinition } from './types'
import { renderVanishingViolinReconstruction, renderVanishingViolinScene } from './vanishingViolinArtwork'

const locations = {
  'music-room': { en: 'Music Room', ru: 'Музыкальный класс' },
  'backstage-corridor': { en: 'Backstage Corridor', ru: 'Служебный коридор' },
  'concert-hall': { en: 'Concert Hall', ru: 'Концертный зал' },
  'instrument-workshop': { en: 'Instrument Workshop', ru: 'Мастерская инструментов' },
}

const people = {
  vera: { en: 'Vera', ru: 'Вера' },
  anya: { en: 'Anya', ru: 'Аня' },
  pavel: { en: 'Pavel', ru: 'Павел' },
  lev: { en: 'Lev', ru: 'Лев' },
}

export const vanishingViolinCase: CaseDefinition = {
  id: 'vanishing-violin',
  title: { en: 'The Vanishing Violin', ru: 'Исчезнувшая скрипка' },
  introduction: {
    en: 'Just before the student concert, a valuable violin vanishes from a locked music room. Find it—and discover why someone kept quiet.',
    ru: 'Перед ученическим концертом из запертого класса исчезает ценная скрипка. Найдите её и выясните, почему кто-то молчит.',
  },
  initialLocationId: 'music-room',
  initiallyOpenedLocationIds: ['music-room', 'backstage-corridor', 'concert-hall'],
  locations: [
    { id: 'music-room', title: locations['music-room'], description: { en: 'An empty place in the instrument cabinet is the only thing out of tune.', ru: 'В шкафу для инструментов пустует место — единственная фальшивая нота в этом классе.' }, sceneId: 'music-room' },
    { id: 'backstage-corridor', title: locations['backstage-corridor'], description: { en: 'A narrow service route links the rehearsal rooms with the old workshop.', ru: 'Узкий служебный проход соединяет классы с давней мастерской.' }, sceneId: 'backstage-corridor' },
    { id: 'concert-hall', title: locations['concert-hall'], description: { en: 'The audience is arriving, but the soloist’s place on stage is empty.', ru: 'Зрители уже собираются, но место солистки на сцене пустует.' }, sceneId: 'concert-hall' },
    { id: 'instrument-workshop', title: locations['instrument-workshop'], description: { en: 'A quiet repair room smells of wood, varnish, and something recently dried.', ru: 'В тихой мастерской пахнет деревом, лаком и чем-то недавно высохшим.' }, sceneId: 'instrument-workshop', unlockedBy: { kind: 'deduction', id: 'service-route' } },
  ],
  hotspots: [
    { id: 'empty-cabinet', locationId: 'music-room', placement: { x: 0.49, y: 0.52 }, title: { en: 'Empty violin space', ru: 'Пустое место для скрипки' }, description: { en: 'Dust outlines a violin-shaped case, recently lifted from the cabinet.', ru: 'В пыли остался контур футляра; его недавно сняли со шкафа.' }, observationId: 'empty-cabinet-clue' },
    { id: 'water-stain', locationId: 'music-room', placement: { x: 0.5, y: 0.24 }, title: { en: 'Fresh ceiling stain', ru: 'Свежий след на потолке' }, description: { en: 'A drop has darkened the shelf directly above the violin’s old place.', ru: 'Капля оставила тёмный след на полке прямо над местом скрипки.' }, observationId: 'leak-drips' },
    { id: 'cabinet-lock', locationId: 'music-room', placement: { x: 0.635, y: 0.56 }, title: { en: 'Cabinet lock', ru: 'Замок шкафа' }, description: { en: 'The lock is unbroken. The cabinet was opened with a key.', ru: 'Замок цел. Шкаф открыли ключом.' }, observationId: 'cabinet-lock-clue' },
    { id: 'rehearsal-list', locationId: 'music-room', placement: { x: 0.79, y: 0.33 }, title: { en: 'Rehearsal list', ru: 'Расписание репетиций' }, description: { en: 'The last rehearsal ended before the roof began to drip.', ru: 'Последняя репетиция закончилась до того, как с крыши закапало.' }, observationId: 'rehearsal-ended' },
    { id: 'key-ledger', locationId: 'music-room', placement: { x: 0.81, y: 0.7 }, title: { en: 'Key register', ru: 'Журнал ключей' }, description: { en: 'Vera signed out the master key just after rehearsal.', ru: 'Вера взяла мастер-ключ сразу после репетиции.' }, observationId: 'key-register-clue' },
    { id: 'cart-track', locationId: 'backstage-corridor', placement: { x: 0.38, y: 0.75 }, title: { en: 'Small wheel tracks', ru: 'Следы маленьких колёс' }, description: { en: 'Two faint parallel lines run from the music room toward the workshop door.', ru: 'Две бледные параллельные полосы ведут от класса к двери мастерской.' }, observationId: 'cart-track-clue' },
    { id: 'service-door', locationId: 'backstage-corridor', placement: { x: 0.815, y: 0.53 }, title: { en: 'Workshop service door', ru: 'Служебная дверь мастерской' }, description: { en: 'The door opens onto the instrument workshop; its latch has no scratch marks.', ru: 'За дверью — мастерская. На защёлке нет царапин от взлома.' }, observationId: 'service-door-clue' },
    { id: 'rosin-mark', locationId: 'backstage-corridor', placement: { x: 0.5, y: 0.615 }, title: { en: 'Amber powder', ru: 'Янтарная крошка' }, description: { en: 'A dusting of rosin lies beside the practice-room bench.', ru: 'Возле скамьи в коридоре рассыпана канифоль.' }, observationId: 'rosin-dust', falseLead: { en: 'Pavel used rosin here before the final rehearsal; it has nothing to do with the missing violin.', ru: 'Павел пользовался канифолью здесь до последней репетиции. К исчезновению скрипки это не относится.' }, falseLeadEvidenceIds: ['pavel-rehearsal-statement'] },
    { id: 'concert-program', locationId: 'concert-hall', placement: { x: 0.735, y: 0.59 }, title: { en: 'Concert program', ru: 'Программа концерта' }, description: { en: 'Anya is listed as tonight’s violin soloist.', ru: 'В программе указано, что сегодня сольную партию играет Аня.' }, observationId: 'anya-soloist' },
    { id: 'empty-stand', locationId: 'concert-hall', placement: { x: 0.435, y: 0.56 }, title: { en: 'Empty music stand', ru: 'Пустой пюпитр' }, description: { en: 'Anya’s marked sheet music is waiting beside an empty stand.', ru: 'У пустого пюпитра лежат ноты Ани с пометками.' }, observationId: 'solo-part-waiting' },
    { id: 'repair-bench', locationId: 'instrument-workshop', placement: { x: 0.44, y: 0.53 }, title: { en: 'Repair bench', ru: 'Верстак мастера' }, description: { en: 'A soft cloth has left a clean rectangle through the bench dust.', ru: 'Мягкая ткань оставила чистый прямоугольник на запылённом верстаке.' }, observationId: 'cloth-on-bench' },
    { id: 'covered-violin', locationId: 'instrument-workshop', placement: { x: 0.715, y: 0.63 }, title: { en: 'Covered instrument', ru: 'Инструмент под тканью' }, description: { en: 'Under the cloth is the missing violin, dry and safely tucked away.', ru: 'Под тканью лежит пропавшая скрипка — сухая и целая.' }, observationId: 'violin-found' },
    { id: 'workshop-window', locationId: 'instrument-workshop', placement: { x: 0.765, y: 0.31 }, title: { en: 'Workshop window', ru: 'Окно мастерской' }, description: { en: 'The window is shut from inside; rain has only reached the outer sill.', ru: 'Окно заперто изнутри, дождь намочил только внешний подоконник.' }, observationId: 'window-shut' },
    { id: 'roof-plan', locationId: 'instrument-workshop', placement: { x: 0.26, y: 0.37 }, title: { en: 'Roof repair plan', ru: 'План ремонта крыши' }, description: { en: 'The repair was postponed twice. A note warns to move instruments if the leak returns.', ru: 'Ремонт дважды откладывали. В записке сказано убрать инструменты, если течь вернётся.' }, observationId: 'repair-delayed' },
  ],
  evidence: [
    { id: 'empty-cabinet-clue', kind: 'observation', text: { en: 'A violin case was recently lifted from the cabinet.', ru: 'Футляр со скрипкой недавно сняли со шкафа.' } },
    { id: 'leak-drips', kind: 'observation', text: { en: 'Water dripped onto the shelf above the violin’s place.', ru: 'Вода капала на полку над местом скрипки.' } },
    { id: 'cabinet-lock-clue', kind: 'observation', text: { en: 'The cabinet was opened with its key, not forced.', ru: 'Шкаф открыли ключом, а не взломали.' } },
    { id: 'rehearsal-ended', kind: 'observation', text: { en: 'The last rehearsal ended before the leak started.', ru: 'Последняя репетиция закончилась до начала протечки.' } },
    { id: 'key-register-clue', kind: 'observation', text: { en: 'Vera signed out the master key just after rehearsal.', ru: 'Вера взяла мастер-ключ сразу после репетиции.' } },
    { id: 'cart-track-clue', kind: 'observation', text: { en: 'Small wheel tracks lead from the music room toward the workshop.', ru: 'Следы маленьких колёс ведут из класса к мастерской.' } },
    { id: 'service-door-clue', kind: 'observation', text: { en: 'The workshop route was used without forcing its door.', ru: 'В мастерскую прошли через дверь, не взламывая её.' } },
    { id: 'rosin-dust', kind: 'observation', text: { en: 'Rosin dust was left beside the practice-room bench.', ru: 'Возле скамьи в коридоре осталась канифоль.' } },
    { id: 'anya-soloist', kind: 'observation', text: { en: 'Anya is due to play the violin solo tonight.', ru: 'Сегодня вечером Аня должна играть скрипичное соло.' } },
    { id: 'solo-part-waiting', kind: 'observation', text: { en: 'Anya’s solo music was ready beside the empty stand.', ru: 'Партия Ани готова и лежит возле пустого пюпитра.' } },
    { id: 'cloth-on-bench', kind: 'observation', text: { en: 'A violin-sized object recently rested on the workshop bench.', ru: 'На верстаке недавно лежал предмет размером со скрипку.' } },
    { id: 'violin-found', kind: 'observation', text: { en: 'The missing violin is safe in the workshop.', ru: 'Пропавшая скрипка цела и находится в мастерской.' } },
    { id: 'window-shut', kind: 'observation', text: { en: 'No one entered the workshop through its window.', ru: 'В мастерскую не проникали через окно.' } },
    { id: 'repair-delayed', kind: 'observation', text: { en: 'The roof repair was delayed, and instruments should be moved if the leak returns.', ru: 'Ремонт крыши задержали; при новой протечке инструменты нужно убрать.' } },
    { id: 'vera-denies-room', kind: 'statement', statementId: 'vera-denies-room' },
    { id: 'vera-admits-move', kind: 'statement', statementId: 'vera-admits-move' },
    { id: 'vera-explains-leak', kind: 'statement', statementId: 'vera-explains-leak' },
    { id: 'anya-heard-drips', kind: 'statement', statementId: 'anya-heard-drips' },
    { id: 'anya-saw-empty-cabinet', kind: 'statement', statementId: 'anya-saw-empty-cabinet' },
    { id: 'pavel-rehearsal-statement', kind: 'statement', statementId: 'pavel-rehearsal-statement' },
    { id: 'lev-key-log', kind: 'statement', statementId: 'lev-key-log' },
    { id: 'lev-cart-route', kind: 'statement', statementId: 'lev-cart-route' },
    { id: 'vera-checks-roof', kind: 'statement', statementId: 'vera-checks-roof' },
  ],
  characters: [
    { id: 'vera', locationId: 'music-room', placement: { x: 0.19, y: 0.65 }, name: people.vera, role: { en: 'the school caretaker', ru: 'смотрительница школы' }, questions: [
      { id: 'ask-vera-room', text: { en: 'Did you go into the music room after rehearsal?', ru: 'Вы заходили в класс после репетиции?' }, responseStatementIds: ['vera-denies-room'] },
      { id: 'ask-vera-motive', text: { en: 'Why did you move the violin?', ru: 'Зачем вы перенесли скрипку?' }, requires: [{ kind: 'statement', id: 'vera-admits-move' }], responseStatementIds: ['vera-explains-leak'] },
    ] },
    { id: 'anya', locationId: 'concert-hall', placement: { x: 0.75, y: 0.68 }, name: people.anya, role: { en: 'the violin soloist', ru: 'скрипачка-солистка' }, questions: [
      { id: 'ask-anya-last-seen', text: { en: 'When did you last see the violin?', ru: 'Когда вы в последний раз видели скрипку?' }, responseStatementIds: ['anya-saw-empty-cabinet'] },
      { id: 'ask-anya-leak', text: { en: 'Did you notice anything unusual in the music room?', ru: 'Вы заметили что-нибудь необычное в классе?' }, responseStatementIds: ['anya-heard-drips'] },
    ] },
    { id: 'pavel', locationId: 'concert-hall', placement: { x: 0.25, y: 0.68 }, name: people.pavel, role: { en: 'the cellist', ru: 'виолончелист' }, questions: [
      { id: 'ask-pavel-rehearsal', text: { en: 'Why is there rosin in the corridor?', ru: 'Почему в коридоре канифоль?' }, responseStatementIds: ['pavel-rehearsal-statement'] },
    ] },
    { id: 'lev', locationId: 'backstage-corridor', placement: { x: 0.56, y: 0.61 }, name: people.lev, role: { en: 'the stage manager', ru: 'режиссёр концерта' }, questions: [
      { id: 'ask-lev-key', text: { en: 'Who signed out the master key?', ru: 'Кто брал мастер-ключ?' }, responseStatementIds: ['lev-key-log'] },
      { id: 'ask-lev-cart', text: { en: 'Where do these wheel tracks lead?', ru: 'Куда ведут следы колёс?' }, requires: [{ kind: 'deduction', id: 'service-route' }], responseStatementIds: ['lev-cart-route'] },
    ] },
  ],
  statements: [
    { id: 'vera-denies-room', speakerId: 'vera', kind: 'initial', text: { en: 'Vera says she did not enter the music room after the rehearsal ended.', ru: 'Вера говорит, что после репетиции в класс не заходила.' } },
    { id: 'vera-admits-move', speakerId: 'vera', kind: 'admission', text: { en: 'Vera admits she used the master key and carried the violin to the workshop.', ru: 'Вера признаётся, что мастер-ключом открыла класс и отнесла скрипку в мастерскую.' } },
    { id: 'vera-explains-leak', speakerId: 'vera', kind: 'admission', text: { en: 'She moved it to keep rain off the instrument, then stayed quiet because she feared blame for the delayed roof repair.', ru: 'Она убрала скрипку от дождя, а потом промолчала, потому что боялась отвечать за задержку ремонта крыши.' } },
    { id: 'anya-heard-drips', speakerId: 'anya', text: { en: 'Anya heard a steady drip from the music-room ceiling after rehearsal.', ru: 'После репетиции Аня слышала, как с потолка музыкального класса капает вода.' } },
    { id: 'anya-saw-empty-cabinet', speakerId: 'anya', text: { en: 'Anya saw the empty cabinet just before the concert, but the violin was there at rehearsal.', ru: 'Перед концертом Аня увидела пустой шкаф, хотя на репетиции скрипка была на месте.' } },
    { id: 'pavel-rehearsal-statement', speakerId: 'pavel', text: { en: 'Pavel used rosin on his bow before the final rehearsal and left a little by the practice-room bench.', ru: 'Перед последней репетицией Павел натёр смычок канифолью и просыпал немного у скамьи.' } },
    { id: 'lev-key-log', speakerId: 'lev', text: { en: 'The register shows Vera signed out the master key just after rehearsal.', ru: 'В журнале указано, что Вера взяла мастер-ключ сразу после репетиции.' } },
    { id: 'lev-cart-route', speakerId: 'lev', text: { en: 'The small service cart runs from the music room to the instrument workshop.', ru: 'Маленькая служебная тележка ездит из музыкального класса в мастерскую.' } },
    { id: 'vera-checks-roof', speakerId: 'vera', text: { en: 'Vera says the roof repair was supposed to begin last week.', ru: 'Вера говорит, что ремонт крыши должен был начаться ещё на прошлой неделе.' } },
    { id: 'anya-protects-instrument', speakerId: 'anya', text: { en: 'Anya says the violin must stay dry; even a little water can damage its old varnish.', ru: 'Аня говорит, что скрипку нужно беречь от влаги: вода повредит старый лак.' } },
    { id: 'pavel-saw-closed-workshop', speakerId: 'pavel', text: { en: 'Pavel saw the workshop door closed before the concert began.', ru: 'Перед началом концерта Павел видел, что дверь мастерской была закрыта.' } },
  ],
  deductions: [
    { id: 'protective-move', prompt: { en: 'Why would someone move the violin?', ru: 'Зачем кто-то стал бы переносить скрипку?' }, title: { en: 'The violin was moved away from the leak', ru: 'Скрипку убрали от протечки' }, text: { en: 'Water fell above the cabinet, and the violin was lifted out soon afterward.', ru: 'Над шкафом капала вода, и вскоре скрипку оттуда убрали.' }, requiresEvidenceIds: ['leak-drips', 'empty-cabinet-clue'] },
    { id: 'service-route', prompt: { en: 'Where could a small instrument cart go?', ru: 'Куда могла проехать небольшая тележка?' }, title: { en: 'The cart went toward the workshop', ru: 'Тележка ехала к мастерской' }, text: { en: 'Wheel tracks reach the service door, whose other side opens into the workshop.', ru: 'Следы колёс доходят до служебной двери, которая ведёт в мастерскую.' }, requiresEvidenceIds: ['cart-track-clue', 'service-door-clue'] },
    { id: 'keyed-removal', prompt: { en: 'How was the cabinet opened?', ru: 'Как открыли шкаф?' }, title: { en: 'Someone used a key after rehearsal', ru: 'После репетиции шкаф открыли ключом' }, text: { en: 'The lock is intact, and the key register records a checkout just after rehearsal.', ru: 'Замок цел, а в журнале отмечено, что сразу после репетиции взяли ключ.' }, requiresEvidenceIds: ['cabinet-lock-clue', 'lev-key-log'] },
  ],
  contradictions: [{
    id: 'vera-key-contradiction',
    title: { en: 'Vera’s timeline does not fit', ru: 'Слова Веры не сходятся' },
    prompt: { en: 'Show Vera the key-register entry and the route to the workshop.', ru: 'Покажите Вере запись в журнале ключей и след к мастерской.' },
    evidenceIds: ['key-register-clue', 'cart-track-clue'],
    initialStatementId: 'vera-denies-room',
    revealedStatementId: 'vera-admits-move',
  }],
  theoryFields: [
    { id: 'person', prompt: { en: 'Who moved the violin?', ru: 'Кто перенёс скрипку?' }, value: 'vera', options: [
      { id: 'vera', label: people.vera }, { id: 'anya', label: people.anya }, { id: 'pavel', label: people.pavel }, { id: 'lev', label: people.lev },
    ], evidenceIds: ['key-register-clue', 'vera-admits-move'] },
    { id: 'destination', prompt: { en: 'Where was it taken?', ru: 'Куда её отнесли?' }, value: 'instrument-workshop', options: [
      { id: 'instrument-workshop', label: locations['instrument-workshop'] }, { id: 'concert-hall', label: locations['concert-hall'] }, { id: 'backstage-corridor', label: locations['backstage-corridor'] }, { id: 'music-room', label: locations['music-room'] },
    ], evidenceIds: ['cart-track-clue', 'violin-found'] },
    { id: 'access', prompt: { en: 'How was the locked room opened?', ru: 'Как открыли запертую комнату?' }, value: 'master-key', options: [
      { id: 'master-key', label: { en: 'With the master key', ru: 'Мастер-ключом' } }, { id: 'forced-lock', label: { en: 'By forcing the lock', ru: 'Взломав замок' } }, { id: 'window', label: { en: 'Through a window', ru: 'Через окно' } },
    ], evidenceIds: ['cabinet-lock-clue', 'key-register-clue'] },
    { id: 'motive', prompt: { en: 'Why did she move it?', ru: 'Зачем она её перенесла?' }, value: 'protect-from-leak', options: [
      { id: 'protect-from-leak', label: { en: 'To protect it from the leak', ru: 'Чтобы защитить от протечки' } }, { id: 'hide-repair-delay', label: { en: 'To hide the delayed repair', ru: 'Чтобы скрыть задержку ремонта' } }, { id: 'steal-violin', label: { en: 'To steal the violin', ru: 'Чтобы украсть скрипку' } },
    ], evidenceIds: ['repair-delayed', 'vera-explains-leak'] },
  ],
  reconstruction: [
    { id: 'reconstruction-1', timestamp: { en: '5:40 PM', ru: '17:40' }, text: { en: 'The student rehearsal ends as rain begins above the music room.', ru: 'Ученическая репетиция заканчивается, и над классом начинается дождь.' }, sceneId: 'reconstruction-leak' },
    { id: 'reconstruction-2', timestamp: { en: '5:48 PM', ru: '17:48' }, text: { en: 'Vera signs out the master key and notices water dripping over the violin cabinet.', ru: 'Вера берёт мастер-ключ и замечает, что над шкафом со скрипкой капает вода.' }, sceneId: 'reconstruction-key' },
    { id: 'reconstruction-3', timestamp: { en: '5:52 PM', ru: '17:52' }, text: { en: 'She carries the violin along the service route to the workshop.', ru: 'Она несёт скрипку по служебному проходу в мастерскую.' }, sceneId: 'reconstruction-cart' },
    { id: 'reconstruction-4', timestamp: { en: '5:56 PM', ru: '17:56' }, text: { en: 'Vera covers the instrument on the dry repair bench, then returns the key.', ru: 'Вера накрывает инструмент на сухом верстаке и возвращает ключ.' }, sceneId: 'reconstruction-workshop' },
    { id: 'reconstruction-5', timestamp: { en: '6:10 PM', ru: '18:10' }, text: { en: 'The concert can begin; the violin is safe, and Vera can explain the delayed repair.', ru: 'Концерт может начаться: скрипка цела, а Вера может объяснить задержку ремонта.' }, sceneId: 'reconstruction-concert' },
  ],
  renderScene: renderVanishingViolinScene,
  renderReconstruction: renderVanishingViolinReconstruction,
}
