export const validateName = (value: string) => {
    if (!value) return '이름을 입력하세요.'
    if (value.includes('e')) return '알파벳 e는 입력할수 없음.'
}
export const validateType = (value: string[]) => {
    if (!value.length) return '최소데이터하나를 선택하세요.'
}