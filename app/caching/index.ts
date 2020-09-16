import { getUserByToken } from "../../graphql/resolvers/auth";
import { checkPermission } from "../../helpers/authHelpers";
import { PERMISSIONS } from "../../constants";
import { clearCacheDb } from "../../DataSource/cache";

export async function clearAllCache(req: any, res: any) {
    const authorization = (req.headers as any)?.authorization;
    let currentUser: any = await getUserByToken(authorization);
    if (!currentUser) {
        return res.send({
            success: false,
            error: "Pleas login"
        })
    }
    try {
        await checkPermission(PERMISSIONS.CLEAR_CACHE, { currentUser });
        clearCacheDb((err: any) => {
            return res.send({
                success: err !== undefined,
                error: err
            })
        })
    } catch (e) {
        return res.send({
            success: false,
            error: e
        })
    }
}