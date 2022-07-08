import bcrypt from "bcrypt";

export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async validatePassrowd(password: string, hash: string) {
        const isValide =  await bcrypt.compare(password, hash)
        return isValide
    }
}