module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/vercel/smile-schedule-dash/src/integrations/mongodb/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Real MongoDB utilities calling the backend API
__turbopack_context__.s([
    "ObjectId",
    ()=>ObjectId,
    "deleteOne",
    ()=>deleteOne,
    "findMany",
    ()=>findMany,
    "findOne",
    ()=>findOne,
    "insertOne",
    ()=>insertOne,
    "objectIdToString",
    ()=>objectIdToString,
    "stringToObjectId",
    ()=>stringToObjectId,
    "updateOne",
    ()=>updateOne
]);
class ObjectId {
    id;
    constructor(id){
        this.id = id || ""; // Backend will handle ID generation if empty
    }
    toString() {
        return this.id;
    }
}
const API_BASE = "/api";
async function insertOne(collectionName, document) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'insertOne',
                document
            })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error inserting into ${collectionName}:`, error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Insert failed'
        };
    }
}
async function findOne(collectionName, filter) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'findOne',
                filter
            })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error finding in ${collectionName}:`, error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Find failed'
        };
    }
}
async function findMany(collectionName, filter = {}, options = {}) {
    try {
        const query = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(options.sort || {}),
            limit: (options.limit || 0).toString()
        });
        const response = await fetch(`${API_BASE}/${collectionName}?${query}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error finding many in ${collectionName}:`, error);
        return {
            data: [],
            error: error instanceof Error ? error.message : 'Find failed'
        };
    }
}
async function updateOne(collectionName, filter, update) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter,
                update
            })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error updating in ${collectionName}:`, error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Update failed'
        };
    }
}
async function deleteOne(collectionName, filter) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter
            })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error deleting from ${collectionName}:`, error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Delete failed'
        };
    }
}
function objectIdToString(obj) {
    if (!obj) return obj;
    if (obj._id) return {
        ...obj,
        id: obj._id.toString()
    };
    return obj;
}
function stringToObjectId(id) {
    // Pass filter as an object with _id, backend will convert it for Mongoose
    return {
        _id: id
    };
}
}),
"[project]/Desktop/vercel/smile-schedule-dash/src/lib/whatsapp.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendWhatsAppNotification",
    ()=>sendWhatsAppNotification
]);
// WhatsApp notification service
const CLINIC_PHONE = "8302115319";
async function sendWhatsAppNotification(phone, status, details) {
    try {
        // 1. Log to our API (database tracking)
        try {
            await fetch('/api/whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone,
                    status,
                    details,
                    clinicPhone: CLINIC_PHONE
                })
            });
        } catch (e) {
            console.error("Failed to log notification to API", e);
        }
        // 2. Open WhatsApp Web (Browser-based approach as requested for immediate use)
        const cleanPhone = phone.replace(/\D/g, '');
        const message = status === 'confirmed' ? `✅ *Appointment Confirmed* ✅\n\nHello ${details.patientName}!\n\nYour dental appointment has been successfully confirmed.\n\n📋 *Appointment Details:*\n👨‍⚕️ Dentist: ${details.dentist}\n📅 Date: ${details.date}\n🕐 Time: ${details.time}\n🦷 Service: ${details.service}\n\nWe look forward to seeing you! If you need to reschedule, please contact us.\n\n*Tooth World Clinic*\n📞 ${CLINIC_PHONE}` : `❌ *Appointment Cancelled* ❌\n\nHello ${details.patientName},\n\nWe regret to inform you that your appointment request has been cancelled.\n\n📋 *Cancelled Appointment:*\n👨‍⚕️ Dentist: ${details.dentist}\n📅 Date: ${details.date}\n🕐 Time: ${details.time}\n🦷 Service: ${details.service}\n\nIf you'd like to book another appointment, please visit our website or contact us.\n\n*Tooth World Clinic*\n📞 ${CLINIC_PHONE}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        return false;
    }
}
}),
"[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-ssr] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$images$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Images$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/images.js [app-ssr] (ecmascript) <export default as Images>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/video.js [app-ssr] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/src/integrations/mongodb/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/src/lib/whatsapp.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const ALL_SLOTS = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM"
];
const DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri"
];
// --- Stat Card ---
function StatCard({ icon, label, value, sub, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card-dental p-5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 48,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-bold",
                            style: {
                                fontFamily: "'DM Serif Display', serif"
                            },
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 49,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground mt-1",
                            children: sub
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 50,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                    lineNumber: 47,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-12 h-12 rounded-xl flex items-center justify-center",
                    style: {
                        background: color
                    },
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                    lineNumber: 52,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 46,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 45,
        columnNumber: 9
    }, this);
}
// --- Dashboard ---
function Dashboard({ appointments, loading }) {
    const pending = appointments.filter((a)=>a.status === "pending").length;
    const confirmed = appointments.filter((a)=>a.status === "confirmed").length;
    const today = appointments.slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-1",
                        style: {
                            fontFamily: "'DM Serif Display', serif"
                        },
                        children: "Dashboard Overview"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 69,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Welcome back! Here's what's happening at Tooth World today."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 70,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 68,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: "w-6 h-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 74,
                            columnNumber: 33
                        }, void 0),
                        label: "Total Appointments",
                        value: loading ? "—" : String(appointments.length),
                        sub: "All time",
                        color: "hsl(var(--primary))"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            className: "w-6 h-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 76,
                            columnNumber: 33
                        }, void 0),
                        label: "Pending",
                        value: loading ? "—" : String(pending),
                        sub: "Awaiting confirmation",
                        color: "hsl(38 92% 55%)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 76,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                            className: "w-6 h-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 78,
                            columnNumber: 33
                        }, void 0),
                        label: "Confirmed",
                        value: loading ? "—" : String(confirmed),
                        sub: "Confirmed bookings",
                        color: "hsl(142 71% 45%)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                            className: "w-6 h-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 80,
                            columnNumber: 33
                        }, void 0),
                        label: "Satisfaction",
                        value: "98%",
                        sub: "Based on 5-star reviews",
                        color: "hsl(262 80% 65%)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 80,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-5 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                className: "w-5 h-5",
                                style: {
                                    color: "hsl(var(--primary))"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 86,
                                columnNumber: 21
                            }, this),
                            " Recent Appointments"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 85,
                        columnNumber: 17
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-10 text-muted-foreground gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-5 h-5 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 90,
                                columnNumber: 25
                            }, this),
                            " Loading appointments..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 89,
                        columnNumber: 21
                    }, this) : today.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10 text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-8 h-8 mx-auto mb-2 opacity-40"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 94,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "No appointments yet. They'll appear here once patients book."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 95,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 93,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: today.map((apt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold",
                                                style: {
                                                    background: "var(--gradient-primary)"
                                                },
                                                children: apt.patient[0]
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 102,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm",
                                                        children: apt.patient
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 107,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: [
                                                            apt.dentist,
                                                            " · ",
                                                            apt.service
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium",
                                                children: apt.time
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: apt.date
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 113,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 111,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-4 text-xs font-medium px-2.5 py-1 rounded-full ${apt.status === "confirmed" ? "bg-green-100 text-green-700" : apt.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`,
                                        children: apt.status
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, apt._id, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 100,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 98,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 84,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 67,
        columnNumber: 9
    }, this);
}
// --- Appointments Manager ---
function AppointmentsManager({ appointments, loading, onUpdateStatus }) {
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [updating, setUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const filtered = filter === "all" ? appointments : appointments.filter((a)=>a.status === filter);
    const handleUpdate = async (id, status)=>{
        setUpdating(id);
        await onUpdateStatus(id, status);
        setUpdating(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold",
                        style: {
                            fontFamily: "'DM Serif Display', serif"
                        },
                        children: "Appointments"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 149,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: "Manage all patient appointments · WhatsApp notifications sent automatically on accept/decline"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 150,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 148,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 flex-wrap",
                children: [
                    "all",
                    "pending",
                    "confirmed",
                    "cancelled"
                ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilter(f),
                        className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${filter === f ? "text-white" : "border border-border hover:border-primary/50"}`,
                        style: {
                            background: filter === f ? "hsl(var(--primary))" : undefined
                        },
                        children: f
                    }, f, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 157,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-16 text-muted-foreground gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-5 h-5 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 167,
                        columnNumber: 21
                    }, this),
                    " Loading..."
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 166,
                columnNumber: 17
            }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-10 text-center text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-8 h-8 mx-auto mb-2 opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 171,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: "No appointments found."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 172,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 170,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: filtered.map((apt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0",
                                        style: {
                                            background: "var(--gradient-primary)"
                                        },
                                        children: apt.patient[0]
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-sm",
                                                children: apt.patient
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 184,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: apt.service
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 37
                                            }, this),
                                            apt.patient_email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: apt.patient_email
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 59
                                            }, this),
                                            apt.patient_phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground flex items-center gap-1",
                                                children: [
                                                    "📱 ",
                                                    apt.patient_phone
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 188,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 183,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 178,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: apt.dentist
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 59
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            apt.date,
                                            " ",
                                            apt.time
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 73
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 194,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xs font-medium px-2.5 py-1 rounded-full ${apt.status === "confirmed" ? "bg-green-100 text-green-700" : apt.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`,
                                        children: apt.status
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 33
                                    }, this),
                                    apt.status === "pending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdate(apt._id, "confirmed"),
                                                disabled: updating === apt._id,
                                                className: "p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50",
                                                children: updating === apt._id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "w-3.5 h-3.5 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 69
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 120
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 205,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdate(apt._id, "cancelled"),
                                                disabled: updating === apt._id,
                                                className: "p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 197,
                                columnNumber: 29
                            }, this)
                        ]
                    }, apt._id, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 177,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 175,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 147,
        columnNumber: 9
    }, this);
}
// --- Calendar & Slots Manager ---
function CalendarManager({ dentists }) {
    const [selectedDentist, setSelectedDentist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Mon");
    const [blockedSlots, setBlockedSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [toggling, setToggling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (dentists.length > 0 && !selectedDentist) setSelectedDentist(dentists[0]._id);
    }, [
        dentists
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchBlockedSlots(true);
        const interval = setInterval(()=>fetchBlockedSlots(false), 30000);
        return ()=>clearInterval(interval);
    }, []);
    const fetchBlockedSlots = async (isInitial = false)=>{
        if (isInitial) setLoading(true);
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("blocked_slots");
        if (data) {
            const map = {};
            data.forEach((row)=>{
                const key = String(row.dentist_id);
                if (!map[key]) map[key] = {};
                if (!map[key][row.day]) map[key][row.day] = [];
                map[key][row.day].push(row.slot);
            });
            setBlockedSlots(map);
        }
        setLoading(false);
    };
    const toggleSlot = async (slot)=>{
        if (!selectedDentist) return;
        const key = String(selectedDentist);
        const isBlocked = blockedSlots[key]?.[selectedDay]?.includes(slot);
        setToggling(slot);
        if (isBlocked) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteOne"])("blocked_slots", {
                dentist_id: selectedDentist,
                day: selectedDay,
                slot
            });
            setBlockedSlots((prev)=>({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        [selectedDay]: (prev[key]?.[selectedDay] || []).filter((s)=>s !== slot)
                    }
                }));
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["insertOne"])("blocked_slots", {
                dentist_id: selectedDentist,
                day: selectedDay,
                slot
            });
            setBlockedSlots((prev)=>({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        [selectedDay]: [
                            ...prev[key]?.[selectedDay] || [],
                            slot
                        ]
                    }
                }));
        }
        setToggling(null);
    };
    const dentist = dentists.find((d)=>d._id === selectedDentist);
    const currentBlocked = blockedSlots[String(selectedDentist)]?.[selectedDay] || [];
    const blockedCount = currentBlocked.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold",
                        style: {
                            fontFamily: "'DM Serif Display', serif"
                        },
                        children: "Calendar & Slots"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 287,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: "Block or unblock time slots for each dentist. Updates in real-time."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 288,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 286,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 flex-wrap",
                children: dentists.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectedDentist(d._id),
                        className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${selectedDentist === d._id ? "text-white border-transparent" : "border-border hover:border-primary/50"}`,
                        style: {
                            background: selectedDentist === d._id ? "hsl(var(--primary))" : undefined
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                                style: {
                                    background: selectedDentist === d._id ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--secondary))",
                                    color: selectedDentist === d._id ? "white" : "hsl(var(--primary))"
                                },
                                children: d.avatar
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 296,
                                columnNumber: 25
                            }, this),
                            d.name
                        ]
                    }, d._id, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 293,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 291,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-16 text-muted-foreground gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-5 h-5 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 310,
                        columnNumber: 21
                    }, this),
                    " Loading slots..."
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 309,
                columnNumber: 17
            }, this) : dentist ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-6 space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                                        style: {
                                            background: "var(--gradient-primary)"
                                        },
                                        children: dentist.avatar
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold",
                                                children: dentist.name
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 321,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: dentist.specialty
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 315,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 text-xs text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-3 h-3 rounded-sm inline-block",
                                                style: {
                                                    background: "hsl(var(--primary) / 0.15)",
                                                    border: "1px solid hsl(var(--primary) / 0.4)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 33
                                            }, this),
                                            "Available"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-3 h-3 rounded-sm inline-block bg-red-100",
                                                style: {
                                                    border: "1px solid hsl(0 84% 80%)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 33
                                            }, this),
                                            "Blocked"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 325,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 314,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 flex-wrap",
                        children: DAYS.map((day)=>{
                            const cnt = (blockedSlots[String(selectedDentist)]?.[day] || []).length;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedDay(day),
                                className: `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedDay === day ? "text-white border-transparent" : "border-border hover:border-primary/40"}`,
                                style: {
                                    background: selectedDay === day ? "hsl(var(--primary))" : undefined
                                },
                                children: [
                                    day,
                                    cnt > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${selectedDay === day ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`,
                                        children: cnt
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, day, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 341,
                                columnNumber: 33
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 337,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mb-3",
                                children: blockedCount === 0 ? `All ${ALL_SLOTS.length} slots available on ${selectedDay}` : `${blockedCount} slot${blockedCount > 1 ? "s" : ""} blocked on ${selectedDay} — click to toggle`
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 358,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 sm:grid-cols-4 gap-2.5",
                                children: ALL_SLOTS.map((slot)=>{
                                    const isBlocked = currentBlocked.includes(slot);
                                    const isToggling = toggling === slot;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleSlot(slot),
                                        disabled: isToggling,
                                        className: `py-3 px-3 rounded-xl text-sm font-medium border transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-1.5 ${isBlocked ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "hover:border-primary/60"}`,
                                        style: !isBlocked ? {
                                            background: "hsl(var(--primary) / 0.06)",
                                            borderColor: "hsl(var(--primary) / 0.25)",
                                            color: "hsl(var(--primary))"
                                        } : undefined,
                                        children: [
                                            isToggling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-3.5 h-3.5 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 45
                                            }, this) : isBlocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 384,
                                                columnNumber: 45
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 45
                                            }, this),
                                            slot
                                        ]
                                    }, slot, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 368,
                                        columnNumber: 37
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 363,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 357,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 313,
                columnNumber: 17
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 285,
        columnNumber: 9
    }, this);
}
// --- Blog Manager ---
function BlogManager({ dentists }) {
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newPost, setNewPost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        category: "Oral Health",
        content: ""
    });
    const [pendingImages, setPendingImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadingImages, setUploadingImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewSlide, setPreviewSlide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const categories = [
        "Oral Health",
        "Patient Guide",
        "Cosmetic Dentistry",
        "Dental Implants",
        "Pediatric",
        "General"
    ];
    const defaultAuthor = dentists[0]?.name || "Dr. Admin";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchPosts();
    }, []);
    const fetchPosts = async ()=>{
        setLoading(true);
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("blog_posts", {}, {
            sort: {
                created_at: -1
            }
        });
        if (data) setPosts(data);
        setLoading(false);
    };
    const handleCreate = async ()=>{
        if (!newPost.title.trim()) return;
        setSaving(true);
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["insertOne"])("blog_posts", {
            title: newPost.title,
            category: newPost.category,
            author: defaultAuthor,
            content: newPost.content,
            published: false,
            images: pendingImages
        });
        if (data) {
            setPosts((prev)=>[
                    data,
                    ...prev
                ]);
        }
        setCreating(false);
        setNewPost({
            title: "",
            category: "Oral Health",
            content: ""
        });
        setPendingImages([]);
        setSaving(false);
    };
    const handleFileChange = (e)=>{
        const files = e.target.files;
        if (!files) return;
        setUploadingImages(true);
        Array.from(files).forEach((file)=>{
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setPendingImages((prev)=>[
                        ...prev,
                        reader.result
                    ]);
            };
            reader.readAsDataURL(file);
        });
        setUploadingImages(false);
    };
    const togglePublish = async (id, current)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOne"])("blog_posts", {
            _id: id
        }, {
            published: !current
        });
        fetchPosts();
    };
    const deletePost = async (id)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteOne"])("blog_posts", {
            _id: id
        });
        fetchPosts();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold",
                                style: {
                                    fontFamily: "'DM Serif Display', serif"
                                },
                                children: "Blog Management"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 473,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground mt-1",
                                children: "Create and manage your dental health articles"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 474,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 472,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCreating(true),
                        className: "btn-primary text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 477,
                                columnNumber: 21
                            }, this),
                            " New Post"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 476,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 471,
                columnNumber: 13
            }, this),
            creating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-6 animate-scale-in border-2",
                style: {
                    borderColor: "hsl(var(--primary) / 0.3)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-5 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                className: "w-4 h-4",
                                style: {
                                    color: "hsl(var(--primary))"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 484,
                                columnNumber: 25
                            }, this),
                            " New Blog Post"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 483,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Post Title *"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 488,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input-dental",
                                        placeholder: "Enter a compelling title...",
                                        value: newPost.title,
                                        onChange: (e)=>setNewPost({
                                                ...newPost,
                                                title: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 489,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 487,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-dental",
                                        value: newPost.category,
                                        onChange: (e)=>setNewPost({
                                                ...newPost,
                                                category: e.target.value
                                            }),
                                        children: categories.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: c,
                                                children: c
                                            }, c, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 54
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 492,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Content"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "input-dental min-h-[140px] resize-y",
                                        placeholder: "Write your article content here...",
                                        value: newPost.content,
                                        onChange: (e)=>setNewPost({
                                                ...newPost,
                                                content: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 499,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Post Images"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 505,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mb-2",
                                        children: [
                                            pendingImages.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative w-16 h-16 rounded-lg overflow-hidden border border-border",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: img,
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                            lineNumber: 509,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setPendingImages((prev)=>prev.filter((_, idx)=>idx !== i)),
                                                            className: "absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                                lineNumber: 512,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                            lineNumber: 510,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 37
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fileInputRef.current?.click(),
                                                className: "w-16 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 518,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px]",
                                                        children: "Add"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 516,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                ref: fileInputRef,
                                                className: "hidden",
                                                multiple: true,
                                                accept: "image/*",
                                                onChange: handleFileChange
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 521,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 506,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 504,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCreate,
                                        className: "btn-primary text-sm",
                                        disabled: !newPost.title.trim() || saving,
                                        children: [
                                            saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 526,
                                                columnNumber: 43
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 526,
                                                columnNumber: 90
                                            }, this),
                                            saving ? "Saving..." : "Save as Draft"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 525,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setCreating(false);
                                        },
                                        className: "btn-outline text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 530,
                                                columnNumber: 33
                                            }, this),
                                            " Cancel"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 529,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 524,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 486,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 482,
                columnNumber: 17
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-16 text-muted-foreground gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-5 h-5 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 539,
                        columnNumber: 21
                    }, this),
                    " Loading posts..."
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 538,
                columnNumber: 17
            }, this) : posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-10 text-center text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-8 h-8 mx-auto mb-2 opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 543,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: 'No blog posts yet. Click "New Post" to create your first article.'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 544,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 542,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                                        style: {
                                            background: "hsl(var(--secondary))"
                                        },
                                        children: "📄"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 551,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "section-tag text-xs",
                                                        children: post.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 555,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs font-medium px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`,
                                                        children: post.published ? "Published" : "Draft"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 554,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold text-sm truncate",
                                                children: post.title
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 560,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mt-0.5",
                                                children: [
                                                    "By ",
                                                    post.author,
                                                    " · ",
                                                    new Date(post.created_at).toLocaleDateString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 561,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 553,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 550,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>togglePublish(post._id, post.published),
                                        className: `text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${post.published ? "border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100" : "border-green-200 text-green-600 bg-green-50 hover:bg-green-100"}`,
                                        children: post.published ? "Unpublish" : "Publish"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 567,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>deletePost(post._id),
                                        className: "p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 566,
                                columnNumber: 29
                            }, this)
                        ]
                    }, post._id, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 549,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 547,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 470,
        columnNumber: 9
    }, this);
}
// --- Gallery Manager ---
function GalleryManager() {
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [caption, setCaption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const fileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleFileUpload = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = ()=>{
            setUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchImages();
    }, []);
    const fetchImages = async ()=>{
        setLoading(true);
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("gallery_images", {}, {
            sort: {
                created_at: -1
            }
        });
        if (data) setImages(data);
        setLoading(false);
    };
    const handleAdd = async ()=>{
        if (!url) return;
        setUploading(true);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["insertOne"])("gallery_images", {
            url,
            caption: caption.trim() || null
        });
        setUrl("");
        setCaption("");
        fetchImages();
        setUploading(false);
    };
    const handleDelete = async (id)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteOne"])("gallery_images", {
            _id: id
        });
        fetchImages();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold",
                        style: {
                            fontFamily: "'DM Serif Display', serif"
                        },
                        children: "Gallery Manager"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 634,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: "Manage clinic photos shown on the public gallery page."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 635,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 633,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-6 border-2",
                style: {
                    borderColor: "hsl(var(--primary) / 0.25)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-4 flex items-center gap-2 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                className: "w-4 h-4",
                                style: {
                                    color: "hsl(var(--primary))"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 640,
                                columnNumber: 21
                            }, this),
                            " Add New Photo"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 639,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium mb-1.5 opacity-70",
                                                children: "Image URL"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 645,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "input-dental",
                                                placeholder: "https://...",
                                                value: url,
                                                onChange: (e)=>setUrl(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 646,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 644,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-px h-12 bg-border self-end mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 648,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium mb-1.5 opacity-70",
                                                children: "Or Upload Image"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 650,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fileRef.current?.click(),
                                                className: "btn-outline w-full h-11 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                                        className: "w-3.5 h-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Select File"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                ref: fileRef,
                                                className: "hidden",
                                                accept: "image/*",
                                                onChange: handleFileUpload
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 649,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 643,
                                columnNumber: 21
                            }, this),
                            url && url.startsWith('data:') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-24 h-24 rounded-xl overflow-hidden border border-primary/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: url,
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 659,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setUrl(""),
                                        className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 661,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 658,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "input-dental",
                                placeholder: "Caption (optional)",
                                value: caption,
                                onChange: (e)=>setCaption(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 665,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAdd,
                                disabled: !url || uploading,
                                className: "btn-primary text-sm",
                                children: [
                                    uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 38
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 85
                                    }, this),
                                    "Add to Gallery"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 666,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 642,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 638,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-3 gap-4",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aspect-square rounded-2xl bg-muted animate-pulse"
                    }, i, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 675,
                        columnNumber: 41
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 674,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-3 gap-4",
                children: images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "group relative rounded-2xl overflow-hidden border border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: img.url,
                                alt: img.caption || "Gallery",
                                className: "w-full aspect-square object-cover"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 681,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleDelete(img._id),
                                    className: "p-2 rounded-full bg-red-500 text-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 684,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                    lineNumber: 683,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 682,
                                columnNumber: 29
                            }, this)
                        ]
                    }, img._id, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 680,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 678,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 632,
        columnNumber: 9
    }, this);
}
// --- Reviews Manager ---
function ReviewsManager() {
    const [reviews, setReviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newReview, setNewReview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        clientName: "",
        videoUrl: "",
        category: "General",
        thumbnailUrl: ""
    });
    const categories = [
        "Smile Makeover",
        "Dental Implants",
        "Orthodontics",
        "General",
        "Full Mouth Rehab"
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchReviews();
    }, []);
    const fetchReviews = async ()=>{
        setLoading(true);
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("video_reviews", {}, {
            sort: {
                created_at: -1
            }
        });
        if (data) setReviews(data);
        setLoading(false);
    };
    const handleAdd = async ()=>{
        if (!newReview.clientName || !newReview.videoUrl) return;
        setSaving(true);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["insertOne"])("video_reviews", {
            ...newReview,
            created_at: new Date().toISOString()
        });
        setNewReview({
            clientName: "",
            videoUrl: "",
            category: "General",
            thumbnailUrl: ""
        });
        fetchReviews();
        setSaving(false);
    };
    const handleDelete = async (id)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteOne"])("video_reviews", {
            _id: id
        });
        fetchReviews();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold",
                        style: {
                            fontFamily: "'DM Serif Display', serif"
                        },
                        children: "Video Reviews Manager"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 732,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: "Manage video testimonials from your patients. Organise by service category."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 733,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 731,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-6 border-2",
                style: {
                    borderColor: "hsl(var(--primary) / 0.25)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-4 flex items-center gap-2 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                className: "w-4 h-4",
                                style: {
                                    color: "hsl(var(--primary))"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 738,
                                columnNumber: 21
                            }, this),
                            " Add New Video Review"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 737,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium mb-1.5 opacity-70",
                                        children: "Patient/Client Name"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 742,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input-dental",
                                        placeholder: "e.g. John Doe",
                                        value: newReview.clientName,
                                        onChange: (e)=>setNewReview({
                                                ...newReview,
                                                clientName: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 743,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 741,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium mb-1.5 opacity-70",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 747,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-dental",
                                        value: newReview.category,
                                        onChange: (e)=>setNewReview({
                                                ...newReview,
                                                category: e.target.value
                                            }),
                                        children: categories.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: c,
                                                children: c
                                            }, c, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 750,
                                                columnNumber: 50
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 748,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 746,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 740,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium mb-1.5 opacity-70",
                                        children: "Video URL (YouTube/Direct Link)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 756,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input-dental",
                                        placeholder: "https://youtube.com/watch?v=...",
                                        value: newReview.videoUrl,
                                        onChange: (e)=>setNewReview({
                                                ...newReview,
                                                videoUrl: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 757,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 755,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium mb-1.5 opacity-70",
                                        children: "Thumbnail URL (Optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 761,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input-dental",
                                        placeholder: "https://...",
                                        value: newReview.thumbnailUrl,
                                        onChange: (e)=>setNewReview({
                                                ...newReview,
                                                thumbnailUrl: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 762,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 760,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAdd,
                                disabled: !newReview.clientName || !newReview.videoUrl || saving,
                                className: "btn-primary text-sm",
                                children: [
                                    saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 766,
                                        columnNumber: 35
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 766,
                                        columnNumber: 82
                                    }, this),
                                    "Add Review"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 765,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 754,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 736,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aspect-video rounded-2xl bg-muted animate-pulse"
                    }, i, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 774,
                        columnNumber: 41
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 773,
                columnNumber: 17
            }, this) : reviews.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-dental p-10 text-center text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                        className: "w-8 h-8 mx-auto mb-2 opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 778,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: "No video reviews yet. Add your first patient testimonial."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 779,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 777,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: reviews.map((review)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-dental overflow-hidden group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "aspect-video relative bg-slate-100 flex items-center justify-center",
                                children: [
                                    review.thumbnailUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: review.thumbnailUrl,
                                        alt: review.clientName,
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 787,
                                        columnNumber: 37
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                        className: "w-10 h-10 text-slate-300"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 789,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: review.videoUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "p-3 rounded-full bg-white text-primary hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                className: "w-5 h-5 fill-current"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 794,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 792,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 791,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-2 left-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "section-tag bg-white/90 backdrop-blur shadow-sm",
                                            children: review.category
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 798,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 797,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 785,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-t border-border flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-sm",
                                                children: review.clientName
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 803,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5",
                                                children: "Patient Testimonial"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                                lineNumber: 804,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 802,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleDelete(review._id),
                                        className: "p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 806,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 801,
                                columnNumber: 29
                            }, this)
                        ]
                    }, review._id, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 784,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 782,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 730,
        columnNumber: 9
    }, this);
}
const navItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 819,
            columnNumber: 50
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "appointments",
        label: "Appointments",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 820,
            columnNumber: 56
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "calendar",
        label: "Calendar & Slots",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 821,
            columnNumber: 56
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "blog",
        label: "Blog",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 822,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "gallery",
        label: "Gallery",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$images$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Images$3e$__["Images"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 823,
            columnNumber: 46
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "reviews",
        label: "Reviews",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
            lineNumber: 824,
            columnNumber: 46
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function AdminDashboard() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("dashboard");
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [dentists, setDentists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const session = localStorage.getItem('adminSession');
        if (!session) {
            router.push('/admin');
            return;
        }
        fetchInitialData();
    }, [
        router
    ]);
    const fetchInitialData = async ()=>{
        setLoading(true);
        const [aptRes, dentRes] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("appointments", {}, {
                sort: {
                    created_at: -1
                }
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findMany"])("dentists", {}, {
                sort: {
                    id: 1
                }
            })
        ]);
        if (aptRes.data) setAppointments(aptRes.data);
        if (dentRes.data) setDentists(dentRes.data);
        setLoading(false);
    };
    const updateAppointmentStatus = async (id, status)=>{
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$integrations$2f$mongodb$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOne"])("appointments", {
            _id: id
        }, {
            status
        });
        if (data) {
            // Find the appointment details for notification
            const apt = appointments.find((a)=>a._id === id);
            if (apt && apt.patient_phone) {
                toast({
                    title: `Sending WhatsApp...`,
                    description: `Sending ${status} notification to ${apt.patient}.`
                });
                const sent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendWhatsAppNotification"])(apt.patient_phone, status, {
                    patientName: apt.patient,
                    patientPhone: apt.patient_phone,
                    dentist: apt.dentist,
                    date: apt.date,
                    time: apt.time,
                    service: apt.service
                });
                if (sent) {
                    toast({
                        title: "WhatsApp Sent ✅",
                        description: `Notification for ${apt.patient} has been sent.`
                    });
                }
            }
            fetchInitialData();
        }
    };
    const handleLogout = ()=>{
        localStorage.removeItem('adminSession');
        router.push('/admin');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex",
        style: {
            background: "hsl(var(--muted))"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
                style: {
                    background: "hsl(var(--card))",
                    borderRight: "1px solid hsl(var(--border))"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 border-b border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-9 h-9 rounded-xl flex items-center justify-center",
                                    style: {
                                        background: "var(--gradient-primary)"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 904,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                    lineNumber: 903,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-bold text-sm",
                                            style: {
                                                fontFamily: "'DM Serif Display', serif"
                                            },
                                            children: "Tooth World"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 907,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Admin Panel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 908,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                    lineNumber: 906,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 902,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 901,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "p-4 space-y-1 flex-1",
                        children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                },
                                className: `admin-sidebar-link w-full ${activeTab === item.id ? "active" : ""}`,
                                children: [
                                    item.icon,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 918,
                                        columnNumber: 29
                                    }, this),
                                    activeTab !== item.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "w-3.5 h-3.5 ml-auto opacity-40"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 919,
                                        columnNumber: 55
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 915,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 913,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            className: "admin-sidebar-link w-full text-red-500 hover:bg-red-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                    lineNumber: 926,
                                    columnNumber: 25
                                }, this),
                                " Sign Out"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                            lineNumber: 925,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 924,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 898,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-h-screen min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b border-border px-6 py-4 flex items-center justify-between",
                        style: {
                            background: "hsl(var(--card))"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSidebarOpen(true),
                                        className: "lg:hidden p-2 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                            lineNumber: 934,
                                            columnNumber: 107
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 934,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-bold text-base capitalize",
                                        children: activeTab
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                        lineNumber: 935,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 933,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                style: {
                                    background: "var(--gradient-primary)"
                                },
                                children: "AD"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 937,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 932,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-6 overflow-auto animate-fade-in",
                        children: [
                            activeTab === "dashboard" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dashboard, {
                                appointments: appointments,
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 941,
                                columnNumber: 51
                            }, this),
                            activeTab === "appointments" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppointmentsManager, {
                                appointments: appointments,
                                loading: loading,
                                onUpdateStatus: updateAppointmentStatus
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 942,
                                columnNumber: 54
                            }, this),
                            activeTab === "calendar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarManager, {
                                dentists: dentists
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 943,
                                columnNumber: 50
                            }, this),
                            activeTab === "blog" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlogManager, {
                                dentists: dentists
                            }, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 944,
                                columnNumber: 46
                            }, this),
                            activeTab === "gallery" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GalleryManager, {}, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 945,
                                columnNumber: 49
                            }, this),
                            activeTab === "reviews" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewsManager, {}, void 0, false, {
                                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                                lineNumber: 946,
                                columnNumber: 49
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                        lineNumber: 940,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
                lineNumber: 931,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/vercel/smile-schedule-dash/src/app/admin/dashboard/page.tsx",
        lineNumber: 897,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__69435bb4._.js.map