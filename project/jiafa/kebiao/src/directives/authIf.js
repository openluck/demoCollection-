import { check } from '../Utils/auth'

export function permit(e) {
    return check(e)
}
export default { permit };