export async function getTimeAfterFiveMinutes(date: string) {
  const initialTime = new Date(date);
  const timeAfterFiveMinutes = new Date(initialTime.getTime() + 5 * 60 * 1000);

  return timeAfterFiveMinutes;
}

export function generateSecretCode(input: string): string {
  const digitToCode: Record<string, string> = {
    "0": process.env.SECRET_NUM_0 || "000",
    "1": process.env.SECRET_NUM_1 || "111",
    "2": process.env.SECRET_NUM_2 || "222",
    "3": process.env.SECRET_NUM_3 || "333",
    "4": process.env.SECRET_NUM_4 || "444",
    "5": process.env.SECRET_NUM_5 || "555",
    "6": process.env.SECRET_NUM_6 || "666",
    "7": process.env.SECRET_NUM_7 || "777",
    "8": process.env.SECRET_NUM_8 || "888",
    "9": process.env.SECRET_NUM_9 || "999",
  };

  return input
    .toString()
    .split("")
    .map((digit) => digitToCode[digit] || digit)
    .join("");
}

export function decodeSecretCode(secretCode: string): string {
  const codeToDigit: Record<string, string> = {
    [process.env.SECRET_NUM_0 || "000"]: "0",
    [process.env.SECRET_NUM_1 || "111"]: "1",
    [process.env.SECRET_NUM_2 || "222"]: "2",
    [process.env.SECRET_NUM_3 || "333"]: "3",
    [process.env.SECRET_NUM_4 || "444"]: "4",
    [process.env.SECRET_NUM_5 || "555"]: "5",
    [process.env.SECRET_NUM_6 || "666"]: "6",
    [process.env.SECRET_NUM_7 || "777"]: "7",
    [process.env.SECRET_NUM_8 || "888"]: "8",
    [process.env.SECRET_NUM_9 || "999"]: "9",
  };

  let decodedString = "";
  let tempCode = "";

  // Loop through each character in the secret code
  for (let i = 0; i < secretCode.length; i++) {
    tempCode += secretCode[i];

    // Check if the tempCode matches any secret code
    if (codeToDigit[tempCode]) {
      decodedString += codeToDigit[tempCode]; // Add the corresponding digit
      tempCode = ""; // Reset tempCode after matching
    }
  }

  return decodedString;
}

