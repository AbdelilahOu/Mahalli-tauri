type Lang = "fr" | "en" | "ar" | "de";

export function useNumberToWords() {
  const languages: Record<Lang, any> = {
    en: {
      units: [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ],
      teens: [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ],
      tens: [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ],
      scales: ["", "thousand", "million", "billion", "trillion"],
    },
    fr: {
      units: [
        "",
        "un",
        "deux",
        "trois",
        "quatre",
        "cinq",
        "six",
        "sept",
        "huit",
        "neuf",
      ],
      teens: [
        "dix",
        "onze",
        "douze",
        "treize",
        "quatorze",
        "quinze",
        "seize",
        "dix-sept",
        "dix-huit",
        "dix-neuf",
      ],
      tens: [
        "",
        "",
        "vingt",
        "trente",
        "quarante",
        "cinquante",
        "soixante",
        "soixante-dix",
        "quatre-vingt",
        "quatre-vingt-dix",
      ],
      scales: ["", "mille", "million", "milliard", "billion"],
    },
    ar: {
      units: [
        "",
        "واحد",
        "اثنان",
        "ثلاثة",
        "أربعة",
        "خمسة",
        "ستة",
        "سبعة",
        "ثمانية",
        "تسعة",
      ],
      teens: [
        "عشرة",
        "أحد عشر",
        "اثنا عشر",
        "ثلاثة عشر",
        "أربعة عشر",
        "خمسة عشر",
        "ستة عشر",
        "سبعة عشر",
        "ثمانية عشر",
        "تسعة عشر",
      ],
      tens: [
        "",
        "",
        "عشرون",
        "ثلاثون",
        "أربعون",
        "خمسون",
        "ستون",
        "سبعون",
        "ثمانون",
        "تسعون",
      ],
      scales: ["", "ألف", "مليون", "مليار", "تريليون"],
    },
    de: {
      units: [
        "",
        "ein",
        "zwei",
        "drei",
        "vier",
        "fünf",
        "sechs",
        "sieben",
        "acht",
        "neun",
      ],
      teens: [
        "zehn",
        "elf",
        "zwölf",
        "dreizehn",
        "vierzehn",
        "fünfzehn",
        "sechzehn",
        "siebzehn",
        "achtzehn",
        "neunzehn",
      ],
      tens: [
        "",
        "",
        "zwanzig",
        "dreißig",
        "vierzig",
        "fünfzig",
        "sechzig",
        "siebzig",
        "achtzig",
        "neunzig",
      ],
      scales: ["", "tausend", "Million", "Milliarde", "Billion"],
    },
  };

  function convertThreeDigits(n: number, lang: Lang) {
    let words = [];
    let hundreds = Math.floor(n / 100);
    let remainder = n % 100;

    if (hundreds > 0) {
      if (lang === "de") {
        words.push(languages[lang].units[hundreds] + "hundert");
      } else {
        words.push(languages[lang].units[hundreds]);
        words.push(lang === "en" ? "hundred" : lang === "fr" ? "cent" : "مائة");
      }
    }

    if (remainder > 0) {
      if (remainder < 10) {
        words.push(languages[lang].units[remainder]);
      } else if (remainder < 20) {
        words.push(languages[lang].teens[remainder - 10]);
      } else {
        let tens = Math.floor(remainder / 10);
        let ones = remainder % 10;
        if (lang === "de") {
          if (ones > 0) {
            words.push(
              languages[lang].units[ones] + "und" + languages[lang].tens[tens]
            );
          } else {
            words.push(languages[lang].tens[tens]);
          }
        } else {
          words.push(languages[lang].tens[tens]);
          if (ones > 0) {
            words.push(languages[lang].units[ones]);
          }
        }
      }
    }

    return words.join(lang === "de" ? "" : " ");
  }

  function numberToWords(num: number, lang: Lang = "en") {
    if (num === 0)
      return lang === "en"
        ? "zero"
        : lang === "fr"
        ? "zéro"
        : lang === "ar"
        ? "صفر"
        : "null";

    let words = [];
    let scale = 0;

    while (num > 0) {
      let threeDigits = num % 1000;
      if (threeDigits > 0) {
        let chunk = convertThreeDigits(threeDigits, lang);
        if (scale > 0) {
          chunk +=
            (lang === "de" && scale === 1 ? "" : " ") +
            languages[lang].scales[scale];
        }
        words.unshift(chunk);
      }
      num = Math.floor(num / 1000);
      scale++;
    }

    return words.join(lang === "de" ? "" : " ");
  }

  return {
    numberToWords,
  };
}
