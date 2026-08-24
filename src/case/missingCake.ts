import type { CaseDefinition } from './types';

export const missingCakeCase: CaseDefinition = {
  id: 'missing-cake',
  title: { en: 'The Missing Cake', ru: 'Пропавший торт' },
  introduction: {
    en: 'The birthday cake vanished before the family celebration. Find out where it went.',
    ru: 'Праздничный торт исчез перед семейным праздником. Узнайте, куда он делся.',
  },
  locations: [
    {
      id: 'kitchen',
      title: { en: 'Kitchen', ru: 'Кухня' },
      description: { en: 'The cake stand is empty, but the room is not quiet.', ru: 'Подставка для торта пуста, но в комнате не тихо.' },
      sceneId: 'kitchen-diorama',
    },
    {
      id: 'living-room',
      title: { en: 'Living Room', ru: 'Гостиная' },
      description: { en: 'Guests waited here for the celebration to begin.', ru: 'Здесь гости ждали начала праздника.' },
      sceneId: 'living-room-diorama',
    },
    {
      id: 'garden',
      title: { en: 'Garden', ru: 'Сад' },
      description: { en: 'Rain has left the path soft and muddy.', ru: 'После дождя дорожка стала мягкой и грязной.' },
      sceneId: 'garden-diorama',
    },
    {
      id: 'corridor',
      title: { en: 'Corridor', ru: 'Коридор' },
      description: { en: 'A narrow route connects the rooms to the back door.', ru: 'Узкий проход соединяет комнаты с задней дверью.' },
      sceneId: 'corridor-diorama',
    },
    {
      id: 'shed',
      title: { en: 'Shed', ru: 'Сарай' },
      description: { en: 'A locked-looking shed stands beyond the garden fence.', ru: 'За садовой оградой стоит сарай, похожий на запертый.' },
      sceneId: 'shed-diorama',
      unlockedBy: { kind: 'statement', id: 'petya-admits-shed' },
    },
  ],
  hotspots: [
    {
      id: 'cake-stand', locationId: 'kitchen', title: { en: 'Empty cake stand', ru: 'Пустая подставка' },
      description: { en: 'A clean ring of frosting marks where the cake stood.', ru: 'Чистое кольцо крема показывает, где стоял торт.' }, observationId: 'cake-missing',
    },
    {
      id: 'kitchen-window', locationId: 'kitchen', title: { en: 'Open window', ru: 'Открытое окно' },
      description: { en: 'The latch is open and the sill has fresh soil on it.', ru: 'Шпингалет открыт, а на подоконнике свежая земля.' }, observationId: 'window-open',
    },
    {
      id: 'muddy-footprints', locationId: 'kitchen', title: { en: 'Muddy footprints', ru: 'Грязные следы' },
      description: { en: 'Small prints lead from the window toward the pantry.', ru: 'Небольшие следы ведут от окна к кладовой.' }, observationId: 'footprints-inward',
    },
    {
      id: 'blue-frosting', locationId: 'kitchen', title: { en: 'Blue frosting smear', ru: 'След синего крема' },
      description: { en: 'A blue smear catches on the pantry door handle.', ru: 'На ручке кладовой остался синий след.' }, observationId: 'frosting-trail',
    },
    {
      id: 'party-invitation', locationId: 'living-room', title: { en: 'Party invitation', ru: 'Приглашение на праздник' },
      description: { en: 'The celebration was planned for four o’clock.', ru: 'Праздник был назначен на четыре часа.' }, observationId: 'party-time',
    },
    {
      id: 'wet-umbrella', locationId: 'living-room', title: { en: 'Wet umbrella', ru: 'Мокрый зонт' },
      description: { en: 'Rain stopped shortly before the cake disappeared.', ru: 'Дождь закончился незадолго до исчезновения торта.' }, observationId: 'recent-rain',
    },
    {
      id: 'garden-path', locationId: 'garden', title: { en: 'Garden path', ru: 'Садовая дорожка' },
      description: { en: 'The same small shoe prints cross the wet soil.', ru: 'Такие же небольшие следы пересекают мокрую землю.' }, observationId: 'footprints-outward',
    },
    {
      id: 'broken-stem', locationId: 'garden', title: { en: 'Broken flower stem', ru: 'Сломанный стебель' },
      description: { en: 'Something brushed past the flower bed recently.', ru: 'Кто-то недавно задел клумбу.' }, observationId: 'garden-disturbance',
    },
    {
      id: 'garden-lantern', locationId: 'garden', title: { en: 'Garden lantern', ru: 'Садовый фонарь' },
      description: { en: 'Its glass is dusty and its wick is untouched.', ru: 'Стекло пыльное, фитиль не трогали.' }, decorative: true,
    },
    {
      id: 'scarf-thread', locationId: 'corridor', title: { en: 'Blue scarf thread', ru: 'Нитка синего шарфа' },
      description: { en: 'A bright blue thread is caught on the window latch.', ru: 'Яркая синяя нитка зацепилась за шпингалет.' }, observationId: 'scarf-thread', falseLead: { en: 'It could be from any blue garment, but Petya wears a matching scarf.', ru: 'Она могла попасть от любой синей одежды, но Петя носит такой шарф.' },
    },
    {
      id: 'back-door', locationId: 'corridor', title: { en: 'Back door', ru: 'Задняя дверь' },
      description: { en: 'Dust on the threshold is unbroken.', ru: 'Пыль на пороге не потревожена.' }, observationId: 'door-unused',
    },
    {
      id: 'shed-latch', locationId: 'shed', title: { en: 'Shed latch', ru: 'Задвижка сарая' },
      description: { en: 'The latch has a fresh blue frosting mark.', ru: 'На задвижке свежий след синего крема.' }, observationId: 'shed-frosting',
    },
    {
      id: 'hidden-cake', locationId: 'shed', title: { en: 'Covered cake', ru: 'Накрытый торт' },
      description: { en: 'The missing cake is safe under a clean cloth.', ru: 'Пропавший торт цел и спрятан под чистой тканью.' }, observationId: 'cake-in-shed',
    },
  ],
  evidence: [
    { id: 'cake-missing', kind: 'observation', text: { en: 'The cake was lifted from its stand, not eaten there.', ru: 'Торт сняли с подставки, а не съели на месте.' } },
    { id: 'window-open', kind: 'observation', text: { en: 'The kitchen window was used recently.', ru: 'Кухонным окном недавно воспользовались.' } },
    { id: 'footprints-inward', kind: 'observation', text: { en: 'Small muddy prints lead into the kitchen.', ru: 'Небольшие грязные следы ведут на кухню.' } },
    { id: 'frosting-trail', kind: 'observation', text: { en: 'Blue frosting marks the route to the pantry.', ru: 'Синий крем отмечает путь к кладовой.' } },
    { id: 'party-time', kind: 'observation', text: { en: 'The cake vanished shortly before four o’clock.', ru: 'Торт исчез незадолго до четырёх часов.' } },
    { id: 'recent-rain', kind: 'observation', text: { en: 'Rain made the footprints too fresh to be old tracks.', ru: 'Из-за дождя следы слишком свежие, чтобы быть старыми.' } },
    { id: 'footprints-outward', kind: 'observation', text: { en: 'The matching prints continue from the garden to the window.', ru: 'Такие же следы идут из сада к окну.' } },
    { id: 'garden-disturbance', kind: 'observation', text: { en: 'Someone crossed the flower bed while carrying something.', ru: 'Кто-то пересёк клумбу, неся что-то.' } },
    { id: 'scarf-thread', kind: 'observation', text: { en: 'A blue scarf thread links the window to Petya.', ru: 'Синяя нитка связывает окно с Петей.' } },
    { id: 'door-unused', kind: 'observation', text: { en: 'The back door was not the route out.', ru: 'Задняя дверь не была выходом.' } },
    { id: 'shed-frosting', kind: 'observation', text: { en: 'The frosting trail ends at the shed.', ru: 'След крема заканчивается у сарая.' } },
    { id: 'cake-in-shed', kind: 'observation', text: { en: 'The cake was moved intact to the shed.', ru: 'Торт целым перенесли в сарай.' } },
    { id: 'petya-denies-garden', kind: 'statement', text: { en: 'Petya says he never went into the garden.', ru: 'Петя говорит, что не ходил в сад.' } },
    { id: 'anya-saw-petya', kind: 'statement', text: { en: 'Anya saw Petya near the kitchen before the alarm.', ru: 'Аня видела Петю возле кухни до тревоги.' } },
    { id: 'boris-heard-window', kind: 'statement', text: { en: 'Boris heard the kitchen window click shut.', ru: 'Борис слышал, как закрылось кухонное окно.' } },
    { id: 'mira-rain-time', kind: 'statement', text: { en: 'Mira says the rain stopped at three thirty.', ru: 'Мира говорит, что дождь закончился в половине четвёртого.' } },
    { id: 'petya-admits-shed', kind: 'statement', text: { en: 'Petya admits he took the cake to the shed.', ru: 'Петя признаётся, что отнёс торт в сарай.' } },
    { id: 'petya-admits-window', kind: 'statement', text: { en: 'Petya admits entering through the kitchen window.', ru: 'Петя признаётся, что вошёл через кухонное окно.' } },
    { id: 'petya-surprise', kind: 'statement', text: { en: 'Petya moved the cake to keep his surprise safe.', ru: 'Петя перенёс торт, чтобы сохранить сюрприз.' } },
    { id: 'anya-shed-key', kind: 'statement', text: { en: 'Anya says Petya had the shed key for decorations.', ru: 'Аня говорит, что у Пети был ключ от сарая для украшений.' } },
    { id: 'boris-no-cake', kind: 'statement', text: { en: 'Boris confirms nobody ate cake in the kitchen.', ru: 'Борис подтверждает, что на кухне никто не ел торт.' } },
    { id: 'mira-blue-scarf', kind: 'statement', text: { en: 'Mira noticed Petya’s blue scarf was snagged.', ru: 'Мира заметила, что синий шарф Пети зацепился.' } },
  ],
  characters: [
    {
      id: 'anya', name: { en: 'Anya', ru: 'Аня' }, role: { en: 'the birthday host', ru: 'хозяйка праздника' },
      questions: [
        { id: 'ask-anya-before', text: { en: 'Who was near the kitchen?', ru: 'Кто был возле кухни?' }, responseStatementIds: ['anya-saw-petya'] },
        { id: 'ask-anya-shed', text: { en: 'Who could open the shed?', ru: 'Кто мог открыть сарай?' }, requires: [{ kind: 'statement', id: 'petya-denies-garden' }], responseStatementIds: ['anya-shed-key'], unlockLocationIds: ['shed'] },
      ],
    },
    {
      id: 'boris', name: { en: 'Boris', ru: 'Борис' }, role: { en: 'the neighbor', ru: 'сосед' },
      questions: [
        { id: 'ask-boris-window', text: { en: 'What did you hear?', ru: 'Что вы слышали?' }, responseStatementIds: ['boris-heard-window'] },
        { id: 'ask-boris-kitchen', text: { en: 'Was anyone eating cake?', ru: 'Кто-нибудь ел торт?' }, responseStatementIds: ['boris-no-cake'] },
      ],
    },
    {
      id: 'mira', name: { en: 'Mira', ru: 'Мира' }, role: { en: 'the gardener', ru: 'садовница' },
      questions: [
        { id: 'ask-mira-rain', text: { en: 'When did the rain stop?', ru: 'Когда закончился дождь?' }, responseStatementIds: ['mira-rain-time'] },
        { id: 'ask-mira-scarf', text: { en: 'Did you notice anything unusual?', ru: 'Вы заметили что-нибудь необычное?' }, requires: [{ kind: 'hotspot', id: 'scarf-thread' }], responseStatementIds: ['mira-blue-scarf'] },
      ],
    },
    {
      id: 'petya', name: { en: 'Petya', ru: 'Петя' }, role: { en: 'the younger brother', ru: 'младший брат' },
      questions: [
        { id: 'ask-petya-garden', text: { en: 'Were you in the garden?', ru: 'Ты был в саду?' }, responseStatementIds: ['petya-denies-garden'] },
        { id: 'ask-petya-cake', text: { en: 'What happened to the cake?', ru: 'Что случилось с тортом?' }, requires: [{ kind: 'deduction', id: 'petya-likely-took-cake' }], responseStatementIds: ['petya-admits-window', 'petya-admits-shed', 'petya-surprise'], unlockLocationIds: ['shed'] },
      ],
    },
  ],
  statements: [
    { id: 'petya-denies-garden', speakerId: 'petya', kind: 'initial', text: { en: 'Petya says he never went into the garden.', ru: 'Петя говорит, что не ходил в сад.' } },
    { id: 'anya-saw-petya', speakerId: 'anya', text: { en: 'Anya saw Petya near the kitchen before the alarm.', ru: 'Аня видела Петю возле кухни до тревоги.' } },
    { id: 'boris-heard-window', speakerId: 'boris', text: { en: 'Boris heard the kitchen window click shut.', ru: 'Борис слышал, как закрылось кухонное окно.' } },
    { id: 'mira-rain-time', speakerId: 'mira', text: { en: 'Mira says the rain stopped at three thirty.', ru: 'Мира говорит, что дождь закончился в половине четвёртого.' } },
    { id: 'petya-admits-window', speakerId: 'petya', kind: 'admission', text: { en: 'Petya admits entering through the kitchen window.', ru: 'Петя признаётся, что вошёл через кухонное окно.' } },
    { id: 'petya-admits-shed', speakerId: 'petya', kind: 'admission', text: { en: 'Petya admits he took the cake to the shed.', ru: 'Петя признаётся, что отнёс торт в сарай.' } },
    { id: 'petya-surprise', speakerId: 'petya', kind: 'admission', text: { en: 'Petya moved the cake to keep his surprise safe.', ru: 'Петя перенёс торт, чтобы сохранить сюрприз.' } },
    { id: 'anya-shed-key', speakerId: 'anya', text: { en: 'Anya says Petya had the shed key for decorations.', ru: 'Аня говорит, что у Пети был ключ от сарая для украшений.' } },
    { id: 'boris-no-cake', speakerId: 'boris', text: { en: 'Boris confirms nobody ate cake in the kitchen.', ru: 'Борис подтверждает, что на кухне никто не ел торт.' } },
    { id: 'mira-blue-scarf', speakerId: 'mira', text: { en: 'Mira noticed Petya’s blue scarf was snagged.', ru: 'Мира заметила, что синий шарф Пети зацепился.' } },
  ],
  deductions: [
    { id: 'fresh-footprints', title: { en: 'The tracks are recent', ru: 'Следы свежие' }, text: { en: 'Rain timing and soft mud place the tracks after the shower.', ru: 'Время дождя и мягкая грязь показывают, что следы оставили после ливня.' }, requiresEvidenceIds: ['footprints-inward', 'recent-rain'] },
    { id: 'window-route', title: { en: 'The cake left through the window', ru: 'Торт вынесли через окно' }, text: { en: 'The open latch, inward tracks, and untouched back door form one route.', ru: 'Открытый шпингалет, следы и нетронутая задняя дверь указывают на один путь.' }, requiresEvidenceIds: ['window-open', 'footprints-inward', 'door-unused'] },
    { id: 'petya-likely-took-cake', title: { en: 'Petya handled the cake', ru: 'Петя взял торт' }, text: { en: 'Petya’s thread, Anya’s sighting, and the false denial place him at the window.', ru: 'Нитка Пети, слова Ани и ложное отрицание помещают его у окна.' }, requiresEvidenceIds: ['scarf-thread', 'anya-saw-petya', 'petya-denies-garden'] },
    { id: 'shed-destination', title: { en: 'The shed is the destination', ru: 'Место назначения — сарай' }, text: { en: 'The frosting trail ends at the shed, where the intact cake is found.', ru: 'След крема заканчивается у сарая, где найден целый торт.' }, requiresEvidenceIds: ['shed-frosting', 'cake-in-shed'] },
  ],
  contradiction: {
    id: 'petya-garden-contradiction', title: { en: 'Petya’s story does not fit', ru: 'История Пети не сходится' },
    prompt: { en: 'Show Petya the footprint chain and his scarf thread.', ru: 'Покажите Пете цепочку следов и нитку его шарфа.' },
    evidenceIds: ['footprints-outward', 'scarf-thread'], initialStatementId: 'petya-denies-garden', revealedStatementId: 'petya-admits-window',
  },
  solution: {
    person: { value: 'petya', evidenceIds: ['scarf-thread', 'anya-saw-petya'] },
    origin: { value: 'kitchen', evidenceIds: ['cake-missing'] },
    entryMethod: { value: 'window', evidenceIds: ['window-open', 'footprints-inward', 'door-unused'] },
    event: { value: 'moved-to-shed', evidenceIds: ['shed-frosting', 'cake-in-shed'] },
    motive: { value: 'surprise', evidenceIds: ['petya-surprise', 'anya-shed-key'] },
  },
  reconstruction: [
    { id: 'reconstruction-1', timestamp: { en: '3:35 PM', ru: '15:35' }, text: { en: 'After the rain, Petya crosses the garden with a secret plan.', ru: 'После дождя Петя пересекает сад с тайным планом.' }, sceneId: 'reconstruction-garden' },
    { id: 'reconstruction-2', timestamp: { en: '3:40 PM', ru: '15:40' }, text: { en: 'He enters the kitchen through the open window.', ru: 'Он входит на кухню через открытое окно.' }, sceneId: 'reconstruction-window' },
    { id: 'reconstruction-3', timestamp: { en: '3:42 PM', ru: '15:42' }, text: { en: 'Petya lifts the whole cake from its stand.', ru: 'Петя снимает целый торт с подставки.' }, sceneId: 'reconstruction-cake' },
    { id: 'reconstruction-4', timestamp: { en: '3:45 PM', ru: '15:45' }, text: { en: 'He follows the pantry route and carries it to the shed.', ru: 'Он идёт через кладовую и несёт его в сарай.' }, sceneId: 'reconstruction-shed' },
    { id: 'reconstruction-5', timestamp: { en: '4:00 PM', ru: '16:00' }, text: { en: 'The cake waits safely for Petya’s surprise reveal.', ru: 'Торт целым ждёт сюрприза Пети.' }, sceneId: 'reconstruction-reveal' },
  ],
};
