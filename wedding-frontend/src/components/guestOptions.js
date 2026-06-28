// Essensbesonderheiten
export const DIETARY_OPTIONS = [
  { label: 'Vegetarisch',       value: 'Vegetarisch',       group: 'Ernährungsweise' },
  { label: 'Vegan',             value: 'Vegan',             group: 'Ernährungsweise' },
  { label: 'Pescetarisch',      value: 'Pescetarisch',      group: 'Ernährungsweise' },
  { label: 'Glutenfrei',        value: 'Glutenfrei',        group: 'Unverträglichkeiten' },
  { label: 'Laktoseintolerant', value: 'Laktoseintolerant', group: 'Unverträglichkeiten' },
  { label: 'Nussallergie',      value: 'Nussallergie',      group: 'Allergien' },
  { label: 'Schalentierallergie', value: 'Schalentierallergie', group: 'Allergien' },
  { label: 'Keine',             value: 'Keine',             group: 'Sonstiges' },
]

// Verhältnisse zur Braut
export const RELATIONSHIP_BRIDE = [
  { label: 'Mutter der Braut',   value: 'Mutter der Braut',   group: 'Familie (Braut)' },
  { label: 'Vater der Braut',    value: 'Vater der Braut',    group: 'Familie (Braut)' },
  { label: 'Schwester der Braut',value: 'Schwester der Braut',group: 'Familie (Braut)' },
  { label: 'Bruder der Braut',   value: 'Bruder der Braut',   group: 'Familie (Braut)' },
  { label: 'Großmutter (Braut)', value: 'Großmutter (Braut)', group: 'Familie (Braut)' },
  { label: 'Großvater (Braut)',  value: 'Großvater (Braut)',  group: 'Familie (Braut)' },
  { label: 'Tante (Braut)',      value: 'Tante (Braut)',      group: 'Familie (Braut)' },
  { label: 'Onkel (Braut)',      value: 'Onkel (Braut)',      group: 'Familie (Braut)' },
  { label: 'Cousine (Braut)',    value: 'Cousine (Braut)',    group: 'Familie (Braut)' },
  { label: 'Cousin (Braut)',     value: 'Cousin (Braut)',     group: 'Familie (Braut)' },
  { label: 'Freundin der Braut', value: 'Freundin der Braut', group: 'Freunde (Braut)' },
  { label: 'Freund der Braut',   value: 'Freund der Braut',   group: 'Freunde (Braut)' },
  { label: 'Trauzeugin (Braut)', value: 'Trauzeugin (Braut)', group: 'Freunde (Braut)' },
  { label: 'Trauzeuge (Braut)',  value: 'Trauzeuge (Braut)',  group: 'Freunde (Braut)' },
  { label: 'Kollegin (Braut)',   value: 'Kollegin (Braut)',   group: 'Bekannte (Braut)' },
  { label: 'Kollege (Braut)',    value: 'Kollege (Braut)',    group: 'Bekannte (Braut)' },
]

// Verhältnisse zum Bräutigam
export const RELATIONSHIP_GROOM = [
  { label: 'Mutter des Bräutigams',    value: 'Mutter des Bräutigams',    group: 'Familie (Bräutigam)' },
  { label: 'Vater des Bräutigams',     value: 'Vater des Bräutigams',     group: 'Familie (Bräutigam)' },
  { label: 'Schwester des Bräutigams', value: 'Schwester des Bräutigams', group: 'Familie (Bräutigam)' },
  { label: 'Bruder des Bräutigams',    value: 'Bruder des Bräutigams',    group: 'Familie (Bräutigam)' },
  { label: 'Großmutter (Bräutigam)',   value: 'Großmutter (Bräutigam)',   group: 'Familie (Bräutigam)' },
  { label: 'Großvater (Bräutigam)',    value: 'Großvater (Bräutigam)',    group: 'Familie (Bräutigam)' },
  { label: 'Tante (Bräutigam)',        value: 'Tante (Bräutigam)',        group: 'Familie (Bräutigam)' },
  { label: 'Onkel (Bräutigam)',        value: 'Onkel (Bräutigam)',        group: 'Familie (Bräutigam)' },
  { label: 'Cousine (Bräutigam)',      value: 'Cousine (Bräutigam)',      group: 'Familie (Bräutigam)' },
  { label: 'Cousin (Bräutigam)',       value: 'Cousin (Bräutigam)',       group: 'Familie (Bräutigam)' },
  { label: 'Freundin des Bräutigams',  value: 'Freundin des Bräutigams',  group: 'Freunde (Bräutigam)' },
  { label: 'Freund des Bräutigams',    value: 'Freund des Bräutigams',    group: 'Freunde (Bräutigam)' },
  { label: 'Trauzeugin (Bräutigam)',   value: 'Trauzeugin (Bräutigam)',   group: 'Freunde (Bräutigam)' },
  { label: 'Trauzeuge (Bräutigam)',    value: 'Trauzeuge (Bräutigam)',    group: 'Freunde (Bräutigam)' },
  { label: 'Kollegin (Bräutigam)',     value: 'Kollegin (Bräutigam)',     group: 'Bekannte (Bräutigam)' },
  { label: 'Kollege (Bräutigam)',      value: 'Kollege (Bräutigam)',      group: 'Bekannte (Bräutigam)' },
]

// Gemeinsam (für die Combined-Liste)
export const RELATIONSHIP_SHARED = [
  { label: 'Gemeinsamer Freund',       value: 'Gemeinsamer Freund',       group: 'Gemeinsam' },
  { label: 'Gemeinsame Freundin',      value: 'Gemeinsame Freundin',      group: 'Gemeinsam' },
  { label: 'Nachbarn',                 value: 'Nachbarn',                 group: 'Gemeinsam' },
  { label: 'Arbeitskollege',           value: 'Arbeitskollege',           group: 'Gemeinsam' },
]

export const ALL_RELATIONSHIP_OPTIONS = [
  ...RELATIONSHIP_BRIDE,
  ...RELATIONSHIP_GROOM,
  ...RELATIONSHIP_SHARED,
]
