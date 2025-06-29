export const maps = [
  { name: "Clearwater Springs", info: "Map 1 – Clearwater Springs" },
  { name: "Ancient Fortifications", info: "Map 2 – Ancient Fortifications" },
  { name: "Dormant Caldera", info: "Map 3 – Dormant Caldera" },
  { name: "Abandoned Settlement", info: "Map 4 – Abandoned Settlement" },
  { name: "Historic Battlefield", info: "Map 5 – Historic Battlefield" },
  { name: "Mountainous Crags", info: "Map 6 – Mountainous Crags" }
];

export const deployments = [
  { name: "Frontline Clash" },
  { name: "Bottleneck" },
  { name: "Spearhead" },
  { name: "Mutual Encroachment" },
  { name: "Refused Flank" },
  { name: "Cornerstone" }
];

export const primaries = [
  { name: "Spoils of War", info: "Cuando destruyes unidades enemigas, acumulas tokens..." },
  { name: "Breakthrough", info: "Controla la zona de despliegue enemiga al final." },
  { name: "Secure Target", info: "Controla los objetivos colocados en la línea central." },
  { name: "Forage and Plunder", info: "Plundear terrenos estratégicos en el campo de batalla." },
  { name: "Hold the Centre", info: "Controlar el centro del campo de batalla." },
  { name: "Hidden Agendas", info: "Objetivos secundarios aleatorios, puntaje secreto." }
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

