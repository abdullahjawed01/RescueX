import crypto from "crypto";

export const generateHash = (data, previousHash = "") => {
  const content = JSON.stringify(data) + previousHash;
  return crypto.createHash("sha256").update(content).digest("hex");
};

export const verifyChain = (logs) => {
  for (let i = 1; i < logs.length; i++) {
    const current = logs[i];
    const previous = logs[i - 1];
    
    const recalculatedHash = generateHash(current.details, previous.hash);
    if (current.hash !== recalculatedHash) return false;
  }
  return true;
};
