// ルームに入る時に入力するユーザー名のバリデーション
export function isCorrectUserName(text: string): boolean {
  const regexPattern = /^(?![*]$)[.A-Za-z0-9%*_-]+$/;
  return regexPattern.test(text);
}
