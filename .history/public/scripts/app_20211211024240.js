"use strict";
(function () {
    function confirmDelete() {
        $("a.delete").on("click", function (event) {
            if (!confirm("Are you sure you want to delete your account?")) {
                event.preventDefault();
                location.href = 'trainer/updateOrDeleteAccount/';
            }
        });
    }
    function Start() {
        console.log("App Started");
        confirmDelete();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map