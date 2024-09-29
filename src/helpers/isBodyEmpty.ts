export default function isBodyEmpty(body: Record<string, any>) {
  const keys = Object.keys(body);
  return keys.length == 0 ? true : false;
}
