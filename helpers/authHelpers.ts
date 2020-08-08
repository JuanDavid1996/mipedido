export function verifyCurrentUser(context: any) {
    if (!context.currentUser) throw new Error("Please login");
}