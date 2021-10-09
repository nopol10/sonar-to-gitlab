import crypto from "crypto";

export function isValidSignature(signature: string, content: string) {
  const generated = crypto
    .createHmac("sha256", process.env.SONARQUBE_SECRET)
    .update(content)
    .digest("hex");
  return generated === signature;
}
