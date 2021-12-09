"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.AuditorDisplayName = void 0;
function AuditorDisplayName(req) {
    if (req.user) {
        let user = req.user;
        return user.displayName.toString();
    }
    return '';
}
exports.AuditorDisplayName = AuditorDisplayName;
function AuthGuard(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auditor.js.map