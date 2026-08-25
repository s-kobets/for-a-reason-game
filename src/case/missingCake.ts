import type { CaseDefinition } from './types';
import { renderMissingCakeReconstruction, renderMissingCakeScene } from './missingCakeArtwork';

const locationNames = {
  kitchen: { en: 'Kitchen', ru: 'Кухня' },
  'living-room': { en: 'Living Room', ru: 'Гостиная' },
  garden: { en: 'Garden', ru: 'Сад' },
  corridor: { en: 'Corridor', ru: 'Коридор' },
  shed: { en: 'Shed', ru: 'Сарай' },
};
const characterNames = {
  petya: { en: 'Petya', ru: 'Петя' },
  anya: { en: 'Anya', ru: 'Аня' },
  boris: { en: 'Boris', ru: 'Борис' },
  mira: { en: 'Mira', ru: 'Мира' },
};

export const missingCakeCase: CaseDefinition = {
  id: 'missing-cake',
  title: { en: 'The Missing Cake', ru: 'Пропавший торт' },
  introduction: {
    en: 'The birthday cake vanished before the family celebration. Find out where it went.',
    ru: 'Праздничный торт исчез перед семейным праздником. Узнайте, куда он делся.',
  },
  initialLocationId: 'kitchen',
  initiallyOpenedLocationIds: ['kitchen', 'living-room', 'garden', 'corridor'],
  locations: [
    {
      id: 'kitchen',
      title: locationNames.kitchen,
      description: { en: 'The cake stand is empty, but the room is not quiet.', ru: 'Подставка для торта пуста, но в комнате не тихо.' },
      sceneId: 'kitchen-diorama',
    },
    {
      id: 'living-room',
      title: locationNames['living-room'],
      description: { en: 'Guests waited here for the celebration to begin.', ru: 'Здесь гости ждали начала праздника.' },
      sceneId: 'living-room-diorama',
    },
    {
      id: 'garden',
      title: locationNames.garden,
      description: { en: 'Rain has left the path soft and muddy.', ru: 'После дождя дорожка стала мягкой и грязной.' },
      sceneId: 'garden-diorama',
    },
    {
      id: 'corridor',
      title: locationNames.corridor,
      description: { en: 'A narrow route connects the rooms to the back door.', ru: 'Узкий проход соединяет комнаты с задней дверью.' },
      sceneId: 'corridor-diorama',
    },
    {
      id: 'shed',
      title: locationNames.shed,
      description: { en: 'A locked-looking shed stands beyond the garden fence.', ru: 'За садовой оградой стоит сарай, похожий на запертый.' },
      sceneId: 'shed-diorama',
      unlockedBy: { kind: 'statement', id: 'petya-admits-shed' },
    },
  ],
  hotspots: [
    {
      id: 'cake-stand', locationId: 'kitchen', placement: { x: 0.65, y: 0.44 }, title: { en: 'Empty cake stand', ru: 'Пустая подставка' },
      description: { en: 'A clean ring of frosting marks where the cake stood.', ru: 'Чистое кольцо крема показывает, где стоял торт.' }, observationId: 'cake-missing',
    },
    {
      id: 'kitchen-window', locationId: 'kitchen', placement: { x: 0.23, y: 0.36 }, title: { en: 'Open window', ru: 'Открытое окно' },
      description: { en: 'The latch is open and the sill has fresh soil on it.', ru: 'Шпингалет открыт, а на подоконнике свежая земля.' }, observationId: 'window-open',
    },
    {
      id: 'muddy-footprints', locationId: 'kitchen', placement: { x: 0.67, y: 0.77 }, title: { en: 'Muddy footprints', ru: 'Грязные следы' },
      description: { en: 'Small prints lead from the window toward the pantry.', ru: 'Небольшие следы ведут от окна к кладовой.' }, observationId: 'footprints-inward',
    },
    {
      id: 'blue-frosting', locationId: 'kitchen', placement: { x: 0.52, y: 0.48 }, title: { en: 'Blue frosting smear', ru: 'След синего крема' },
      description: { en: 'A blue smear catches on the pantry door handle.', ru: 'На ручке кладовой остался синий след.' }, observationId: 'frosting-trail',
    },
    {
      id: 'party-invitation', locationId: 'living-room', placement: { x: 0.67, y: 0.44 }, title: { en: 'Party invitation', ru: 'Приглашение на праздник' },
      description: { en: 'The celebration was planned for four o’clock.', ru: 'Праздник был назначен на четыре часа.' }, observationId: 'party-time',
    },
    {
      id: 'wet-umbrella', locationId: 'living-room', placement: { x: 0.88, y: 0.35 }, title: { en: 'Wet umbrella', ru: 'Мокрый зонт' },
      description: { en: 'Rain stopped shortly before the cake disappeared.', ru: 'Дождь закончился незадолго до исчезновения торта.' }, observationId: 'recent-rain',
    },
    {
      id: 'garden-path', locationId: 'garden', placement: { x: 0.46, y: 0.72 }, title: { en: 'Garden path', ru: 'Садовая дорожка' },
      description: { en: 'The same small shoe prints cross the wet soil.', ru: 'Такие же небольшие следы пересекают мокрую землю.' }, observationId: 'footprints-outward',
    },
    {
      id: 'broken-stem', locationId: 'garden', placement: { x: 0.24, y: 0.64 }, title: { en: 'Broken flower stem', ru: 'Сломанный стебель' },
      description: { en: 'Something brushed past the flower bed recently.', ru: 'Кто-то недавно задел клумбу.' }, observationId: 'garden-disturbance',
    },
    {
      id: 'garden-lantern', locationId: 'garden', placement: { x: 0.85, y: 0.4 }, title: { en: 'Garden lantern', ru: 'Садовый фонарь' },
      description: { en: 'Its glass is dusty and its wick is untouched.', ru: 'Стекло пыльное, фитиль не трогали.' }, decorative: true,
    },
    {
      id: 'scarf-thread', locationId: 'corridor', placement: { x: 0.76, y: 0.39 }, title: { en: 'Blue scarf thread', ru: 'Нитка синего шарфа' },
      description: { en: 'A bright blue thread is caught on the window latch.', ru: 'Яркая синяя нитка зацепилась за шпингалет.' }, observationId: 'scarf-thread', falseLead: { en: 'It could be from any blue garment, but Petya wears a matching scarf.', ru: 'Она могла попасть от любой синей одежды, но Петя носит такой шарф.' }, falseLeadEvidenceIds: ['mira-blue-scarf'],
    },
    {
      id: 'back-door', locationId: 'corridor', placement: { x: 0.5, y: 0.48 }, title: { en: 'Back door', ru: 'Задняя дверь' },
      description: { en: 'Dust on the threshold is unbroken.', ru: 'Пыль на пороге не потревожена.' }, observationId: 'door-unused',
    },
    {
      id: 'shed-latch', locationId: 'shed', placement: { x: 0.55, y: 0.68 }, title: { en: 'Shed latch', ru: 'Задвижка сарая' },
      description: { en: 'The latch has a fresh blue frosting mark.', ru: 'На задвижке свежий след синего крема.' }, observationId: 'shed-frosting',
    },
    {
      id: 'hidden-cake', locationId: 'shed', placement: { x: 0.3, y: 0.69 }, title: { en: 'Covered cake', ru: 'Накрытый торт' },
      description: { en: 'The missing cake is safe under a clean cloth.', ru: 'Пропавший торт цел и спрятан под чистой тканью.' }, observationId: 'cake-in-shed',
    },
    {
      id: 'pantry-dust', locationId: 'kitchen', placement: { x: 0.48, y: 0.34 }, title: { en: 'Pantry shelf', ru: 'Полка кладовой' },
      description: { en: 'A dust-free strip shows where the cake box brushed past.', ru: 'Чистая полоса пыли показывает, где прошла коробка с тортом.' }, observationId: 'pantry-route',
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
    { id: 'pantry-route', kind: 'observation', text: { en: 'The cake box brushed the pantry shelf on its way out.', ru: 'Коробка с тортом задела полку кладовой по пути.' } },
    { id: 'petya-denies-garden', kind: 'statement', statementId: 'petya-denies-garden' },
    { id: 'anya-saw-petya', kind: 'statement', statementId: 'anya-saw-petya' },
    { id: 'boris-heard-window', kind: 'statement', statementId: 'boris-heard-window' },
    { id: 'mira-rain-time', kind: 'statement', statementId: 'mira-rain-time' },
    { id: 'petya-admits-shed', kind: 'statement', statementId: 'petya-admits-shed' },
    { id: 'petya-admits-window', kind: 'statement', statementId: 'petya-admits-window' },
    { id: 'petya-surprise', kind: 'statement', statementId: 'petya-surprise' },
    { id: 'anya-shed-key', kind: 'statement', statementId: 'anya-shed-key' },
    { id: 'boris-no-cake', kind: 'statement', statementId: 'boris-no-cake' },
    { id: 'mira-blue-scarf', kind: 'statement', statementId: 'mira-blue-scarf' },
  ],
  characters: [
    {
      id: 'anya', locationId: 'living-room', placement: { x: 0.35, y: 0.48 }, name: characterNames.anya, role: { en: 'the birthday host', ru: 'хозяйка праздника' },
      questions: [
        { id: 'ask-anya-before', text: { en: 'Who was near the kitchen?', ru: 'Кто был возле кухни?' }, responseStatementIds: ['anya-saw-petya'] },
        { id: 'ask-anya-shed', text: { en: 'Who could open the shed?', ru: 'Кто мог открыть сарай?' }, requires: [{ kind: 'statement', id: 'petya-admits-window' }], responseStatementIds: ['anya-shed-key'] },
      ],
    },
    {
      id: 'boris', locationId: 'corridor', placement: { x: 0.74, y: 0.52 }, name: characterNames.boris, role: { en: 'the neighbor', ru: 'сосед' },
      questions: [
        { id: 'ask-boris-window', text: { en: 'What did you hear?', ru: 'Что вы слышали?' }, responseStatementIds: ['boris-heard-window'] },
        { id: 'ask-boris-kitchen', text: { en: 'Was anyone eating cake?', ru: 'Кто-нибудь ел торт?' }, responseStatementIds: ['boris-no-cake'] },
      ],
    },
    {
      id: 'mira', locationId: 'garden', placement: { x: 0.58, y: 0.45 }, name: characterNames.mira, role: { en: 'the gardener', ru: 'садовница' },
      questions: [
        { id: 'ask-mira-rain', text: { en: 'When did the rain stop?', ru: 'Когда закончился дождь?' }, responseStatementIds: ['mira-rain-time'] },
        { id: 'ask-mira-scarf', text: { en: 'Did you notice anything unusual?', ru: 'Вы заметили что-нибудь необычное?' }, requires: [{ kind: 'hotspot', id: 'scarf-thread' }], responseStatementIds: ['mira-blue-scarf'] },
      ],
    },
    {
      id: 'petya', locationId: 'kitchen', placement: { x: 0.86, y: 0.58 }, name: characterNames.petya, role: { en: 'the younger brother', ru: 'младший брат' },
      questions: [
        { id: 'ask-petya-garden', text: { en: 'Were you in the garden?', ru: 'Ты был в саду?' }, responseStatementIds: ['petya-denies-garden'] },
        { id: 'ask-petya-cake', text: { en: 'What happened to the cake?', ru: 'Что случилось с тортом?' }, requires: [{ kind: 'deduction', id: 'petya-likely-took-cake' }, { kind: 'statement', id: 'petya-admits-window' }], responseStatementIds: ['petya-admits-shed', 'petya-surprise'], unlockLocationIds: ['shed'] },
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
    { id: 'fresh-footprints', prompt: { en: 'When were the tracks made?', ru: 'Когда появились следы?' }, title: { en: 'The tracks are recent', ru: 'Следы свежие' }, text: { en: 'Rain timing and soft mud place the tracks after the shower.', ru: 'Время дождя и мягкая грязь показывают, что следы оставили после ливня.' }, requiresEvidenceIds: ['footprints-inward', 'recent-rain'] },
    { id: 'window-route', prompt: { en: 'How did the cake leave?', ru: 'Как вынесли торт?' }, title: { en: 'The cake left through the window', ru: 'Торт вынесли через окно' }, text: { en: 'The open latch, inward tracks, and untouched back door form one route.', ru: 'Открытый шпингалет, следы и нетронутая задняя дверь указывают на один путь.' }, requiresEvidenceIds: ['window-open', 'footprints-inward', 'door-unused'] },
    { id: 'petya-likely-took-cake', prompt: { en: 'Who handled the cake?', ru: 'Кто переносил торт?' }, title: { en: 'Petya handled the cake', ru: 'Петя взял торт' }, text: { en: 'Petya’s thread, Anya’s sighting, and the false denial place him at the window.', ru: 'Нитка Пети, слова Ани и ложное отрицание помещают его у окна.' }, requiresEvidenceIds: ['scarf-thread', 'anya-saw-petya', 'petya-denies-garden'] },
    { id: 'shed-destination', prompt: { en: 'Where did the cake go?', ru: 'Куда отнесли торт?' }, title: { en: 'The shed is the destination', ru: 'Место назначения — сарай' }, text: { en: 'The frosting trail ends at the shed, where the intact cake is found.', ru: 'След крема заканчивается у сарая, где найден целый торт.' }, requiresEvidenceIds: ['shed-frosting', 'cake-in-shed'] },
  ],
  contradictions: [{
    id: 'petya-garden-contradiction', title: { en: 'Petya’s story does not fit', ru: 'История Пети не сходится' },
    prompt: { en: 'Show Petya the footprint chain and his scarf thread.', ru: 'Покажите Пете цепочку следов и нитку его шарфа.' },
    evidenceIds: ['footprints-outward', 'scarf-thread'], initialStatementId: 'petya-denies-garden', revealedStatementId: 'petya-admits-window',
  }],
  theoryFields: [
    { id: 'person', prompt: { en: 'Who?', ru: 'Кто?' },
      value: 'petya',
      options: [
        { id: 'petya', label: characterNames.petya },
        { id: 'anya', label: characterNames.anya },
        { id: 'boris', label: characterNames.boris },
        { id: 'mira', label: characterNames.mira },
      ],
      evidenceIds: ['scarf-thread', 'anya-saw-petya']
    },
    { id: 'origin', prompt: { en: 'Where did he come from?', ru: 'Откуда он пришёл?' },
      value: 'garden',
      options: [
        { id: 'kitchen', label: locationNames.kitchen },
        { id: 'living-room', label: locationNames['living-room'] },
        { id: 'garden', label: locationNames.garden },
      ],
      evidenceIds: ['footprints-inward', 'footprints-outward']
    },
    { id: 'entryMethod', prompt: { en: 'How did he enter?', ru: 'Как он вошёл?' },
      value: 'window',
      options: [
        { id: 'window', label: { en: 'Through the kitchen window', ru: 'Через кухонное окно' } },
        { id: 'back-door', label: { en: 'Through the back door', ru: 'Через заднюю дверь' } },
        { id: 'front-door', label: { en: 'Through the front door', ru: 'Через входную дверь' } },
      ],
      evidenceIds: ['window-open', 'footprints-inward', 'door-unused']
    },
    { id: 'event', prompt: { en: 'What happened?', ru: 'Что произошло?' },
      value: 'moved-to-shed',
      options: [
        { id: 'moved-to-shed', label: { en: 'Moved it to the shed', ru: 'Перенёс его в сарай' } },
        { id: 'ate-it', label: { en: 'Ate it', ru: 'Съел его' } },
        { id: 'left-it-outside', label: { en: 'Left it outside', ru: 'Оставил его снаружи' } },
      ],
      evidenceIds: ['shed-frosting', 'cake-in-shed']
    },
    { id: 'motive', prompt: { en: 'Why?', ru: 'Зачем?' },
      value: 'surprise',
      options: [
        { id: 'surprise', label: { en: 'Protect a surprise', ru: 'Сохранить сюрприз' } },
        { id: 'hunger', label: { en: 'Get a snack', ru: 'Перекусить' } },
        { id: 'prank', label: { en: 'Play a prank', ru: 'Устроить розыгрыш' } },
      ],
      evidenceIds: ['petya-surprise', 'anya-shed-key']
    },
  ],
  reconstruction: [
    { id: 'reconstruction-1', timestamp: { en: '3:35 PM', ru: '15:35' }, text: { en: 'After the rain, Petya crosses the garden with a secret plan.', ru: 'После дождя Петя пересекает сад с тайным планом.' }, sceneId: 'reconstruction-garden' },
    { id: 'reconstruction-2', timestamp: { en: '3:40 PM', ru: '15:40' }, text: { en: 'He enters the kitchen through the open window.', ru: 'Он входит на кухню через открытое окно.' }, sceneId: 'reconstruction-window' },
    { id: 'reconstruction-3', timestamp: { en: '3:42 PM', ru: '15:42' }, text: { en: 'Petya lifts the whole cake from its stand.', ru: 'Петя снимает целый торт с подставки.' }, sceneId: 'reconstruction-cake' },
    { id: 'reconstruction-4', timestamp: { en: '3:45 PM', ru: '15:45' }, text: { en: 'He follows the pantry route and carries it to the shed.', ru: 'Он идёт через кладовую и несёт его в сарай.' }, sceneId: 'reconstruction-shed' },
    { id: 'reconstruction-5', timestamp: { en: '4:00 PM', ru: '16:00' }, text: { en: 'The cake waits safely for Petya’s surprise reveal.', ru: 'Торт целым ждёт сюрприза Пети.' }, sceneId: 'reconstruction-reveal' },
  ],
  renderScene: renderMissingCakeScene,
  renderReconstruction: renderMissingCakeReconstruction,
};
