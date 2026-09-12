/**
 * Smart Articulation Training System - Comprehensive Phonetic Knowledge Base
 * Covers Complete Hindi Varnamala Consonants (Sparsh, Anthastha, Ushma, Glottal, Blends)
 * as well as English Articulation Targets.
 * Structured according to Articulation Therapy Hierarchy: Sound -> Word -> Sentence
 * Includes Inside Out Emotion Themes, Pet Data & Accessories Catalog
 */

const PET_DATA = {
  cat: {
    id: "cat",
    name: "Mimi the Cat",
    emoji: "🐱",
    themeColor: "#ff9f1c",
    voiceGreeting: "Meow! Ready to stretch that tongue, super speaker?"
  },
  rabbit: {
    id: "rabbit",
    name: "Pip the Bunny",
    emoji: "🐰",
    themeColor: "#38bdf8",
    voiceGreeting: "Hop hop! Let's bounce through our target sounds!"
  },
  pup: {
    id: "pup",
    name: "Buster the Pup",
    emoji: "🐶",
    themeColor: "#a855f7",
    voiceGreeting: "Woof woof! You're going to ace your speech practice today!"
  }
};

const ACCESSORIES_CATALOG = [
  { id: "none", name: "Natural Look", icon: "✨", cost: 0, type: "none" },
  { id: "party_hat", name: "Party Hat", icon: "🥳", cost: 30, type: "head" },
  { id: "pink_bow", name: "Sparkle Bow", icon: "🎀", cost: 20, type: "head" },
  { id: "cool_shades", name: "Cool Shades", icon: "🕶️", cost: 40, type: "eyes" },
  { id: "gold_crown", name: "Golden Crown", icon: "👑", cost: 60, type: "head" },
  { id: "warm_scarf", name: "Cozy Scarf", icon: "🧣", cost: 25, type: "neck" },
  { id: "hero_cape", name: "Hero Cape", icon: "🦸", cost: 50, type: "back" },
  { id: "flower_pin", name: "Flower Blossom", icon: "🌸", cost: 35, type: "head" },
  { id: "magic_star", name: "Magic Star Pin", icon: "🪄", cost: 45, type: "chest" }
];

const PHONEME_DATA = {
  hindi: [
    /* =========================================================
       0. SWAR • स्वर (HINDI VOWELS: अ to अः - 13 SOUNDS)
       ========================================================= */
    {
      id: "swar_a",
      symbol: "अ",
      name: "A (अ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Short Open Vowel / स्वर)",
      emotion: "orb-joy",
      ipa: "/ə/",
      soundLevel: {
        target: "अ",
        points: 20,
        prompt: "Say the isolated vowel sound: 'अ' (/ə/)",
        audioCadence: "U-h-h",
        placement: "Tongue rests in mid-central position in the oral cavity without touching the roof. Vocal folds vibrate with continuous voicing.",
        airflow: "Continuous free oral phonation, velum raised.",
        pediatricCue: "🦁 Soft gentle breath! Open your mouth a little bit and say 'Uh': अ!",
        tonguePosition: { height: 0.5, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.5, round: 0.0 },
        jawPosition: { open: 0.4 }
      },
      wordLevel: {
        word: "अनार",
        points: 35,
        transliteration: "Anaar",
        meaning: "Pomegranate",
        emoji: "🍎",
        syllables: ["अ", "ना", "र"]
      },
      sentenceLevel: {
        sentence: "अ से अनार मीठा और लाल है।",
        points: 50,
        transliteration: "Anaar meetha aur laal hai.",
        meaning: "Pomegranate is sweet and red."
      },
      unlocked3D: true
    },
    {
      id: "swar_aa",
      symbol: "आ",
      name: "Aa (आ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Long Open Vowel / स्वर)",
      emotion: "orb-joy",
      ipa: "/aː/",
      soundLevel: {
        target: "आ",
        points: 20,
        prompt: "Say the open vowel sound: 'आ' (/aː/)",
        audioCadence: "A-a-a-h",
        placement: "Jaw drops wide, tongue stays low and flat on the floor of the mouth with full oral cavity resonance.",
        airflow: "Open vocalic airflow with full vocal cord resonance.",
        pediatricCue: "🌟 Big doctor check-up mouth! Open wide like looking at the stars: Aaaah (आ)!",
        tonguePosition: { height: 0.15, advancement: -0.1, curl: 0.0 },
        lipPosition: { open: 0.9, round: 0.0 },
        jawPosition: { open: 0.85 }
      },
      wordLevel: {
        word: "आम",
        points: 35,
        transliteration: "Aam",
        meaning: "Mango",
        emoji: "🥭",
        syllables: ["आ", "म"]
      },
      sentenceLevel: {
        sentence: "आ से आम फलों का राजा है।",
        points: 50,
        transliteration: "Aam phalon ka raja hai.",
        meaning: "Mango is the king of fruits."
      },
      unlocked3D: true
    },
    {
      id: "swar_i",
      symbol: "इ",
      name: "I (इ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Short Close Front Vowel / स्वर)",
      emotion: "orb-sadness",
      ipa: "/ɪ/",
      soundLevel: {
        target: "इ",
        points: 20,
        prompt: "Say the short front vowel: 'इ' (/ɪ/)",
        audioCadence: "I-h",
        placement: "Front of the tongue body raises towards the hard palate with parted lips in a slight smile. Quick duration.",
        airflow: "High-front narrow vocalic passage without friction.",
        pediatricCue: "🐭 Tiny mouse smile! Quick friendly smile: Ih (इ)!",
        tonguePosition: { height: 0.75, advancement: 0.7, curl: 0.0 },
        lipPosition: { open: 0.35, round: -0.2 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "इमली",
        points: 35,
        transliteration: "Imli",
        meaning: "Tamarind",
        emoji: "🌰",
        syllables: ["इ", "म", "ली"]
      },
      sentenceLevel: {
        sentence: "इ से खट्टी-मीठी इमली सबको भाती है।",
        points: 50,
        transliteration: "Imli sabko bhaati hai.",
        meaning: "Everyone loves sweet and sour tamarind."
      },
      unlocked3D: true
    },
    {
      id: "swar_ee",
      symbol: "ई",
      name: "Ee (ई)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Long Close Front Vowel / स्वर)",
      emotion: "orb-sadness",
      ipa: "/iː/",
      soundLevel: {
        target: "ई",
        points: 20,
        prompt: "Say the long front vowel: 'ई' (/iː/)",
        audioCadence: "E-e-e",
        placement: "Tongue dorsum raises high near the hard palate with wide retracted lip corners. Sustained tone.",
        airflow: "Tense front vowel with sustained vocal cord vibration.",
        pediatricCue: "📸 Cheese photo smile! Spread your lips super wide: Eeeee (ई)!",
        tonguePosition: { height: 0.9, advancement: 0.85, curl: 0.0 },
        lipPosition: { open: 0.3, round: -0.4 },
        jawPosition: { open: 0.2 }
      },
      wordLevel: {
        word: "ईख",
        points: 35,
        transliteration: "Eekh",
        meaning: "Sugarcane",
        emoji: "🎋",
        syllables: ["ई", "ख"]
      },
      sentenceLevel: {
        sentence: "ई से ईख का रस बहुत मीठा होता है।",
        points: 50,
        transliteration: "Eekh ka ras bahut meetha hota hai.",
        meaning: "Sugarcane juice is very sweet."
      },
      unlocked3D: true
    },
    {
      id: "swar_u",
      symbol: "उ",
      name: "U (उ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Short Close Back Rounded Vowel / स्वर)",
      emotion: "orb-disgust",
      ipa: "/ʊ/",
      soundLevel: {
        target: "उ",
        points: 20,
        prompt: "Say the short rounded vowel: 'उ' (/ʊ/)",
        audioCadence: "U-u",
        placement: "Back of the tongue rises towards the velum with gentle circular lip rounding. Short duration.",
        airflow: "Central vocalic stream through gently rounded lips.",
        pediatricCue: "🦉 Little owl hoot! Make small round lips and give a quick hoot: Uh (उ)!",
        tonguePosition: { height: 0.7, advancement: -0.6, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.6 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "उल्लू",
        points: 35,
        transliteration: "Ullu",
        meaning: "Owl",
        emoji: "🦉",
        syllables: ["उ", "ल्लू"]
      },
      sentenceLevel: {
        sentence: "उ से उल्लू रात में जागता है।",
        points: 50,
        transliteration: "Ullu raat mein jaagta hai.",
        meaning: "The owl stays awake at night."
      },
      unlocked3D: true
    },
    {
      id: "swar_oo",
      symbol: "ऊ",
      name: "Oo (ऊ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Long Close Back Rounded Vowel / स्वर)",
      emotion: "orb-disgust",
      ipa: "/uː/",
      soundLevel: {
        target: "ऊ",
        points: 20,
        prompt: "Say the long rounded vowel: 'ऊ' (/uː/)",
        audioCadence: "O-o-o",
        placement: "Back of tongue raises high towards soft palate with tight circular lip protrusion. Sustained tone.",
        airflow: "Tense posterior vowel resonance.",
        pediatricCue: "🚂 Toy train whistle! Pucker your lips like blowing bubbles: Ooooo (ऊ)!",
        tonguePosition: { height: 0.88, advancement: -0.75, curl: 0.0 },
        lipPosition: { open: 0.25, round: 0.85 },
        jawPosition: { open: 0.2 }
      },
      wordLevel: {
        word: "ऊन",
        points: 35,
        transliteration: "Oon",
        meaning: "Wool",
        emoji: "🧶",
        syllables: ["ऊ", "न"]
      },
      sentenceLevel: {
        sentence: "ऊ से ऊन से दादी गरम स्वेटर बनाती हैं।",
        points: 50,
        transliteration: "Oon se dadi garam sweater banati hain.",
        meaning: "Grandma knits warm sweaters from wool."
      },
      unlocked3D: true
    },
    {
      id: "swar_ri",
      symbol: "ऋ",
      name: "Ri (ऋ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Vocalic Retroflex Vowel / स्वर)",
      emotion: "orb-fear",
      ipa: "/rɪ/",
      soundLevel: {
        target: "ऋ",
        points: 20,
        prompt: "Say the vocalic retroflex sound: 'ऋ' (/rɪ/)",
        audioCadence: "R-i-i",
        placement: "Tongue tip curls slightly up towards the prepalatal ridge with continuous vocalic voicing.",
        airflow: "Continuous retroflex-colored vowel airflow.",
        pediatricCue: "🧘 Meditation bell! Curl your tongue tip up gently like a tiny spoon: Ri (ऋ)!",
        tonguePosition: { height: 0.65, advancement: 0.2, curl: 0.4 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "ऋषि",
        points: 35,
        transliteration: "Rishi",
        meaning: "Sage",
        emoji: "🧘",
        syllables: ["ऋ", "षि"]
      },
      sentenceLevel: {
        sentence: "ऋ से ऋषि वन में ध्यान लगाते हैं।",
        points: 50,
        transliteration: "Rishi van mein dhyan lagate hain.",
        meaning: "The sage meditates in the forest."
      },
      unlocked3D: true
    },
    {
      id: "swar_e",
      symbol: "ए",
      name: "E (ए)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Close-Mid Front Vowel / स्वर)",
      emotion: "orb-anxiety",
      ipa: "/eː/",
      soundLevel: {
        target: "ए",
        points: 20,
        prompt: "Say the front vowel sound: 'ए' (/eː/)",
        audioCadence: "A-y",
        placement: "Front of tongue rises to mid-high position; lips unrounded in a relaxed half-smile.",
        airflow: "Laminar vocalic airflow with mid-front resonance.",
        pediatricCue: "👋 Friendly greeting! Open your lips half-way with a smile: Ay (ए)!",
        tonguePosition: { height: 0.65, advancement: 0.6, curl: 0.0 },
        lipPosition: { open: 0.45, round: -0.2 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "एड़ी",
        points: 35,
        transliteration: "Edee",
        meaning: "Heel",
        emoji: "🦶",
        syllables: ["ए", "ड़ी"]
      },
      sentenceLevel: {
        sentence: "ए से एड़ी उठा कर चलना सीखो।",
        points: 50,
        transliteration: "Edee utha kar chalna seekho.",
        meaning: "Learn to walk lifting your heels."
      },
      unlocked3D: true
    },
    {
      id: "swar_ai",
      symbol: "ऐ",
      name: "Ai (ऐ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Open-Mid Front Diphthong Vowel / स्वर)",
      emotion: "orb-anxiety",
      ipa: "/ɛː/",
      soundLevel: {
        target: "ऐ",
        points: 20,
        prompt: "Say the open-mid vowel: 'ऐ' (/ɛː/)",
        audioCadence: "A-y-y",
        placement: "Open-mid front tongue position with wider jaw opening than 'ए'.",
        airflow: "Wider open-mid oral vowel resonance.",
        pediatricCue: "🎉 Cheerleader shout! Open your jaw wider and cheer: Ayy (ऐ)!",
        tonguePosition: { height: 0.45, advancement: 0.5, curl: 0.0 },
        lipPosition: { open: 0.6, round: -0.15 },
        jawPosition: { open: 0.5 }
      },
      wordLevel: {
        word: "ऐनक",
        points: 35,
        transliteration: "Ainak",
        meaning: "Spectacles",
        emoji: "👓",
        syllables: ["ऐ", "न", "क"]
      },
      sentenceLevel: {
        sentence: "ऐ से ऐनक लगा कर दादाजी पुस्तक पढ़ते हैं।",
        points: 50,
        transliteration: "Ainak laga kar dadaji pustak padhte hain.",
        meaning: "Grandfather wears glasses to read books."
      },
      unlocked3D: true
    },
    {
      id: "swar_o",
      symbol: "ओ",
      name: "O (ओ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Close-Mid Back Rounded Vowel / स्वर)",
      emotion: "orb-anger",
      ipa: "/oː/",
      soundLevel: {
        target: "ओ",
        points: 20,
        prompt: "Say the round vowel sound: 'ओ' (/oː/)",
        audioCadence: "O-h-h",
        placement: "Back of tongue in mid-high position with distinct circular lip rounding.",
        airflow: "Posterior vocal tract resonance shaped by circular lips.",
        pediatricCue: "🫧 Soap bubble lips! Make your lips into a perfect round circle: Ohhh (ओ)!",
        tonguePosition: { height: 0.6, advancement: -0.5, curl: 0.0 },
        lipPosition: { open: 0.45, round: 0.7 },
        jawPosition: { open: 0.4 }
      },
      wordLevel: {
        word: "ओखली",
        points: 35,
        transliteration: "Okhli",
        meaning: "Mortar",
        emoji: "🥣",
        syllables: ["ओ", "ख", "ली"]
      },
      sentenceLevel: {
        sentence: "ओ से ओखली में धान कूटा जाता है।",
        points: 50,
        transliteration: "Okhli mein dhaan koota jaata hai.",
        meaning: "Grain is crushed in the mortar."
      },
      unlocked3D: true
    },
    {
      id: "swar_au",
      symbol: "औ",
      name: "Au (औ)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Open-Mid Back Diphthong Vowel / स्वर)",
      emotion: "orb-anger",
      ipa: "/ɔː/",
      soundLevel: {
        target: "औ",
        points: 20,
        prompt: "Say the open back vowel: 'औ' (/ɔː/)",
        audioCadence: "A-u-w",
        placement: "Open-mid back vowel with wide jaw drop transitioning into rounded lips.",
        airflow: "Low-back open oral resonance.",
        pediatricCue: "😲 Wonder and surprise! Drop your jaw into a big round O: Awww (औ)!",
        tonguePosition: { height: 0.35, advancement: -0.4, curl: 0.0 },
        lipPosition: { open: 0.7, round: 0.6 },
        jawPosition: { open: 0.65 }
      },
      wordLevel: {
        word: "औरत",
        points: 35,
        transliteration: "Aurat",
        meaning: "Woman",
        emoji: "👩",
        syllables: ["औ", "र", "त"]
      },
      sentenceLevel: {
        sentence: "औ से औरत सबका मान बढ़ाती है।",
        points: 50,
        transliteration: "Aurat sabka maan badhati hai.",
        meaning: "A woman brings honor to everyone."
      },
      unlocked3D: true
    },
    {
      id: "swar_am",
      symbol: "अं",
      name: "Am (अं)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Nasalized Vowel / अनुस्वार)",
      emotion: "orb-joy",
      ipa: "/ə̃/",
      soundLevel: {
        target: "अं",
        points: 20,
        prompt: "Say the nasalized vowel sound: 'अं' (/ə̃/)",
        audioCadence: "U-m-m",
        placement: "Vocalic sound produced with lowered velum allowing air to resonate through both oral and nasal cavities.",
        airflow: "Nasalized vowel resonance (Anusvara).",
        pediatricCue: "🔔 Singing temple bell! Hum gently through your nose while saying: Um (अं)!",
        tonguePosition: { height: 0.55, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.45, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "अंगूर",
        points: 35,
        transliteration: "Angoor",
        meaning: "Grapes",
        emoji: "🍇",
        syllables: ["अं", "गू", "र"]
      },
      sentenceLevel: {
        sentence: "अं से अंगूर खट्टे और मीठे होते हैं।",
        points: 50,
        transliteration: "Angoor khatte aur meethe hote hain.",
        meaning: "Grapes are sweet and juicy."
      },
      unlocked3D: true
    },
    {
      id: "swar_aha",
      symbol: "अः",
      name: "Aha (अः)",
      group: "swar",
      groupTitle: "🌈 Swar • स्वर (Hindi Vowels: अ to अः)",
      category: "Swar (Glottalized Aspirate Vowel / विसर्ग)",
      emotion: "orb-joy",
      ipa: "/əh/",
      soundLevel: {
        target: "अः",
        points: 20,
        prompt: "Say the aspirate vowel sound: 'अः' (/əh/)",
        audioCadence: "A-h-a",
        placement: "Vowel followed by a gentle voiceless glottal aspirate puff at the vocal folds.",
        airflow: "Vocalic onset ending in breathy glottal release (Visarga).",
        pediatricCue: "👏 Happy clap burst! Soft warm puff of air at the end: Aha (अः)!",
        tonguePosition: { height: 0.5, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.5, round: 0.0 },
        jawPosition: { open: 0.4 }
      },
      wordLevel: {
        word: "अहा",
        points: 35,
        transliteration: "Aha",
        meaning: "Hurrah!",
        emoji: "😄",
        syllables: ["अ", "हा"]
      },
      sentenceLevel: {
        sentence: "अः खाली! बच्चे बजाओ मिलकर ताली!",
        points: 50,
        transliteration: "Aha khali! Bachhe bajao milkar taali!",
        meaning: "Aha is empty, children clap together!"
      },
      unlocked3D: true
    },
    /* =========================================================
       1. KAVARGA • कण्ठ्य (VELAR STOPS & NASAL: क, ख, ग, घ, ङ)
       ========================================================= */
    {
      id: "ka",
      symbol: "क",
      name: "Ka (क)",
      group: "kavarga",
      groupTitle: "🎯 Kavarga • कण्ठ्य (Velar Stops)",
      category: "Sparsh (Velar Stop / कण्ठ्य)",
      emotion: "orb-joy",
      ipa: "/k/",
      soundLevel: {
        target: "क",
        points: 20,
        prompt: "Say the isolated sound: 'क' (/k/)",
        audioCadence: "K-a-a",
        placement: "Back of the tongue (dorsum) elevates to touch the soft palate (velum). Stop air, then release with a gentle burst.",
        airflow: "Oral explosion burst, velic port closed (no nasal air).",
        pediatricCue: "🐉 Dragon cough! Tap the back of your tongue to the roof of your mouth like a little baby dragon: Ka!",
        tonguePosition: { height: 0.85, advancement: -0.65, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "कबूतर",
        points: 35,
        transliteration: "Kabootar",
        meaning: "Pigeon",
        emoji: "🕊️",
        syllables: ["क (Ka)", "बू (boo)", "तर (tar)"],
        cadenceText: "Ka... boo... tar",
        audioCadence: "क... बू... तर"
      },
      sentenceLevel: {
        sentence: "कबूतर दाना चुगता है।",
        points: 50,
        transliteration: "Kabootar daana chugta hai.",
        meaning: "The pigeon is pecking at grains.",
        targetHighlights: ["कबूतर", "चुगता"]
      },
      commonError: "Velar Fronting: Substituting 'त' (/t/) for 'क' -> 'तबूतर'.",
      therapistNotes: "Prevent tongue tip from touching front teeth. Anchor tip down.",
      unlocked3D: true
    },
    {
      id: "kha",
      symbol: "ख",
      name: "Kha (ख)",
      group: "kavarga",
      groupTitle: "🎯 Kavarga • कण्ठ्य (Velar Stops)",
      category: "Sparsh (Aspirated Velar / कण्ठ्य महाप्राण)",
      emotion: "orb-anxiety",
      ipa: "/kʰ/",
      soundLevel: {
        target: "ख",
        points: 20,
        prompt: "Say the aspirated sound: 'ख' (/kʰ/)",
        audioCadence: "Kh-a-a",
        placement: "Back of tongue against soft palate followed by a strong puff of warm air.",
        airflow: "Heavy aspirated oral puff of warm air.",
        pediatricCue: "🌬️ Warm breath test! Hold your hand in front of your lips and feel the big warm puff of air: Kha!",
        tonguePosition: { height: 0.85, advancement: -0.65, curl: 0.0 },
        lipPosition: { open: 0.45, round: 0.1 },
        jawPosition: { open: 0.4 }
      },
      wordLevel: {
        word: "खरगोश",
        points: 35,
        transliteration: "Khargosh",
        meaning: "Rabbit",
        emoji: "🐇",
        syllables: ["खर (Khar)", "गोश (gosh)"],
        cadenceText: "Khar... gosh",
        audioCadence: "खर... गोश"
      },
      sentenceLevel: {
        sentence: "सफेद खरगोश गाजर खाता है।",
        points: 50,
        transliteration: "Safed khargosh gaajar khaata hai.",
        meaning: "The white bunny munches a fresh carrot.",
        targetHighlights: ["खरगोश", "खाता"]
      },
      commonError: "De-aspiration: Dropping the breath puff, turning 'ख' into 'क' (/k/).",
      therapistNotes: "Use tactile airflow feedback with tissue paper or feather.",
      unlocked3D: false
    },
    {
      id: "ga",
      symbol: "ग",
      name: "Ga (ग)",
      group: "kavarga",
      groupTitle: "🎯 Kavarga • कण्ठ्य (Velar Stops)",
      category: "Sparsh (Voiced Velar / कण्ठ्य घोष)",
      emotion: "orb-disgust",
      ipa: "/ɡ/",
      soundLevel: {
        target: "ग",
        points: 20,
        prompt: "Say the voiced sound: 'ग' (/ɡ/)",
        audioCadence: "G-a-a",
        placement: "Back of tongue against velum with vocal cords vibrating. Feel throat buzzing.",
        airflow: "Voiced oral burst with larynx vibration.",
        pediatricCue: "🐝 Motor buzzer! Touch your throat with two fingers and feel the bee buzzing inside: Ga!",
        tonguePosition: { height: 0.82, advancement: -0.6, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "गमला",
        points: 35,
        transliteration: "Gamla",
        meaning: "Flower Pot",
        emoji: "🪴",
        syllables: ["ग (Gam)", "म (ma)", "ला (la)"],
        cadenceText: "Gam... la",
        audioCadence: "गम... ला"
      },
      sentenceLevel: {
        sentence: "गमले में सुंदर गुलाब खिला है।",
        points: 50,
        transliteration: "Gamle mein sundar gulaab khila hai.",
        meaning: "A lovely rose has bloomed in the pot.",
        targetHighlights: ["गमले", "गुलाब"]
      },
      commonError: "Devoicing: Turning 'ग' into 'क' (/k/).",
      therapistNotes: "Tactile vibration feedback on larynx.",
      unlocked3D: false
    },
    {
      id: "gha",
      symbol: "घ",
      name: "Gha (घ)",
      group: "kavarga",
      groupTitle: "🎯 Kavarga • कण्ठ्य (Velar Stops)",
      category: "Sparsh (Voiced Aspirated Velar / कण्ठ्य घोष महाप्राण)",
      emotion: "orb-anger",
      ipa: "/ɡʱ/",
      soundLevel: {
        target: "घ",
        points: 20,
        prompt: "Say the voiced aspirated sound: 'घ' (/ɡʱ/)",
        audioCadence: "Gh-a-a",
        placement: "Back of tongue contacts velum with vocal cord vibration and strong breath puff.",
        airflow: "Voiced breathy burst with throat vibration.",
        pediatricCue: "⏰ Big clock chime! Buzz your throat and let out a big puff of air together: Gha!",
        tonguePosition: { height: 0.82, advancement: -0.6, curl: 0.0 },
        lipPosition: { open: 0.45, round: 0.1 },
        jawPosition: { open: 0.4 }
      },
      wordLevel: {
        word: "घड़ी",
        points: 35,
        transliteration: "Ghadi",
        meaning: "Clock",
        emoji: "⏰",
        syllables: ["घ (Gha)", "ड़ी (di)"],
        cadenceText: "Gha... di",
        audioCadence: "घ... ड़ी"
      },
      sentenceLevel: {
        sentence: "दीवार पर लगी घड़ी टिक-टिक करती है।",
        points: 50,
        transliteration: "Deewaar par lagi ghadi tik-tik karti hai.",
        meaning: "The clock on the wall ticks away time.",
        targetHighlights: ["घड़ी"]
      },
      commonError: "De-aspiration to 'ग' or devoicing to 'क'.",
      therapistNotes: "Combine throat buzz and paper flutter simultaneously.",
      unlocked3D: false
    },
    {
      id: "nga",
      symbol: "ङ",
      name: "Ṅa (ङ)",
      group: "kavarga",
      groupTitle: "🎯 Kavarga • कण्ठ्य (Velar Stops)",
      category: "Sparsh (Velar Nasal / कण्ठ्य अनुनासिक)",
      emotion: "orb-fear",
      ipa: "/ŋ/",
      soundLevel: {
        target: "ङ",
        points: 20,
        prompt: "Say the velar nasal sound: 'ङ' (/ŋ/)",
        audioCadence: "Ng-a-a",
        placement: "Back of tongue seals against lowered soft palate, directing air through nasal cavity.",
        airflow: "Nasal continuous airflow through nose.",
        pediatricCue: "🪁 Singing hum! Make the 'ng' ring in your nose like the end of 'sing': Nga!",
        tonguePosition: { height: 0.88, advancement: -0.65, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "पतंग",
        points: 35,
        transliteration: "Patang",
        meaning: "Kite (Velar Nasal)",
        emoji: "🪁",
        syllables: ["प (Pa)", "तंग (tang)"],
        cadenceText: "Pa... tang",
        audioCadence: "प... तंग"
      },
      sentenceLevel: {
        sentence: "आसमान में रंग-बिरंगी पतंग उड़ती है।",
        points: 50,
        transliteration: "Aasmaan mein rang-birangi patang udti hai.",
        meaning: "The colorful kite soars high in the sky.",
        targetHighlights: ["रंग", "पतंग"]
      },
      commonError: "Denasalization or oral substitute 'ग'.",
      therapistNotes: "Palpate lateral nasal cartilage to verify nasal resonance.",
      unlocked3D: false
    },

    /* =========================================================
       2. CHAVARGA • तालव्य (PALATAL STOPS & NASAL: च, छ, ज, झ, ञ)
       ========================================================= */
    {
      id: "cha",
      symbol: "च",
      name: "Cha (च)",
      group: "chavarga",
      groupTitle: "✨ Chavarga • तालव्य (Palatal Stops)",
      category: "Sparsh (Palatal Stop / तालव्य)",
      emotion: "orb-joy",
      ipa: "/t͡ʃ/",
      soundLevel: {
        target: "च",
        points: 20,
        prompt: "Say the palatal sound: 'च' (/t͡ʃ/)",
        audioCadence: "Ch-a-a",
        placement: "Flat blade of tongue seals against hard palate roof, releasing with a clean snap.",
        airflow: "Palatal quick burst release.",
        pediatricCue: "🥄 Spoon tapper! Touch the flat part of your tongue to the middle roof of your mouth: Cha!",
        tonguePosition: { height: 0.75, advancement: 0.3, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.1 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "चम्मच",
        points: 35,
        transliteration: "Chammach",
        meaning: "Spoon",
        emoji: "🥄",
        syllables: ["चम (Cham)", "मच (mach)"],
        cadenceText: "Cham... mach",
        audioCadence: "चम... मच"
      },
      sentenceLevel: {
        sentence: "नीना ने चम्मच से मीठी खीर खाई।",
        points: 50,
        transliteration: "Neena ne chammach se meethi kheer khaayi.",
        meaning: "Neena ate sweet pudding with a spoon.",
        targetHighlights: ["चम्मच"]
      },
      commonError: "Depalatalization: Substituting dental 'त' (/t/).",
      therapistNotes: "Ensure wide contact of tongue blade against hard palate.",
      unlocked3D: false
    },
    {
      id: "chha",
      symbol: "छ",
      name: "Chha (छ)",
      group: "chavarga",
      groupTitle: "✨ Chavarga • तालव्य (Palatal Stops)",
      category: "Sparsh (Aspirated Palatal / तालव्य महाप्राण)",
      emotion: "orb-anxiety",
      ipa: "/t͡ʃʰ/",
      soundLevel: {
        target: "छ",
        points: 20,
        prompt: "Say the aspirated sound: 'छ' (/t͡ʃʰ/)",
        audioCadence: "Chh-a-a",
        placement: "Palatal seal release followed by a crisp burst of warm air.",
        airflow: "Strong palatal aspirated airflow.",
        pediatricCue: "☂️ Rain shower sneezes! Make a big warm puff like a little umbrella snap: Chha!",
        tonguePosition: { height: 0.75, advancement: 0.3, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "छतरी",
        points: 35,
        transliteration: "Chhatri",
        meaning: "Umbrella",
        emoji: "☂️",
        syllables: ["छ (Chha)", "त (ta)", "री (ree)"],
        cadenceText: "Chha... ta... ree",
        audioCadence: "छ... त... री"
      },
      sentenceLevel: {
        sentence: "बारिश में रंगीन छतरी खोल लो।",
        points: 50,
        transliteration: "Baarish mein rangeen chhatri khol lo.",
        meaning: "Open your colorful umbrella in the rain.",
        targetHighlights: ["छतरी"]
      },
      commonError: "De-aspiration to 'च'.",
      therapistNotes: "Hand-in-front feedback for distinct aspiration puff.",
      unlocked3D: false
    },
    {
      id: "ja",
      symbol: "ज",
      name: "Ja (ज)",
      group: "chavarga",
      groupTitle: "✨ Chavarga • तालव्य (Palatal Stops)",
      category: "Sparsh (Voiced Palatal / तालव्य घोष)",
      emotion: "orb-disgust",
      ipa: "/d͡ʒ/",
      soundLevel: {
        target: "ज",
        points: 20,
        prompt: "Say the voiced sound: 'ज' (/d͡ʒ/)",
        audioCadence: "J-a-a",
        placement: "Tongue blade against hard palate with buzzing vocal fold vibration.",
        airflow: "Voiced palatal burst with vocal cord buzz.",
        pediatricCue: "🚢 Big boat horn! Buzz your throat while popping your tongue: Ja, Ja, Ja!",
        tonguePosition: { height: 0.73, advancement: 0.28, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.1 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "जहाज",
        points: 35,
        transliteration: "Jahaaz",
        meaning: "Ship",
        emoji: "🚢",
        syllables: ["ज (Ja)", "हाज (haaz)"],
        cadenceText: "Ja... haaz",
        audioCadence: "ज... हाज"
      },
      sentenceLevel: {
        sentence: "बड़ा जहाज नीले समुद्र में तैरता है।",
        points: 50,
        transliteration: "Bada jahaaz neele samudra mein tairta hai.",
        meaning: "The large ship sails through the blue sea.",
        targetHighlights: ["जहाज"]
      },
      commonError: "Devoicing to 'च' or fronting to 'द'.",
      therapistNotes: "Hold larynx to verify vocal cord onset timing.",
      unlocked3D: false
    },
    {
      id: "jha",
      symbol: "झ",
      name: "Jha (झ)",
      group: "chavarga",
      groupTitle: "✨ Chavarga • तालव्य (Palatal Stops)",
      category: "Sparsh (Voiced Aspirated Palatal / तालव्य घोष महाप्राण)",
      emotion: "orb-anger",
      ipa: "/d͡ʒʱ/",
      soundLevel: {
        target: "झ",
        points: 20,
        prompt: "Say the voiced aspirated sound: 'झ' (/d͡ʒʱ/)",
        audioCadence: "Jh-a-a",
        placement: "Tongue blade to hard palate with simultaneous throat vibration and breath burst.",
        airflow: "Voiced breathy palatal explosion.",
        pediatricCue: "🇮🇳 Fluttering flag! Buzz and blow together like a flag flapping in the wind: Jha!",
        tonguePosition: { height: 0.73, advancement: 0.28, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "झंडा",
        points: 35,
        transliteration: "Jhanda",
        meaning: "Flag",
        emoji: "🇮🇳",
        syllables: ["झं (Jhan)", "डा (daa)"],
        cadenceText: "Jhan... daa",
        audioCadence: "झं... डा"
      },
      sentenceLevel: {
        sentence: "हमारा तिरंगा झंडा शान से लहराता है।",
        points: 50,
        transliteration: "Humaara tiranga jhanda shaan se lahraata hai.",
        meaning: "Our tricolor flag flutters with pride.",
        targetHighlights: ["झंडा"]
      },
      commonError: "De-aspiration to 'ज'.",
      therapistNotes: "Emphasize simultaneous voicing and pulmonary airflow pulse.",
      unlocked3D: false
    },
    {
      id: "nya",
      symbol: "ञ",
      name: "Ña (ञ)",
      group: "chavarga",
      groupTitle: "✨ Chavarga • तालव्य (Palatal Stops)",
      category: "Sparsh (Palatal Nasal / तालव्य अनुनासिक)",
      emotion: "orb-fear",
      ipa: "/ɲ/",
      soundLevel: {
        target: "ञ",
        points: 20,
        prompt: "Say the palatal nasal sound: 'ञ' (/ɲ/)",
        audioCadence: "Nya-a",
        placement: "Flat tongue blade presses palate with open nasal port.",
        airflow: "Nasal resonance with palatal occlusion.",
        pediatricCue: "🐒 Playful monkey hum! Make a sweet nasal hum right in the center of your palate: Nya!",
        tonguePosition: { height: 0.78, advancement: 0.35, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "चंचल",
        points: 35,
        transliteration: "Chanchal",
        meaning: "Playful (Palatal Nasal)",
        emoji: "🐒",
        syllables: ["चं (Chan)", "चल (chal)"],
        cadenceText: "Chan... chal",
        audioCadence: "चं... चल"
      },
      sentenceLevel: {
        sentence: "छोटा बंदर बहुत चंचल है।",
        points: 50,
        transliteration: "Chhota bandar bahut chanchal hai.",
        meaning: "The little monkey is very playful.",
        targetHighlights: ["चंचल"]
      },
      commonError: "Substituting dental 'न'.",
      therapistNotes: "Demonstrate palatal contact area vs alveolar contact.",
      unlocked3D: false
    },

    /* =========================================================
       3. ṬAVARGA • मूर्धन्य (RETROFLEX STOPS & NASAL: ट, ठ, ड, ढ, ण)
       ========================================================= */
    {
      id: "ta_retro",
      symbol: "ट",
      name: "Ṭa (ट)",
      group: "tavarga_retro",
      groupTitle: "👅 Ṭavarga • मूर्धन्य (Retroflex Stops)",
      category: "Sparsh (Retroflex Stop / मूर्धन्य)",
      emotion: "orb-anger",
      ipa: "/ʈ/",
      soundLevel: {
        target: "ट",
        points: 20,
        prompt: "Say the isolated sound: 'ट' (/ʈ/)",
        audioCadence: "T-a-a (Retroflex)",
        placement: "Curling tongue tip backwards (retroflex) to strike the hard palate roof, then popping down.",
        airflow: "Retroflex oral snap with quick downward tongue release.",
        pediatricCue: "🥄 Little spoon tongue! Curl the tip of your tongue backwards like a secret cave scoop: Ṭa!",
        tonguePosition: { height: 0.72, advancement: 0.2, curl: 0.8 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "टमाटर",
        points: 35,
        transliteration: "Tamaatar",
        meaning: "Tomato",
        emoji: "🍅",
        syllables: ["ट (Ta)", "मा (maa)", "टर (tar)"],
        cadenceText: "Ta... maa... tar",
        audioCadence: "ट... मा... टर"
      },
      sentenceLevel: {
        sentence: "रोहन ने गोल लाल टमाटर तोड़ा।",
        points: 50,
        transliteration: "Rohan ne gol laal tamaatar toda.",
        meaning: "Rohan picked a round red tomato.",
        targetHighlights: ["टमाटर", "तोड़ा"]
      },
      commonError: "Dental substitution: Replacing retroflex 'ट' with dental 'त' (/t̪/).",
      therapistNotes: "Auditory discrimination between dental त and retroflex ट is critical.",
      unlocked3D: true
    },
    {
      id: "tha_retro",
      symbol: "ठ",
      name: "Ṭha (ठ)",
      group: "tavarga_retro",
      groupTitle: "👅 Ṭavarga • मूर्धन्य (Retroflex Stops)",
      category: "Sparsh (Aspirated Retroflex / मूर्धन्य महाप्राण)",
      emotion: "orb-anxiety",
      ipa: "/ʈʰ/",
      soundLevel: {
        target: "ठ",
        points: 20,
        prompt: "Say the aspirated retroflex sound: 'ठ' (/ʈʰ/)",
        audioCadence: "Th-a-a (Retroflex)",
        placement: "Curl tongue tip backwards to palate, release with strong aspirated burst.",
        airflow: "Aspirated retroflex puff.",
        pediatricCue: "🔔 Bell hammer! Curl your tongue tip up and let out a big puff of air: Ṭha!",
        tonguePosition: { height: 0.72, advancement: 0.2, curl: 0.8 },
        lipPosition: { open: 0.42, round: 0.1 },
        jawPosition: { open: 0.38 }
      },
      wordLevel: {
        word: "ठठेरा",
        points: 35,
        transliteration: "Thatheera",
        meaning: "Bell Maker",
        emoji: "🔔",
        syllables: ["ठ (Tha)", "ठे (thee)", "रा (raa)"],
        cadenceText: "Tha... thee... raa",
        audioCadence: "ठ... ठे... रा"
      },
      sentenceLevel: {
        sentence: "ठठेरा बर्तन पर ठक-ठक करता है।",
        points: 50,
        transliteration: "Thatheera bartan par thak-thak karta hai.",
        meaning: "The metal craftsman taps steadily on the bell.",
        targetHighlights: ["ठठेरा", "ठक-ठक"]
      },
      commonError: "De-aspiration to 'ट' or dentalization to 'थ'.",
      therapistNotes: "Combine retroflex tongue curling and strong breath exhalation.",
      unlocked3D: false
    },
    {
      id: "da_retro",
      symbol: "ड",
      name: "Ḍa (ड)",
      group: "tavarga_retro",
      groupTitle: "👅 Ṭavarga • मूर्धन्य (Retroflex Stops)",
      category: "Sparsh (Voiced Retroflex / मूर्धन्य घोष)",
      emotion: "orb-disgust",
      ipa: "/ɖ/",
      soundLevel: {
        target: "ड",
        points: 20,
        prompt: "Say the voiced retroflex sound: 'ड' (/ɖ/)",
        audioCadence: "D-a-a (Retroflex)",
        placement: "Curl tongue tip back to hard palate, add voice vibration, snap down.",
        airflow: "Voiced retroflex snap.",
        pediatricCue: "🥁 Drum beat! Beat your curled tongue against the roof of your mouth like a drum: Ḍa!",
        tonguePosition: { height: 0.7, advancement: 0.2, curl: 0.8 },
        lipPosition: { open: 0.35, round: 0.1 },
        jawPosition: { open: 0.35 }
      },
      wordLevel: {
        word: "डमरू",
        points: 35,
        transliteration: "Damroo",
        meaning: "Small Drum",
        emoji: "🥁",
        syllables: ["डम (Dam)", "रू (roo)"],
        cadenceText: "Dam... roo",
        audioCadence: "डम... रू"
      },
      sentenceLevel: {
        sentence: "शिवजी का डमरू डम-डम बजता है।",
        points: 50,
        transliteration: "Shivji ka damroo dam-dam bajta hai.",
        meaning: "The little drum echoes with rhythmic beats.",
        targetHighlights: ["डमरू", "डम-डम"]
      },
      commonError: "Dental substitution 'द' (/d̪/).",
      therapistNotes: "Verify tongue tip curling without contacting upper teeth.",
      unlocked3D: false
    },
    {
      id: "dha_retro",
      symbol: "ढ",
      name: "Ḍha (ढ)",
      group: "tavarga_retro",
      groupTitle: "👅 Ṭavarga • मूर्धन्य (Retroflex Stops)",
      category: "Sparsh (Voiced Aspirated Retroflex / मूर्धन्य घोष महाप्राण)",
      emotion: "orb-anger",
      ipa: "/ɖʱ/",
      soundLevel: {
        target: "ढ",
        points: 20,
        prompt: "Say the voiced aspirated sound: 'ढ' (/ɖʱ/)",
        audioCadence: "Dh-a-a (Retroflex)",
        placement: "Retroflex curled tongue with simultaneous vocal fold buzz and breath puff.",
        airflow: "Voiced aspirated retroflex release.",
        pediatricCue: "🫙 Snapping lid! Curl your tongue, buzz your throat, and let out a puff: Ḍha!",
        tonguePosition: { height: 0.7, advancement: 0.2, curl: 0.8 },
        lipPosition: { open: 0.4, round: 0.1 },
        jawPosition: { open: 0.38 }
      },
      wordLevel: {
        word: "ढक्कन",
        points: 35,
        transliteration: "Dhakkan",
        meaning: "Lid",
        emoji: "🫙",
        syllables: ["ढक (Dhak)", "कन (kan)"],
        cadenceText: "Dhak... kan",
        audioCadence: "ढक... कन"
      },
      sentenceLevel: {
        sentence: "रसगुल्ले के डिब्बे पर ढक्कन लगा दो।",
        points: 50,
        transliteration: "Rasgulle ke dibbe par dhakkan laga do.",
        meaning: "Place the lid firmly on the sweet box.",
        targetHighlights: ["ढक्कन"]
      },
      commonError: "De-aspiration to 'ड'.",
      therapistNotes: "Heavy vocal fold vibration accompanied by breath burst.",
      unlocked3D: false
    },
    {
      id: "na_retro",
      symbol: "ण",
      name: "Ṇa (ण)",
      group: "tavarga_retro",
      groupTitle: "👅 Ṭavarga • मूर्धन्य (Retroflex Stops)",
      category: "Sparsh (Retroflex Nasal / मूर्धन्य अनुनासिक)",
      emotion: "orb-fear",
      ipa: "/ɳ/",
      soundLevel: {
        target: "ण",
        points: 20,
        prompt: "Say the retroflex nasal sound: 'ण' (/ɳ/)",
        audioCadence: "N-a-a (Retroflex)",
        placement: "Tongue tip curls backwards against hard palate while air resonates in nasal cavity.",
        airflow: "Nasal continuous airflow with retroflex posture.",
        pediatricCue: "🏹 Archer arrow! Curl your tongue tip up high and hum through your nose: Ṇa!",
        tonguePosition: { height: 0.75, advancement: 0.25, curl: 0.85 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "बाण",
        points: 35,
        transliteration: "Baan",
        meaning: "Arrow",
        emoji: "🏹",
        syllables: ["बा (Baa)", "ण (na)"],
        cadenceText: "Baa... na",
        audioCadence: "बा... ण"
      },
      sentenceLevel: {
        sentence: "वीर धनुर्धर ने सटीक बाण चलाया।",
        points: 50,
        transliteration: "Veer dhanurdhar ne sateek baan chalaaya.",
        meaning: "The archer released a swift arrow.",
        targetHighlights: ["बाण"]
      },
      commonError: "Dental substitution 'न' (/n/).",
      therapistNotes: "Focus on retroflex tongue curvature to avoid flat alveolar contact.",
      unlocked3D: false
    },

    /* =========================================================
       4. TAVARGA • दन्त्य (DENTAL STOPS & NASAL: त, थ, द, ध, न)
       ========================================================= */
    {
      id: "ta_dental",
      symbol: "त",
      name: "Ta (त)",
      group: "tavarga_dental",
      groupTitle: "🦷 Tavarga • दन्त्य (Dental Stops)",
      category: "Sparsh (Dental Stop / दन्त्य)",
      emotion: "orb-joy",
      ipa: "/t̪/",
      soundLevel: {
        target: "त",
        points: 20,
        prompt: "Say the dental sound: 'त' (/t̪/)",
        audioCadence: "T-a-a (Dental)",
        placement: "Tongue tip touches behind the upper front teeth (incisors). Sharp clean release.",
        airflow: "Clean dental release against upper incisors.",
        pediatricCue: "🦷 Tooth tipper! Touch the tip of your tongue right behind your top front teeth: Ta!",
        tonguePosition: { height: 0.65, advancement: 0.8, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "तितली",
        points: 35,
        transliteration: "Titli",
        meaning: "Butterfly",
        emoji: "🦋",
        syllables: ["तित (Tit)", "ली (lee)"],
        cadenceText: "Tit... lee",
        audioCadence: "तित... ली"
      },
      sentenceLevel: {
        sentence: "रंग-बिरंगी तितली फूल पर बैठी।",
        points: 50,
        transliteration: "Rang-birangi titli phool par baithi.",
        meaning: "The colorful butterfly rested on the flower.",
        targetHighlights: ["तितली"]
      },
      commonError: "Interdental protrusion: Poking tongue too far out between teeth.",
      therapistNotes: "Keep blade flat; only tip contacts upper anterior teeth.",
      unlocked3D: false
    },
    {
      id: "tha_dental",
      symbol: "थ",
      name: "Tha (थ)",
      group: "tavarga_dental",
      groupTitle: "🦷 Tavarga • दन्त्य (Dental Stops)",
      category: "Sparsh (Aspirated Dental / दन्त्य महाप्राण)",
      emotion: "orb-anxiety",
      ipa: "/t̪ʰ/",
      soundLevel: {
        target: "थ",
        points: 20,
        prompt: "Say the aspirated dental sound: 'थ' (/t̪ʰ/)",
        audioCadence: "Th-a-a (Dental)",
        placement: "Tongue tip behind upper incisors released with strong warm breath puff.",
        airflow: "Strong dental aspirated airflow.",
        pediatricCue: "🍽️ Warm plate puff! Touch your teeth and puff a warm breeze onto your palm: Tha!",
        tonguePosition: { height: 0.65, advancement: 0.8, curl: 0.0 },
        lipPosition: { open: 0.38, round: 0.0 },
        jawPosition: { open: 0.32 }
      },
      wordLevel: {
        word: "थाली",
        points: 35,
        transliteration: "Thaali",
        meaning: "Plate",
        emoji: "🍽️",
        syllables: ["था (Thaa)", "ली (lee)"],
        cadenceText: "Thaa... lee",
        audioCadence: "था... ली"
      },
      sentenceLevel: {
        sentence: "दादी ने गरम भोजन थाली में परोसा।",
        points: 50,
        transliteration: "Daadi ne garam bhojan thaali mein parosa.",
        meaning: "Grandmother served warm food on the plate.",
        targetHighlights: ["थाली"]
      },
      commonError: "De-aspiration to 'त'.",
      therapistNotes: "Visual paper flutter test for dental aspiration.",
      unlocked3D: false
    },
    {
      id: "da_dental",
      symbol: "द",
      name: "Da (द)",
      group: "tavarga_dental",
      groupTitle: "🦷 Tavarga • दन्त्य (Dental Stops)",
      category: "Sparsh (Voiced Dental / दन्त्य घोष)",
      emotion: "orb-disgust",
      ipa: "/d̪/",
      soundLevel: {
        target: "द",
        points: 20,
        prompt: "Say the voiced dental sound: 'द' (/d̪/)",
        audioCadence: "D-a-a (Dental)",
        placement: "Tongue tip touches behind upper teeth with larynx vocal cord vibration.",
        airflow: "Voiced dental burst.",
        pediatricCue: "🚪 Door knock! Tap behind your teeth while humming your throat: Da!",
        tonguePosition: { height: 0.65, advancement: 0.8, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "दरवाजा",
        points: 35,
        transliteration: "Darwaaza",
        meaning: "Door",
        emoji: "🚪",
        syllables: ["दर (Dar)", "वा (waa)", "जा (zaa)"],
        cadenceText: "Dar... waa... zaa",
        audioCadence: "दर... वा... जा"
      },
      sentenceLevel: {
        sentence: "सुंदर घर का बड़ा दरवाजा खुला है।",
        points: 50,
        transliteration: "Sundar ghar ka bada darwaaza khula hai.",
        meaning: "The large door of the home is open.",
        targetHighlights: ["दरवाजा"]
      },
      commonError: "Devoicing to 'त' or retroflex substitution 'ड'.",
      therapistNotes: "Ensure anterior dental placement with vocal cord buzzing.",
      unlocked3D: false
    },
    {
      id: "dha_dental",
      symbol: "ध",
      name: "Dha (ध)",
      group: "tavarga_dental",
      groupTitle: "🦷 Tavarga • दन्त्य (Dental Stops)",
      category: "Sparsh (Voiced Aspirated Dental / दन्त्य घोष महाप्राण)",
      emotion: "orb-anger",
      ipa: "/d̪ʱ/",
      soundLevel: {
        target: "ध",
        points: 20,
        prompt: "Say the voiced aspirated sound: 'ध' (/d̪ʱ/)",
        audioCadence: "Dh-a-a (Dental)",
        placement: "Tongue behind upper incisors with vocal cord vibration and breath exhalation.",
        airflow: "Voiced aspirated dental release.",
        pediatricCue: "🏹 Bow twang! Touch teeth, buzz throat, and puff together: Dha!",
        tonguePosition: { height: 0.65, advancement: 0.8, curl: 0.0 },
        lipPosition: { open: 0.38, round: 0.0 },
        jawPosition: { open: 0.32 }
      },
      wordLevel: {
        word: "धनुष",
        points: 35,
        transliteration: "Dhanush",
        meaning: "Bow",
        emoji: "🏹",
        syllables: ["ध (Dha)", "नुष (nush)"],
        cadenceText: "Dha... nush",
        audioCadence: "ध... नुष"
      },
      sentenceLevel: {
        sentence: "राम जी ने शक्तिशाली धनुष उठाया।",
        points: 50,
        transliteration: "Ram ji ne shaktishaali dhanush uthaaya.",
        meaning: "Lord Rama lifted the mighty bow.",
        targetHighlights: ["धनुष"]
      },
      commonError: "De-aspiration to 'द'.",
      therapistNotes: "Work on coordinate breathing with dental stop release.",
      unlocked3D: false
    },
    {
      id: "na_dental",
      symbol: "न",
      name: "Na (न)",
      group: "tavarga_dental",
      groupTitle: "🦷 Tavarga • दन्त्य (Dental Stops)",
      category: "Sparsh (Dental Nasal / दन्त्य अनुनासिक)",
      emotion: "orb-fear",
      ipa: "/n/",
      soundLevel: {
        target: "न",
        points: 20,
        prompt: "Say the dental nasal sound: 'न' (/n/)",
        audioCadence: "N-a-a (Dental)",
        placement: "Tongue tip seals behind upper teeth while air resonates freely through nose.",
        airflow: "Continuous nasal flow.",
        pediatricCue: "🚰 Water tap stream! Touch your top teeth and hum out your nose: Na!",
        tonguePosition: { height: 0.68, advancement: 0.8, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "नल",
        points: 35,
        transliteration: "Nal",
        meaning: "Water Tap",
        emoji: "🚰",
        syllables: ["न (Nal)", "ल (l)"],
        cadenceText: "Na... l",
        audioCadence: "न... ल"
      },
      sentenceLevel: {
        sentence: "नल से ठंडा और ताजा पानी बहता है।",
        points: 50,
        transliteration: "Nal se thanda aur taaza paani bahta hai.",
        meaning: "Cool, refreshing water flows from the tap.",
        targetHighlights: ["नल"]
      },
      commonError: "Denasalization to 'द' (/d/).",
      therapistNotes: "Ensure velopharyngeal port is open during phonation.",
      unlocked3D: false
    },

    /* =========================================================
       5. PAVARGA • ओष्ठ्य (BILABIAL STOPS & NASAL: प, फ, ब, भ, म)
       ========================================================= */
    {
      id: "pa",
      symbol: "प",
      name: "Pa (प)",
      group: "pavarga",
      groupTitle: "🫧 Pavarga • ओष्ठ्य (Bilabial Stops)",
      category: "Sparsh (Bilabial Stop / ओष्ठ्य)",
      emotion: "orb-joy",
      ipa: "/p/",
      soundLevel: {
        target: "प",
        points: 20,
        prompt: "Say the isolated sound: 'प' (/p/)",
        audioCadence: "P-a-a",
        placement: "Close both lips tightly together, build gentle oral pressure, then pop open.",
        airflow: "Bilabial puff explosion.",
        pediatricCue: "🫧 Soap bubble pop! Press your lips gently together and pop them open: Pop!",
        tonguePosition: { height: 0.3, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.05, round: 0.2 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "पतंग",
        points: 35,
        transliteration: "Patang",
        meaning: "Kite",
        emoji: "🪁",
        syllables: ["प (Pa)", "तंग (tang)"],
        cadenceText: "Pa... tang",
        audioCadence: "प... तंग"
      },
      sentenceLevel: {
        sentence: "आसमान में नीली पतंग उड़ रही है।",
        points: 50,
        transliteration: "Aasmaan mein neeli patang ud rahi hai.",
        meaning: "A blue kite is flying high in the sky.",
        targetHighlights: ["पतंग"]
      },
      commonError: "Weak lip closure or labiodental substitution (teeth to lips).",
      therapistNotes: "Check for adequate bilateral lip seal and intraoral pressure buildup.",
      unlocked3D: false
    },
    {
      id: "pha",
      symbol: "फ",
      name: "Pha (फ)",
      group: "pavarga",
      groupTitle: "🫧 Pavarga • ओष्ठ्य (Bilabial Stops)",
      category: "Sparsh (Aspirated Bilabial / ओष्ठ्य महाप्राण)",
      emotion: "orb-anxiety",
      ipa: "/pʰ/",
      soundLevel: {
        target: "फ",
        points: 20,
        prompt: "Say the aspirated bilabial sound: 'फ' (/pʰ/)",
        audioCadence: "Ph-a-a",
        placement: "Both lips seal together, then pop open with an energetic puff of warm air.",
        airflow: "Bilabial strong aspirated exhalation.",
        pediatricCue: "🍎 Fruit tree breeze! Pop both lips open and blow a big puff of air: Pha!",
        tonguePosition: { height: 0.3, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.1, round: 0.2 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "फल",
        points: 35,
        transliteration: "Phal",
        meaning: "Fruit",
        emoji: "🍎",
        syllables: ["फ (Pha)", "ल (l)"],
        cadenceText: "Pha... l",
        audioCadence: "फ... ल"
      },
      sentenceLevel: {
        sentence: "टोकरी में ताजे और मीठे फल हैं।",
        points: 50,
        transliteration: "Tokri mein taaze aur meethe phal hain.",
        meaning: "The basket is filled with sweet, fresh fruit.",
        targetHighlights: ["फल"]
      },
      commonError: "De-aspiration to 'प' or fricative substitution 'फ़' (/f/).",
      therapistNotes: "Ensure both lips seal (bilabial), not lower lip to upper teeth.",
      unlocked3D: false
    },
    {
      id: "ba",
      symbol: "ब",
      name: "Ba (ब)",
      group: "pavarga",
      groupTitle: "🫧 Pavarga • ओष्ठ्य (Bilabial Stops)",
      category: "Sparsh (Voiced Bilabial / ओष्ठ्य घोष)",
      emotion: "orb-disgust",
      ipa: "/b/",
      soundLevel: {
        target: "ब",
        points: 20,
        prompt: "Say the voiced bilabial sound: 'ब' (/b/)",
        audioCadence: "B-a-a",
        placement: "Both lips touch with vocal cord vibration, popping open with voice.",
        airflow: "Voiced bilabial burst.",
        pediatricCue: "🐱 Kitten bounce! Close your lips, buzz your throat, and let it pop: Ba!",
        tonguePosition: { height: 0.3, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.05, round: 0.15 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "बिल्ली",
        points: 35,
        transliteration: "Billi",
        meaning: "Kitten",
        emoji: "🐱",
        syllables: ["बिल (Bil)", "ली (lee)"],
        cadenceText: "Bil... lee",
        audioCadence: "बिल... ली"
      },
      sentenceLevel: {
        sentence: "प्यारी बिल्ली कटोरी से दूध पीती है।",
        points: 50,
        transliteration: "Pyaari billi katori se doodh peeti hai.",
        meaning: "The cute kitten sips milk from the bowl.",
        targetHighlights: ["बिल्ली"]
      },
      commonError: "Devoicing to 'प'.",
      therapistNotes: "Feel throat buzzing during lip closure prior to release.",
      unlocked3D: false
    },
    {
      id: "bha",
      symbol: "भ",
      name: "Bha (भ)",
      group: "pavarga",
      groupTitle: "🫧 Pavarga • ओष्ठ्य (Bilabial Stops)",
      category: "Sparsh (Voiced Aspirated Bilabial / ओष्ठ्य घोष महाप्राण)",
      emotion: "orb-anger",
      ipa: "/bʱ/",
      soundLevel: {
        target: "भ",
        points: 20,
        prompt: "Say the voiced aspirated sound: 'भ' (/bʱ/)",
        audioCadence: "Bh-a-a",
        placement: "Both lips seal together with voice vibration and a hearty breath puff on release.",
        airflow: "Voiced aspirated bilabial burst.",
        pediatricCue: "🐻 Dancing bear! Pop lips, buzz throat, and blow a warm gust: Bha!",
        tonguePosition: { height: 0.3, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.1, round: 0.15 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "भालू",
        points: 35,
        transliteration: "Bhaalu",
        meaning: "Bear",
        emoji: "🐻",
        syllables: ["भा (Bhaa)", "लू (loo)"],
        cadenceText: "Bhaa... loo",
        audioCadence: "भा... लू"
      },
      sentenceLevel: {
        sentence: "जंगल से बड़ा और प्यारा भालू आया।",
        points: 50,
        transliteration: "Jangal se bada aur pyaara bhaalu aaya.",
        meaning: "A big friendly bear arrived from the woods.",
        targetHighlights: ["भालू"]
      },
      commonError: "De-aspiration to 'ब'.",
      therapistNotes: "Teach synchronized breath pulse with lip opening.",
      unlocked3D: false
    },
    {
      id: "ma",
      symbol: "म",
      name: "Ma (म)",
      group: "pavarga",
      groupTitle: "🫧 Pavarga • ओष्ठ्य (Bilabial Stops)",
      category: "Sparsh (Bilabial Nasal / ओष्ठ्य अनुनासिक)",
      emotion: "orb-fear",
      ipa: "/m/",
      soundLevel: {
        target: "म",
        points: 20,
        prompt: "Say the bilabial nasal sound: 'म' (/m/)",
        audioCadence: "M-a-a",
        placement: "Lips gently closed together while voice resonates through nose.",
        airflow: "Continuous nasal flow with complete lip closure.",
        pediatricCue: "🐟 Yummy food hum! Keep lips softly closed and hum like eating yummy ice cream: Mmmm-Ma!",
        tonguePosition: { height: 0.35, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.0, round: 0.1 },
        jawPosition: { open: 0.2 }
      },
      wordLevel: {
        word: "मछली",
        points: 35,
        transliteration: "Machhli",
        meaning: "Fish",
        emoji: "🐟",
        syllables: ["मछ (Machh)", "ली (lee)"],
        cadenceText: "Machh... lee",
        audioCadence: "मछ... ली"
      },
      sentenceLevel: {
        sentence: "मछली नीले जल की प्यारी रानी है।",
        points: 50,
        transliteration: "Machhli neele jal ki pyaari raani hai.",
        meaning: "The fish is the queen of the blue water.",
        targetHighlights: ["मछली"]
      },
      commonError: "Denasalization to 'ब' (/b/).",
      therapistNotes: "Check bilateral nostril airflow using mirror test.",
      unlocked3D: false
    },

    /* =========================================================
       6. ANTHASTHA • अन्तःस्थ (APPROXIMANTS: य, र, ल, व)
       ========================================================= */
    {
      id: "ya",
      symbol: "य",
      name: "Ya (य)",
      group: "anthastha",
      groupTitle: "🌊 Anthastha • अन्तःस्थ (Approximants)",
      category: "Anthastha (Palatal Approximant / अन्तःस्थ)",
      emotion: "orb-joy",
      ipa: "/j/",
      soundLevel: {
        target: "य",
        points: 20,
        prompt: "Say the glide sound: 'य' (/j/)",
        audioCadence: "Y-a-a",
        placement: "Tongue glides smoothly from high palatal position down to vowel.",
        airflow: "Continuous smooth oral glide.",
        pediatricCue: "🔥 Firefly glide! Glide your tongue smoothly from 'ee' into 'ya': Ya, Ya, Ya!",
        tonguePosition: { height: 0.75, advancement: 0.5, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "यज्ञ",
        points: 35,
        transliteration: "Yagya",
        meaning: "Sacred Ceremony",
        emoji: "🔥",
        syllables: ["य (Ya)", "ज्ञ (gya)"],
        cadenceText: "Ya... gya",
        audioCadence: "य... ज्ञ"
      },
      sentenceLevel: {
        sentence: "ऋषियों ने आश्रम में पावन यज्ञ किया।",
        points: 50,
        transliteration: "Rishiyon ne aashram mein paavan yagya kiya.",
        meaning: "The sages conducted a sacred fire ceremony.",
        targetHighlights: ["यज्ञ"]
      },
      commonError: "Hardening to 'ज' (/d͡ʒ/).",
      therapistNotes: "Ensure continuous gliding without stopping airflow.",
      unlocked3D: false
    },
    {
      id: "ra",
      symbol: "र",
      name: "Ra (र)",
      group: "anthastha",
      groupTitle: "🌊 Anthastha • अन्तःस्थ (Approximants)",
      category: "Anthastha (Alveolar Tap/Trill / अन्तःस्थ)",
      emotion: "orb-fear",
      ipa: "/r/ /ɾ/",
      soundLevel: {
        target: "र",
        points: 20,
        prompt: "Say the isolated sound: 'र' (/ɾ/)",
        audioCadence: "R-a-a",
        placement: "Tongue tip taps briskly against the alveolar ridge behind upper front teeth.",
        airflow: "Continuous pulmonary airflow with rapid alveolar tap.",
        pediatricCue: "🏎️ Race car rev! Make your tongue do a super quick tap dance right behind your top teeth: Brrr-ra!",
        tonguePosition: { height: 0.65, advancement: 0.7, curl: 0.2 },
        lipPosition: { open: 0.35, round: 0.1 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "रेलगाड़ी",
        points: 35,
        transliteration: "Railgaadi",
        meaning: "Train",
        emoji: "🚂",
        syllables: ["रेल (Rail)", "गा (gaa)", "ड़ी (di)"],
        cadenceText: "Rail... gaa... di",
        audioCadence: "रेल... गा... ड़ी"
      },
      sentenceLevel: {
        sentence: "छुक-छुक करती रेलगाड़ी स्टेशन आई।",
        points: 50,
        transliteration: "Chhuk-chhuk karti railgaadi station aayi.",
        meaning: "The train arrived at the station with a chug.",
        targetHighlights: ["रेलगाड़ी"]
      },
      commonError: "Gliding: Replacing 'र' with 'य' (/j/) or 'व' (/w/) -> 'येलगाड़ी'.",
      therapistNotes: "Very frequent pediatric articulation hurdle. Practice 't-d-t-d' rapid sequencing first.",
      unlocked3D: false
    },
    {
      id: "la",
      symbol: "ल",
      name: "La (ल)",
      group: "anthastha",
      groupTitle: "🌊 Anthastha • अन्तःस्थ (Approximants)",
      category: "Anthastha (Alveolar Lateral / अन्तःस्थ)",
      emotion: "orb-sadness",
      ipa: "/l/",
      soundLevel: {
        target: "ल",
        points: 20,
        prompt: "Say the lateral sound: 'ल' (/l/)",
        audioCadence: "L-a-a",
        placement: "Tongue tip anchors firmly to alveolar ridge while air streams out smoothly around both sides.",
        airflow: "Bilateral oral airflow stream.",
        pediatricCue: "🟡 Sweet laddu lick! Anchor the tip of your tongue to the roof and sing: La-la-la!",
        tonguePosition: { height: 0.7, advancement: 0.75, curl: 0.0 },
        lipPosition: { open: 0.4, round: 0.0 },
        jawPosition: { open: 0.32 }
      },
      wordLevel: {
        word: "लड्डू",
        points: 35,
        transliteration: "Laddu",
        meaning: "Sweet Laddu",
        emoji: "🟡",
        syllables: ["लड (Lad)", "डू (doo)"],
        cadenceText: "Lad... doo",
        audioCadence: "लड... डू"
      },
      sentenceLevel: {
        sentence: "दादी ने गोल और मीठे लड्डू बनाए।",
        points: 50,
        transliteration: "Daadi ne gol aur meethe laddu banaaye.",
        meaning: "Grandmother made sweet round laddus.",
        targetHighlights: ["लड्डू"]
      },
      commonError: "Gliding to 'व' or 'य'.",
      therapistNotes: "Firm central contact with free lateral airflow escape.",
      unlocked3D: false
    },
    {
      id: "va",
      symbol: "व",
      name: "Va (व)",
      group: "anthastha",
      groupTitle: "🌊 Anthastha • अन्तःस्थ (Approximants)",
      category: "Anthastha (Labiodental Approximant / अन्तःस्थ)",
      emotion: "orb-anxiety",
      ipa: "/ʋ/",
      soundLevel: {
        target: "व",
        points: 20,
        prompt: "Say the approximant sound: 'व' (/ʋ/)",
        audioCadence: "V-a-a",
        placement: "Lower lip approaches upper front incisors gently without friction burst.",
        airflow: "Smooth continuous labiodental airflow.",
        pediatricCue: "🌲 Forest breeze! Lightly touch your lower lip to upper teeth and say: Va, Va!",
        tonguePosition: { height: 0.4, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.25, round: 0.1 },
        jawPosition: { open: 0.28 }
      },
      wordLevel: {
        word: "वन",
        points: 35,
        transliteration: "Van",
        meaning: "Forest",
        emoji: "🌲",
        syllables: ["व (Van)", "न (n)"],
        cadenceText: "Va... n",
        audioCadence: "व... न"
      },
      sentenceLevel: {
        sentence: "हरे-भरे वन में ऊंचे-ऊंचे पेड़ हैं।",
        points: 50,
        transliteration: "Hare-bhare van mein oonche-oonche ped hain.",
        meaning: "Tall green trees grow in the lush forest.",
        targetHighlights: ["वन"]
      },
      commonError: "Bilabial substitution 'ब' (/b/) or English heavy fricative /v/.",
      therapistNotes: "Aim for soft Hindi labiodental glide /ʋ/ without heavy friction.",
      unlocked3D: false
    },

    /* =========================================================
       7. USHMA & GLOTTAL • ऊष्म (FRICATIVES & GLOTTAL: श, ष, स, ह)
       ========================================================= */
    {
      id: "sha",
      symbol: "श",
      name: "Śa (श)",
      group: "ushma",
      groupTitle: "💨 Ushma & Glottal • ऊष्म (Fricatives & Glottal)",
      category: "Ushma (Palato-Alveolar Fricative / तालव्य श)",
      emotion: "orb-disgust",
      ipa: "/ʃ/",
      soundLevel: {
        target: "श",
        points: 20,
        prompt: "Say the quiet sound: 'श' (/ʃ/)",
        audioCadence: "Sh-sh-a",
        placement: "Tongue blade arches towards postalveolar palate; lips gently flared.",
        airflow: "Broad whispering friction stream.",
        pediatricCue: "🤫 Quiet sleeping lion! Put a finger to your lips and blow a soft breeze: Shhhhh!",
        tonguePosition: { height: 0.7, advancement: 0.4, curl: 0.0 },
        lipPosition: { open: 0.3, round: 0.3 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "शेर",
        points: 35,
        transliteration: "Sher",
        meaning: "Lion",
        emoji: "🦁",
        syllables: ["शे (She)", "र (r)"],
        cadenceText: "She... r",
        audioCadence: "शे... र"
      },
      sentenceLevel: {
        sentence: "जंगल का राजा शेर जोर से दहाड़ता है।",
        points: 50,
        transliteration: "Jangal ka raaja sher zor se dahaadta hai.",
        meaning: "The lion, king of the jungle, roars proudly.",
        targetHighlights: ["शेर"]
      },
      commonError: "Depalatalization to dental 'स' (/s/) -> 'सेर'.",
      therapistNotes: "Slight lip rounding aids the postalveolar resonance cavity for श.",
      unlocked3D: false
    },
    {
      id: "sha_retro",
      symbol: "ष",
      name: "Ṣa (ष)",
      group: "ushma",
      groupTitle: "💨 Ushma & Glottal • ऊष्म (Fricatives & Glottal)",
      category: "Ushma (Retroflex Sibilant / मूर्धन्य ष)",
      emotion: "orb-anger",
      ipa: "/ʂ/",
      soundLevel: {
        target: "ष",
        points: 20,
        prompt: "Say the retroflex sibilant sound: 'ष' (/ʂ/)",
        audioCadence: "Sh-a-a (Retroflex)",
        placement: "Curled tongue tip backwards to palate releasing hissing retroflex friction.",
        airflow: "Retroflex turbulent friction.",
        pediatricCue: "⬡ Six-sided hexagon! Curl tongue tip backwards and hiss like a mountain breeze: Sha!",
        tonguePosition: { height: 0.72, advancement: 0.25, curl: 0.75 },
        lipPosition: { open: 0.3, round: 0.2 },
        jawPosition: { open: 0.25 }
      },
      wordLevel: {
        word: "षट्कोण",
        points: 35,
        transliteration: "Shatkon",
        meaning: "Hexagon",
        emoji: "⬡",
        syllables: ["षट (Shat)", "कोण (kon)"],
        cadenceText: "Shat... kon",
        audioCadence: "षट... कोण"
      },
      sentenceLevel: {
        sentence: "छह भुजाओं वाली आकृति षट्कोण कहलाती है।",
        points: 50,
        transliteration: "Chhah bhujaon waali aakriti shatkon kahlaati hai.",
        meaning: "A six-sided polygon is called a hexagon.",
        targetHighlights: ["षट्कोण"]
      },
      commonError: "Substitution with palatal 'श' or dental 'स'.",
      therapistNotes: "Maintain apical retroflex posturing throughout friction duration.",
      unlocked3D: false
    },
    {
      id: "sa",
      symbol: "स",
      name: "Sa (स)",
      group: "ushma",
      groupTitle: "💨 Ushma & Glottal • ऊष्म (Fricatives & Glottal)",
      category: "Ushma (Dental Sibilant Fricative / दन्त्य स)",
      emotion: "orb-joy",
      ipa: "/s/",
      soundLevel: {
        target: "स",
        points: 20,
        prompt: "Say the isolated sound: 'स' (/s/)",
        audioCadence: "S-s-s-a",
        placement: "Tongue tip close to alveolar ridge creating narrow groove. Air shoots forward in high-frequency hiss.",
        airflow: "Continuous high-velocity central airflow stream.",
        pediatricCue: "🐍 Friendly snake hiss! Keep your teeth smiling close and blow a cool gentle breeze: Sssss!",
        tonguePosition: { height: 0.68, advancement: 0.75, curl: 0.0 },
        lipPosition: { open: 0.25, round: 0.0 },
        jawPosition: { open: 0.2 }
      },
      wordLevel: {
        word: "सेब",
        points: 35,
        transliteration: "Seb",
        meaning: "Apple",
        emoji: "🍎",
        syllables: ["से (Se)", "ब (b)"],
        cadenceText: "Se... b",
        audioCadence: "से... ब"
      },
      sentenceLevel: {
        sentence: "समीर रोज एक मीठा सेब खाता है।",
        points: 50,
        transliteration: "Sameer roz ek meetha seb khaata hai.",
        meaning: "Sameer eats a sweet apple every single day.",
        targetHighlights: ["समीर", "सेब"]
      },
      commonError: "Interdental lisp: Tongue pokes between teeth causing 'th' sound -> 'थेब'.",
      therapistNotes: "Use 'keep the snake behind the cage (teeth)' metaphor for young learners.",
      unlocked3D: false
    },
    {
      id: "ha",
      symbol: "ह",
      name: "Ha (ह)",
      group: "ushma",
      groupTitle: "💨 Ushma & Glottal • ऊष्म (Fricatives & Glottal)",
      category: "Glottal (Voiced Glottal Fricative / कण्ठ्य ह)",
      emotion: "orb-anxiety",
      ipa: "/ɦ/",
      soundLevel: {
        target: "ह",
        points: 20,
        prompt: "Say the glottal sound: 'ह' (/ɦ/)",
        audioCadence: "H-a-a",
        placement: "Vocal folds open slightly in pharynx/glottis, releasing a deep, warm exhalation.",
        airflow: "Glottal warm pulmonary breath.",
        pediatricCue: "🐘 Friendly elephant sigh! Open your mouth wide and sigh a warm gentle breath: Haa-Ha!",
        tonguePosition: { height: 0.35, advancement: 0.0, curl: 0.0 },
        lipPosition: { open: 0.5, round: 0.0 },
        jawPosition: { open: 0.45 }
      },
      wordLevel: {
        word: "हाथी",
        points: 35,
        transliteration: "Haathi",
        meaning: "Elephant",
        emoji: "🐘",
        syllables: ["हा (Haa)", "थी (thee)"],
        cadenceText: "Haa... thee",
        audioCadence: "हा... थी"
      },
      sentenceLevel: {
        sentence: "विशाल हाथी अपनी सूंड हिलाता है।",
        points: 50,
        transliteration: "Vishaal haathi apni soondh hilaata hai.",
        meaning: "The gentle giant elephant waves his long trunk.",
        targetHighlights: ["हाथी"]
      },
      commonError: "Weak exhalation or glottal closure omission.",
      therapistNotes: "Focus on relaxed glottal constriction and gentle pulmonary flow.",
      unlocked3D: false
    },

    /* =========================================================
       8. SAMYUKT VYANJAN • संयुक्ताक्षर (BLENDS: क्ष, त्र, ज्ञ, श्र)
       ========================================================= */
    {
      id: "ksha",
      symbol: "क्ष",
      name: "Kṣa (क्ष)",
      group: "blends",
      groupTitle: "🔀 Samyukt Vyanjan • संयुक्ताक्षर (Blends)",
      category: "Blends (Samyukt Vyanjan / क + ष)",
      emotion: "orb-joy",
      ipa: "/kʃ/",
      soundLevel: {
        target: "क्ष",
        points: 20,
        prompt: "Say the blend sound: 'क्ष' (/kʃ/)",
        audioCadence: "K-sh-a",
        placement: "Rapid transition from velar stop 'क' (/k/) into retroflex/postalveolar friction 'ष' (/ʃ/).",
        airflow: "Stop release immediately into turbulent sibilance.",
        pediatricCue: "⚔️ Warrior sword swoosh! Tap your velar dragon 'k' and quickly swoosh into 'sh': Ksha!",
        tonguePosition: { height: 0.78, advancement: -0.2, curl: 0.3 },
        lipPosition: { open: 0.35, round: 0.2 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "क्षत्रिय",
        points: 35,
        transliteration: "Kshatriya",
        meaning: "Warrior",
        emoji: "⚔️",
        syllables: ["क्ष (Ksha)", "त्रि (tri)", "य (ya)"],
        cadenceText: "Ksha... tri... ya",
        audioCadence: "क्ष... त्रि... य"
      },
      sentenceLevel: {
        sentence: "वीर क्षत्रिय देश की रक्षा करते हैं।",
        points: 50,
        transliteration: "Veer kshatriya desh ki raksha karte hain.",
        meaning: "The brave warriors defend the homeland.",
        targetHighlights: ["क्षत्रिय", "रक्षा"]
      },
      commonError: "Cluster reduction: Dropping 'क' to say only 'छ' or 'स'.",
      therapistNotes: "Segment into 'क + श' before blending smoothly into 'क्ष'.",
      unlocked3D: false
    },
    {
      id: "tra",
      symbol: "त्र",
      name: "Tra (त्र)",
      group: "blends",
      groupTitle: "🔀 Samyukt Vyanjan • संयुक्ताक्षर (Blends)",
      category: "Blends (Samyukt Vyanjan / त + र)",
      emotion: "orb-fear",
      ipa: "/t̪r/",
      soundLevel: {
        target: "त्र",
        points: 20,
        prompt: "Say the blend sound: 'त्र' (/t̪r/)",
        audioCadence: "T-r-a",
        placement: "Dental stop 'त' (/t̪/) immediately sequencing into alveolar tap 'र' (/r/).",
        airflow: "Dental release with rapid alveolar tap.",
        pediatricCue: "🔱 Shining trident! Tap your front teeth and tap dance into your race car: Tra!",
        tonguePosition: { height: 0.65, advancement: 0.75, curl: 0.1 },
        lipPosition: { open: 0.35, round: 0.1 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "त्रिशूल",
        points: 35,
        transliteration: "Trishool",
        meaning: "Trident",
        emoji: "🔱",
        syllables: ["त्रि (Tri)", "शूल (shool)"],
        cadenceText: "Tri... shool",
        audioCadence: "त्रि... शूल"
      },
      sentenceLevel: {
        sentence: "मंदिर के शिखर पर सोने का त्रिशूल चमका।",
        points: 50,
        transliteration: "Mandir ke shikhar par sone ka trishool chamka.",
        meaning: "The golden trident shone brightly atop the temple.",
        targetHighlights: ["त्रिशूल"]
      },
      commonError: "Cluster reduction: Deleting 'र' -> 'तिशूल'.",
      therapistNotes: "Practice rapid dental-alveolar transition: 't... ra'.",
      unlocked3D: false
    },
    {
      id: "gya",
      symbol: "ज्ञ",
      name: "Jña / Gya (ज्ञ)",
      group: "blends",
      groupTitle: "🔀 Samyukt Vyanjan • संयुक्ताक्षर (Blends)",
      category: "Blends (Samyukt Vyanjan / ज + ञ)",
      emotion: "orb-sadness",
      ipa: "/ɡj/ /d͡ʒɲ/",
      soundLevel: {
        target: "ज्ञ",
        points: 20,
        prompt: "Say the blend sound: 'ज्ञ' (/ɡj/)",
        audioCadence: "Gy-a-a",
        placement: "Palatal glide starting from voiced stop into nasalized palatal transition.",
        airflow: "Voiced oral-nasal compound airflow.",
        pediatricCue: "📖 Wise teacher's bell! Start with gentle 'g' and glide into nasal 'ya': Gya!",
        tonguePosition: { height: 0.75, advancement: 0.3, curl: 0.0 },
        lipPosition: { open: 0.35, round: 0.0 },
        jawPosition: { open: 0.3 }
      },
      wordLevel: {
        word: "ज्ञानी",
        points: 35,
        transliteration: "Gyaani",
        meaning: "Wise Scholar",
        emoji: "📖",
        syllables: ["ज्ञा (Gyaa)", "नी (nee)"],
        cadenceText: "Gyaa... nee",
        audioCadence: "ज्ञा... नी"
      },
      sentenceLevel: {
        sentence: "ज्ञानी गुरु जी ने बच्चों को ज्ञान दिया।",
        points: 50,
        transliteration: "Gyaani guru ji ne bachhon ko gyaan diya.",
        meaning: "The wise teacher shared inspiring knowledge.",
        targetHighlights: ["ज्ञानी", "ज्ञान"]
      },
      commonError: "Pronouncing pure 'ग' or 'ज' without proper glide.",
      therapistNotes: "Standard modern Hindi realization is [ɡj] with nasalization.",
      unlocked3D: false
    },
    {
      id: "shra",
      symbol: "श्र",
      name: "Śra (श्र)",
      group: "blends",
      groupTitle: "🔀 Samyukt Vyanjan • संयुक्ताक्षर (Blends)",
      category: "Blends (Samyukt Vyanjan / श + र)",
      emotion: "orb-anxiety",
      ipa: "/ʃr/",
      soundLevel: {
        target: "श्र",
        points: 20,
        prompt: "Say the blend sound: 'श्र' (/ʃr/)",
        audioCadence: "Sh-r-a",
        placement: "Palato-alveolar friction 'श' (/ʃ/) immediately leading into alveolar tap 'र' (/r/).",
        airflow: "Fricative stream transitioning into alveolar tap.",
        pediatricCue: "👷 Dedicated worker! Start with soft 'sh' and slide straight into 'ra': Shra!",
        tonguePosition: { height: 0.68, advancement: 0.5, curl: 0.15 },
        lipPosition: { open: 0.32, round: 0.2 },
        jawPosition: { open: 0.28 }
      },
      wordLevel: {
        word: "श्रमिक",
        points: 35,
        transliteration: "Shramik",
        meaning: "Worker",
        emoji: "👷",
        syllables: ["श्र (Shra)", "मिक (mik)"],
        cadenceText: "Shra... mik",
        audioCadence: "श्र... मिक"
      },
      sentenceLevel: {
        sentence: "मेहनती श्रमिक हर रोज नया काम करता है।",
        points: 50,
        transliteration: "Mehnati shramik har roz naya kaam karta hai.",
        meaning: "The diligent worker accomplishes meaningful tasks daily.",
        targetHighlights: ["श्रमिक"]
      },
      commonError: "Simplification to 'श' or 'स'.",
      therapistNotes: "Teach prolonged 'shhhh' then add tongue tip tap 'ra'.",
      unlocked3D: false
    }
  ]
};

function getAllPhonemes(lang = 'hindi') {
  return PHONEME_DATA.hindi;
}

function getPhonemeById(id) {
  const all = getAllPhonemes();
  return all.find(p => p.id === id) || PHONEME_DATA.hindi[0];
}
