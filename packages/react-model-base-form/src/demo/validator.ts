export const validateName = (value: string) => {
    if (value.includes('e')) return '알파벳 e는 입력할수 없음.'
}