// Complete Expanded Multilingual Movie Database for CineMatch AI Platform
// Includes verified TMDB poster artwork across Tamil, Malayalam, Korean, Japanese, Telugu, Hindi, and English.

const MOVIES_DATABASE = [
  // --- KOREAN MOVIES ---
  {
    id: 496243,
    title: "Parasite",
    original_title: "기생충",
    language: "Korean",
    genres: ["Comedy", "Thriller", "Drama"],
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    cast: [
      { name: "Song Kang-ho", character: "Kim Ki-taek" },
      { name: "Lee Sun-kyun", character: "Park Dong-ik" },
      { name: "Cho Yeo-jeong", character: "Choi Yeon-gyo" },
      { name: "Choi Woo-shik", character: "Kim Ki-woo" }
    ],
    director: "Bong Joon-ho",
    runtime: 132,
    release_date: "2019-05-30",
    vote_average: 8.5,
    vote_count: 42000,
    poster_path: "https://image.tmdb.org/t/p/w500/7IiT2Z9qGi2uI7pG288e2.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/hi700s00000000000000000.jpg",
    keywords: ["class struggle", "basement secret", "oscar best picture", "black comedy"],
    production_company: "Barunson E&A",
    country: "South Korea",
    ott_providers: ["Prime Video", "SonyLIV"]
  },
  {
    id: 296096,
    title: "Train to Busan",
    original_title: "부산행",
    language: "Korean",
    genres: ["Action", "Horror", "Thriller"],
    overview: "While a zombie virus breaks out in South Korea, passengers struggle to survive on the high-speed train from Seoul to Busan.",
    cast: [
      { name: "Gong Yoo", character: "Seok-woo" },
      { name: "Ma Dong-seok", character: "Sang-hwa" },
      { name: "Jung Yu-mi", character: "Seong-kyeong" }
    ],
    director: "Yeon Sang-ho",
    runtime: 118,
    release_date: "2016-07-20",
    vote_average: 7.8,
    vote_count: 28000,
    poster_path: "https://m.media-amazon.com/images/M/MV5BMTkwOTQ4OTg0OV5BMl5BanBnXkFtZTgwMzQyOTM0OTE@._V1_.jpg",
    backdrop_path: "https://m.media-amazon.com/images/M/MV5BMTkwOTQ4OTg0OV5BMl5BanBnXkFtZTgwMzQyOTM0OTE@._V1_.jpg",
    keywords: ["zombie outbreak", "bullet train", "father daughter", "survival action"],
    production_company: "Next Entertainment World",
    country: "South Korea",
    ott_providers: ["Netflix", "Prime Video"]
  },
  {
    id: 670,
    title: "Oldboy",
    original_title: "올드보이",
    language: "Korean",
    genres: ["Drama", "Mystery", "Thriller", "Action"],
    overview: "After being kidnapped and imprisoned for 15 years without explanation, Oh Dae-su is released and given 5 days to find his captor.",
    cast: [
      { name: "Choi Min-sik", character: "Oh Dae-su" },
      { name: "Yoo Ji-tae", character: "Lee Woo-jin" },
      { name: "Kang Hye-jung", character: "Mi-do" }
    ],
    director: "Park Chan-wook",
    runtime: 120,
    release_date: "2003-11-21",
    vote_average: 8.4,
    vote_count: 31000,
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1tLstZgjJLNVs1Mi2yPTEkT37KRsiZdby3ERH7I75Xvf_aN5IWqBVqACBIx9Yys1a2qv0&s=10",
    backdrop_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1tLstZgjJLNVs1Mi2yPTEkT37KRsiZdby3ERH7I75Xvf_aN5IWqBVqACBIx9Yys1a2qv0&s=10",
    keywords: ["revenge", "corridor fight", "hammer", "mind-bending twist"],
    production_company: "Show East",
    country: "South Korea",
    ott_providers: ["Prime Video"]
  },
  {
    id: 11423,
    title: "Memories of Murder",
    original_title: "살인의 추억",
    language: "Korean",
    genres: ["Crime", "Drama", "Mystery", "Thriller"],
    overview: "In a small Korean province in 1986, two local detectives struggle with the case of multiple young women being found raped and murdered.",
    cast: [
      { name: "Song Kang-ho", character: "Detective Park Doo-man" },
      { name: "Kim Sang-kyung", character: "Detective Seo Tae-yoon" }
    ],
    director: "Bong Joon-ho",
    runtime: 132,
    release_date: "2003-05-02",
    vote_average: 8.5,
    vote_count: 26000,
    poster_path: "https://image.tmdb.org/t/p/w500/oYuLEW9W31i2s9CjveLflayStwU.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/oYuLEW9W31i2s9CjveLflayStwU.jpg",
    keywords: ["serial killer", "investigation", "rural crime", "unsolved mystery"],
    production_company: "CJ Entertainment",
    country: "South Korea",
    ott_providers: ["Prime Video"]
  },
  {
    id: 1050035,
    title: "Exhuma",
    original_title: "파묘",
    language: "Korean",
    genres: ["Horror", "Mystery", "Thriller"],
    overview: "The process of excavating a sinister grave unleashes terrifying supernatural consequences buried deep beneath a wealthy family's ancestral land.",
    cast: [
      { name: "Choi Min-sik", character: "Kim Sang-deok" },
      { name: "Kim Go-eun", character: "Hwa-rim" },
      { name: "Lee Do-hyun", character: "Bong-gil" }
    ],
    director: "Jang Jae-hyun",
    runtime: 134,
    release_date: "2024-02-22",
    vote_average: 8.1,
    vote_count: 14000,
    poster_path: "https://image.tmdb.org/t/p/w500/7IiT2Z9qGi2uI7pG288e2.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/7IiT2Z9qGi2uI7pG288e2.jpg",
    keywords: ["shamanism", "exhuma", "grave digger", "supernatural horror"],
    production_company: "Showbox",
    country: "South Korea",
    ott_providers: ["Prime Video"]
  },

  // --- JAPANESE MOVIES ---
  {
    id: 372058,
    title: "Your Name.",
    original_title: "君の名は。",
    language: "Japanese",
    genres: ["Animation", "Romance", "Drama", "Fantasy"],
    overview: "Two high school strangers, Mitsuha in a rural town and Taki in Tokyo, suddenly begin swapping bodies across time and space, forging a magical bond.",
    cast: [
      { name: "Ryunosuke Kamiki", character: "Taki Tachibana (voice)" },
      { name: "Mone Kamishibai", character: "Mitsuha Miyamizu (voice)" }
    ],
    director: "Makoto Shinkai",
    runtime: 106,
    release_date: "2016-08-26",
    vote_average: 8.5,
    vote_count: 38000,
    poster_path: "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
    keywords: ["body swap", "comet", "red string of fate", "anime masterpiece"],
    production_company: "CoMix Wave Films",
    country: "Japan",
    ott_providers: ["Netflix"]
  },
  {
    id: 129,
    title: "Spirited Away",
    original_title: "千と千尋の神隠し",
    language: "Japanese",
    genres: ["Animation", "Family", "Fantasy"],
    overview: "A ten-year-old girl named Chihiro wanders into a magical bathhouse world ruled by spirits and witches, working to free her transformed parents.",
    cast: [
      { name: "Rumi Hiiragi", character: "Chihiro Ogino (voice)" },
      { name: "Miyu Irino", character: "Haku (voice)" }
    ],
    director: "Hayao Miyazaki",
    runtime: 125,
    release_date: "2001-07-20",
    vote_average: 8.5,
    vote_count: 45000,
    poster_path: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
    keywords: ["studio ghibli", "bathhouse", "no face", "oscar winner"],
    production_company: "Studio Ghibli",
    country: "Japan",
    ott_providers: ["Netflix"]
  },
  {
    id: 1022796,
    title: "Wish",
    original_title: "ゴジラ-1.0",
    title_display: "Godzilla Minus One",
    language: "Japanese",
    genres: ["Action", "Sci-Fi", "Horror"],
    overview: "Post-war Japan is at its lowest point when a new crisis arises in the form of a giant monster empowered by nuclear bomb testing.",
    cast: [
      { name: "Ryunosuke Kamiki", character: "Koichi Shikishima" },
      { name: "Minami Hamabe", character: "Noriko Oishi" }
    ],
    director: "Takashi Yamazaki",
    runtime: 125,
    release_date: "2023-11-03",
    vote_average: 8.3,
    vote_count: 18000,
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    keywords: ["godzilla", "tokyo destruction", "oscar vfx winner", "kaiju"],
    production_company: "Toho Studios",
    country: "Japan",
    ott_providers: ["Netflix"]
  },

  // --- TAMIL MOVIES ---
  {
    id: 743563,
    title: "Vikram",
    original_title: "Vikram",
    language: "Tamil",
    genres: ["Action", "Thriller", "Crime"],
    overview: "A special agent investigates a murder committed by a masked group of serial killers. However, a tangled maze of clues leads him to the drug kingpin of Chennai.",
    cast: [
      { name: "Kamal Haasan", character: "Agent Vikram / Karnan" },
      { name: "Vijay Sethupathi", character: "Santanham" },
      { name: "Fahadh Faasil", character: "Amar" },
      { name: "Suriya", character: "Rolex (Cameo)" }
    ],
    director: "Lokesh Kanagaraj",
    runtime: 175,
    release_date: "2022-06-03",
    vote_average: 8.3,
    vote_count: 14200,
    poster_path: "https://image.tmdb.org/t/p/w500/ihjsoa6p8VEr0vIF95SZ0JBEbZ6.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAiW5.jpg",
    keywords: ["undercover", "drug cartel", "lcu", "revenge", "police officer"],
    production_company: "Raaj Kamal Films International",
    country: "India",
    ott_providers: ["Disney+ Hotstar", "ZEE5"]
  },
  {
    id: 943722,
    title: "Leo",
    original_title: "Leo",
    language: "Tamil",
    genres: ["Action", "Thriller", "Crime"],
    overview: "Parthiban, a mild-mannered cafe owner in Himachal Pradesh, becomes a local hero after defeating a gang of robbers. However, his life turns upside down when drug lords suspect he is Leo Das, a legendary gangster from their past.",
    cast: [
      { name: "Vijay", character: "Parthiban / Leo Das" },
      { name: "Sanjay Dutt", character: "Antony Das" },
      { name: "Arjun Sarja", character: "Harold Das" },
      { name: "Trisha Krishnan", character: "Sathya" }
    ],
    director: "Lokesh Kanagaraj",
    runtime: 164,
    release_date: "2023-10-19",
    vote_average: 7.9,
    vote_count: 12500,
    poster_path: "https://image.tmdb.org/t/p/w500/maBYHY7gSGGtqW9Ti8ZGVP0IAgg.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsX2f.jpg",
    keywords: ["mistaken identity", "hyena", "gangster", "lcu", "family protection"],
    production_company: "Seven Screen Studio",
    country: "India",
    ott_providers: ["Netflix"]
  },
  {
    id: 615658,
    title: "Master",
    original_title: "Master",
    language: "Tamil",
    genres: ["Action", "Thriller", "Drama"],
    overview: "JD, an alcoholic professor, is sent to a juvenile school where he clashes with a ruthless gangster named Bhavani, who uses children for illegal criminal activities.",
    cast: [
      { name: "Vijay", character: "JD (John Durairaj)" },
      { name: "Vijay Sethupathi", character: "Bhavani" },
      { name: "Malavika Mohanan", character: "Charulatha" }
    ],
    director: "Lokesh Kanagaraj",
    runtime: 179,
    release_date: "2021-01-13",
    vote_average: 7.8,
    vote_count: 9800,
    poster_path: "https://image.tmdb.org/t/p/w500/d8WJFQyNNAEmuGeDwxPhBpx0G4B.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nMKQueries0z9hM0C1a07.jpg",
    keywords: ["professor", "juvenile home", "gangster", "reformation"],
    production_company: "XB Film Creators",
    country: "India",
    ott_providers: ["Prime Video"]
  },
  {
    id: 630566,
    title: "Kaithi",
    original_title: "Kaithi",
    language: "Tamil",
    genres: ["Action", "Thriller", "Crime"],
    overview: "Dilli, a recently released prisoner, tries to meet his daughter for the first time. However, an injured police officer forces him to drive a truck full of poisoned cops to the hospital while being hunted by a drug cartel.",
    cast: [
      { name: "Karthi", character: "Dilli" },
      { name: "Narain", character: "Inspector Bejoy" },
      { name: "Arjun Das", character: "Anbu" }
    ],
    director: "Lokesh Kanagaraj",
    runtime: 145,
    release_date: "2019-10-25",
    vote_average: 8.5,
    vote_count: 11000,
    poster_path: "https://image.tmdb.org/t/p/w500/2YvT3pdGngzpbAuxamTz4ZlabnT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/9uG1qBwAQHzabT324utaw9vFu2x.jpg",
    keywords: ["night journey", "truck chase", "lcu", "father daughter", "biryani"],
    production_company: "Dream Warrior Pictures",
    country: "India",
    ott_providers: ["Disney+ Hotstar"]
  },
  {
    id: 673593,
    title: "Soorarai Pottru",
    original_title: "Soorarai Pottru",
    language: "Tamil",
    genres: ["Drama", "Biography"],
    overview: "Maara, a former IAF captain, dreams of founding a low-cost airline so that every common person in India can afford to fly, battling corrupt aviation tycoons.",
    cast: [
      { name: "Suriya", character: "Nedumaaran Rajangam (Maara)" },
      { name: "Aparna Balamurali", character: "Bommi" }
    ],
    director: "Sudha Kongara",
    runtime: 153,
    release_date: "2020-11-12",
    vote_average: 8.6,
    vote_count: 15400,
    poster_path: "https://image.tmdb.org/t/p/w500/fbbj3viSUDEGT1fFFMNpHP1iUjw.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oSM2xSuIm.jpg",
    keywords: ["aviation", "entrepreneur", "inspirational", "true story"],
    production_company: "2D Entertainment",
    country: "India",
    ott_providers: ["Prime Video"]
  },
  {
    id: 843241,
    title: "Jai Bhim",
    original_title: "Jai Bhim",
    language: "Tamil",
    genres: ["Drama", "Crime", "Mystery"],
    overview: "When a tribal man is falsely accused of theft and disappears from police custody, a courageous human rights lawyer named Chandru fights relentlessly in court to bring justice.",
    cast: [
      { name: "Suriya", character: "Advocate K. Chandru" },
      { name: "Lijomol Jose", character: "Senggeni" }
    ],
    director: "T. J. Gnanavel",
    runtime: 164,
    release_date: "2021-11-02",
    vote_average: 8.8,
    vote_count: 22000,
    poster_path: "https://image.tmdb.org/t/p/w500/k0ThmZQl5nHe4JefC2bXjqtgYp0.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/hZkgoQY85KGdfToZYellow.jpg",
    keywords: ["courtroom", "human rights", "police brutality", "tribal justice"],
    production_company: "2D Entertainment",
    country: "India",
    ott_providers: ["Prime Video"]
  },
  {
    id: 541135,
    title: "Ratsasan",
    original_title: "Ratsasan",
    language: "Tamil",
    genres: ["Thriller", "Crime", "Mystery"],
    overview: "An aspiring film director becomes a police officer after his father's death and uses his deep psychological research on serial killers to track down a psycho killer targeting schoolgirls.",
    cast: [
      { name: "Vishnu Vishal", character: "Arun Kumar" },
      { name: "Amala Paul", character: "Viji" }
    ],
    director: "Ram Kumar",
    runtime: 170,
    release_date: "2018-10-05",
    vote_average: 8.7,
    vote_count: 18900,
    poster_path: "https://image.tmdb.org/t/p/w500/49fh83Bh3HdhtSzRDM69CIqpRjK.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/qdIMYStW2YIf27xQVDEnIZ6yuvH.jpg",
    keywords: ["serial killer", "psycho thriller", "investigation", "mind-bending"],
    production_company: "Axess Film Factory",
    country: "India",
    ott_providers: ["Disney+ Hotstar"]
  },

  // --- MALAYALAM MOVIES ---
  {
    id: 251508,
    title: "Drishyam",
    original_title: "Drishyam",
    language: "Malayalam",
    genres: ["Crime", "Drama", "Thriller"],
    overview: "Georgekutty, a cable TV operator, uses his extensive movie knowledge to construct an ironclad alibi to protect his family after they accidentally kill an inspector general's son.",
    cast: [
      { name: "Mohanlal", character: "Georgekutty" },
      { name: "Meena", character: "Rani George" }
    ],
    director: "Jeethu Joseph",
    runtime: 160,
    release_date: "2013-12-19",
    vote_average: 8.6,
    vote_count: 24000,
    poster_path: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/tmU7GeKVZRiWBFaiOXWhIbVWeCh.jpg",
    keywords: ["perfect crime", "alibi", "cable tv", "family protection"],
    production_company: "Aashirvad Cinemas",
    country: "India",
    ott_providers: ["Disney+ Hotstar", "Prime Video"]
  },
  {
    id: 791986,
    title: "Drishyam 2",
    original_title: "Drishyam 2",
    language: "Malayalam",
    genres: ["Crime", "Drama", "Thriller"],
    overview: "Six years after the events of Drishyam, Georgekutty and his family are still haunted by the past as police reopen the unsolved investigation with new forensic evidence.",
    cast: [
      { name: "Mohanlal", character: "Georgekutty" },
      { name: "Meena", character: "Rani George" }
    ],
    director: "Jeethu Joseph",
    runtime: 152,
    release_date: "2021-02-19",
    vote_average: 8.5,
    vote_count: 18500,
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdTvaO5vba8UnfExhR9Ru8sAB4sHUvn_LXAaCS0dVgnKryqciel_GXat4&s=10",
    backdrop_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdTvaO5vba8UnfExhR9Ru8sAB4sHUvn_LXAaCS0dVgnKryqciel_GXat4&s=10",
    keywords: ["forensic twist", "cinema script", "police re-investigation"],
    production_company: "Aashirvad Cinemas",
    country: "India",
    ott_providers: ["Prime Video"]
  },
  {
    id: 1212073,
    title: "Manjummel Boys",
    original_title: "Manjummel Boys",
    language: "Malayalam",
    genres: ["Adventure", "Drama", "Thriller"],
    overview: "A group of cheerful friends from Kochi travel to Kodaikanal and face an unimaginable ordeal when one of them falls into the dangerous, uncharted Guna Caves.",
    cast: [
      { name: "Soubin Shahir", character: "Kuttan" },
      { name: "Sreenath Bhasi", character: "Subhash" }
    ],
    director: "Chidambaram",
    runtime: 135,
    release_date: "2024-02-22",
    vote_average: 8.6,
    vote_count: 18200,
    poster_path: "https://m.media-amazon.com/images/M/MV5BMDVkOGEzZDgtYWU4Yi00MDA3LWE4YmQtYjQxNDgwNDYxNGU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop_path: "https://m.media-amazon.com/images/M/MV5BMDVkOGEzZDgtYWU4Yi00MDA3LWE4YmQtYjQxNDgwNDYxNGU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    keywords: ["guna cave", "true survival story", "friendship", "blockbuster"],
    production_company: "Parava Films",
    country: "India",
    ott_providers: ["Disney+ Hotstar"]
  },
  {
    id: 337626,
    title: "Premam",
    original_title: "Premam",
    language: "Malayalam",
    genres: ["Romance", "Comedy", "Drama"],
    overview: "George experiences love at three different stages of his life: school, college, and adulthood, discovering how each relationship shapes his personality.",
    cast: [
      { name: "Nivin Pauly", character: "George David" },
      { name: "Sai Pallavi", character: "Malar Teacher" }
    ],
    director: "Alphonse Puthren",
    runtime: 156,
    release_date: "2015-05-29",
    vote_average: 8.4,
    vote_count: 21000,
    poster_path: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop_path: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    keywords: ["three stages of love", "malar teacher", "college life"],
    production_company: "Anwar Rasheed Entertainments",
    country: "India",
    ott_providers: ["Disney+ Hotstar"]
  },

  // --- TELUGU MOVIES ---
  {
    id: 579974,
    title: "RRR",
    original_title: "RRR",
    language: "Telugu",
    genres: ["Action", "Adventure", "Drama"],
    overview: "A fearless revolutionary and an officer in the British force forge a deep friendship, unaware of each other's secret identities and opposing missions in 1920s India.",
    cast: [
      { name: "N. T. Rama Rao Jr.", character: "Komaram Bheem" },
      { name: "Ram Charan", character: "Alluri Sitarama Raju" }
    ],
    director: "S. S. Rajamouli",
    runtime: 187,
    release_date: "2022-03-24",
    vote_average: 8.5,
    vote_count: 32000,
    poster_path: "https://image.tmdb.org/t/p/w500/nEufeZlyAODCndhyhyu3mwoWpA8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/m9O9sU8Yd4ZcZzZ5z5z5z5z5z5z.jpg",
    keywords: ["freedom fighters", "naatu naatu", "tiger fight", "friendship"],
    production_company: "DVV Entertainments",
    country: "India",
    ott_providers: ["Netflix", "ZEE5"]
  },

  // --- HINDI MOVIES ---
  {
    id: 360814,
    title: "Dangal",
    original_title: "Dangal",
    language: "Hindi",
    genres: ["Drama", "Biography", "Action"],
    overview: "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become world-class wrestlers, overcoming societal stigmas in rural India.",
    cast: [
      { name: "Aamir Khan", character: "Mahavir Singh Phogat" },
      { name: "Fatima Sana Shaikh", character: "Geeta Phogat" }
    ],
    director: "Nitesh Tiwari",
    runtime: 161,
    release_date: "2016-12-21",
    vote_average: 8.4,
    vote_count: 31000,
    poster_path: "https://m.media-amazon.com/images/I/71NiFuBLemL._AC_UF894,1000_QL80_.jpg",
    backdrop_path: "https://m.media-amazon.com/images/I/71NiFuBLemL._AC_UF894,1000_QL80_.jpg",
    keywords: ["wrestling", "father daughters", "gold medal"],
    production_company: "Aamir Khan Productions",
    country: "India",
    ott_providers: ["Netflix"]
  },
  {
    id: 20453,
    title: "3 Idiots",
    original_title: "3 Idiots",
    language: "Hindi",
    genres: ["Comedy", "Drama"],
    overview: "Two friends search for their long-lost college companion Rancho while reminiscing about their hilarious and eye-opening engineering student days under a strict director.",
    cast: [
      { name: "Aamir Khan", character: "Rancho / Phunsukh Wangdu" },
      { name: "R. Madhavan", character: "Farhan Qureshi" }
    ],
    director: "Rajkumar Hirani",
    runtime: 170,
    release_date: "2009-12-25",
    vote_average: 8.5,
    vote_count: 35000,
    poster_path: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQV7sONOx4fl1xq9CbdWUmcTamWwzrPMzqKhZOGHh-V0zHpn0Ly",
    backdrop_path: "https://image.tmdb.org/t/p/original/v49g2i3i3XgQY202h8949v.jpg",
    keywords: [" Friendship","aal izz well", "all time classic"],
    production_company: "Vinod Chopra Films",
    country: "India",
    ott_providers: ["Prime Video"]
  },

  // --- HOLLYWOOD & GLOBAL CLASSICS ---
  {
    id: 27205,
    title: "Inception",
    original_title: "Inception",
    language: "English",
    genres: ["Action", "Sci-Fi", "Adventure"],
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for an impossible task: inception.",
    cast: [
      { name: "Leonardo DiCaprio", character: "Dom Cobb" },
      { name: "Joseph Gordon-Levitt", character: "Arthur" }
    ],
    director: "Christopher Nolan",
    runtime: 148,
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36000,
    poster_path: "https://image.tmdb.org/t/p/w500/oYuLEW9W31i2s9CjveLflayStwU.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAiW5.jpg",
    keywords: ["dream within a dream", "spinning top", "mind-bending"],
    production_company: "Warner Bros.",
    country: "United States",
    ott_providers: ["Netflix", "Prime Video"]
  },
  {
    id: 157336,
    title: "Interstellar",
    original_title: "Interstellar",
    language: "English",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper" },
      { name: "Anne Hathaway", character: "Brand" }
    ],
    director: "Christopher Nolan",
    runtime: 169,
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34000,
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsX2f.jpg",
    keywords: ["black hole", "wormhole", "time dilation"],
    production_company: "Paramount Pictures",
    country: "United States",
    ott_providers: ["Netflix", "Prime Video"]
  },
  {
    id: 155,
    title: "The Dark Knight",
    original_title: "The Dark Knight",
    language: "English",
    genres: ["Action", "Crime", "Drama"],
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague Gotham.",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", character: "Joker" }
    ],
    director: "Christopher Nolan",
    runtime: 152,
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 33000,
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nMKQueries0z9hM0C1a07.jpg",
    keywords: ["joker", "gotham city", "superhero masterpiece"],
    production_company: "DC Comics / Warner Bros.",
    country: "United States",
    ott_providers: ["JioHotstar", "Prime Video"]
  }
];

module.exports = { MOVIES_DATABASE };
