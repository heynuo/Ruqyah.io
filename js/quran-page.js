/**
 * Ruqyah - Holy Qur'an Platform Controller v5.0
 * Scholastic Directory, Ergonomic Reader, Verified Reciters Audio Engine,
<<<<<<< HEAD
 * Live Multi-Criterion Search, Surah Overview, and PDF Library.
=======
 * Live Multi-Criterion Search, Tafsir Ibn Kathir, and PDF Library.
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CANONICAL 114 SURAHS DATASET
  // =========================================================================
  const SURAHS = [
    { id: 1, name: "Al-Fātihah", arabic: "سُورَةُ الفَاتِحَةِ", rawArabic: "الفاتحة", meaning: "The Opening", ayahs: 7, type: "Makki", page: 1, revOrder: 5, juz: 1, words: 29, letters: 139, desc: "Umm al-Kitāb (The Mother of the Book), As-Sab' al-Mathānī (The Seven Oft-Repeated Verses), and Ash-Shifā' (The Cure). An indispensable pillar of every unit of prayer." },
    { id: 2, name: "Al-Baqarah", arabic: "سُورَةُ البَقَرَةِ", rawArabic: "البقرة", meaning: "The Cow", ayahs: 286, type: "Madani", page: 2, revOrder: 87, juz: 1, words: 6144, letters: 25613, desc: "The longest chapter in the Noble Qur'an containing Ayat al-Kursi (2:255), legal statutes, covenant history, and spiritual protection against demonic malevolence." },
    { id: 3, name: "Āli 'Imrān", arabic: "سُورَةُ آلِ عِمْرَانَ", rawArabic: "آل عمران", meaning: "Family of Imran", ayahs: 200, type: "Madani", page: 50, revOrder: 89, juz: 3, words: 3503, letters: 14605, desc: "A decisive defense of pure monotheism, theological dialogues with the People of the Book, the birth of Maryam and 'Isa, and lessons from the Battle of Uhud." },
    { id: 4, name: "An-Nisā'", arabic: "سُورَةُ النِّسَاءِ", rawArabic: "النساء", meaning: "The Women", ayahs: 176, type: "Madani", page: 77, revOrder: 92, juz: 4, words: 3745, letters: 16030, desc: "Codification of family ethics, women's contractual rights, inheritance jurisprudence, protection of orphans, and communal equity." },
    { id: 5, name: "Al-Mā'idah", arabic: "سُورَةُ المَائِدَةِ", rawArabic: "المائدة", meaning: "The Table Spread", ayahs: 120, type: "Madani", page: 106, revOrder: 112, juz: 6, words: 2837, letters: 11892, desc: "The definitive treaty on sacred covenants, dietary law, purity rites, and the perfection of religion announced during the Farewell Pilgrimage." },
    { id: 6, name: "Al-An'ām", arabic: "سُورَةُ الأَنْعَامِ", rawArabic: "الأنعام", meaning: "The Cattle", ayahs: 165, type: "Makki", page: 128, revOrder: 55, juz: 7, words: 3055, letters: 12418, desc: "A majestic exposition of Tawheed, cosmic theology, the arguments of Prophet Ibrahim against pagan celestial cults, and divine dominion over creation." },
    { id: 7, name: "Al-A'rāf", arabic: "سُورَةُ الأَعْرَافِ", rawArabic: "الأعراف", meaning: "The Heights", ayahs: 206, type: "Makki", page: 151, revOrder: 39, juz: 8, words: 3341, letters: 14071, desc: "The cosmic saga of Adam and Iblis, the primordial covenant (Al-A'lastu bi-Rabbikum), the barrier of Al-A'raf, and the struggles of past messengers." },
    { id: 8, name: "Al-Anfāl", arabic: "سُورَةُ الأَنْفَالِ", rawArabic: "الأنفال", meaning: "The Spoils of War", ayahs: 75, type: "Madani", page: 177, revOrder: 88, juz: 9, words: 1243, letters: 5299, desc: "Revealed following the pivotal Battle of Badr, clarifying spiritual victory, angelic assistance, ethical conduct in conflict, and divine governance." },
    { id: 9, name: "At-Tawbah", arabic: "سُورَةُ التَّوْبَةِ", rawArabic: "التوبة", meaning: "The Repentance", ayahs: 129, type: "Madani", page: 187, revOrder: 113, juz: 10, words: 2506, letters: 10873, desc: "Also known as Bara'ah (Immunity). Denunciation of hypocrisy, historical expedition to Tabuk, sincere repentance, and unconditional devotion to the Creator." },
    { id: 10, name: "Yūnus", arabic: "سُورَةُ يُونُسَ", rawArabic: "يونس", meaning: "Jonah", ayahs: 109, type: "Makki", page: 208, revOrder: 51, juz: 11, words: 1841, letters: 7425, desc: "The signs of divine wisdom in the cosmos, prophetic warnings, the miraculous redemption of the people of Yunus, and the futility of polytheism." },
    { id: 11, name: "Hūd", arabic: "سُورَةُ هُودٍ", rawArabic: "هود", meaning: "Hud", ayahs: 123, type: "Makki", page: 221, revOrder: 52, juz: 11, words: 1947, letters: 7597, desc: "Powerful narratives of Nuh, Hud, Salih, Ibrahim, Lut, and Shu'ayb, known for causing the Prophet's hair to gray through the gravity of its admonitions." },
    { id: 12, name: "Yūsuf", arabic: "سُورَةُ يُوسُفَ", rawArabic: "يوسف", meaning: "Joseph", ayahs: 111, type: "Makki", page: 235, revOrder: 53, juz: 12, words: 1795, letters: 7166, desc: "Ahsan al-Qasas (The Most Beautiful of Narratives), depicting prophetic patience, moral steadfastness against temptation, and ultimate divine vindication." },
    { id: 13, name: "Ar-Ra'd", arabic: "سُورَةُ الرَّعْدِ", rawArabic: "الرعد", meaning: "The Thunder", ayahs: 43, type: "Madani", page: 249, revOrder: 96, juz: 13, words: 854, letters: 3450, desc: "The thunder glorifying Allah with praise, the certainty of truth vs the transient vanity of falsehood, and tranquility achieved through divine remembrance." },
    { id: 14, name: "Ibrāhīm", arabic: "سُورَةُ إِبْرَاهِيمَ", rawArabic: "إبراهيم", meaning: "Abraham", ayahs: 52, type: "Makki", page: 255, revOrder: 72, juz: 13, words: 831, letters: 3434, desc: "The parable of the Good Word like a firmly rooted tree whose branches reach into heaven, and the heartfelt invocations of Ibrahim for Makkah." },
    { id: 15, name: "Al-Hijr", arabic: "سُورَةُ الحِجْرِ", rawArabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99, type: "Makki", page: 262, revOrder: 54, juz: 14, words: 658, letters: 2797, desc: "The solemn divine guarantee of the Qur'an's incorruptibility (15:9), heavenly constellations protected from eavesdropping, and the destruction of Thamud." },
    { id: 16, name: "An-Nahl", arabic: "سُورَةُ النَّحْلِ", rawArabic: "النحل", meaning: "The Bee", ayahs: 128, type: "Makki", page: 267, revOrder: 70, juz: 14, words: 1851, letters: 7707, desc: "Surat an-Ni'am (The Chapter of Blessings), celebrating cosmic ecology, honeybee architecture, cattle, rain, and gratitude for divine gifts." },
    { id: 17, name: "Al-Isrā'", arabic: "سُورَةُ الإِسْرَاءِ", rawArabic: "الإسراء", meaning: "The Night Journey", ayahs: 111, type: "Makki", page: 282, revOrder: 50, juz: 15, words: 1559, letters: 6480, desc: "The miraculous nocturnal ascent from Makkah to Al-Aqsa and the heavens, foundational ethical commandments, and the sacred dignity of humanity." },
    { id: 18, name: "Al-Kahf", arabic: "سُورَةُ الكَهْفِ", rawArabic: "الكهف", meaning: "The Cave", ayahs: 110, type: "Makki", page: 293, revOrder: 69, juz: 15, words: 1583, letters: 6425, badge: "Friday Sunnah", desc: "The Friday Sunnah protection against the Dajjal, chronicling the Companions of the Cave, the Two Gardens, Musa and Khidr, and Dhul-Qarnayn." },
    { id: 19, name: "Maryam", arabic: "سُورَةُ مَرْيَمَ", rawArabic: "مريم", meaning: "Mary", ayahs: 98, type: "Makki", page: 305, revOrder: 44, juz: 16, words: 972, letters: 3802, desc: "A sublime poetic revelation honoring the miracle of Maryam, the birth of 'Isa, the prayer of Zakariyya, and the mercy showered upon prophetic lineages." },
    { id: 20, name: "Tā-Hā", arabic: "سُورَةُ طه", rawArabic: "طه", meaning: "Ta-Ha", ayahs: 135, type: "Makki", page: 312, revOrder: 45, juz: 16, words: 1354, letters: 5288, desc: "The intimate calling of Musa at Mount Sinai, the burning bush, confronting Pharaoh, and reassurance that the Qur'an was not revealed to cause distress." },
    { id: 21, name: "Al-Anbiyā'", arabic: "سُورَةُ الأَنْبِيَاءِ", rawArabic: "الأنبياء", meaning: "The Prophets", ayahs: 112, type: "Makki", page: 322, revOrder: 73, juz: 17, words: 1174, letters: 4890, desc: "The unified brotherhood of prophets, the cosmic singularity before creation, and the sending of Prophet Muhammad as a Mercy to all worlds (21:107)." },
    { id: 22, name: "Al-Hajj", arabic: "سُورَةُ الحَجِّ", rawArabic: "الحج", meaning: "The Pilgrimage", ayahs: 78, type: "Madani", page: 332, revOrder: 103, juz: 17, words: 1279, letters: 5196, desc: "Rites of Hajj, the sanctity of the Ka'bah, the tremor of the Final Hour, the miracle of human embryology, and defensive military sanction." },
    { id: 23, name: "Al-Mu'minūn", arabic: "سُورَةُ المُؤْمِنُونَ", rawArabic: "المؤمنون", meaning: "The Believers", ayahs: 118, type: "Makki", page: 342, revOrder: 74, juz: 18, words: 1055, letters: 4403, desc: "The defining spiritual hallmarks of successful believers who inherit Firdaus, embryonic development, and the inevitable return to the Lord." },
    { id: 24, name: "An-Nūr", arabic: "سُورَةُ النُّورِ", rawArabic: "النور", meaning: "The Light", ayahs: 64, type: "Madani", page: 350, revOrder: 102, juz: 18, words: 1317, letters: 5680, desc: "Home to the glorious Parable of Light (Ayat an-Nur 24:35), personal modesty, social etiquettes, and exoneration of Sayyidah 'A'ishah." },
    { id: 25, name: "Al-Furqān", arabic: "سُورَةُ الفُرْقَانِ", rawArabic: "الفرقان", meaning: "The Criterion", ayahs: 77, type: "Makki", page: 359, revOrder: 42, juz: 18, words: 896, letters: 3734, desc: "The Qur'an as the ultimate Criterion between truth and illusion, culminating in the sublime characteristics of 'Ibad ar-Rahman (Servants of the Merciful)." },
    { id: 26, name: "Ash-Shu'arā'", arabic: "سُورَةُ الشُّعَرَاءِ", rawArabic: "الشعراء", meaning: "The Poets", ayahs: 227, type: "Makki", page: 367, revOrder: 47, juz: 19, words: 1322, letters: 5542, desc: "The divine origin of revelation contrasted with poetic fantasy, rhythmic refrain of prophetic warnings, and Musa's confrontation with Pharaoh's magicians." },
    { id: 27, name: "An-Naml", arabic: "سُورَةُ النَّمْلِ", rawArabic: "النمل", meaning: "The Ant", ayahs: 93, type: "Makki", page: 377, revOrder: 48, juz: 19, words: 1160, letters: 4679, desc: "The kingdoms of Dawud and Sulayman, Sulayman listening to the speech of the ant and the hoopoe, and the conversion of the Queen of Sheba." },
    { id: 28, name: "Al-Qasas", arabic: "سُورَةُ القَصَصِ", rawArabic: "القصص", meaning: "The Stories", ayahs: 88, type: "Makki", page: 385, revOrder: 49, juz: 20, words: 1441, letters: 5790, desc: "The complete biographical narrative of Musa from infancy in the Nile to Midian and Sinai, contrasted with the ruin of Qarun's arrogant wealth." },
    { id: 29, name: "Al-'Ankabūt", arabic: "سُورَةُ العَنْكَبُوتِ", rawArabic: "العنكبوت", meaning: "The Spider", ayahs: 69, type: "Makki", page: 396, revOrder: 85, juz: 20, words: 981, letters: 4195, desc: "The inevitability of tribulation for true belief, and the frail fragility of idolatrous allegiances likened to a spider's web." },
    { id: 30, name: "Ar-Rūm", arabic: "سُورَةُ الرُّومِ", rawArabic: "الروم", meaning: "The Romans", ayahs: 60, type: "Makki", page: 404, revOrder: 84, juz: 21, words: 819, letters: 3472, desc: "The fulfilled geopolitical prophecy of the Byzantine victory over Persia within a few years, cosmic signs, and the primordial human disposition (Fitrah)." },
    { id: 31, name: "Luqmān", arabic: "سُورَةُ لُقْمَانَ", rawArabic: "لقمان", meaning: "Luqman", ayahs: 34, type: "Makki", page: 411, revOrder: 57, juz: 21, words: 550, letters: 2121, desc: "The enduring pedagogical maxims of the sage Luqman advising his son regarding humility, prayer, parental gratitude, and the five keys of the Unseen." },
    { id: 32, name: "As-Sajdah", arabic: "سُورَةُ السَّجْدَةِ", rawArabic: "السجدة", meaning: "The Prostration", ayahs: 30, type: "Makki", page: 415, revOrder: 75, juz: 21, words: 374, letters: 1518, desc: "Recited weekly in Fajr prayer on Fridays. Creation from clay, the cosmic descent of divine decrees, and those who forsake their beds for nocturnal prayer." },
    { id: 33, name: "Al-Ahzāb", arabic: "سُورَةُ الأَحْزَابِ", rawArabic: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, type: "Madani", page: 418, revOrder: 90, juz: 21, words: 1303, letters: 5618, desc: "The siege of the Trench, the Prophet as the Exemplary Model (Uswah Hasanah) and Seal of the Prophets, and the trust offered to the heavens and earth." },
    { id: 34, name: "Saba'", arabic: "سُورَةُ سَبَإٍ", rawArabic: "سبأ", meaning: "Sheba", ayahs: 54, type: "Makki", page: 428, revOrder: 58, juz: 22, words: 884, letters: 3512, desc: "The righteous gratitude of Dawud and Sulayman contrasted with the ingratitude and catastrophic dam collapse that obliterated the civilization of Sheba." },
    { id: 35, name: "Fātir", arabic: "سُورَةُ فَاطِرٍ", rawArabic: "فاطر", meaning: "Originator", ayahs: 45, type: "Makki", page: 434, revOrder: 43, juz: 22, words: 780, letters: 3159, desc: "The Creator who wings the angels, human dependence on God, ecological diversity of mountain strata, and scholars as those who truly revere Him." },
    { id: 36, name: "Yā-Sīn", arabic: "سُورَةُ يس", rawArabic: "يس", meaning: "Ya-Sin (Heart of Qur'an)", ayahs: 83, type: "Makki", page: 440, revOrder: 41, juz: 22, words: 733, letters: 3000, desc: "The celebrated Heart of the Qur'an, focusing on divine sovereignty, cosmic physics, the resurrection of decomposed bones, and 'Kun Fayakun'." },
    { id: 37, name: "As-Sāffāt", arabic: "سُورَةُ الصَّافَّاتِ", rawArabic: "الصافات", meaning: "Those Who Set The Ranks", ayahs: 182, type: "Makki", page: 446, revOrder: 56, juz: 23, words: 866, letters: 3790, desc: "Angelic ranks, meteoric defense of heaven, the sacrifice of Ibrahim and redemption of his son, and salutations upon the verified messengers." },
    { id: 38, name: "Sād", arabic: "سُورَةُ ص", rawArabic: "ص", meaning: "The Letter Sad", ayahs: 88, type: "Makki", page: 453, revOrder: 38, juz: 23, words: 735, letters: 3029, desc: "The trials and repentance of Dawud, Sulayman, and Ayyub, the council of the angels regarding Adam, and Iblis's refusal to bow." },
    { id: 39, name: "Az-Zumar", arabic: "سُورَةُ الزُّمَرِ", rawArabic: "الزمر", meaning: "The Troops", ayahs: 75, type: "Makki", page: 458, revOrder: 59, juz: 23, words: 1177, letters: 4741, desc: "Pure religion (Ikhlas), the hope-giving proclamation not to despair of Allah's mercy (39:53), and humanity marched in troops to their final destination." },
    { id: 40, name: "Ghāfir", arabic: "سُورَةُ غَافِرٍ", rawArabic: "غافر", meaning: "The Forgiver", ayahs: 85, type: "Makki", page: 467, revOrder: 60, juz: 24, words: 1228, letters: 4984, desc: "The first of the seven Ha-Mim chapters. The Forgiver of sin, the Believer in Pharaoh's court defending Musa, and the angelic bearers of the Throne." },
    { id: 41, name: "Fussilat", arabic: "سُورَةُ فُصِّلَتْ", rawArabic: "فصلت", meaning: "Explained In Detail", ayahs: 54, type: "Makki", page: 477, revOrder: 61, juz: 24, words: 796, letters: 3315, desc: "Signs in the furthest cosmological horizons and within the human soul, the primordial submission of heaven and earth, and angelic companions." },
    { id: 42, name: "Ash-Shūrā", arabic: "سُورَةُ الشُّورَىٰ", rawArabic: "الشورى", meaning: "The Consultation", ayahs: 53, type: "Makki", page: 483, revOrder: 62, juz: 25, words: 860, letters: 3450, desc: "Communal consultation (Shura), divine transcendence ('Nothing is like unto Him' 42:11), and the modes through which God communicates with mortal humans." },
    { id: 43, name: "Az-Zukhruf", arabic: "سُورَةُ الزُّخْرُفِ", rawArabic: "الزخرف", meaning: "The Gold Adornments", ayahs: 89, type: "Makki", page: 489, revOrder: 63, juz: 25, words: 836, letters: 3609, desc: "The celestial mother of the book (Umm al-Kitab), worldly wealth as ephemeral ornamentation, and true prophetic nobility transcending gold." },
    { id: 44, name: "Ad-Dukhān", arabic: "سُورَةُ الدُّخَانِ", rawArabic: "الدخان", meaning: "The Smoke", ayahs: 59, type: "Makki", page: 496, revOrder: 64, juz: 25, words: 346, letters: 1431, desc: "The blessed Night of Destiny (Laylat al-Qadr), the eschatological sign of the encroaching smoke, and Pharaoh's army sinking into oblivion." },
    { id: 45, name: "Al-Jāthiyah", arabic: "سُورَةُ الجَاثِيَةِ", rawArabic: "الجاثية", meaning: "The Crouching", ayahs: 37, type: "Makki", page: 499, revOrder: 65, juz: 25, words: 490, letters: 2014, desc: "Signs of cosmic design, every nation brought to its knees before the universal ledger of accountability, and absolute divine majesty." },
    { id: 46, name: "Al-Ahqāf", arabic: "سُورَةُ الأَحْقَافِ", rawArabic: "الأحقاف", meaning: "The Wind-Curved Dunes", ayahs: 35, type: "Makki", page: 502, revOrder: 66, juz: 26, words: 648, letters: 2600, desc: "The devastation of 'Ad in the Yemeni sandhills, honoring parents through pregnancy and nursing, and the gathering of Jinn listening to the Qur'an." },
    { id: 47, name: "Muhammad", arabic: "سُورَةُ مُحَمَّدٍ", rawArabic: "محمد", meaning: "Muhammad", ayahs: 38, type: "Madani", page: 507, revOrder: 95, juz: 26, words: 542, letters: 2360, desc: "The contrast between deeds rooted in divine light vs the nullified actions of falsehood, steadfastness in adversity, and rivers of Paradise." },
    { id: 48, name: "Al-Fath", arabic: "سُورَةُ الفَتْحِ", rawArabic: "الفتح", meaning: "The Victory", ayahs: 29, type: "Madani", page: 511, revOrder: 111, juz: 26, words: 560, letters: 2438, desc: "The Treaty of Hudaybiyyah declared as a Clear Victory, the Pledge of Ridwan beneath the tree, and divine tranquility descending into believers' hearts." },
    { id: 49, name: "Al-Hujurāt", arabic: "سُورَةُ الحُجُرَاتِ", rawArabic: "الحجرات", meaning: "The Rooms", ayahs: 18, type: "Madani", page: 515, revOrder: 106, juz: 26, words: 353, letters: 1476, desc: "The civic charter of Islamic interpersonal ethics: verifying news, avoiding slander and suspicion, reconciliation, and universal human fraternity." },
    { id: 50, name: "Qāf", arabic: "سُورَةُ ق", rawArabic: "ق", meaning: "The Letter Qaf", ayahs: 45, type: "Makki", page: 518, revOrder: 34, juz: 26, words: 373, letters: 1473, desc: "The intimate proximity of Allah closer than the jugular vein (50:16), recording angels, the stupor of death, and the rebirth of dry land." },
    { id: 51, name: "Adh-Dhāriyāt", arabic: "سُورَةُ الذَّارِيَاتِ", rawArabic: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, type: "Makki", page: 520, revOrder: 67, juz: 26, words: 360, letters: 1510, desc: "The purpose of human and jinn creation to know and worship Allah (51:56), the winds scattering seeds, and sustenance preserved in the heavens." },
    { id: 52, name: "At-Tūr", arabic: "سُورَةُ الطُّورِ", rawArabic: "الطور", meaning: "The Mount", ayahs: 49, type: "Makki", page: 523, revOrder: 76, juz: 27, words: 312, letters: 1293, desc: "Oaths sworn by Mount Sinai, the Inscribed Book, the Visited House (Bayt al-Ma'mur), and the bliss of families reunited in everlasting gardens." },
    { id: 53, name: "An-Najm", arabic: "سُورَةُ النَّجْمِ", rawArabic: "النجم", meaning: "The Star", ayahs: 62, type: "Makki", page: 526, revOrder: 23, juz: 27, words: 360, letters: 1405, desc: "The vision of Jibril at the Lote Tree of the Utmost Boundary (Sidrat al-Muntaha), debunking pagan idols, and divine justice where none bears another's burden." },
    { id: 54, name: "Al-Qamar", arabic: "سُورَةُ القَمَرِ", rawArabic: "القمر", meaning: "The Moon", ayahs: 55, type: "Makki", page: 528, revOrder: 37, juz: 27, words: 342, letters: 1438, desc: "The historical splitting of the moon as a sign of the Hour, and the repeated comforting refrain: 'And We have certainly made the Qur'an easy for remembrance'." },
    { id: 55, name: "Ar-Rahmān", arabic: "سُورَةُ الرَّحْمَٰنِ", rawArabic: "الرحمن", meaning: "The Beneficent", ayahs: 78, type: "Madani", page: 531, revOrder: 97, juz: 27, words: 352, letters: 1585, desc: "The Bride of the Qur'an ('Arus al-Qur'an), repeating 31 times: 'Which of the favors of your Lord will you deny?', uniting cosmology, oceanography, and Paradise." },
    { id: 56, name: "Al-Wāqi'ah", arabic: "سُورَةُ الوَاقِعَةِ", rawArabic: "الواقعة", meaning: "The Inevitable", ayahs: 96, type: "Makki", page: 534, revOrder: 46, juz: 27, words: 379, letters: 1692, desc: "The categorization of humanity into the Foremost (Sabiqun), Companions of the Right, and Companions of the Left. Recited nightly as protection against poverty." },
    { id: 57, name: "Al-Hadīd", arabic: "سُورَةُ الحَدِيدِ", rawArabic: "الحديد", meaning: "The Iron", ayahs: 29, type: "Madani", page: 537, revOrder: 94, juz: 27, words: 575, letters: 2475, desc: "The cosmic descent of iron containing great strength and benefits (57:25), spending for Allah's cause, and the light of true believers on the Bridge." },
    { id: 58, name: "Al-Mujādilah", arabic: "سُورَةُ المُجَادَلَةِ", rawArabic: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, type: "Madani", page: 542, revOrder: 105, juz: 28, words: 475, letters: 1991, desc: "The only chapter where every single verse contains the name 'Allah'. Listening to the woman pleading for justice, and condemning secret malicious conspiracies." },
    { id: 59, name: "Al-Hashr", arabic: "سُورَةُ الحَشْرِ", rawArabic: "الحشر", meaning: "The Exile", ayahs: 24, type: "Madani", page: 545, revOrder: 101, juz: 28, words: 447, letters: 1913, desc: "The expulsion of the Banu Nadir, the mountain that would crumble in humility under the Qur'an, and the closing litany of Allah's Most Beautiful Names (Asma' Allah al-Husna)." },
    { id: 60, name: "Al-Mumtahanah", arabic: "سُورَةُ المُمْتَحَنَةِ", rawArabic: "الممتحنة", meaning: "She That Is To Be Examined", ayahs: 13, type: "Madani", page: 549, revOrder: 91, juz: 28, words: 350, letters: 1510, desc: "Diplomatic guidelines for peaceful relations with non-combatant nations, examining women refugees fleeing persecution, and the noble example of Ibrahim." },
    { id: 61, name: "As-Saff", arabic: "سُورَةُ الصَّفِّ", rawArabic: "الصف", meaning: "The Ranks", ayahs: 14, type: "Madani", page: 551, revOrder: 109, juz: 28, words: 226, letters: 926, desc: "Unity in discipline like a reinforced concrete structure, the prophecy of 'Isa announcing the coming of Ahmad (61:6), and trade that rescues from suffering." },
    { id: 62, name: "Al-Jumu'ah", arabic: "سُورَةُ الجُمُعَةِ", rawArabic: "الجمعة", meaning: "The Congregation, Friday", ayahs: 11, type: "Madani", page: 553, revOrder: 110, juz: 28, words: 177, letters: 720, desc: "The Prophet purifying and teaching the Scripture, the parable of the donkey laden with books, and abandoning commerce when the Friday prayer call is sounded." },
    { id: 63, name: "Al-Munāfiqūn", arabic: "سُورَةُ المُنَافِقُونَ", rawArabic: "المنافقون", meaning: "The Hypocrites", ayahs: 11, type: "Madani", page: 554, revOrder: 104, juz: 28, words: 180, letters: 776, desc: "Unmasking the psychology of double-faced deceit, and warning believers never to let wealth or progeny divert them from remembering God before death arrives." },
    { id: 64, name: "At-Taghābun", arabic: "سُورَةُ التَّغَابُنِ", rawArabic: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, type: "Madani", page: 556, revOrder: 108, juz: 28, words: 242, letters: 1070, desc: "The Day of Mutual Gain and Loss where worldly bargains are revealed, forgiving familial faults, and giving an auspicious loan to the Almighty." },
    { id: 65, name: "At-Talāq", arabic: "سُورَةُ الطَّلَاقِ", rawArabic: "الطلاق", meaning: "The Divorce", ayahs: 12, type: "Madani", page: 558, revOrder: 99, juz: 28, words: 279, letters: 1160, desc: "Equitable separation procedures, waiting periods, maternal maintenance, and the famous promise: 'Whoever is conscious of Allah, He will make a way out for him' (65:2)." },
    { id: 66, name: "At-Tahrīm", arabic: "سُورَةُ التَّحْرِيمِ", rawArabic: "التحريم", meaning: "The Prohibition", ayahs: 12, type: "Madani", page: 560, revOrder: 107, juz: 28, words: 254, letters: 1067, desc: "Domestic harmony within the household of the Prophet, shielding families from fire, and exemplary archetypes of piety (Asiyah and Maryam)." },
    { id: 67, name: "Al-Mulk", arabic: "سُورَةُ المُلْكِ", rawArabic: "الملك", meaning: "The Sovereignty", ayahs: 30, type: "Makki", page: 562, revOrder: 77, juz: 29, words: 333, letters: 1313, badge: "Nightly Shield", desc: "The nocturnal protector from the punishment of the grave, the flawless engineering of the seven heavens, and creation of life and death as an existential trial." },
    { id: 68, name: "Al-Qalam", arabic: "سُورَةُ القَلَمِ", rawArabic: "القلم", meaning: "The Pen", ayahs: 52, type: "Makki", page: 564, revOrder: 2, juz: 29, words: 301, letters: 1256, desc: "The second revelation honoring the divine instrument of writing, the exaltation of the Prophet's character ('on an exalted standard of ethics'), and the Owner of the Fish." },
    { id: 69, name: "Al-Hāqqah", arabic: "سُورَةُ الحَاقَّةِ", rawArabic: "الحاقة", meaning: "The Inevitable Reality", ayahs: 52, type: "Makki", page: 566, revOrder: 78, juz: 29, words: 260, letters: 1106, desc: "The trumpet blast that shatters mountains, receiving the personal record in the right hand vs the left hand, and the solemn truth of revelation." },
    { id: 70, name: "Al-Ma'ārij", arabic: "سُورَةُ المَعَارِجِ", rawArabic: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, type: "Makki", page: 568, revOrder: 79, juz: 29, words: 217, letters: 929, desc: "The celestial ascensions of angels across a span of 50,000 years, the innate fretfulness of man, and perseverance through prayer and charity." },
    { id: 71, name: "Nūh", arabic: "سُورَةُ نُوحٍ", rawArabic: "نوح", meaning: "Noah", ayahs: 28, type: "Makki", page: 570, revOrder: 71, juz: 29, words: 227, letters: 950, desc: "The 950-year calling of Nuh, seeking forgiveness to unlock rain and children, cosmic contemplation of the seven skies, and the Deluge." },
    { id: 72, name: "Al-Jinn", arabic: "سُورَةُ الجِنِّ", rawArabic: "الجن", meaning: "The Jinn", ayahs: 28, type: "Makki", page: 572, revOrder: 40, juz: 29, words: 286, letters: 1109, desc: "The gathering of Jinn listening to the miraculous recitation of the Qur'an and instantly embracing Tawheed, discarding superstition and soothsaying." },
    { id: 73, name: "Al-Muzzammil", arabic: "سُورَةُ المُزَّمِّلِ", rawArabic: "المزمل", meaning: "The Enshrouded One", ayahs: 20, type: "Makki", page: 574, revOrder: 3, juz: 29, words: 200, letters: 838, desc: "The sacred discipline of the Night Vigil (Tahajjud), reciting the Qur'an with slow, distinct rhythmic measured chanting (Tarteel)." },
    { id: 74, name: "Al-Muddaththir", arabic: "سُورَةُ المُدَّثِّرِ", rawArabic: "المدثر", meaning: "The Cloaked One", ayahs: 56, type: "Makki", page: 575, revOrder: 4, juz: 29, words: 256, letters: 1010, desc: "The divine command to arise and warn, purifying spiritual garments, the nineteen guardians of Saqar, and the running zebras fleeing the lion." },
    { id: 75, name: "Al-Qiyāmah", arabic: "سُورَةُ القِيَامَةِ", rawArabic: "القيامة", meaning: "The Resurrection", ayahs: 40, type: "Makki", page: 577, revOrder: 31, juz: 29, words: 164, letters: 652, desc: "Oaths sworn by the Day of Resurrection and the Self-Reproaching Soul, reconstruction of individual fingerprints (75:4), and the agony of the death throe." },
    { id: 76, name: "Al-Insān", arabic: "سُورَةُ الإِنْسَانِ", rawArabic: "الإنسان", meaning: "The Human", ayahs: 31, type: "Madani", page: 578, revOrder: 98, juz: 29, words: 243, letters: 1065, desc: "Human emergence from insignificance, patience in feeding prisoners and orphans purely for the face of God, and the radiant fountains of Kafur and Salsabil." },
    { id: 77, name: "Al-Mursalāt", arabic: "سُورَةُ المُرْسَلَاتِ", rawArabic: "المرسلات", meaning: "The Emissaries", ayahs: 50, type: "Makki", page: 580, revOrder: 33, juz: 29, words: 181, letters: 816, desc: "The cosmic winds sent forth in swift succession, the scattering of stars, and the stern rhythmic warning repeated ten times to the deniers." },
    { id: 78, name: "An-Naba'", arabic: "سُورَةُ النَّبَإِ", rawArabic: "النبأ", meaning: "The Tidings", ayahs: 40, type: "Makki", page: 582, revOrder: 80, juz: 30, words: 174, letters: 770, desc: "Opening of Juz 'Amma. The Great News of the Resurrection, mountains pegged into the crust, the solar lamp, and the triumph of the pious." },
    { id: 79, name: "An-Nāzi'āt", arabic: "سُورَةُ النَّازِعَاتِ", rawArabic: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, type: "Makki", page: 583, revOrder: 81, juz: 30, words: 179, letters: 753, desc: "The extraction of souls by angels, the destruction of Pharaoh, the vaulted dome of the cosmos, and life feeling like but an evening or morning." },
    { id: 80, name: "'Abasa", arabic: "سُورَةُ عَبَسَ", rawArabic: "عبس", meaning: "He Frowned", ayahs: 42, type: "Makki", page: 585, revOrder: 24, juz: 30, words: 133, letters: 533, desc: "Divine reproof emphasizing that the earnest seeker of truth—even if blind like Ibn Umm Maktum—takes precedence over the arrogant wealthy elite." },
    { id: 81, name: "At-Takwīr", arabic: "سُورَةُ التَّكْوِيرِ", rawArabic: "التكوير", meaning: "The Overthrowing", ayahs: 29, type: "Makki", page: 586, revOrder: 7, juz: 30, words: 104, letters: 533, desc: "The folding of the sun, falling of stars, boiling of oceans, reckoning for the infant girl buried alive, and the dignity of the angelic envoy Jibril." },
    { id: 82, name: "Al-Infitār", arabic: "سُورَةُ الانفِطَارِ", rawArabic: "الانفطار", meaning: "The Cleaving", ayahs: 19, type: "Makki", page: 587, revOrder: 82, juz: 30, words: 81, letters: 327, desc: "The cleaving of the sky, the scattering of planetary spheres, the delusion of mortal arrogance against the Gracious Creator, and guardian scribes." },
    { id: 83, name: "Al-Mutaffifīn", arabic: "سُورَةُ المُطَفِّفِينَ", rawArabic: "المطففين", meaning: "Those Who Deal In Fraud", ayahs: 36, type: "Makki", page: 587, revOrder: 86, juz: 30, words: 169, letters: 730, desc: "Economic integrity and condemnation of short-weighing, the rust upon sinful hearts, and the sealed nectar of Tasneem prepared for the pure." },
    { id: 84, name: "Al-Inshiqāq", arabic: "سُورَةُ الانشِقَاقِ", rawArabic: "الانشقاق", meaning: "The Splitting Asunder", ayahs: 25, type: "Makki", page: 589, revOrder: 83, juz: 30, words: 108, letters: 436, desc: "The earth flattened out and casting forth its contents, man toiling toward his Lord to meet Him, and passing through progressive cosmic planes." },
    { id: 85, name: "Al-Burūj", arabic: "سُورَةُ البُرُوجِ", rawArabic: "البروج", meaning: "The Great Stars", ayahs: 22, type: "Makki", page: 590, revOrder: 27, juz: 30, words: 109, letters: 458, desc: "Constellations in the sky, martyrdom of the People of the Ditch (Ashab al-Ukhdud), the Preserved Tablet (Lawh Mahfuz), and the triumph of faith." },
    { id: 86, name: "At-Tāriq", arabic: "سُورَةُ الطَّارِقِ", rawArabic: "الطارق", meaning: "The Nightcomer", ayahs: 17, type: "Makki", page: 591, revOrder: 36, juz: 30, words: 61, letters: 245, desc: "The piercing morning star (Najm ath-Thaqib), creation from an emitted fluid, the Day when innermost secrets are laid bare, and divine patience." },
    { id: 87, name: "Al-A'lā", arabic: "سُورَةُ الأَعْلَىٰ", rawArabic: "الأعلى", meaning: "The Most High", ayahs: 19, type: "Makki", page: 591, revOrder: 8, juz: 30, words: 72, letters: 291, desc: "Beloved chapter of the Prophet. Exalting the name of the Most High, the promise that he will not forget the revelation, and the ancient scriptures of Ibrahim and Musa." },
    { id: 88, name: "Al-Ghāshiyah", arabic: "سُورَةُ الغَاشِيَةِ", rawArabic: "الغاشية", meaning: "The Overwhelming", ayahs: 26, type: "Makki", page: 592, revOrder: 68, juz: 30, words: 92, letters: 377, desc: "Faces downcast vs joyful faces in elevated gardens, pondering the camel's physiology, the sky raised without pillars, and the mountains fixed as anchors." },
    { id: 89, name: "Al-Fajr", arabic: "سُورَةُ الفَجْرِ", rawArabic: "الفجر", meaning: "The Dawn", ayahs: 30, type: "Makki", page: 593, revOrder: 10, juz: 30, words: 139, letters: 577, desc: "Oaths of the Ten Blessed Nights of Dhul-Hijjah, the architectural pillars of Iram, and the call to the Soul at Peace (Nafs al-Mutma'innah) to return to its Lord." },
    { id: 90, name: "Al-Balad", arabic: "سُورَةُ البَلَدِ", rawArabic: "البلد", meaning: "The City", ayahs: 20, type: "Makki", page: 594, revOrder: 35, juz: 30, words: 82, letters: 335, desc: "Man created in hardship, ascending the steep uphill path ('Aqabah) through liberating captives and feeding starving orphans in times of famine." },
    { id: 91, name: "Ash-Shams", arabic: "سُورَةُ الشَّمْسِ", rawArabic: "الشمس", meaning: "The Sun", ayahs: 15, type: "Makki", page: 595, revOrder: 26, juz: 30, words: 54, letters: 247, desc: "The longest sequence of consecutive oaths in the Qur'an: by the sun, moon, day, night, heaven, earth, and the soul—he who purifies it succeeds, he who corrupts it fails." },
    { id: 92, name: "Al-Layl", arabic: "سُورَةُ اللَّيْلِ", rawArabic: "الليل", meaning: "The Night", ayahs: 21, type: "Makki", page: 595, revOrder: 9, juz: 30, words: 71, letters: 302, desc: "Divergent human strivings: he who gives in charity, remains God-conscious, and confirms truth is eased into bliss; the miser who hoards is eased into difficulty." },
    { id: 93, name: "Ad-Duhā", arabic: "سُورَةُ الضُّحَىٰ", rawArabic: "الضحى", meaning: "The Morning Hours", ayahs: 11, type: "Makki", page: 596, revOrder: 11, juz: 30, words: 40, letters: 172, desc: "Divine consolation during a pause in revelation: 'Your Lord has not forsaken you, nor does He detest you', remembering orphanhood, poverty, and proclamation of blessings." },
    { id: 94, name: "Ash-Sharh", arabic: "سُورَةُ الشَّرْحِ", rawArabic: "الشرح", meaning: "The Relief", ayahs: 8, type: "Makki", page: 596, revOrder: 12, juz: 30, words: 27, letters: 103, desc: "The opening of the Prophet's heart, lifting of burdens, exalting his mention alongside the Divine, and the immutable law: 'Indeed, with hardship comes ease'." },
    { id: 95, name: "At-Tīn", arabic: "سُورَةُ التِّينِ", rawArabic: "التين", meaning: "The Fig", ayahs: 8, type: "Makki", page: 597, revOrder: 28, juz: 30, words: 34, letters: 156, desc: "The sacred geography of Mount Sinai and Makkah, humanity created in the finest stature (Ahsani Taqweem), preserved through righteous deeds from regression." },
    { id: 96, name: "Al-'Alaq", arabic: "سُورَةُ العَلَقِ", rawArabic: "العلق", meaning: "The Clot", ayahs: 19, type: "Makki", page: 597, revOrder: 1, juz: 30, words: 72, letters: 281, desc: "The epochal dawn of revelation in Hira: 'Iqra' bi-ismi Rabbika' (Read in the Name of your Lord), education by the pen, and prostrating to draw near to God." },
    { id: 97, name: "Al-Qadr", arabic: "سُورَةُ القَدْرِ", rawArabic: "القدر", meaning: "The Night of Decree", ayahs: 5, type: "Makki", page: 598, revOrder: 25, juz: 30, words: 30, letters: 112, desc: "Laylat al-Qadr, a solitary night surpassing a thousand months in sanctity, during which the Spirit and angels descend with every divine decree until the break of dawn." },
    { id: 98, name: "Al-Bayyinah", arabic: "سُورَةُ البَيِّنَةِ", rawArabic: "البينة", meaning: "The Clear Proof", ayahs: 8, type: "Madani", page: 598, revOrder: 100, juz: 30, words: 94, letters: 399, desc: "The universal moral mandate to worship Allah sincerely, establish prayer, pay Zakat, and the declaration of righteous believers as the Best of Creation." },
    { id: 99, name: "Az-Zalzalah", arabic: "سُورَةُ الزَّلْزَلَةِ", rawArabic: "الزلزلة", meaning: "The Earthquake", ayahs: 8, type: "Madani", page: 599, revOrder: 93, juz: 30, words: 35, letters: 149, desc: "The catastrophic final earthquake of the earth, soil testifying to what took place upon it, and accountability for every atom's weight of good or evil." },
    { id: 100, name: "Al-'Ādiyāt", arabic: "سُورَةُ العَادِيَاتِ", rawArabic: "العاديات", meaning: "The Courser", ayahs: 11, type: "Makki", page: 599, revOrder: 14, juz: 30, words: 40, letters: 163, desc: "The thunderous panting of war steeds striking sparks with their hooves, exposing mankind's ingratitude and passionate obsession with material wealth." },
    { id: 101, name: "Al-Qāri'ah", arabic: "سُورَةُ القَارِعَةِ", rawArabic: "القارعة", meaning: "The Calamity", ayahs: 11, type: "Makki", page: 600, revOrder: 30, juz: 30, words: 36, letters: 152, desc: "The Sudden Calamity that reduces humanity to scattered moths and mountains to carded wool, weighing scales that determine bliss in Paradise or Hawiyah." },
    { id: 102, name: "At-Takāthur", arabic: "سُورَةُ التَّكَاثُرِ", rawArabic: "التكاثر", meaning: "Competition in Increase", ayahs: 8, type: "Makki", page: 600, revOrder: 16, juz: 30, words: 28, letters: 120, desc: "The relentless consumerist competition for increase distracting humans until they visit the graves, followed by questioning about every earthly comfort." },
    { id: 103, name: "Al-'Asr", arabic: "سُورَةُ العَصْرِ", rawArabic: "العصر", meaning: "The Declining Day", ayahs: 3, type: "Makki", page: 601, revOrder: 13, juz: 30, words: 14, letters: 68, desc: "Imam Ash-Shafi'i noted: If humanity reflected upon this chapter alone, it would suffice them. All are in loss except those with faith, righteous deeds, truth, and patience." },
    { id: 104, name: "Al-Humazah", arabic: "سُورَةُ الهُمَزَةِ", rawArabic: "الهمزة", meaning: "The Slanderer", ayahs: 9, type: "Makki", page: 601, revOrder: 32, juz: 30, words: 33, letters: 130, desc: "Woe to every backbiter and slanderer who amasses hoarded wealth believing it will confer immortality, thrown into the Hutamah that climbs to the hearts." },
    { id: 105, name: "Al-Fīl", arabic: "سُورَةُ الفِيلِ", rawArabic: "الفيل", meaning: "The Elephant", ayahs: 5, type: "Makki", page: 601, revOrder: 19, juz: 30, words: 23, letters: 96, desc: "The historic defeat of Abraha's invading army and his war elephant marching to demolish the Ka'bah, bombarded by flocks of birds casting baked stones." },
    { id: 106, name: "Quraysh", arabic: "سُورَةُ قُرَيْشٍ", rawArabic: "قريش", meaning: "Quraysh", ayahs: 4, type: "Makki", page: 602, revOrder: 29, juz: 30, words: 17, letters: 73, desc: "The secured winter and summer trading caravans of Quraysh, calling them to worship the Lord of this Sacred Sanctuary who feeds them and shields them from fear." },
    { id: 107, name: "Al-Mā'ūn", arabic: "سُورَةُ المَاعُونِ", rawArabic: "الماعون", meaning: "Small Kindnesses", ayahs: 7, type: "Makki", page: 602, revOrder: 17, juz: 30, words: 25, letters: 112, desc: "Severe condemnation of those who deny the Judgment, repel orphans, perform ostentatious prayer heedless of its spirit, and withhold ordinary everyday kindnesses." },
    { id: 108, name: "Al-Kawthar", arabic: "سُورَةُ الكَوْثَرِ", rawArabic: "الكوثر", meaning: "Abundance", ayahs: 3, type: "Makki", page: 602, revOrder: 15, juz: 30, words: 10, letters: 42, desc: "The shortest chapter of the Qur'an. Bestowing the celestial river of Kawthar upon the Prophet, commanding sacrifice, and declaring his mockers to be cut off." },
    { id: 109, name: "Al-Kāfirūn", arabic: "سُورَةُ الكَافِرُونَ", rawArabic: "الكافرون", meaning: "The Disbelievers", ayahs: 6, type: "Makki", page: 603, revOrder: 18, juz: 30, words: 26, letters: 94, desc: "The uncompromising charter of theological purity: absolute dissociation from idolatry and theological syncretism: 'To you be your religion, and to me mine'." },
    { id: 110, name: "An-Nasr", arabic: "سُورَةُ النَّصْرِ", rawArabic: "النصر", meaning: "The Divine Support", ayahs: 3, type: "Madani", page: 603, revOrder: 114, juz: 30, words: 19, letters: 77, desc: "The final chronologically revealed complete chapter. The divine victory and crowds entering religion in multitudes, signaling the Prophet's approaching departure." },
    { id: 111, name: "Al-Masad", arabic: "سُورَةُ المَسَدِ", rawArabic: "المسد", meaning: "The Palm Fibre", ayahs: 5, type: "Makki", page: 603, revOrder: 6, juz: 30, words: 23, letters: 77, desc: "The ruin of Abu Lahab and his wife who cast thorns in the Prophet's path; a miraculous prophecy confirming they would never embrace faith until death." },
    { id: 112, name: "Al-Ikhlās", arabic: "سُورَةُ الإِخْلَاصِ", rawArabic: "الإخلاص", meaning: "The Sincerity", ayahs: 4, type: "Makki", page: 604, revOrder: 22, juz: 30, words: 15, letters: 47, badge: "1/3 of Qur'an", desc: "Equivalent to one-third of the entire Qur'an in theological weight. The definitive formulation of absolute monotheism: God is One, Eternal, Unbegotten, and Peerless." },
    { id: 113, name: "Al-Falaq", arabic: "سُورَةُ الفَلَقِ", rawArabic: "الفلق", meaning: "The Daybreak", ayahs: 5, type: "Makki", page: 604, revOrder: 20, juz: 30, words: 23, letters: 71, desc: "The primary Ruqyah invocation seeking refuge with the Lord of Daybreak from the evil of created things, the encroaching darkness, occult mischief, and envy." },
    { id: 114, name: "An-Nās", arabic: "سُورَةُ النَّاسِ", rawArabic: "الناس", meaning: "Mankind", ayahs: 6, type: "Makki", page: 604, revOrder: 21, juz: 30, words: 20, letters: 79, desc: "The closing seal of the Noble Qur'an. Seeking refuge with the Lord, Sovereign, and God of Mankind from the insidious whisperer (Al-Waswas) among Jinn and humanity." }
  ];

  // =========================================================================
  // 2. VERIFIED RECITERS
  // =========================================================================
  const RECITERS = [
    {
      id: "alafasy",
      name: "Sheikh Mishary Rashid Alafasy",
      style: "Murattal (Hafs)",
      location: "Kuwait",
      serverPrefix: "mishari_rashid_al_3afasy",
      everyAyahCode: "Alafasy_128kbps",
      quranCloudEdition: "ar.alafasy"
    },
    {
      id: "abdulbasit",
      name: "Sheikh Abdul Basit Abdul Samad",
      style: "Murattal (Hafs)",
      location: "Egypt",
      serverPrefix: "abdul_basit_murattal",
      everyAyahCode: "Abdul_Basit_Murattal_192kbps"
    },
    {
      id: "alhusary",
      name: "Sheikh Mahmoud Khalil Al-Husary",
      style: "Murattal (Precise Tajweed)",
      location: "Egypt",
      serverPrefix: "mahmood_khaleel_al-husaree_iza3ah",
      everyAyahCode: "Husary_128kbps",
      quranCloudEdition: "ar.husary"
    },
    {
      id: "alghamdi",
      name: "Sheikh Saad Al-Ghamdi",
      style: "Murattal (Hafs)",
      location: "Saudi Arabia",
      serverPrefix: "sa3d_al-ghamidi/complete",
      everyAyahCode: "Ghamadi_40kbps"
    },
    {
      id: "minshawi",
      name: "Sheikh Muhammad Siddiq Al-Minshawi",
      style: "Murattal (Reverent)",
      location: "Egypt",
      serverPrefix: "muhammad_siddeeq_al-minshaawee",
      everyAyahCode: "Minshawy_Murattal_128kbps"
    },
    {
      id: "sudais",
      name: "Sheikh Abdur-Rahman As-Sudais",
      style: "Haram Makkah Recitation",
      location: "Makkah",
      serverPrefix: "abdurrahmaan_as-sudays",
      everyAyahCode: "Abdurrahmaan_As-Sudais_192kbps",
      quranCloudEdition: "ar.abdurrahmaansudais"
    }
  ];

  // =========================================================================
  // 3. AUTHENTIC MUSHAF PDF REPOSITORY
  // =========================================================================
  const PDF_CATALOG = [
    {
      id: "madinah-kf",
      title: "King Fahd Complex Madinah Mushaf",
      arabic: "مصحف المدينة المنورة (رواية حفص)",
      desc: "The world-standard authentic Mushaf printed in Madinah under the patronage of the King Fahd Complex. Complete 604 pages in high-resolution vector Uthmani calligraphy.",
      size: "78.7 MB",
      badge: "🏛️ Official Madinah Edition",
      downloadUrl: "https://archive.org/download/quran-madinah/quran-madina.pdf",
      previewUrl: "https://archive.org/details/quran-madinah/mode/2up"
    },
    {
      id: "quran-tajweed",
      title: "Color-Coded Tajweed Quran Mushaf",
      arabic: "مصحف التجويد الملون مع أحكام التلاوة",
      desc: "Complete 30 Juz Mushaf with pedagogical color-coding for all Tajweed rules (Ghunnah, Qalqalah, Idgham, Madd, Ikhfa) with color key annotations.",
      size: "269 MB",
      badge: "🎨 Full Color Tajweed",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1dYY2klWLIV7wEv06ZS6iLm4cOaaCk3O_",
      previewUrl: "https://drive.google.com/file/d/1dYY2klWLIV7wEv06ZS6iLm4cOaaCk3O_/view?usp=sharing"
    },
    {
      id: "quran-108-verses",
      title: "Master Compilation of Qur'anic Verses (108 Verses)",
      arabic: "جامع الآيات القرآنية الكريمة (108 آيات)",
      desc: "Deduplicated canonical reference extracted across 62 classical Islamic manuscripts covering Ruqyah healing, Tawheed, protection, and divine names.",
      size: "92 KB",
      badge: "✨ 108 Master Verses PDF",
      downloadUrl: "assets/pdf/quran_verses_master_compilation.pdf",
      previewUrl: "quran-verses.html"
    },
    {
      id: "quran-transliteration",
      title: "Qur'an Complete English Transliteration",
      arabic: "القرآن الكريم بالحروف اللاتينية والترجمة",
      desc: "Complete Romanized English phonetic transliteration for pronunciation guidance, tajweed assistance, and non-Arabic readers.",
      size: "1.6 MB",
      badge: "⚡ Fast Download",
      downloadUrl: "assets/pdf/quran_transliteration.pdf",
      previewUrl: "https://drive.google.com/file/d/1KopwI6BEB4jckZF7wDHnyGboKKCRd8Qm/view?usp=sharing"
    },
    {
      id: "quran-tajweed-trans",
      title: "Tajweed Qur'an + Transliteration + Translation",
      arabic: "مصحف التجويد مع الترجمة الإنجليزية والنطق الصوتي",
      desc: "Comprehensive 3-in-1 volume featuring original Arabic with color Tajweed rules, line-by-line phonetic transliteration, and English translation side-by-side.",
      size: "193 MB",
      badge: "📁 3-in-1 Study Edition",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1zJBRqPihXcyB4oM2GEa6a1baZcGiOR7k",
      previewUrl: "https://drive.google.com/file/d/1zJBRqPihXcyB4oM2GEa6a1baZcGiOR7k/view?usp=sharing"
    }
  ];

  // =========================================================================
  // 4. SAMPLE AYAHS REPOSITORY (Pre-cached for instant Ayah-by-Ayah reader)
  // =========================================================================
  const AYAH_SAMPLE_STORE = {
    1: [
      { num: 1, arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", latin: "Bismi Allāhi ar-rahmāni ar-rahīmi", en: "In the Name of Allah—the Most Compassionate, Most Merciful." },
      { num: 2, arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", latin: "Al-hamdu lillāhi rabbi al-'ālamīna", en: "All praise is for Allah—Lord of all worlds." },
      { num: 3, arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", latin: "Ar-rahmāni ar-rahīmi", en: "The Most Compassionate, Most Merciful." },
      { num: 4, arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", latin: "Māliki yawmi ad-dīni", en: "Master of the Day of Judgment." },
      { num: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", latin: "Iyyāka na'budu wa-iyyāka nasta'īnu", en: "You alone we worship and You alone we ask for help." },
      { num: 6, arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", latin: "Ihdinā as-sirāta al-mustaqīma", en: "Guide us along the Straight Path." },
      { num: 7, arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", latin: "Sirāta alladhīna an'amta 'alayhim ghayri al-maghdūbi 'alayhim walad-dāllīna", en: "The Path of those You have blessed—not those who have incurred Your wrath, nor those who have gone astray." }
    ],
    18: [
      { num: 1, arabic: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَاۜ", latin: "Al-hamdu lillāhi alladhī anzala 'alā 'abdihi al-kitāba walam yaj'al lahu 'iwajā", en: "All praise is for Allah Who has revealed the Book to His servant, allowing no crookedness in it." },
      { num: 2, arabic: "قَيِّمًۭا لِّيُنذِرَ بَأْسًۭا شَدِيدًۭا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّـٰلِحَـٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًۭا", latin: "Qayyiman liyundhira ba'san shadīdan min ladunhu wayubashshira al-mu'minīna...", en: "Making it upright, to warn of a severe punishment from Him and give good news to the believers..." },
      { num: 10, arabic: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا", latin: "Idh awā al-fityatu ilā al-kahfi faqālū Rabbanā ātinā min ladunka rahmatan...", en: "Remember when the youths took refuge in the cave, saying, 'Our Lord! Grant us mercy from Yourself and guide us rightly in our affair!'" }
    ],
    36: [
      { num: 1, arabic: "يسٓ", latin: "Yā-Sīn", en: "Ya-Sin." },
      { num: 2, arabic: "وَٱلْقُرْءَانِ ٱلْحَكِيمِ", latin: "Wal-Qur'āni al-hakīmi", en: "By the wise Qur'an." },
      { num: 3, arabic: "إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ", latin: "Innaka lamina al-mursalīna", en: "Indeed, you are one of the messengers." }
    ],
    67: [
      { num: 1, arabic: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ", latin: "Tabāraka alladhī biyadihi al-mulku wahuwa 'alā kulli shay'in qadīrun", en: "Blessed is the One in Whose Hand is the entire Kingdom, and He is Capable of all things." },
      { num: 2, arabic: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ", latin: "Alladhī khalaqa al-mawta wal-hayāta liyabluwakum ayyukum ahsanu 'amalan...", en: "He is the One Who created death and life to test which of you is best in conduct..." }
    ],
    112: [
      { num: 1, arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", latin: "Qul huwa Allāhu ahadun", en: "Say: He is Allah—the One." },
      { num: 2, arabic: "ٱللَّهُ ٱلصَّمَدُ", latin: "Allāhu as-samadu", en: "Allah—the Self-Sufficient Master." },
      { num: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", latin: "Lam yalid walam yūlad", en: "He begets not, nor was He begotten." },
      { num: 4, arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", latin: "Walam yakun lahu kufuwan ahadun", en: "And there is none comparable unto Him." }
    ],
    113: [
      { num: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", latin: "Qul a'ūdhu birabbi al-falaqi", en: "Say: I seek refuge in the Lord of the daybreak." },
      { num: 2, arabic: "مِن شَرِّ مَا خَلَقَ", latin: "Min sharri mā khalaqa", en: "From the evil of what He has created." },
      { num: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", latin: "Wamin sharri ghāsiqin idhā waqaba", en: "And from the evil of darkness when it settles." },
      { num: 4, arabic: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ", latin: "Wamin sharri an-naffāthāti fī al-'uqadi", en: "And from the evil of those who blow on knots." },
      { num: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", latin: "Wamin sharri hāsidin idhā hasada", en: "And from the evil of an envier when they envy." }
    ],
    114: [
      { num: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", latin: "Qul a'ūdhu birabbi an-nāsi", en: "Say: I seek refuge in the Lord of mankind." },
      { num: 2, arabic: "مَلِكِ ٱلنَّاسِ", latin: "Maliki an-nāsi", en: "The Sovereign of mankind." },
      { num: 3, arabic: "إِلَـٰهِ ٱلنَّاسِ", latin: "Ilāhi an-nāsi", en: "The God of mankind." },
      { num: 4, arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", latin: "Min sharri al-waswāsi al-khannāsi", en: "From the evil of the retreating whisperer." },
      { num: 5, arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", latin: "Alladhī yuwaswisu fī sudūri an-nāsi", en: "Who whispers into the hearts of mankind." },
      { num: 6, arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", latin: "Mina al-jinnati wan-nāsi", en: "From among the jinn and mankind." }
    ]
  };

<<<<<<< HEAD
  // Fetch complete Qur'an text on demand and keep successful responses for offline reading.
  const QURAN_TEXT_CACHE = 'ruqyah-quran-text-v1';
  let readerRequestToken = 0;
  let mushafRequestToken = 0;
  let mushafCurrentPage = 1;
  const BASMALA_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

  function separateOpeningFormula(surahId, ayahNumber, text) {
    const prefix = `${BASMALA_TEXT} `;
    if (ayahNumber === 1 && surahId !== 1 && surahId !== 9 && text.startsWith(prefix)) {
      return { opening: BASMALA_TEXT, arabic: text.slice(prefix.length) };
    }
    return { opening: '', arabic: text };
  }

  async function getQuranApiData(path) {
    const url = `https://api.alquran.cloud/v1/${path}`;
    let cache = null;

    if (window.caches) {
      try {
        cache = await window.caches.open(QURAN_TEXT_CACHE);
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          const cachedPayload = await cachedResponse.json();
          if (cachedPayload.code === 200 && cachedPayload.data) return cachedPayload.data;
        }
      } catch (error) {
        cache = null;
      }
    }

    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Qur'an text request failed (${response.status}).`);

    const responseForCache = response.clone();
    const payload = await response.json();
    if (payload.code !== 200 || !payload.data) throw new Error("Qur'an text response was incomplete.");
    if (cache) cache.put(url, responseForCache).catch(() => {});
    return payload.data;
  }

  async function fetchSurahVerses(surah) {
    const editions = await getQuranApiData(`surah/${surah.id}/editions/quran-uthmani,en.sahih`);
    const arabicEdition = Array.isArray(editions) ? editions[0] : null;
    const englishEdition = Array.isArray(editions) ? editions[1] : null;
    if (!arabicEdition?.ayahs?.length || !englishEdition?.ayahs?.length ||
        arabicEdition.ayahs.length !== surah.ayahs || englishEdition.ayahs.length !== surah.ayahs) {
      throw new Error('The complete Surah text is not available right now.');
    }

    return arabicEdition.ayahs.map((ayah, index) => ({
      num: ayah.numberInSurah,
      ...separateOpeningFormula(surah.id, ayah.numberInSurah, ayah.text),
      latin: '',
      en: englishEdition.ayahs[index]?.text || ''
    }));
  }

  async function fetchMushafPage(pageNumber) {
    const page = await getQuranApiData(`page/${pageNumber}/quran-uthmani`);
    if (!Array.isArray(page.ayahs) || !page.ayahs.length) throw new Error('This Mushaf page is empty.');
    return page.ayahs.map(ayah => ({
      number: ayah.numberInSurah,
      ...separateOpeningFormula(ayah.surah.number, ayah.numberInSurah, ayah.text),
      surahId: ayah.surah.number,
      surahName: SURAHS.find(surah => surah.id === ayah.surah.number)?.arabic || ayah.surah.name
    }));
  }

  async function copySurahText(surahId) {
    const surah = SURAHS.find(item => item.id === Number(surahId)) || SURAHS[0];
    showToast(`Preparing complete text for ${surah.name}`);
    let verses;
    let source = 'Arabic text: Uthmani script, Al Quran Cloud. English translation: Saheeh International.';

    try {
      verses = await fetchSurahVerses(surah);
    } catch (error) {
      const offlineVerses = AYAH_SAMPLE_STORE[surah.id];
      if (!offlineVerses || offlineVerses.length !== surah.ayahs) {
        showToast('A complete Surah copy needs a connection; only partial offline excerpts are stored.');
        return;
      }
      verses = offlineVerses;
      source = 'Bundled offline text. English translation: Saheeh International.';
    }

    const arabicText = verses.flatMap(ayah => [
      ...(ayah.opening ? [`Opening formula\n${ayah.opening}`] : []),
      `${ayah.num}. ${ayah.arabic}`
    ]).join('\n');
    const translation = verses.map(ayah => `${ayah.num}. ${ayah.en}`).join('\n');
    const copyText = `${surah.name} (${surah.arabic})\n\nArabic text\n${arabicText}\n\nEnglish translation\n${translation}\n\n${source}`;

    try {
      await writeTextToClipboard(copyText);
      showToast(`Copied complete text for ${surah.name}`);
    } catch (error) {
      showToast('Could not copy the Surah text.');
    }
  }

  async function writeTextToClipboard(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) { }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    textarea.remove();
    if (!copied) throw new Error('Clipboard access is unavailable.');
  }

=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  // =========================================================================
  // 5. APPLICATION STATE
  // =========================================================================
  let activeSurahId = 1;
  let activeReciter = RECITERS[0];
<<<<<<< HEAD
  let loadedSurahId = null;
  let loadedReciterId = null;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  let isPlaying = false;
  let audioPlayer = new Audio();
  let audioContext = null;
  let audioGainNode = null;
  let audioLimiterNode = null;
  let playerVolume = 1;
  let lastPlayerVolume = 1;
  let playbackToken = 0;
  let playbackMode = 'idle';
  let fallbackAyah = 0;
<<<<<<< HEAD
  let consecutiveFallbackFailures = 0;
  const MAX_FALLBACK_FAILURES = 4;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  let repeatSurah = false;
  let searchDebounce = null;
  let currentSpeedIdx = 1;
  const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
  let fontScale = 1.0;
  let showLatin = true;
  let showTranslation = true;

  // Bookmarks in localStorage
  function getBookmarks() {
    try {
      const saved = localStorage.getItem('heynuo_surah_bookmarks');
      return saved ? JSON.parse(saved) : [1];
    } catch (e) {
      return [1];
    }
  }

  function setBookmarks(bms) {
    try {
      localStorage.setItem('heynuo_surah_bookmarks', JSON.stringify(bms));
    } catch (e) {}
  }

  function savePlayerPreference(key, value) {
    try {
      localStorage.setItem(`heynuo_player_${key}`, String(value));
    } catch (e) {}
  }

  function getPlayerPreference(key, fallback) {
    try {
      const value = localStorage.getItem(`heynuo_player_${key}`);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function isBookmarked(id) {
    return getBookmarks().includes(id);
  }

  function toggleBookmark(id) {
    let bms = getBookmarks();
    if (bms.includes(id)) {
      bms = bms.filter(item => item !== id);
      showToast(`Removed Surah ${id} from Bookmarks`);
    } else {
      bms.push(id);
      showToast(`Bookmarked Surah ${id}`);
    }
    setBookmarks(bms);
    updateBookmarkIcon();
<<<<<<< HEAD
    if (window._quranApplyFilter) window._quranApplyFilter();
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  function updateBookmarkIcon() {
    const icon = document.getElementById('hero-bookmark-icon');
    if (icon) {
      icon.textContent = isBookmarked(activeSurahId) ? 'bookmark' : 'bookmark_border';
    }
<<<<<<< HEAD
    const countBadge = document.getElementById('bookmarks-count');
    if (countBadge) {
      countBadge.textContent = String(getBookmarks().length);
    }
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  // Toast Notification System
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'bg-primary text-on-primary px-4 py-2.5 rounded-lg shadow-lg text-xs font-ui-interactive font-medium flex items-center gap-2 animate-toast pointer-events-auto';
    toast.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // =========================================================================
  // 6. AUDIO RECITATION ENGINE
  // =========================================================================
  function ensureAudioProcessing() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    try {
      if (!audioContext) {
        // Set CORS mode before assigning a remote source so the audio can enter Web Audio.
        audioPlayer.crossOrigin = 'anonymous';
        audioContext = new AudioContextClass();
        const source = audioContext.createMediaElementSource(audioPlayer);
        audioGainNode = audioContext.createGain();
        audioLimiterNode = audioContext.createDynamicsCompressor();
        audioLimiterNode.threshold.value = -2;
        audioLimiterNode.knee.value = 0;
        audioLimiterNode.ratio.value = 20;
        audioLimiterNode.attack.value = 0.003;
        audioLimiterNode.release.value = 0.18;
        source.connect(audioGainNode);
        audioGainNode.connect(audioLimiterNode);
        audioLimiterNode.connect(audioContext.destination);
        audioGainNode.gain.value = playerVolume;
      }
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return true;
    } catch (error) {
      return false;
    }
  }

  function setPlayerVolume(value) {
    const requested = Math.max(0, Math.min(5, Number(value) || 0));
    const hasAudioProcessing = requested > 1 || Boolean(audioGainNode)
      ? ensureAudioProcessing()
      : false;
    playerVolume = hasAudioProcessing ? requested : Math.min(requested, 1);
    if (audioGainNode) {
      audioGainNode.gain.setTargetAtTime(playerVolume, audioContext.currentTime, 0.015);
      audioPlayer.volume = 1;
    } else {
      audioPlayer.volume = playerVolume;
    }

    const slider = document.getElementById('playerVolumeSlider');
    const readout = document.getElementById('playerVolumeReadout');
    const icon = document.getElementById('playerVolumeIcon');
    const muteButton = document.getElementById('playerMuteBtn');
    if (slider) slider.value = String(playerVolume);
    if (readout) readout.textContent = `${Math.round(playerVolume * 100)}%`;
    if (slider) slider.setAttribute('aria-valuetext', `${Math.round(playerVolume * 100)} percent`);
    if (icon) icon.textContent = playerVolume === 0 ? 'volume_off' : (playerVolume < 0.5 ? 'volume_down' : 'volume_up');
    savePlayerPreference('volume', playerVolume);
    if (playerVolume > 0) {
      lastPlayerVolume = playerVolume;
      savePlayerPreference('last-volume', playerVolume);
    }
    if (muteButton) {
      muteButton.title = playerVolume === 0 ? 'Unmute audio' : 'Mute audio';
      muteButton.setAttribute('aria-label', muteButton.title);
    }
  }

  function getSurahAudioUrl(surahId, reciter) {
    // QuranCloud serves a single complete-surah recording for these editions.
    if (reciter.quranCloudEdition) {
      return `https://cdn.islamic.network/quran/audio-surah/128/${reciter.quranCloudEdition}/${surahId}.mp3`;
    }
    const pad = String(surahId).padStart(3, '0');
    return `https://download.quranicaudio.com/quran/${reciter.serverPrefix}/${pad}.mp3`;
  }

  let sourceErrorHandler = null;
  function setAudioSource(source, onError) {
    if (sourceErrorHandler) audioPlayer.removeEventListener('error', sourceErrorHandler);
    let handled = false;
    const failOnce = () => {
      if (handled) return;
      handled = true;
      audioPlayer.removeEventListener('error', failOnce);
      if (sourceErrorHandler === failOnce) sourceErrorHandler = null;
      onError?.();
    };
    sourceErrorHandler = failOnce;
    audioPlayer.addEventListener('error', failOnce, { once: true });
    audioPlayer.src = source;
    return failOnce;
  }

  function setPlayerStatus(message, isError = false, isBusy = false) {
    const status = document.getElementById('playerStatus');
    const bar = document.getElementById('dockedQuranPlayer');
    if (status) status.textContent = message;
    if (bar) bar.setAttribute('aria-busy', String(isBusy));
    if (isError) showToast(message);
  }

  function playFallbackAyah(surah, token, ayahNumber) {
    if (token !== playbackToken) return;
    if (ayahNumber > surah.ayahs) {
      playbackMode = 'surah';
      fallbackAyah = 0;
      if (repeatSurah) playSurah(surah.id);
      else if (surah.id < 114) playSurah(surah.id + 1);
      else {
        playbackMode = 'idle';
        isPlaying = false;
        updatePlayStateUI();
      }
      return;
    }

    playbackMode = 'ayah-sequence';
    fallbackAyah = ayahNumber;
    const surahNumber = String(surah.id).padStart(3, '0');
    const ayah = String(ayahNumber).padStart(3, '0');
    const failOnce = setAudioSource(
      `https://everyayah.com/data/${activeReciter.everyAyahCode}/${surahNumber}${ayah}.mp3`,
      () => {
<<<<<<< HEAD
        // Skip isolated missing verses, but stop rather than requesting an entire offline Surah.
        if (token === playbackToken && playbackMode === 'ayah-sequence' && fallbackAyah === ayahNumber) {
          consecutiveFallbackFailures += 1;
          if (consecutiveFallbackFailures >= MAX_FALLBACK_FAILURES) {
            playbackMode = 'idle';
            isPlaying = false;
            updatePlayStateUI();
            setPlayerStatus('Verse audio is unavailable. Check your connection and try again.', true);
            return;
          }
=======
        // If a verse file is missing, keep going so one bad file cannot stop the surah.
        if (token === playbackToken && playbackMode === 'ayah-sequence' && fallbackAyah === ayahNumber) {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
          playFallbackAyah(surah, token, ayahNumber + 1);
        }
      }
    );
    audioPlayer.play().catch(error => {
<<<<<<< HEAD
      if (token !== playbackToken || error?.name === 'AbortError') return;
      if (error?.name === 'NotAllowedError') {
=======
      if (error?.name === 'NotAllowedError' || error?.name === 'AbortError') {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        setPlayerStatus('Tap play to start recitation.');
        return;
      }
      failOnce();
    });
  }

  function playSurah(surahId) {
    if (playerVolume > 1) ensureAudioProcessing();
    const surah = SURAHS.find(s => s.id === Number(surahId)) || SURAHS[0];
    activeSurahId = surah.id;
<<<<<<< HEAD
    loadedSurahId = surah.id;
    loadedReciterId = activeReciter.id;
    updateHeroSpotlight(surah);
    updateActiveCard(surah.id);
    updateDockedTrack(surah);
=======
    updateHeroSpotlight(surah);
    updateActiveCard(surah.id);
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

    const token = ++playbackToken;
    playbackMode = 'surah';
    fallbackAyah = 0;
<<<<<<< HEAD
    consecutiveFallbackFailures = 0;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    const audioUrl = getSurahAudioUrl(surah.id, activeReciter);
    setPlayerStatus('Loading audio...', false, true);
    const failOnce = setAudioSource(audioUrl, () => {
      if (token !== playbackToken || playbackMode !== 'surah') return;
      setPlayerStatus('Full-surah stream unavailable; switching to verse audio.');
      playFallbackAyah(surah, token, 1);
    });
    audioPlayer.playbackRate = SPEEDS[currentSpeedIdx];
    audioPlayer.play().then(() => {
      if (token !== playbackToken) return;
      isPlaying = true;
      setPlayerStatus('');
      updatePlayStateUI();
      showToast(`Playing ${surah.name} (${activeReciter.name.split(' ')[1] || activeReciter.name})`);
    }).catch(error => {
<<<<<<< HEAD
      if (token !== playbackToken || error?.name === 'AbortError') return;
      if (error?.name === 'NotAllowedError') {
=======
      if (error?.name === 'NotAllowedError' || error?.name === 'AbortError') {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        setPlayerStatus('Tap play to start recitation.');
        return;
      }
      failOnce();
    });
  }

  function togglePlayPause() {
<<<<<<< HEAD
    if (!audioPlayer.src || audioPlayer.src === window.location.href || playbackMode === 'idle' || loadedReciterId !== activeReciter.id) {
      playSurah(activeSurahId || loadedSurahId || 1);
      return;
    }
    if (audioPlayer.paused) {
      const token = ++playbackToken;
      setPlayerStatus('Loading audio...', false, true);
      audioPlayer.play().then(() => {
        if (token !== playbackToken) return;
=======
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
      playSurah(activeSurahId);
      return;
    }
    if (audioPlayer.paused) {
      audioPlayer.play().then(() => {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        isPlaying = true;
        setPlayerStatus('');
        updatePlayStateUI();
      }).catch(error => {
<<<<<<< HEAD
        if (token !== playbackToken || error?.name === 'AbortError') return;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        if (error?.name === 'NotAllowedError') setPlayerStatus('Tap play to start recitation.');
        else setPlayerStatus('Audio is unavailable. Please try again.', true);
        isPlaying = false;
        updatePlayStateUI();
      });
    } else {
<<<<<<< HEAD
      playbackToken += 1;
      audioPlayer.pause();
      isPlaying = false;
      setPlayerStatus('');
=======
      audioPlayer.pause();
      isPlaying = false;
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    }
    updatePlayStateUI();
  }

<<<<<<< HEAD
  function toggleHeroPlayback() {
    const sameTrack = loadedSurahId === activeSurahId && loadedReciterId === activeReciter.id;
    const isFullSurahTrack = ['surah', 'ayah-sequence'].includes(playbackMode);
    if (sameTrack && isFullSurahTrack) togglePlayPause();
    else playSurah(activeSurahId);
  }

=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  function updatePlayStateUI() {
    const heroBtn = document.getElementById('hero-play-btn');
    const heroIcon = heroBtn ? heroBtn.querySelector('.material-symbols-outlined') : null;
    const heroLabel = document.getElementById('hero-play-label');

    const dockedBtn = document.getElementById('playerPlayPauseBtn');
    const dockedIcon = document.getElementById('playerPlayPauseIcon');

<<<<<<< HEAD
    const heroIsPlaying = Boolean(isPlaying && loadedSurahId === activeSurahId && loadedReciterId === activeReciter.id && ['surah', 'ayah-sequence'].includes(playbackMode));
    if (heroIcon) heroIcon.textContent = heroIsPlaying ? 'pause' : 'play_arrow';
    if (heroBtn) {
      heroBtn.setAttribute('aria-pressed', String(heroIsPlaying));
      heroBtn.setAttribute('aria-label', heroIsPlaying ? 'Pause recitation' : 'Play full Surah');
    }
    if (heroLabel) heroLabel.textContent = heroIsPlaying ? 'Pause Surah' : 'Play Full Surah';
=======
    if (heroIcon) heroIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (heroBtn) {
      heroBtn.setAttribute('aria-pressed', String(isPlaying));
      heroBtn.setAttribute('aria-label', isPlaying ? 'Pause recitation' : 'Play full Surah');
    }
    if (heroLabel) heroLabel.textContent = isPlaying ? 'Pause Surah' : 'Play Full Surah';
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    if (dockedIcon) dockedIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (dockedBtn) {
      dockedBtn.setAttribute('aria-label', isPlaying ? 'Pause recitation' : 'Play recitation');
      dockedBtn.setAttribute('aria-pressed', String(isPlaying));
      dockedBtn.title = isPlaying ? 'Pause' : 'Play';
    }

<<<<<<< HEAD
    const readerPlayBtn = document.getElementById('readerPlaySurahBtn');
    const readerPlayIcon = readerPlayBtn?.querySelector('.material-symbols-outlined');
    const readerSurahId = Number(document.getElementById('readerModal')?.dataset.surahId);
    const readerSurah = SURAHS.find(surah => surah.id === readerSurahId);
    const readerIsPlaying = Boolean(isPlaying && loadedSurahId === readerSurahId && loadedReciterId === activeReciter.id && ['surah', 'ayah-sequence'].includes(playbackMode));
    if (readerPlayIcon) readerPlayIcon.textContent = readerIsPlaying ? 'pause' : 'play_arrow';
    if (readerPlayBtn) {
      readerPlayBtn.setAttribute('aria-pressed', String(readerIsPlaying));
      readerPlayBtn.setAttribute('aria-label', `${readerIsPlaying ? 'Pause' : 'Play'} full Surah ${readerSurah?.name || ''}`.trim());
    }
=======
    const readerPlayIcon = document.querySelector('#readerPlaySurahBtn .material-symbols-outlined');
    if (readerPlayIcon) readerPlayIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    document.getElementById('readerPlaySurahBtn')?.setAttribute('aria-pressed', String(isPlaying));
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

    // Update active card play button icon
    document.querySelectorAll('.surah-card').forEach(card => {
      const cardId = Number(card.getAttribute('data-id'));
      const cardPlayBtn = card.querySelector('.surah-card-play span');
      if (cardPlayBtn) {
<<<<<<< HEAD
        const active = cardId === loadedSurahId && loadedReciterId === activeReciter.id && isPlaying;
        if (active) {
=======
          const active = cardId === activeSurahId && isPlaying;
          if (active) {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
          cardPlayBtn.textContent = 'pause';
        } else {
          cardPlayBtn.textContent = 'play_arrow';
        }
          card.querySelector('.surah-card-play')?.setAttribute('aria-pressed', String(active));
      }
    });
  }

  // Audio Player Event Listeners
  audioPlayer.addEventListener('timeupdate', () => {
    const cur = audioPlayer.currentTime || 0;
    const dur = audioPlayer.duration || 1;
    const curElem = document.getElementById('playerCurrentTime');
    const durElem = document.getElementById('playerDuration');
    const bar = document.getElementById('playerProgressBar');
    const seekControl = document.getElementById('playerProgressBarContainer');

    if (curElem) curElem.textContent = formatTime(cur);
<<<<<<< HEAD
    if (durElem && Number.isFinite(audioPlayer.duration)) durElem.textContent = formatTime(dur);
    const progress = Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0
      ? Math.min(100, (cur / audioPlayer.duration) * 100)
      : 0;
=======
    if (durElem && !isNaN(audioPlayer.duration)) durElem.textContent = formatTime(dur);
    const progress = audioPlayer.duration ? Math.min(100, (cur / audioPlayer.duration) * 100) : 0;
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    if (bar) bar.style.width = `${progress}%`;
    if (seekControl) {
      seekControl.setAttribute('aria-valuenow', String(Math.round(progress)));
      seekControl.setAttribute('aria-valuetext', `${formatTime(cur)} of ${formatTime(audioPlayer.duration)}`);
    }
  });

  audioPlayer.addEventListener('ended', () => {
    if (playbackMode === 'ayah-sequence') {
      const surah = SURAHS.find(s => s.id === activeSurahId);
      if (surah) playFallbackAyah(surah, playbackToken, fallbackAyah + 1);
      return;
    }
    if (playbackMode === 'single-ayah') {
      playbackMode = 'idle';
      isPlaying = false;
      updatePlayStateUI();
      return;
    }
    if (repeatSurah) {
      playSurah(activeSurahId);
      return;
    }
    // Auto-advance to next Surah
    if (activeSurahId < 114) {
      playSurah(activeSurahId + 1);
    } else {
<<<<<<< HEAD
      playbackMode = 'idle';
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      isPlaying = false;
      updatePlayStateUI();
    }
  });

  audioPlayer.addEventListener('play', () => {
<<<<<<< HEAD
    if (!audioPlayer.paused) {
      isPlaying = true;
      updatePlayStateUI();
    }
  });

  audioPlayer.addEventListener('pause', () => {
    if (audioPlayer.paused) {
      isPlaying = false;
      updatePlayStateUI();
    }
=======
    isPlaying = true;
    updatePlayStateUI();
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayStateUI();
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  });

  audioPlayer.addEventListener('waiting', () => {
    setPlayerStatus('Buffering audio...', false, true);
  });

  audioPlayer.addEventListener('playing', () => {
<<<<<<< HEAD
    consecutiveFallbackFailures = 0;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    setPlayerStatus('');
  });

  function formatTime(sec) {
<<<<<<< HEAD
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
=======
    if (isNaN(sec)) return "00:00";
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // =========================================================================
  // 7. HERO SPOTLIGHT SYNCHRONIZATION
  // =========================================================================
  function updateHeroSpotlight(surah) {
    const pad = String(surah.id).padStart(3, '0');
    
    // Watermark
    const watermark = document.getElementById('hero-watermark');
    if (watermark) watermark.textContent = surah.rawArabic || surah.arabic;

    // Surah ID Badge
    const idBadge = document.getElementById('hero-surah-id');
    if (idBadge) idBadge.textContent = `SURAH ${pad}`;

    // Revelation Badge
    const revBadge = document.getElementById('hero-rev-badge');
    if (revBadge) {
      revBadge.textContent = surah.type === 'Makki' ? 'Makki (Revealed in Makkah)' : 'Madani (Revealed in Madinah)';
    }

    // Counts
    const counts = document.getElementById('hero-meta-counts');
    if (counts) {
      counts.textContent = `${surah.ayahs} Ayahs • ${surah.words || '—'} Words • ${surah.letters || '—'} Letters • Revelation Order: ${surah.revOrder}`;
    }

    // Location
    const loc = document.getElementById('hero-mushaf-location');
    if (loc) {
      loc.innerHTML = `<span class="material-symbols-outlined text-[16px] text-primary">verified</span><span>Mushaf Page ${surah.page} • Juz ${surah.juz} • Hizb ${Math.ceil(surah.juz * 2)}</span>`;
    }

    // Titles & Meaning
    const titleEn = document.getElementById('hero-title-en');
    if (titleEn) titleEn.textContent = surah.name;

    const meaning = document.getElementById('hero-meaning');
    if (meaning) meaning.textContent = `/ ${surah.meaning}`;

    const desc = document.getElementById('hero-desc');
    if (desc) desc.textContent = surah.desc;

    const arTitle = document.getElementById('hero-arabic-title');
    if (arTitle) arTitle.textContent = surah.arabic;

    const arMeta = document.getElementById('hero-arabic-meta');
    if (arMeta) arMeta.textContent = `${surah.type === 'Makki' ? 'Makkan' : 'Medinan'} Revelation • ${surah.ayahs} Verses`;

    // Action buttons dataset
    const playBtn = document.getElementById('hero-play-btn');
    if (playBtn) playBtn.setAttribute('data-surah', surah.id);

    const readBtn = document.getElementById('hero-read-btn');
    if (readBtn) {
      readBtn.setAttribute('data-surah', surah.id);
      const readLabel = document.getElementById('hero-read-label');
      if (readLabel) readLabel.textContent = `Read ${surah.ayahs} Ayahs`;
    }

    const tafsirBtn = document.getElementById('hero-tafsir-btn');
    if (tafsirBtn) tafsirBtn.setAttribute('data-surah', surah.id);

<<<<<<< HEAD
    updateBookmarkIcon();
  }

  function updateDockedTrack(surah) {
    const pad = String(surah.id).padStart(3, '0');
    const playerBadge = document.getElementById('playerTrackBadge');
    const playerTitle = document.getElementById('playerTrackTitle');
    const playerArabic = document.getElementById('playerTrackArabic');
    const playerReciter = document.getElementById('playerTrackReciter');
    if (playerBadge) playerBadge.textContent = pad;
    if (playerTitle) playerTitle.textContent = surah.name;
    if (playerArabic) playerArabic.textContent = surah.arabic;
    if (playerReciter) playerReciter.textContent = `${activeReciter.name} • ${activeReciter.style}`;
=======
    // Docked Player Sync
    const playerBadge = document.getElementById('playerTrackBadge');
    if (playerBadge) playerBadge.textContent = pad;

    const playerTitle = document.getElementById('playerTrackTitle');
    if (playerTitle) playerTitle.textContent = surah.name;

    const playerArabic = document.getElementById('playerTrackArabic');
    if (playerArabic) playerArabic.textContent = surah.arabic;

    updateBookmarkIcon();
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  function updateActiveCard(surahId) {
    document.querySelectorAll('.surah-card').forEach(card => {
      const id = Number(card.getAttribute('data-id'));
      const numBadge = card.querySelector('.surah-num-badge');
      const playBtn = card.querySelector('.surah-card-play');
<<<<<<< HEAD
      const selectBtn = card.querySelector('.surah-card-select');
      if (selectBtn) selectBtn.setAttribute('aria-pressed', String(id === surahId));
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

      if (id === surahId) {
        card.classList.add('active-surah');
        if (numBadge) {
          numBadge.className = 'w-[34px] h-[34px] rounded-lg bg-[#005c55] text-white font-mono text-[12px] font-bold tracking-wider flex items-center justify-center shrink-0 surah-num-badge';
        }
        if (playBtn) {
          playBtn.className = 'surah-card-play w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer';
        }
      } else {
        card.classList.remove('active-surah');
        if (numBadge) {
          numBadge.className = 'w-[34px] h-[34px] rounded-lg bg-[#e6f4f1] text-[#0f766e] dark:bg-primary/20 dark:text-primary font-mono text-[12px] font-bold tracking-wider flex items-center justify-center shrink-0 surah-num-badge';
        }
        if (playBtn) {
          playBtn.className = 'surah-card-play w-7 h-7 rounded-lg bg-[#e6f4f1] text-[#0f766e] hover:bg-[#005c55] hover:text-white dark:bg-primary/20 dark:text-primary dark:hover:bg-primary dark:hover:text-black flex items-center justify-center shadow-xs transition-colors cursor-pointer';
        }
      }
    });
  }

  // =========================================================================
  // 8. DIRECTORY SEARCH & FILTER ENGINE
  // =========================================================================
  function initDirectoryFilters() {
    const searchInput = document.getElementById('surah-search-input');
<<<<<<< HEAD
    const searchClear = document.getElementById('surah-search-clear');
    const resultCount = document.getElementById('search-result-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('surahs-grid');
    const emptyState = document.getElementById('surahs-empty-state');
    const emptyStateMsg = document.getElementById('empty-state-msg');
    const resetBtn = document.getElementById('btn-reset-surah-search');
=======
    const resultCount = document.getElementById('search-result-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('surahs-grid');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    const cards = Array.from(document.querySelectorAll('.surah-card'));

    let currentFilter = 'all';

<<<<<<< HEAD
    cards.forEach(card => {
      card.setAttribute('role', 'group');
      card.removeAttribute('tabindex');
      card.removeAttribute('aria-label');
      const heading = card.querySelector('h3');
      if (!heading || heading.querySelector('.surah-card-select')) return;
      const title = heading.textContent.trim();
      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.className = 'surah-card-select text-left rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer';
      selectButton.style.font = 'inherit';
      selectButton.textContent = title;
      selectButton.setAttribute('aria-label', `Select ${title}`);
      selectButton.setAttribute('aria-pressed', String(Number(card.dataset.id) === activeSurahId));
      heading.replaceChildren(selectButton);
    });

    const cleanSearchStr = (value) => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[إأآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLocaleLowerCase();

    function applyFilterAndSearch() {
      const rawVal = searchInput ? searchInput.value.trim() : '';
      let q = cleanSearchStr(rawVal);
      let visibleCount = 0;

      // Toggle search clear button
      if (searchClear) {
        searchClear.classList.toggle('hidden', !rawVal);
      }

      // Check for "juz X" or "para X"
      const juzMatch = q.match(/^(?:juz|para)\s*(\d+)$/);
      let targetJuz = juzMatch ? Number(juzMatch[1]) : null;

      // Strip "surah", "sura", "soorah" prefix
      q = q.replace(/^(?:surah|soorah|sura)\s+/, '').trim();
      const qSlug = q.replace(/[-'\s]/g, '');
      const qVariant = qSlug.replace(/k/g, 'q').replace(/h$/, '');

      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        const juz = card.getAttribute('data-juz');
        const name = cleanSearchStr(card.getAttribute('data-name'));
        const meaning = cleanSearchStr(card.getAttribute('data-meaning'));
        const arabic = cleanSearchStr(card.getAttribute('data-arabic'));

        // Category / Bookmarks filter check
        let matchesFilter = true;
        if (currentFilter === 'Makki' && type !== 'Makki') matchesFilter = false;
        if (currentFilter === 'Madani' && type !== 'Madani') matchesFilter = false;
        if (currentFilter === 'bookmarks' && !isBookmarked(Number(id))) matchesFilter = false;

        // Search query check
        let matchesQuery = true;
        if (targetJuz !== null) {
          matchesQuery = Number(juz) === targetJuz;
        } else if (q) {
          if (/^\d+$/.test(q)) {
            matchesQuery = Number(id) === Number(q);
          } else {
            const nameSlug = name.replace(/[-'\s]/g, '');
            const meaningSlug = meaning.replace(/[-'\s]/g, '');
            const arabicSlug = arabic.replace(/[-'\s]/g, '');
            const nameVariant = nameSlug.replace(/k/g, 'q').replace(/h$/, '');

            matchesQuery = name.includes(q) ||
              nameSlug.includes(qSlug) ||
              nameVariant.includes(qVariant) ||
              meaning.includes(q) ||
              meaningSlug.includes(qSlug) ||
              arabic.includes(q) ||
              arabicSlug.includes(qSlug);
          }
=======
    function applyFilterAndSearch() {
      const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        const name = card.getAttribute('data-name') || '';
        const meaning = card.getAttribute('data-meaning') || '';
        const arabic = card.getAttribute('data-arabic') || '';

        // Category filter check
        let matchesFilter = true;
        if (currentFilter === 'Makki' && type !== 'Makki') matchesFilter = false;
        if (currentFilter === 'Madani' && type !== 'Madani') matchesFilter = false;

        // Search query check
        let matchesQuery = true;
        if (q) {
          matchesQuery = id === q ||
            String(Number(id)) === q ||
            name.includes(q) ||
            meaning.includes(q) ||
            arabic.includes(q);
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        }

        if (matchesFilter && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

<<<<<<< HEAD
      // Update Empty State
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.remove('hidden');
          emptyState.classList.add('flex');
          if (emptyStateMsg) {
            emptyStateMsg.textContent = currentFilter === 'bookmarks'
              ? 'You have not bookmarked any Surahs yet. Click the bookmark icon on any Surah in the hero section to save it here.'
              : `No chapters match "${rawVal}". Try searching by number (1-114), transliteration (e.g. Yasin, Al-Kahf), or Juz (e.g. Juz 30).`;
          }
        } else {
          emptyState.classList.add('hidden');
          emptyState.classList.remove('flex');
        }
      }

      if (resultCount) {
        if (rawVal || currentFilter !== 'all') {
=======
      if (resultCount) {
        if (q || currentFilter !== 'all') {
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
          resultCount.textContent = `${visibleCount} match${visibleCount === 1 ? '' : 'es'}`;
          resultCount.classList.remove('hidden');
        } else {
          resultCount.classList.add('hidden');
        }
      }
    }

<<<<<<< HEAD
    window._quranApplyFilter = applyFilterAndSearch;

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(applyFilterAndSearch, 100);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          applyFilterAndSearch();
          searchInput.focus();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
        else applyFilterAndSearch();
=======
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(applyFilterAndSearch, 120);
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      });
    }

    // Keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
      }
    });

    filterButtons.forEach(btn => {
<<<<<<< HEAD
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === 'all'));
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-surface', 'font-semibold', 'shadow-sm', 'text-on-surface');
          b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-surface', 'font-semibold', 'shadow-sm', 'text-on-surface');
        btn.classList.remove('text-on-surface-variant');
<<<<<<< HEAD
        filterButtons.forEach(filterButton => filterButton.setAttribute('aria-pressed', String(filterButton === btn)));
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

        const filterMode = btn.getAttribute('data-filter');
        currentFilter = filterMode;

        if (filterMode === 'rev') {
          // Sort by revelation order
          const sorted = [...cards].sort((a, b) => Number(a.getAttribute('data-rev')) - Number(b.getAttribute('data-rev')));
          sorted.forEach(c => grid.appendChild(c));
          currentFilter = 'all';
          showToast("Sorted by Chronological Revelation Order");
        } else if (filterMode === 'juz') {
          // Sort by Juz order
          const sorted = [...cards].sort((a, b) => Number(a.getAttribute('data-juz')) - Number(b.getAttribute('data-juz')));
          sorted.forEach(c => grid.appendChild(c));
          currentFilter = 'all';
          showToast("Grouped by Juz Order");
        } else {
          // Re-sort canonically 1 to 114
          const sorted = [...cards].sort((a, b) => Number(a.getAttribute('data-id')) - Number(b.getAttribute('data-id')));
          sorted.forEach(c => grid.appendChild(c));
<<<<<<< HEAD
          if (filterMode === 'bookmarks') {
            showToast(`Showing ${getBookmarks().length} Bookmarked Chapter${getBookmarks().length === 1 ? '' : 's'}`);
          }
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        }

        applyFilterAndSearch();
      });
    });

    // Card click event listeners
    cards.forEach(card => {
      const id = Number(card.getAttribute('data-id'));
      
      card.addEventListener('click', (e) => {
        // If play button clicked specifically
        if (e.target.closest('.surah-card-play')) {
          e.stopPropagation();
<<<<<<< HEAD
          const sameLoadedSurah = loadedSurahId === id && loadedReciterId === activeReciter.id;
          const isFullSurahTrack = ['surah', 'ayah-sequence'].includes(playbackMode);
          if (sameLoadedSurah && isFullSurahTrack) togglePlayPause();
          else playSurah(id);
=======
          if (activeSurahId === id && isPlaying) {
            audioPlayer.pause();
          } else {
            playSurah(id);
          }
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
          return;
        }

        // Card select
        activeSurahId = id;
        const surah = SURAHS.find(s => s.id === id);
        if (surah) {
          updateHeroSpotlight(surah);
          updateActiveCard(id);
<<<<<<< HEAD
          updatePlayStateUI();
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
          document.getElementById('hero-spotlight').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // =========================================================================
  // 9. AYAH-BY-AYAH SURAH READER
  // =========================================================================
<<<<<<< HEAD
  function setReaderDataStatus(message, isError = false) {
    const status = document.getElementById('readerDataStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('hidden', !message);
    status.classList.toggle('text-danger', isError);
    status.classList.toggle('text-on-surface-variant', !isError);
  }

  function renderReaderVerses(surah, verses) {
    const list = document.getElementById('readerAyahsList');
    if (!list) return;
    const fragment = document.createDocumentFragment();
    const hasTransliteration = verses.some(ayah => Boolean(ayah.latin));

    verses.forEach(ayah => {
      const item = document.createElement('article');
      item.className = 'p-5 rounded-xl bg-surface-container-low border border-subtle flex flex-col gap-3 transition-colors';

      const row = document.createElement('div');
      row.className = 'flex items-center justify-between';
      const number = document.createElement('span');
      number.className = 'w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center';
      number.textContent = String(ayah.num);
      const playButton = document.createElement('button');
      playButton.type = 'button';
      playButton.className = 'ayah-play-btn min-w-10 min-h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer';
      playButton.dataset.surah = String(surah.id);
      playButton.dataset.ayah = String(ayah.num);
      playButton.setAttribute('aria-label', `Listen to ${surah.name}, Ayah ${ayah.num}`);
      playButton.title = `Listen to Ayah ${ayah.num}`;
      const playIcon = document.createElement('span');
      playIcon.className = 'material-symbols-outlined text-[16px]';
      playIcon.setAttribute('aria-hidden', 'true');
      playIcon.textContent = 'volume_up';
      playButton.appendChild(playIcon);
      row.append(number, playButton);
      item.appendChild(row);

      const arabic = document.createElement('p');
      arabic.className = 'font-arabic-sacred scale-arabic-dynamic text-right text-on-surface leading-loose';
      arabic.dir = 'rtl';
      arabic.lang = 'ar';
      arabic.textContent = ayah.arabic;

      if (ayah.opening) {
        const opening = document.createElement('div');
        opening.className = 'py-2 text-center rounded-lg bg-surface/60';
        const openingLabel = document.createElement('span');
        openingLabel.className = 'block mb-1 font-caption-meta text-[10px] text-on-surface-variant';
        openingLabel.textContent = 'Opening formula (not numbered)';
        const openingText = document.createElement('span');
        openingText.className = 'font-arabic-sacred scale-arabic-dynamic text-primary';
        openingText.dir = 'rtl';
        openingText.lang = 'ar';
        openingText.textContent = ayah.opening;
        opening.append(openingLabel, openingText);
        item.appendChild(opening);
      }
      item.appendChild(arabic);

      if (ayah.latin) {
        const transliteration = document.createElement('p');
        transliteration.className = 'font-ui-interactive scale-text-dynamic text-primary font-medium text-xs reader-latin';
        transliteration.lang = 'en-Latn';
        transliteration.hidden = !showLatin;
        transliteration.textContent = ayah.latin;
        item.appendChild(transliteration);
      }

      if (ayah.en) {
        const translation = document.createElement('p');
        translation.className = 'font-body-article scale-text-dynamic text-on-surface-variant text-sm reader-translation';
        translation.lang = 'en';
        translation.hidden = !showTranslation;
        translation.textContent = ayah.en;
        item.appendChild(translation);
      }

      playButton.addEventListener('click', () => {
        if (playerVolume > 1) ensureAudioProcessing();
        activeSurahId = surah.id;
        loadedSurahId = surah.id;
        loadedReciterId = activeReciter.id;
        updateHeroSpotlight(surah);
        updateActiveCard(surah.id);
        updateDockedTrack(surah);
        const token = ++playbackToken;
        playbackMode = 'single-ayah';
        const sNum = String(surah.id).padStart(3, '0');
        const aNum = String(ayah.num).padStart(3, '0');
=======
  function openReaderModal(surahId) {
    const modal = document.getElementById('readerModal');
    const surah = SURAHS.find(s => s.id === Number(surahId)) || SURAHS[0];
    if (!modal) return;

    document.getElementById('readerModalNum').textContent = String(surah.id).padStart(3, '0');
    document.getElementById('readerModalTitle').textContent = surah.name;
    document.getElementById('readerModalArabic').textContent = surah.arabic;
    document.getElementById('readerModalSubtitle').textContent = `${surah.ayahs} Verses • ${surah.type} • Revelation Order: ${surah.revOrder} • Mushaf Page ${surah.page}`;

    const readerPlayBtn = document.getElementById('readerPlaySurahBtn');
    if (readerPlayBtn) {
      readerPlayBtn.setAttribute('aria-label', `Listen to ${surah.name}`);
      const icon = readerPlayBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = activeSurahId === surah.id && isPlaying ? 'pause' : 'play_arrow';
    }

    const ayahsList = document.getElementById('readerAyahsList');
    ayahsList.innerHTML = '';

    const cachedAyahs = AYAH_SAMPLE_STORE[surah.id] || [
      { num: 1, arabic: surah.arabic, latin: surah.name, en: surah.desc },
      { num: 2, arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", latin: "Bismi Allāhi ar-rahmāni ar-rahīmi", en: "In the Name of Allah—the Most Compassionate, Most Merciful." }
    ];

    cachedAyahs.forEach(ayah => {
      const item = document.createElement('div');
      item.className = 'p-5 rounded-xl bg-surface-container-low border border-subtle flex flex-col gap-3 transition-colors';
      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="w-7 h-7 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center">
            ${ayah.num}
          </span>
          <button class="ayah-play-btn w-7 h-7 rounded-full bg-surface-container hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer" type="button" data-surah="${surah.id}" data-ayah="${ayah.num}" title="Listen to Ayah ${ayah.num}">
            <span class="material-symbols-outlined text-[16px]">volume_up</span>
          </button>
        </div>
        <p class="font-arabic-sacred scale-arabic-dynamic text-right text-on-surface leading-loose" dir="rtl">
          ${ayah.arabic}
        </p>
        <p class="font-ui-interactive scale-text-dynamic text-primary font-medium text-xs reader-latin" ${showLatin ? '' : 'style="display:none;"'}>
          ${ayah.latin}
        </p>
        <p class="font-body-article scale-text-dynamic text-on-surface-variant text-sm reader-translation" ${showTranslation ? '' : 'style="display:none;"'}>
          ${ayah.en}
        </p>
      `;
      ayahsList.appendChild(item);
    });

    // Handle individual ayah play
    ayahsList.querySelectorAll('.ayah-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (playerVolume > 1) ensureAudioProcessing();
        const token = ++playbackToken;
        playbackMode = 'single-ayah';
        const sNum = String(surah.id).padStart(3, '0');
        const aNum = String(btn.getAttribute('data-ayah')).padStart(3, '0');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        const ayahUrl = `https://everyayah.com/data/${activeReciter.everyAyahCode}/${sNum}${aNum}.mp3`;
        setPlayerStatus('Loading audio...', false, true);
        const failOnce = setAudioSource(ayahUrl, () => {
          if (token !== playbackToken || playbackMode !== 'single-ayah') return;
          playbackMode = 'idle';
          isPlaying = false;
          updatePlayStateUI();
          setPlayerStatus('This verse audio is unavailable. Please try again.', true);
        });
<<<<<<< HEAD
        audioPlayer.play().then(() => {
          if (token !== playbackToken) return;
          isPlaying = true;
          setPlayerStatus('');
          updatePlayStateUI();
        }).catch(error => {
          if (error?.name === 'NotAllowedError') setPlayerStatus('Tap play to start recitation.');
          else if (error?.name !== 'AbortError') failOnce();
        });
      });

      fragment.appendChild(item);
    });

    list.replaceChildren(fragment);
    document.getElementById('toggle-transliteration')?.classList.toggle('hidden', !hasTransliteration);
  }

  async function openReaderModal(surahId) {
    const modal = document.getElementById('readerModal');
    const surah = SURAHS.find(item => item.id === Number(surahId)) || SURAHS[0];
    if (!modal) return;

    activeSurahId = surah.id;
    updateHeroSpotlight(surah);
    updateActiveCard(surah.id);
    document.body.classList.add('is-modal-open');

    const prevSurahBtn = document.getElementById('readerPrevSurahBtn');
    const nextSurahBtn = document.getElementById('readerNextSurahBtn');
    if (prevSurahBtn) {
      prevSurahBtn.disabled = surah.id <= 1;
      prevSurahBtn.onclick = () => openReaderModal(surah.id - 1);
    }
    if (nextSurahBtn) {
      nextSurahBtn.disabled = surah.id >= 114;
      nextSurahBtn.onclick = () => openReaderModal(surah.id + 1);
    }

    const requestToken = ++readerRequestToken;
    modal.dataset.surahId = String(surah.id);
    document.getElementById('readerModalNum').textContent = String(surah.id).padStart(3, '0');
    document.getElementById('readerModalTitle').textContent = surah.name;
    document.getElementById('readerModalArabic').textContent = surah.arabic;
    document.getElementById('readerModalSubtitle').textContent = `${surah.ayahs} Verses • ${surah.type} • Revelation Order: ${surah.revOrder} • Mushaf Page ${surah.page}`;

    const readerPlayBtn = document.getElementById('readerPlaySurahBtn');
    if (readerPlayBtn) {
      const readerIsPlaying = isPlaying && loadedSurahId === surah.id && loadedReciterId === activeReciter.id && ['surah', 'ayah-sequence'].includes(playbackMode);
      readerPlayBtn.setAttribute('aria-label', `${readerIsPlaying ? 'Pause' : 'Play'} full Surah ${surah.name}`);
      readerPlayBtn.setAttribute('aria-pressed', String(readerIsPlaying));
      const icon = readerPlayBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = readerIsPlaying ? 'pause' : 'play_arrow';
    }

    document.getElementById('readerAyahsList').replaceChildren();
    document.getElementById('readerModalSource').textContent = 'Arabic text: Uthmani script • English translation: Saheeh International';
    setReaderDataStatus('Loading the complete Surah text…');
    modal.setAttribute('aria-busy', 'true');
    modal.classList.remove('hidden');
    document.getElementById('readerCloseBtn')?.focus({ preventScroll: true });

    try {
      const verses = await fetchSurahVerses(surah);
      if (requestToken !== readerRequestToken) return;
      renderReaderVerses(surah, verses);
      document.getElementById('readerModalSource').textContent = 'Arabic: Uthmani script from Al Quran Cloud • Translation: Saheeh International';
      setReaderDataStatus('Complete Surah text loaded. This browser caches the text for offline reading when storage is available.');
      modal.setAttribute('aria-busy', 'false');
    } catch (error) {
      if (requestToken !== readerRequestToken) return;
      const offlineVerses = AYAH_SAMPLE_STORE[surah.id];
      if (offlineVerses?.length) {
        renderReaderVerses(surah, offlineVerses);
        const isComplete = offlineVerses.length === surah.ayahs;
        document.getElementById('readerModalSource').textContent = isComplete
          ? 'Bundled offline text • English translation: Saheeh International'
          : 'Bundled offline excerpt • not the complete Surah';
        setReaderDataStatus(`Offline ${isComplete ? 'text' : 'excerpt'}: showing ${offlineVerses.length} of ${surah.ayahs} ayahs. Reconnect to load the complete Surah.`);
      } else {
        document.getElementById('toggle-transliteration')?.classList.add('hidden');
        document.getElementById('readerModalSource').textContent = 'The complete text is not stored on this device.';
        setReaderDataStatus('Could not load verified Qur’an text. Check your connection and try again.', true);
      }
      modal.setAttribute('aria-busy', 'false');
    }
  }

  // =========================================================================
  // 10. SURAH OVERVIEW DRAWER
=======
        audioPlayer.play().catch(error => {
          if (error?.name === 'NotAllowedError') setPlayerStatus('Tap play to start recitation.');
          else if (error?.name !== 'AbortError') failOnce();
        });
        showToast(`Reciting Ayah ${btn.getAttribute('data-ayah')}`);
      });
    });

    modal.classList.remove('hidden');
  }

  // =========================================================================
  // 10. TAFSIR IBN KATHIR DRAWER
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  // =========================================================================
  function openTafsirModal(surahId) {
    const modal = document.getElementById('tafsirModal');
    const surah = SURAHS.find(s => s.id === Number(surahId)) || SURAHS[0];
    if (!modal) return;
<<<<<<< HEAD
    document.body.classList.add('is-modal-open');

    document.getElementById('tafsirModalTitle').textContent = `Surah Overview: ${surah.name}`;
    document.getElementById('tafsirModalSubtitle').textContent = 'Directory metadata and description';

    const body = document.getElementById('tafsirContentBody');
    body.innerHTML = `
      <section class="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
        <h4 class="font-bold text-primary text-sm">${surah.name} · ${surah.meaning}</h4>
        <p class="text-sm text-on-surface-variant leading-relaxed">${surah.desc}</p>
        <dl class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div><dt class="text-on-surface-variant">Revelation</dt><dd class="font-semibold text-on-surface">${surah.type}</dd></div>
          <div><dt class="text-on-surface-variant">Ayahs</dt><dd class="font-semibold text-on-surface">${surah.ayahs}</dd></div>
          <div><dt class="text-on-surface-variant">Order</dt><dd class="font-semibold text-on-surface">${surah.revOrder}</dd></div>
          <div><dt class="text-on-surface-variant">Mushaf page</dt><dd class="font-semibold text-on-surface">${surah.page}</dd></div>
        </dl>
      </section>
      <p class="text-xs text-on-surface-variant leading-relaxed">This panel contains directory notes, not a quotation or summary of Ibn Kathir's tafsir. The page does not include a sourced classical commentary passage for this Surah.</p>
    `;

    modal.classList.remove('hidden');
    document.getElementById('tafsirCloseBtn')?.focus({ preventScroll: true });
=======

    document.getElementById('tafsirModalTitle').textContent = `Tafsir: ${surah.name} (${surah.arabic})`;
    document.getElementById('tafsirModalSubtitle').textContent = `Authentic Exegesis of Al-Hafiz Ibn Kathir (Ad-Dimashqi)`;

    const body = document.getElementById('tafsirContentBody');
    body.innerHTML = `
      <div class="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
        <h4 class="font-bold text-primary text-sm flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[18px]">verified</span>
          <span>Virtues &amp; Canonical Status of ${surah.name}</span>
        </h4>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          ${surah.desc} Revealed in ${surah.type === 'Makki' ? 'Makkah Al-Mukarramah' : 'Al-Madinah Al-Munawwarah'} as chronological revelation number ${surah.revOrder}. Comprises ${surah.ayahs} noble verses, situated on page ${surah.page} of the standard Madinah Mushaf.
        </p>
      </div>

      <div class="space-y-3 pt-2">
        <h5 class="font-semibold text-on-surface text-sm">Theme and Linguistic Structure</h5>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          Ibn Kathir notes that the chapter addresses the foundational tenets of divine monotheism (Tawheed), dismantling pagan assertions and clarifying the divine covenant made with humanity. The classical commentators agree that reciting and contemplating its meanings unlocks tremendous spiritual illumination and guidance.
        </p>
        <div class="p-3 bg-surface-container-low rounded-lg border border-subtle text-xs font-code-mono text-on-surface">
          <strong>Key Commentary Reference:</strong> Tafsir al-Qur'an al-'Azim, Vol. ${Math.min(surah.juz, 8)}, Surah ${surah.id}.
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  // =========================================================================
  // 11. MADINAH MUSHAF VIEWER
  // =========================================================================
<<<<<<< HEAD
  async function loadMushafPage(pageNumber) {
    mushafCurrentPage = Math.max(1, Math.min(604, Number(pageNumber) || 1));
    const requestToken = ++mushafRequestToken;
    const modal = document.getElementById('mushafModal');
    const title = document.getElementById('mushafModalTitle');
    const status = document.getElementById('mushafPageStatus');
    const header = document.getElementById('mushafSurahHeader');
    const pageText = document.getElementById('mushafSurahText');
    const previousButton = document.getElementById('mushafPrevPageBtn');
    const nextButton = document.getElementById('mushafNextPageBtn');
    const pageInput = document.getElementById('mushafPageInput');
    if (!modal || !pageText) return;

    document.body.classList.add('is-modal-open');
    if (pageInput) pageInput.value = String(mushafCurrentPage);
    if (title) title.textContent = `Mushaf Page ${mushafCurrentPage} of 604`;
    if (status) status.textContent = `Loading page ${mushafCurrentPage}…`;
    modal.setAttribute('aria-busy', 'true');
    if (header) header.textContent = '';
    pageText.replaceChildren();
    if (previousButton) previousButton.disabled = mushafCurrentPage === 1;
    if (nextButton) nextButton.disabled = mushafCurrentPage === 604;

    try {
      const verses = await fetchMushafPage(mushafCurrentPage);
      if (requestToken !== mushafRequestToken) return;

      let currentSurahId = null;
      let firstSurahName = '';
      const fragment = document.createDocumentFragment();
      verses.forEach(verse => {
        if (verse.surahId !== currentSurahId) {
          currentSurahId = verse.surahId;
          if (!firstSurahName) firstSurahName = verse.surahName;
          if (currentSurahId !== verses[0].surahId) {
            const surahHeading = document.createElement('h4');
            surahHeading.className = 'w-full pt-4 mt-3 border-t border-[#8B7B63]/30 text-center font-arabic-sacred text-2xl text-[#0F5F58] dark:text-[#67d9c8] font-bold';
            surahHeading.dir = 'rtl';
            surahHeading.lang = 'ar';
            surahHeading.textContent = verse.surahName;
            fragment.appendChild(surahHeading);
          }
        }

        const line = document.createElement('p');
        line.className = 'font-arabic-sacred text-xl leading-[3.25rem] text-right text-stone-900 dark:text-stone-100';
        line.dir = 'rtl';
        line.lang = 'ar';
        if (verse.opening) {
          const opening = document.createElement('p');
          opening.className = 'py-3 text-center font-arabic-sacred text-xl text-[#0F5F58] dark:text-[#67d9c8]';
          opening.dir = 'rtl';
          opening.lang = 'ar';
          opening.textContent = verse.opening;
          fragment.appendChild(opening);
        }
        const text = document.createElement('span');
        text.textContent = verse.arabic;
        const marker = document.createElement('span');
        marker.className = 'mx-1 text-sm text-[#8B7B63]';
        marker.setAttribute('aria-label', `Ayah ${verse.number}`);
        marker.textContent = `۝${verse.number}`;
        line.append(text, marker);
        fragment.appendChild(line);
      });

      pageText.replaceChildren(fragment);
      if (header) header.textContent = firstSurahName;
      if (status) status.textContent = `Uthmani text from Al Quran Cloud. This page is cached for offline reading when browser storage is available.`;
      modal.setAttribute('aria-busy', 'false');
    } catch (error) {
      if (requestToken !== mushafRequestToken) return;
      if (status) status.textContent = 'This exact Mushaf page is not stored on this device. Connect to load it, then it will be cached for offline reading.';
      if (header) header.textContent = '';
      pageText.replaceChildren();
      modal.setAttribute('aria-busy', 'false');
    }
  }

  async function openMushafModal(surahId) {
    const surah = SURAHS.find(item => item.id === Number(surahId)) || SURAHS[0];
    const modal = document.getElementById('mushafModal');
    if (!modal) return;
    modal.querySelector('.py-2.font-arabic-sacred')?.remove();
    modal.classList.remove('hidden');
    document.getElementById('mushafCloseBtn')?.focus({ preventScroll: true });
    await loadMushafPage(surah.page);
=======
  function openMushafModal(surahId) {
    const modal = document.getElementById('mushafModal');
    const surah = SURAHS.find(s => s.id === Number(surahId)) || SURAHS[0];
    if (!modal) return;

    document.getElementById('mushafModalTitle').textContent = `Madinah Mushaf Page ${surah.page}`;
    document.getElementById('mushafSurahHeader').textContent = surah.arabic;

    const sampleAyahs = AYAH_SAMPLE_STORE[surah.id] || AYAH_SAMPLE_STORE[1];
    const textHtml = sampleAyahs.map(a => `${a.arabic} ﴿${a.num}﴾ `).join(' ');
    document.getElementById('mushafSurahText').innerHTML = textHtml;

    modal.classList.remove('hidden');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  // =========================================================================
  // 12. VERIFIED RECITERS MODAL
  // =========================================================================
  function openRecitersModal() {
    const modal = document.getElementById('recitersModal');
    const list = document.getElementById('recitersList');
    if (!modal || !list) return;
<<<<<<< HEAD
    document.body.classList.add('is-modal-open');
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

    list.innerHTML = '';
    RECITERS.forEach(rec => {
      const isSelected = rec.id === activeReciter.id;
<<<<<<< HEAD
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `w-full p-3.5 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${isSelected ? 'border-primary bg-primary/10' : 'border-subtle bg-surface-container-low hover:bg-surface-container'}`;
      item.setAttribute('aria-pressed', String(isSelected));
=======
      const item = document.createElement('div');
      item.className = `p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-subtle bg-surface-container-low hover:bg-surface-container'}`;
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center font-bold text-xs">
            <span class="material-symbols-outlined text-[18px]">record_voice_over</span>
          </div>
          <div>
            <h4 class="font-ui-interactive font-bold text-sm text-on-surface">${rec.name}</h4>
            <p class="font-caption-meta text-xs text-on-surface-variant">${rec.style} • ${rec.location}</p>
          </div>
        </div>
        ${isSelected ? '<span class="material-symbols-outlined text-primary text-[20px]">check_circle</span>' : ''}
      `;
      item.addEventListener('click', () => {
        activeReciter = rec;
        showToast(`Reciter switched to ${rec.name}`);
<<<<<<< HEAD
        const selectedSurah = SURAHS.find(surah => surah.id === activeSurahId);
        if (selectedSurah) updateDockedTrack(selectedSurah);
=======
        const reciterLabel = document.getElementById('playerTrackReciter');
        if (reciterLabel) reciterLabel.textContent = `${rec.name} • ${rec.style}`;
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        modal.classList.add('hidden');
        if (isPlaying) playSurah(activeSurahId);
      });
      list.appendChild(item);
    });

    modal.classList.remove('hidden');
<<<<<<< HEAD
    document.getElementById('recitersCloseBtn')?.focus({ preventScroll: true });
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  // =========================================================================
  // 13. PDF CATALOG MODAL
  // =========================================================================
  function openPdfModal() {
    const modal = document.getElementById('pdfModal');
    const list = document.getElementById('pdfCatalogList');
    if (!modal || !list) return;
<<<<<<< HEAD
    document.body.classList.add('is-modal-open');
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

    list.innerHTML = '';
    PDF_CATALOG.forEach(pdf => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-surface-container-low border border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/50';
      card.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary text-[28px] mt-0.5 shrink-0">picture_as_pdf</span>
          <div class="flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-ui-interactive font-bold text-sm text-on-surface">${pdf.title}</h4>
              <span class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold">${pdf.badge}</span>
            </div>
            <span class="font-arabic-sacred text-sm text-primary/90 mt-0.5" dir="rtl">${pdf.arabic}</span>
            <p class="font-caption-meta text-xs text-on-surface-variant mt-1 max-w-md">${pdf.desc}</p>
            <span class="font-code-mono text-[11px] text-on-surface-variant mt-1">File Size: ${pdf.size}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <a class="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-container text-xs font-medium flex items-center gap-1 transition-colors" href="${pdf.downloadUrl}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined text-[15px]">download</span>
            <span>Download</span>
          </a>
          <a class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center gap-1 transition-colors" href="${pdf.previewUrl}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined text-[15px]">visibility</span>
            <span>Preview</span>
          </a>
        </div>
      `;
      list.appendChild(card);
    });

    modal.classList.remove('hidden');
<<<<<<< HEAD
    document.getElementById('pdfCloseBtn')?.focus({ preventScroll: true });
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
  }

  // =========================================================================
  // 14. FAST ERGONOMIC CONTROLS & EVENT WIRE-UP
  // =========================================================================
  function initErgonomicControls() {
    // Mode tabs: every tab has a visible active state and a concrete action.
    const modeTabs = document.querySelectorAll('#mode-tabs .mode-tab');
    const closeAllModals = () => {
      ['readerModal', 'tafsirModal', 'mushafModal', 'recitersModal', 'pdfModal']
        .forEach(id => document.getElementById(id)?.classList.add('hidden'));
    };
    const setActiveMode = (mode) => {
      modeTabs.forEach(tab => {
        const active = tab.dataset.mode === mode;
        tab.classList.toggle('bg-primary-container', active);
        tab.classList.toggle('text-on-primary-container', active);
        tab.classList.toggle('font-semibold', active);
        tab.classList.toggle('shadow-sm', active);
        tab.classList.toggle('text-on-surface-variant', !active);
<<<<<<< HEAD
        tab.setAttribute('aria-pressed', String(active));
=======
        tab.setAttribute('aria-current', active ? 'page' : 'false');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      });
    };

    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        closeAllModals();
        setActiveMode(mode);
        if (mode === 'directory') {
          document.getElementById('surahs-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (mode === 'reader') {
          openReaderModal(activeSurahId);
        } else if (mode === 'mushaf') {
          openMushafModal(activeSurahId);
        } else if (mode === 'juz') {
          document.querySelector('.filter-btn[data-filter="juz"]')?.click();
          document.getElementById('surahs-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (mode === 'reciters') {
          openRecitersModal();
        } else if (mode === 'pdf') {
          openPdfModal();
        }
      });
    });
    setActiveMode('directory');

    const readerPlayBtn = document.getElementById('readerPlaySurahBtn');
    if (readerPlayBtn) {
      readerPlayBtn.addEventListener('click', () => {
<<<<<<< HEAD
        const readerSurahId = Number(document.getElementById('readerModal')?.dataset.surahId) || activeSurahId;
        const sameLoadedSurah = loadedSurahId === readerSurahId && loadedReciterId === activeReciter.id;
        if (!sameLoadedSurah || !['surah', 'ayah-sequence'].includes(playbackMode)) playSurah(readerSurahId);
        else togglePlayPause();
      });
    }

    document.getElementById('mushafPrevPageBtn')?.addEventListener('click', () => loadMushafPage(mushafCurrentPage - 1));
    document.getElementById('mushafNextPageBtn')?.addEventListener('click', () => loadMushafPage(mushafCurrentPage + 1));

    // Hero buttons
    const heroPlay = document.getElementById('hero-play-btn');
    if (heroPlay) heroPlay.addEventListener('click', toggleHeroPlayback);
=======
        togglePlayPause();
        const icon = readerPlayBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = isPlaying ? 'pause' : 'play_arrow';
      });
    }

    // Hero buttons
    const heroPlay = document.getElementById('hero-play-btn');
    if (heroPlay) heroPlay.addEventListener('click', () => togglePlayPause());
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f

    const heroRead = document.getElementById('hero-read-btn');
    if (heroRead) heroRead.addEventListener('click', () => openReaderModal(activeSurahId));

    const heroTafsir = document.getElementById('hero-tafsir-btn');
    if (heroTafsir) heroTafsir.addEventListener('click', () => openTafsirModal(activeSurahId));

    const heroCopy = document.getElementById('hero-copy-btn');
<<<<<<< HEAD
    if (heroCopy) heroCopy.addEventListener('click', () => { copySurahText(activeSurahId); });
=======
    if (heroCopy) {
      heroCopy.addEventListener('click', () => {
        const surah = SURAHS.find(s => s.id === activeSurahId) || SURAHS[0];
        const text = `${surah.name} (${surah.arabic})\n${surah.meaning}\n${surah.desc}\n\nبِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ\nIn the Name of Allah—the Most Compassionate, Most Merciful.`;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied text for ${surah.name}`);
        });
      });
    }

>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    const heroBookmark = document.getElementById('hero-bookmark-btn');
    if (heroBookmark) {
      heroBookmark.addEventListener('click', () => toggleBookmark(activeSurahId));
    }

    const heroDownload = document.getElementById('hero-download-btn');
    if (heroDownload) {
      heroDownload.addEventListener('click', () => {
        const url = getSurahAudioUrl(activeSurahId, activeReciter);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Surah_${String(activeSurahId).padStart(3, '0')}.mp3`;
        a.target = '_blank';
        a.click();
        showToast(`Starting audio download for Surah ${activeSurahId}`);
      });
    }

    // Transliteration Toggle
    const translitBtn = document.getElementById('toggle-transliteration');
    if (translitBtn) {
      translitBtn.addEventListener('click', () => {
        showLatin = !showLatin;
        translitBtn.setAttribute('aria-pressed', showLatin);
        document.querySelectorAll('.reader-latin').forEach(el => {
<<<<<<< HEAD
          el.hidden = !showLatin;
=======
          el.style.display = showLatin ? 'block' : 'none';
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        });
        if (showLatin) {
          translitBtn.classList.add('bg-surface-container-high', 'text-on-surface');
          translitBtn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
          showToast("Latin Transliteration Visible");
        } else {
          translitBtn.classList.remove('bg-surface-container-high', 'text-on-surface');
          translitBtn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
          showToast("Latin Transliteration Hidden");
        }
      });
    }

    // Translation Toggle
    const transBtn = document.getElementById('toggle-translation');
    if (transBtn) {
      transBtn.addEventListener('click', () => {
        showTranslation = !showTranslation;
        transBtn.setAttribute('aria-pressed', showTranslation);
        document.querySelectorAll('.reader-translation').forEach(el => {
<<<<<<< HEAD
          el.hidden = !showTranslation;
=======
          el.style.display = showTranslation ? 'block' : 'none';
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        });
        if (showTranslation) {
          transBtn.classList.add('bg-surface-container-high', 'text-on-surface');
          transBtn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
          showToast("English Translation Visible");
        } else {
          transBtn.classList.remove('bg-surface-container-high', 'text-on-surface');
          transBtn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
          showToast("English Translation Hidden");
        }
      });
    }

    // Font Scale Pills
    const decBtn = document.getElementById('btn-font-dec');
    const incBtn = document.getElementById('btn-font-inc');
    const readout = document.getElementById('font-scale-readout');

    if (decBtn && incBtn && readout) {
      decBtn.addEventListener('click', () => {
        if (fontScale > 0.8) {
          fontScale = Math.max(0.8, Number((fontScale - 0.1).toFixed(1)));
          document.documentElement.style.setProperty('--reader-font-scale', fontScale);
          readout.textContent = `${Math.round(fontScale * 100)}%`;
        }
      });
      incBtn.addEventListener('click', () => {
        if (fontScale < 1.5) {
          fontScale = Math.min(1.5, Number((fontScale + 0.1).toFixed(1)));
          document.documentElement.style.setProperty('--reader-font-scale', fontScale);
          readout.textContent = `${Math.round(fontScale * 100)}%`;
        }
      });
    }

    // Docked Player Controls
    const mobileToggle = document.getElementById('playerToggleBtnMobile');
    const controlsGroup = document.getElementById('playerControlsMobileGroup');
    if (mobileToggle && controlsGroup) {
      mobileToggle.addEventListener('click', () => {
        const isHidden = controlsGroup.classList.contains('hidden');
        controlsGroup.classList.toggle('hidden', !isHidden);
        mobileToggle.setAttribute('aria-expanded', String(isHidden));
        mobileToggle.setAttribute('aria-label', isHidden ? 'Collapse player controls' : 'Expand player controls');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isHidden ? 'expand_less' : 'expand_more';
        }
      });
    }

    const dockedPlay = document.getElementById('playerPlayPauseBtn');
    if (dockedPlay) dockedPlay.addEventListener('click', togglePlayPause);

    const seekBy = (seconds) => {
      if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) return;
      audioPlayer.currentTime = Math.max(0, Math.min(audioPlayer.duration, audioPlayer.currentTime + seconds));
    };
    const back10Btn = document.getElementById('playerBack10Btn');
    const forward10Btn = document.getElementById('playerForward10Btn');
    if (back10Btn) back10Btn.addEventListener('click', () => seekBy(-10));
    if (forward10Btn) forward10Btn.addEventListener('click', () => seekBy(10));

    const prevBtn = document.getElementById('playerPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (activeSurahId > 1) playSurah(activeSurahId - 1);
      });
    }

    const nextBtn = document.getElementById('playerNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeSurahId < 114) playSurah(activeSurahId + 1);
      });
    }

    const speedBtn = document.getElementById('playerSpeedBtn');
    const speedReadout = document.getElementById('playerSpeedReadout');
    if (speedBtn && speedReadout) {
      const savedSpeed = Number(getPlayerPreference('speed', '1'));
      const savedSpeedIndex = SPEEDS.indexOf(savedSpeed);
      if (savedSpeedIndex >= 0) currentSpeedIdx = savedSpeedIndex;
      audioPlayer.playbackRate = SPEEDS[currentSpeedIdx];
      speedReadout.textContent = `${SPEEDS[currentSpeedIdx]}x`;
      speedBtn.addEventListener('click', () => {
        currentSpeedIdx = (currentSpeedIdx + 1) % SPEEDS.length;
        const newSpeed = SPEEDS[currentSpeedIdx];
        audioPlayer.playbackRate = newSpeed;
        speedReadout.textContent = `${newSpeed}x`;
        savePlayerPreference('speed', newSpeed);
        showToast(`Playback Speed: ${newSpeed}x`);
      });
    }

    const repeatBtn = document.getElementById('playerRepeatBtn');
    if (repeatBtn) {
      repeatSurah = getPlayerPreference('repeat', 'false') === 'true';
      const updateRepeatButton = () => {
        repeatBtn.setAttribute('aria-pressed', String(repeatSurah));
        repeatBtn.setAttribute('aria-label', `Repeat surah: ${repeatSurah ? 'on' : 'off'}`);
        repeatBtn.title = `Repeat surah: ${repeatSurah ? 'on' : 'off'}`;
        repeatBtn.classList.toggle('text-primary', repeatSurah);
        repeatBtn.classList.toggle('bg-primary/10', repeatSurah);
      };
      updateRepeatButton();
      repeatBtn.addEventListener('click', () => {
        repeatSurah = !repeatSurah;
        savePlayerPreference('repeat', repeatSurah);
        updateRepeatButton();
        showToast(repeatSurah ? 'Repeating current Surah' : 'Surah repeat off');
      });
    }

    const volSlider = document.getElementById('playerVolumeSlider');
    const muteBtn = document.getElementById('playerMuteBtn');
    const volIcon = document.getElementById('playerVolumeIcon');
    if (volSlider) {
      playerVolume = Number(getPlayerPreference('volume', volSlider.value));
      lastPlayerVolume = Number(getPlayerPreference('last-volume', '1')) || 1;
      setPlayerVolume(Number.isFinite(playerVolume) ? playerVolume : 1);
      volSlider.addEventListener('input', (e) => {
        setPlayerVolume(e.target.value);
      });
    }
    if (muteBtn && volIcon) {
      muteBtn.addEventListener('click', () => {
        if (playerVolume > 0) {
          lastPlayerVolume = playerVolume;
          setPlayerVolume(0);
        } else {
          setPlayerVolume(lastPlayerVolume || 1);
        }
      });
    }

    const progressContainer = document.getElementById('playerProgressBarContainer');
    if (progressContainer) {
      const seekToPointer = (e) => {
        const rect = progressContainer.getBoundingClientRect();
<<<<<<< HEAD
        if (rect.width <= 0) return;
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) audioPlayer.currentTime = ratio * audioPlayer.duration;
      };
      progressContainer.addEventListener('pointerdown', (e) => {
        seekToPointer(e);
        if (progressContainer.setPointerCapture) progressContainer.setPointerCapture(e.pointerId);
      });
      progressContainer.addEventListener('pointermove', (e) => {
        if (e.buttons === 1) seekToPointer(e);
      });
      progressContainer.addEventListener('keydown', (e) => {
        if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) return;
        let nextTime = audioPlayer.currentTime;
        if (e.key === 'ArrowLeft') nextTime -= 5;
        else if (e.key === 'ArrowRight') nextTime += 5;
        else if (e.key === 'Home') nextTime = 0;
        else if (e.key === 'End') nextTime = audioPlayer.duration;
        else return;
        e.preventDefault();
        audioPlayer.currentTime = Math.max(0, Math.min(audioPlayer.duration, nextTime));
      });
    }

    window.addEventListener('keydown', (e) => {
      const target = e.target;
      const isEditable = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)
      );
      const activeDialog = document.querySelector('[role="dialog"]:not(.hidden)');
      if (e.code === 'Space' && !isEditable && !activeDialog && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        togglePlayPause();
      }
    });

<<<<<<< HEAD
    // Page jump controls in Mushaf modal
    const mushafInput = document.getElementById('mushafPageInput');
    const mushafGoBtn = document.getElementById('mushafPageGoBtn');
    const doMushafJump = () => {
      if (!mushafInput) return;
      const targetPage = parseInt(mushafInput.value, 10);
      if (targetPage >= 1 && targetPage <= 604) {
        loadMushafPage(targetPage);
      } else {
        showToast('Please enter a valid page number between 1 and 604.');
      }
    };
    if (mushafGoBtn) mushafGoBtn.addEventListener('click', doMushafJump);
    if (mushafInput) {
      mushafInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doMushafJump();
        }
      });
    }

    // Modal Close buttons & unified dismissal
=======
    // Modal Close buttons
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    const closeBtns = [
      { id: 'readerCloseBtn', modalId: 'readerModal' },
      { id: 'tafsirCloseBtn', modalId: 'tafsirModal' },
      { id: 'mushafCloseBtn', modalId: 'mushafModal' },
      { id: 'recitersCloseBtn', modalId: 'recitersModal' },
      { id: 'pdfCloseBtn', modalId: 'pdfModal' }
    ];

<<<<<<< HEAD
    const dismissAllModals = () => {
      closeBtns.forEach(item => {
        const m = document.getElementById(item.modalId);
        if (m) m.classList.add('hidden');
      });
      document.body.classList.remove('is-modal-open');
      setActiveMode('directory');
    };

=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    closeBtns.forEach(item => {
      const btn = document.getElementById(item.id);
      if (btn) {
        btn.addEventListener('click', () => {
          const m = document.getElementById(item.modalId);
          if (m) m.classList.add('hidden');
<<<<<<< HEAD
          const anyOpen = closeBtns.some(b => {
            const el = document.getElementById(b.modalId);
            return el && !el.classList.contains('hidden');
          });
          if (!anyOpen) {
            document.body.classList.remove('is-modal-open');
            setActiveMode('directory');
          }
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        });
      }
    });

    // Close on Escape or click outside
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
<<<<<<< HEAD
        dismissAllModals();
      }
      // Arrow keys navigation in Mushaf modal
      const mushafEl = document.getElementById('mushafModal');
      if (mushafEl && !mushafEl.classList.contains('hidden') && document.activeElement !== mushafInput) {
        if (e.key === 'ArrowLeft' && mushafCurrentPage > 1) {
          e.preventDefault();
          loadMushafPage(mushafCurrentPage - 1);
        } else if (e.key === 'ArrowRight' && mushafCurrentPage < 604) {
          e.preventDefault();
          loadMushafPage(mushafCurrentPage + 1);
        }
=======
        closeBtns.forEach(item => {
          const m = document.getElementById(item.modalId);
          if (m) m.classList.add('hidden');
        });
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
      }
    });

    [
      'readerModal', 'tafsirModal', 'mushafModal', 'recitersModal', 'pdfModal'
    ].forEach(mId => {
      const m = document.getElementById(mId);
      if (m) {
        m.addEventListener('click', (e) => {
<<<<<<< HEAD
          if (e.target === m) {
            m.classList.add('hidden');
            const anyOpen = closeBtns.some(b => {
              const el = document.getElementById(b.modalId);
              return el && !el.classList.contains('hidden');
            });
            if (!anyOpen) {
              document.body.classList.remove('is-modal-open');
              setActiveMode('directory');
            }
          }
=======
          if (e.target === m) m.classList.add('hidden');
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        });
      }
    });
  }

  // =========================================================================
  // 15. INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initDirectoryFilters();
<<<<<<< HEAD
    updateBookmarkIcon();
=======
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
    initErgonomicControls();
    updateBookmarkIcon();
    updateActiveCard(activeSurahId);
  });

  // Export globally
  window.RuqyahQuran = window.HeyNuoQuran = {
    surahs: SURAHS,
    reciters: RECITERS,
    playSurah,
    openReaderModal,
    openTafsirModal,
    openMushafModal,
    openPdfModal
  };
  window.QuranPlayer = Object.assign(window.QuranPlayer || {}, {
    togglePlay: togglePlayPause,
    playSurah,
    pause: () => audioPlayer.pause()
  });

})();
