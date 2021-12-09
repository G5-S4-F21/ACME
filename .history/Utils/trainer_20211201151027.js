"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.TrainerDisplayName = void 0;
function TrainerDisplayName(req) {
    if (req.user) {
        let user = req.user;
        return user.displayName.toString();
    }
    return '';
}
exports.TrainerDisplayName = TrainerDisplayName;
function AuthGuard(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=trainer.js.map