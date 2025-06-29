export const maps = [
  {
    name: "Clearwater Springs",
    info: "Map 1 – Clearwater Springs",
    image: "/deploys/1 - Mapa.png",
  },
  {
    name: "Ancient Fortifications",
    info: "Map 2 – Ancient Fortifications",
    image: "/deploys/2 - Mapa.png",
  },
  {
    name: "Dormant Caldera",
    info: "Map 3 – Dormant Caldera",
    image: "/deploys/3 - Mapa.png",
  },
  {
    name: "Abandoned Settlement",
    info: "Map 4 – Abandoned Settlement",
    image: "/deploys/4 - Mapa.png",
  },
  {
    name: "Historic Battlefield",
    info: "Map 5 – Historic Battlefield",
    image: "/deploys/5 - Mapa.png",
  },
  {
    name: "Mountainous Crags",
    info: "Map 6 – Mountainous Crags",
    image: "/deploys/6 - Mapa.png",
  },
];

export const deployments = [
  {
    name: "Frontline Clash",
    info: "Deployment 1 – Frontline Clash",
    image: "/deploys/1 - Despliegue.png",
  },
  {
    name: "Bottleneck",
    info: "Deployment 2 – Bottleneck",
    image: "/deploys/2 - Despliegue.png",
  },
  {
    name: "Spearhead",
    info: "Deployment 3 – Spearhead",
    image: "/deploys/3 - Despliegue.png",
  },
  {
    name: "Mutual Encroachment",
    info: "Deployment 4 – Mutual Encroachment",
    image: "/deploys/4 - Despliegue.png",
  },
  {
    name: "Refused Flank",
    info: "Deployment 5 – Refused Flank",
    image: "/deploys/5 - Despliegue.png",
  },
  {
    name: "Cornerstone",
    info: "Deployment 6 – Cornerstone",
    image: "/deploys/6 - Despliegue.png",
  },
];


export const primaries = [
  {
    name: "Spoils of War",
    info: `Preparación: No requiere.

Reglas:
Cuando una unidad Scoring enemiga es destruida en combate, el jugador que la destruyó coloca un token de botín en una de sus unidades Scoring que participó en ese combate.
La unidad pierde todos los tokens si:
- Pierde su último punto de vida.
- Se desmoraliza (por ejemplo, al huir).

Victoria:
Quien tenga más tokens de botín al final del juego gana el objetivo.`
  },
  {
    name: "Breakthrough",
    info: `Preparación: Marcar las zonas de despliegue.

Reglas: Ninguna adicional.

Victoria:
Al final del juego, cada jugador suma:
- Sus unidades Scoring en la zona de despliegue enemiga.
- Las unidades Scoring enemigas destruidas en combate.
Quien tenga el total más alto gana el objetivo.`
  },
  {
    name: "Secure Target",
    info: `Preparación: Colocar dos marcadores en la línea media del campo, uno a cada lado del centro, a 12” de los bordes cortos y 48” entre ellos.

Reglas:
Un marcador se controla si una unidad Scoring está a 6” de su centro y no hay enemigos en esa área.

Victoria:
Al final de cada turno (turnos 3 a 6), se otorgan puntos al jugador por cada objetivo que controle.
Gana quien tenga más puntos al final.`
  },
  {
    name: "Forage and Plunder",
    info: `Preparación: Elegir 3 elementos de terreno (no muros ni terreno impasable). Estos serán:
- El más cercano al centro.
- El más cercano al oponente.
- Cada jugador selecciona uno fuera de su zona de despliegue.

Reglas:
Una unidad Scoring saquea un elemento al comenzar un turno (3 a 6) en contacto con él.
Cada jugador puede saquear cada elemento una vez.

Victoria:
Gana quien haya saqueado más elementos al final.`
  },
  {
    name: "Hold the Centre",
    info: `Preparación: Ninguna.

Reglas:
El centro se controla si se tienen más unidades Scoring dentro de 9” del centro.
Si hay empate, nadie lo controla.

Victoria:
Al final de los turnos 3 a 6, se otorgan puntos al jugador que controle el centro.
Gana quien tenga más puntos al final.`
  },
  {
    name: "Hidden Agendas",
    info: `Preparación: Ninguna.

Reglas:
Cada jugador selecciona aleatoriamente dos Objetivos Secundarios, siguiendo las reglas de selección normal.
Por cada objetivo secundario cumplido, el jugador gana 2 puntos de batalla y su oponente pierde 2 puntos de batalla.

Victoria:
Se reemplaza la puntuación normal de objetivos primarios y secundarios.`
  }
];

export const secondaries = [
  {
    name: "Capture the Flags",
    info: `Preparación: Ninguna.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, gana quien tenga más Portaestandartes y Portaestandartes de Batalla sobre el campo que el oponente.`
  },
  {
    name: "Commit to Battle",
    info: `Preparación: Ninguna.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, gana quien tenga más unidades Scoring en la zona de despliegue del oponente que el oponente en su propia zona.`
  },
  {
    name: "Demonstrate Superiority",
    info: `Preparación: El oponente nomina las dos unidades Scoring más caras de su ejército.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, gana quien logre que al menos una unidad nominada esté Destruida, Diezmada, Sacudida o tocando su propia zona de despliegue.`
  },
  {
    name: "Enslave and Ransom",
    info: `Preparación: Ninguna.

Reglas:
Ganas un Contador de Esclavitud cada vez que destruyes una unidad enemiga en combate cuerpo a cuerpo.
Si la unidad es destruida al huir o al ser alcanzada tras una persecución, ganas un contador adicional.

Condiciones de Victoria:
Al final del juego, gana quien tenga al menos 4 Contadores de Esclavitud.`
  },
  {
    name: "Forbid Trespass",
    info: `Preparación: Nominas un Elemento de Terreno fuera de tu zona de despliegue.

Reglas:
Un Elemento de Terreno queda saqueado si una unidad Scoring enemiga inicia alguno de sus turnos (3–6) en contacto con él.

Condiciones de Victoria:
Al final del juego, ganas si el Elemento de Terreno nominado no fue saqueado.`
  },
  {
    name: "Master the Veil",
    info: `Preparación: Marca el centro del campo.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si tienes un modelo con Canalizar o que use un hechizo a 9” del centro del campo, y tu oponente no.`
  },
  {
    name: "Seize and Secure",
    info: `Preparación: El oponente nomina un Elemento de Terreno fuera de su zona de despliegue.

Reglas:
Un Elemento de Terreno queda saqueado si una unidad Scoring amiga inicia alguno de sus turnos (3–6) en contacto con él.

Condiciones de Victoria:
Al final del juego, ganas si saqueaste el Elemento de Terreno nominado.`
  },
  {
    name: "Settle the Score",
    info: `Preparación: Nombra una unidad del ejército del oponente.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si la unidad nominada está Destruida, Diezmada o Sacudida.`
  },
  {
    name: "Slay the Beast",
    info: `Preparación: El oponente nomina las dos unidades más caras que no sean Scoring de su ejército.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si al menos una unidad nominada está Destruida, Diezmada, Sacudida o tocando su propia zona de despliegue.`
  },
  {
    name: "Stand Firm",
    info: `Preparación: El oponente nomina dos unidades de Línea del ejército propio, preferiblemente Scoring.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si ambas unidades nominadas no están Destruidas, Diezmadas o Sacudidas.`
  },
  {
    name: "Unleash the Big Guns",
    info: `Preparación: Nomina dos Elementos de Terreno fuera de tu zona de despliegue. Marca todas las unidades no Scoring con armas de disparo y una unidad Scoring sin armas de disparo de tu ejército.
Si tienes menos de 6 unidades marcadas, puedes marcar una unidad adicional Scoring.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si tienes una unidad marcada no Sacudida en ambos Elementos de Terreno nominados.`
  },
  {
    name: "Work as One",
    info: `Preparación: Marca el centro del campo.

Reglas: Ninguna.

Condiciones de Victoria:
Al final del juego, ganas si tienes más unidades Scoring a 9” del centro del campo que tu oponente.`
  }
];

export const armySecondaryMap = {
  "Beast Herds": ["Capture the Flags", "Commit to Battle", "Forbid Trespass"],
  "Dread Elves": [
    "Capture the Flags",
    "Demonstrate Superiority",
    "Enslave and Ransom"
  ],
  "Dwarven Holds": [
    "Capture the Flags",
    "Enslave and Ransom",
    "Stand Firm"
  ],
  "Daemon Legions": [
    "Capture the Flags",
    "Master the Veil",
    "Unleash the Big Guns"
  ],
  "Daemons of Change": [
    "Capture the Flags",
    "Master the Veil",
    "Unleash the Big Guns"
  ],
  "Empire of Sonnstahl": [
    "Demonstrate Superiority",
    "Master the Veil",
    "Unleash the Big Guns"
  ],
  "Highborn Elves": [
    "Enslave and Ransom",
    "Master the Veil",
    "Stand Firm"
  ],
  "Kingdom of Equitaine": [
    "Demonstrate Superiority",
    "Forbid Trespass",
    "Settle the Score"
  ],
  "Infernal Dwarves": [
    "Commit to Battle",
    "Settle the Score",
    "Slay the Beast"
  ],
  "Ogre Khans": [
    "Enslave and Ransom",
    "Seize and Secure",
    "Slay the Beast"
  ],
  "Orcs and Goblins": [
    "Capture the Flags",
    "Commit to Battle",
    "Seize and Secure"
  ],
  "Saurian Ancients": [
    "Forbid Trespass",
    "Stand Firm",
    "Unleash the Big Guns"
  ],
  "Sylvan Elves": ["Settle the Score", "Slay the Beast", "Work as One"],
  "Undying Dynasties": [
    "Master the Veil",
    "Settle the Score",
    "Work as One"
  ],
  "Vampire Covenant": [
    "Master the Veil",
    "Slay the Beast",
    "Work as One"
  ],
  "Vermin Swarm": [
    "Commit to Battle",
    "Demonstrate Superiority",
    "Work as One"
  ],
  "Warriors of the Dark Gods": [
    "Commit to Battle",
    "Demonstrate Superiority",
    "Unleash the Big Guns"
  ]
};

export const armies = [
  "Beast Herds",
  "Dread Elves",
  "Dwarven Holds",
  "Daemon Legions",
  "Daemons of Change",
  "Empire of Sonnstahl",
  "Highborn Elves",
  "Kingdom of Equitaine",
  "Infernal Dwarves",
  "Ogre Khans",
  "Orcs and Goblins",
  "Saurian Ancients",
  "Sylvan Elves",
  "Undying Dynasties",
  "Vampire Covenant",
  "Vermin Swarm",
  "Warriors of the Dark Gods"
];

const magicOptions = [
  { value: 1, label: '1 - 4 Magic Dice' },
  { value: 2, label: '2 - 5 Magic Dice' },
  { value: 3, label: '3 - 6 Magic Dice' },
  { value: 4, label: '4 - 6 Magic Dice' },
  { value: 5, label: '5 - 5 Magic Dice' },
  { value: 6, label: '6 - 5 Magic Dice' },
  { value: 7, label: '7 - 6 Magic Dice' },
  { value: 8, label: '8 - 7 Magic Dice' }
];

